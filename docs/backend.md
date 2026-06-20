# Backend

El backend es una API REST construida con Express y MongoDB (a través de
Mongoose). Toda respuesta sigue el formato estándar
`{ success: boolean, data | message }` con códigos HTTP apropiados.

## Punto de entrada — `server.js`

`server.js` es el corazón del backend. Allí se:

1. Configura el middleware global (`cors`, `express.json`).
2. Conecta a MongoDB con Mongoose.
3. Registra cada módulo de rutas bajo su prefijo `/api/...`.
4. Expone un endpoint de health check en `/api/health`.
5. Define un middleware centralizado de manejo de errores.

```js
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
```

## Modelos de datos (Mongoose)

Cada modelo encapsula la validación y la estructura de una entidad.

### `Product`
Campos: `name`, `description`, `price`, `category` (ref a `Category`),
`image`, `stock`, `isActive`, `tags[]`, `nutritionalInfo` (`calories`,
`protein`, `fiber`). Incluye un **índice de texto** sobre `name` y
`description` para búsquedas eficientes. La eliminación es lógica
(`isActive: false`).

### `Category`
Campos: `name` (único), `description`, `icon`, `isActive`. Se referencia
desde `Product` mediante `ObjectId`.

### `User`
Campos: `name`, `email` (único), `password`, `phone`, `address`, `role`
(`customer` | `admin`). La contraseña se **hashea con bcrypt** en un hook
`pre('save')`, y el método `comparePassword` verifica credenciales.

### `Order`
Campos: `user` (ref), `items[]` (subdocumento con `product`, `name`,
`quantity`, `price`), `total`, `status`
(`pending` | `confirmed` | `shipped` | `delivered` | `cancelled`),
`shippingAddress`, `paymentMethod`. El estado se valida con un `enum`.

## Middleware de autenticación — `middleware/auth.js`

Módulo transversal reutilizable que implementa seguridad con JWT:

- **`authenticate`** — extrae el token del header `Authorization: Bearer
  <token>`, lo verifica y adjunta `req.userId` y `req.userRole`. Responde
  `401` si falta o es inválido.
- **`authorize(...roles)`** — comprueba que `req.userRole` esté entre los
  roles permitidos. Responde `403` en caso contrario.
- **`generateToken(userId, role)`** — firma un JWT con expiración de 7
  días.

## Rutas (endpoints REST)

Cada módulo de rutas implementa operaciones CRUD con métodos HTTP
estándar. Los detalles de cada endpoint están en
[api-reference.md](./api-reference.md).

| Módulo | Prefijo | Responsabilidad |
|--------|---------|-----------------|
| `productRoutes.js` | `/api/products` | CRUD de productos, listado con filtros, búsqueda y paginación. |
| `categoryRoutes.js` | `/api/categories` | CRUD de categorías. |
| `userRoutes.js` | `/api/users` | Registro, login y perfil. |
| `orderRoutes.js` | `/api/orders` | Crear, listar, ver y cancelar pedidos. |
| `cartRoutes.js` | `/api/cart` | Carrito de compras por usuario. |

### Lógica de negocio destacada

- **Crear pedido** (`POST /api/orders`) valida el stock de cada producto,
  calcula el total, descuenta inventario y crea el pedido en una sola
  operación.
- **Cancelar pedido** (`PUT /api/orders/:id/cancel`) restaura el stock de
  los productos y solo permite cancelar pedidos en estado `pending`.
- **Listar productos** soporta filtros por `category`, búsqueda de texto
  (`search`) y paginación (`page`, `limit`).

## Datos de ejemplo — `seed.js`

El script `npm run seed` limpia las colecciones y carga 5 categorías, 6
productos y 2 usuarios (un admin y un cliente). Los usuarios se crean uno
a uno para que el hook `pre('save')` hashee correctamente las
contraseñas.
