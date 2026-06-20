# Correcciones posteriores a la guía

La implementación inicial replicó **exactamente** la arquitectura descrita
en la guía. Esa réplica fiel arrastró varios defectos de diseño presentes
en la propia guía, que se manifestaron al ejecutar la app en un
dispositivo real. Este documento registra cada problema, su causa raíz y
la reparación aplicada.

> **Origen:** todos los problemas de esta sección provienen del diseño
> propuesto por la guía (no de desviaciones nuestras). Se documentan aquí
> para dejar constancia de las reparaciones.

---

## 1. Sesión / token no disponible salvo tras entrar a Perfil

**Síntomas**
- Al reiniciar la app y empezar a usar el carrito aparecía
  `Token de acceso requerido`.
- Solo después de abrir la pestaña **Perfil** (con ver la cuenta logueada
  bastaba) el carrito empezaba a funcionar.
- Errores `Uncaught (in promise) Error: Token de acceso requerido` al
  arrancar.

**Causa raíz (guía)**
La guía guarda el token en una variable de módulo (`let authToken`) dentro
de `apiService.js` y restaura la sesión dentro del hook `useAuth`, que
**solo se monta en la pantalla de Perfil**. Hasta visitar Perfil,
`setToken` nunca se ejecutaba, por lo que `authToken` seguía en `null` y
toda petición autenticada fallaba con 401.

**Reparación**
- Se creó un **AuthProvider global** (`src/context/AuthContext.js`) que
  restaura el token **una sola vez al arrancar**, a nivel de raíz, y lo
  comparte con toda la app.
- `app/_layout.js` envuelve la aplicación con `<AuthProvider>`.
- `src/hooks/useAuth.js` ahora reexporta el hook del context (los imports
  existentes siguen funcionando).

---

## 2. El carrito no acumulaba productos ni sincronizaba la UI

**Síntomas**
- Al agregar varios productos, el carrito mostraba solo el primero o no se
  actualizaba.
- La pantalla de carrito no reflejaba los cambios hasta tocar los botones
  `+` / `−` de un ítem (lo que forzaba un re-render).

**Causa raíz (guía)**
La guía usa `useCart()` como hook local. Cada pantalla
(Home, Detalle, Carrito) creaba **su propia instancia con su propio
estado**. Agregar desde Home actualizaba el estado de Home, pero la
pantalla de Carrito conservaba su estado independiente y, al estar montada
como pestaña, no volvía a pedir los datos al servidor.

**Reparación**
- Se creó un **CartProvider global** (`src/context/CartContext.js`) con una
  única fuente de verdad compartida por todas las pantallas.
- Tras cada operación (agregar, actualizar, eliminar) se recarga el
  carrito desde el servidor, de modo que cualquier pantalla refleja el
  estado más reciente.
- `app/_layout.js` envuelve la app con `<CartProvider>` (dentro de
  `<AuthProvider>`).
- `src/hooks/useCart.js` reexporta el hook del context.

---

## 3. Agregar al carrito sin sesión lanzaba un error no controlado

**Síntomas**
- Al pulsar el botón `+` en Home o "Agregar al Carrito" en el detalle sin
  estar logueado, aparecían errores de promesa no capturada.

**Causa raíz (guía)**
Las llamadas a `addItem` se hacían "fire-and-forget"
(`onAddToCart={() => addItem(item)}`) sin manejar el rechazo de la
promesa, y los endpoints de carrito requieren autenticación.

**Reparación**
- El CartProvider valida la sesión y, si no hay usuario, lanza un mensaje
  claro: *"Inicia sesión para usar el carrito"*.
- Las pantallas Home y Search envuelven el agregado en un manejador con
  `try/catch` que muestra el mensaje con `Alert`, evitando rechazos no
  capturados.
- El carrito solo consulta al servidor cuando existe una sesión activa.

---

## 4. La barra de pestañas se solapaba con la barra de navegación

**Síntomas**
- Los botones inferiores de la app quedaban tapados por la barra de
  navegación del sistema (Android).

**Causa raíz (guía)**
La guía define `tabBarStyle` con una altura fija (`height: 60`,
`paddingBottom: 8`) sin considerar el *safe area* inferior del
dispositivo.

**Reparación**
- `app/(tabs)/_layout.js` usa `useSafeAreaInsets()` para sumar el inset
  inferior a la altura y al padding del tab bar.
- `app/_layout.js` envuelve la app con `<SafeAreaProvider>`.

---

## 5. Confirmación de "agregar al carrito" inconsistente y bloqueante

**Síntomas**
- Agregar desde el botón `+` (en Home/Search) no mostraba ninguna
  confirmación, mientras que desde el detalle del producto aparecía un
  `Alert`. Es decir, la respuesta dependía del punto de entrada.
- Ese `Alert` bloqueaba la pantalla y obligaba a pulsar "OK", aunque el
  producto ya estaba agregado (un paso de más).

**Causa raíz**
La guía resuelve la confirmación con `Alert.alert(...)` solo en algunas
pantallas. `Alert` es modal y bloqueante, y no encaja con el diseño.

**Reparación**
- Se añadió un sistema de notificación tipo *toast*
  (`src/context/ToastContext.js`): un aviso breve, animado y **no
  bloqueante** que se desvanece solo, acorde al estilo visual de la app.
- Las tres vías de agregado (Home, Search y detalle) usan ahora el mismo
  `showToast(...)`, de modo que la confirmación es **consistente** y sin
  pasos extra.

---

## 6. La búsqueda solo respondía con palabras completas

**Síntomas**
- Al escribir parte de una palabra (por ejemplo "mac") no aparecían
  resultados hasta completar el término exacto.

**Causa raíz (guía)**
La búsqueda del backend usaba el índice de texto de MongoDB
(`$text: { $search }`), que coincide por **palabras completas** (tokens),
no por subcadenas. Por eso un prefijo no devolvía coincidencias.

**Reparación**
- En `server/routes/productRoutes.js` la búsqueda pasó a coincidencia
  **parcial** con expresiones regulares (`$regex`, insensible a
  mayúsculas) sobre `name` y `description`.
- En `app/(tabs)/search.js` la búsqueda es **en vivo con *debounce***
  (a partir de un carácter, con 300 ms de espera), en lugar de exigir dos
  caracteres y consultar en cada pulsación.

---

## 7. Solapamiento con la barra de navegación fuera de las pestañas

**Síntomas**
- En el detalle del producto, el botón "Agregar al Carrito" quedaba por
  debajo de la barra de navegación del sistema. Ocurría en las pantallas
  de pila (donde no está la barra de pestañas que ya aplicaba el *safe
  area*).

**Causa raíz (guía)**
El contenido de las pantallas de pila no reservaba espacio para el *safe
area* inferior.

**Reparación**
- `app/product/[id].js` y `app/checkout.js` añaden
  `paddingBottom: insets.bottom + 24` al contenido desplazable mediante
  `useSafeAreaInsets()`, de modo que el contenido al fondo nunca queda
  tapado.

---

## Resumen de archivos

| Archivo | Cambio |
|---------|--------|
| `src/context/AuthContext.js` | **Nuevo.** Estado de autenticación global. |
| `src/context/CartContext.js` | **Nuevo.** Estado de carrito global. |
| `src/context/ToastContext.js` | **Nuevo.** Notificación no bloqueante (toast). |
| `src/hooks/useAuth.js` | Reexporta el hook del context. |
| `src/hooks/useCart.js` | Reexporta el hook del context. |
| `app/_layout.js` | Envuelve con SafeAreaProvider + AuthProvider + CartProvider + ToastProvider. |
| `app/(tabs)/_layout.js` | Safe area en el tab bar. |
| `app/(tabs)/home.js` | Confirmación con toast al agregar al carrito. |
| `app/(tabs)/search.js` | Búsqueda en vivo con debounce y toast al agregar. |
| `app/product/[id].js` | Toast al agregar y safe area inferior. |
| `app/checkout.js` | Safe area inferior del contenido. |
| `server/routes/productRoutes.js` | Búsqueda parcial con `$regex`. |
