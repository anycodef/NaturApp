# Frontend

La app está construida con React Native y **Expo Router** (navegación
basada en archivos). Consume la API REST del backend a través de un único
módulo de servicio y organiza la lógica de negocio en *custom hooks*.

## Capa de servicio — `src/services/apiService.js`

Centraliza **toda** la comunicación con el backend. Una función `request`
genérica configura los headers (incluido `Authorization: Bearer` cuando
hay token), serializa el cuerpo a JSON y deserializa la respuesta.

Expone un sub-módulo por recurso, cuyos métodos corresponden a los
endpoints del backend:

- `ProductAPI` — `getAll(params)`, `getById(id)`, `search(term)`.
- `CategoryAPI` — `getAll()`.
- `AuthAPI` — `login`, `register`, `getProfile`, `updateProfile`.
- `CartAPI` — `get`, `addItem`, `updateQuantity`, `removeItem`, `clear`.
- `OrderAPI` — `create`, `getAll`, `getById`, `cancel`.

El token se inyecta en memoria con `setToken` / `clearToken`. Si cambia la
URL del backend, solo se modifica `BASE_URL` en este archivo.

## Custom hooks — `src/hooks/`

Cada hook encapsula el estado (`loading`, `error`, datos) y las acciones
de un dominio, actuando de intermediario entre las pantallas y la API.

| Hook | Responsabilidad |
|------|-----------------|
| `useProducts` | Carga inicial en paralelo (`Promise.all`), filtro por categoría, búsqueda, paginación (`loadMore`) y pull-to-refresh. |
| `useCart` | Carga el carrito y sincroniza con el servidor tras cada operación (add, update, remove, clear). |
| `useAuth` | Restaura la sesión al iniciar, login, registro y logout. Persiste el token con `AsyncStorage`. |
| `useOrders` | Lista, crea y cancela pedidos. |

## Navegación

### Stack raíz — `app/_layout.js`
Define el `Stack` global con la cabecera de la app e incluye las rutas de
detalle de producto, checkout y las pantallas modales de autenticación.

### Pestañas — `app/(tabs)/_layout.js`
Configura un `Tabs` con 5 pestañas (Inicio, Buscar, Carrito, Pedidos,
Perfil), cada una con su icono de Ionicons.

> `app/index.js` redirige al arranque a `/(tabs)/home`.

## Pantallas — `app/`

| Pantalla | Archivo | Función |
|----------|---------|---------|
| Inicio | `(tabs)/home.js` | Lista de productos con filtros, paginación infinita y pull-to-refresh. |
| Buscar | `(tabs)/search.js` | Búsqueda dinámica de productos. |
| Carrito | `(tabs)/cart.js` | Items del carrito, total y acceso al checkout. |
| Pedidos | `(tabs)/orders.js` | Historial con estados y cancelación. |
| Perfil | `(tabs)/profile.js` | Datos del usuario o acceso a login/registro. |
| Detalle | `product/[id].js` | Información de un producto y "agregar al carrito". |
| Checkout | `checkout.js` | Formulario de dirección y confirmación del pedido. |
| Login | `auth/login.js` | Inicio de sesión. |
| Registro | `auth/register.js` | Creación de cuenta. |

## Componentes reutilizables — `src/components/`

| Componente | Uso |
|------------|-----|
| `ProductCard` | Tarjeta de producto. Se reutiliza en Home y Search. |
| `CartItemRow` | Fila de un ítem del carrito con controles de cantidad. |
| `CategoryChips` | Filtros de categoría horizontales (patrón controlado). |

## Consideraciones de rendimiento

- **Spinners** (`ActivityIndicator`) en todas las pantallas durante la
  carga.
- **Solicitudes en paralelo** con `Promise.all` en `useProducts`.
- **Paginación infinita** mediante `onEndReached` + `loadMore`.
- **Pull-to-refresh** con `RefreshControl`.
- **Estados de error** con mensajes descriptivos provenientes del backend.
