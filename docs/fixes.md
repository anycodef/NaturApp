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

## Resumen de archivos

| Archivo | Cambio |
|---------|--------|
| `src/context/AuthContext.js` | **Nuevo.** Estado de autenticación global. |
| `src/context/CartContext.js` | **Nuevo.** Estado de carrito global. |
| `src/hooks/useAuth.js` | Reexporta el hook del context. |
| `src/hooks/useCart.js` | Reexporta el hook del context. |
| `app/_layout.js` | Envuelve con SafeAreaProvider + AuthProvider + CartProvider. |
| `app/(tabs)/_layout.js` | Safe area en el tab bar. |
| `app/(tabs)/home.js` | Manejo de error al agregar al carrito. |
| `app/(tabs)/search.js` | Manejo de error al agregar al carrito. |
