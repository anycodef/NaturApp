# Referencia de la API REST

Base URL: `http://<host>:9090/api`

Las respuestas siguen el formato `{ success, data | message }`. Los
endpoints marcados con 🔒 requieren el header
`Authorization: Bearer <token>`. Los marcados con 👑 requieren rol
`admin`.

## Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor. |

## Productos — `/products`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/products` | — | Lista productos. Query: `category`, `search`, `page`, `limit`. Devuelve `data` + `pagination`. |
| GET | `/products/:id` | — | Detalle de un producto (con categoría poblada). |
| POST | `/products` | 🔒👑 | Crea un producto. |
| PUT | `/products/:id` | 🔒👑 | Actualiza un producto. |
| DELETE | `/products/:id` | 🔒👑 | Eliminación lógica (`isActive: false`). |

Ejemplo de respuesta de listado:

```json
{
  "success": true,
  "data": [ /* productos */ ],
  "pagination": { "page": 1, "limit": 20, "total": 6, "pages": 1 }
}
```

## Categorías — `/categories`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/categories` | — | Lista categorías activas. |
| POST | `/categories` | 🔒👑 | Crea una categoría. |
| PUT | `/categories/:id` | 🔒👑 | Actualiza una categoría. |
| DELETE | `/categories/:id` | 🔒👑 | Eliminación lógica. |

## Usuarios — `/users`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/users/register` | — | Registra un usuario y devuelve `{ user, token }`. |
| POST | `/users/login` | — | Autentica y devuelve `{ user, token }`. |
| GET | `/users/profile` | 🔒 | Devuelve el perfil del usuario autenticado. |
| PUT | `/users/profile` | 🔒 | Actualiza `name`, `phone`, `address`. |

Ejemplo de login:

```bash
curl -X POST http://localhost:9090/api/users/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@naturapp.com","password":"123456"}'
```

## Pedidos — `/orders`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/orders` | 🔒 | Crea un pedido. Valida stock y calcula el total. |
| GET | `/orders` | 🔒 | Lista los pedidos del usuario. |
| GET | `/orders/:id` | 🔒 | Detalle de un pedido. |
| PUT | `/orders/:id/cancel` | 🔒 | Cancela un pedido pendiente y restaura stock. |

Cuerpo de creación de pedido:

```json
{
  "items": [{ "productId": "<id>", "quantity": 2 }],
  "shippingAddress": { "street": "Av. X 123", "city": "Lima", "zipCode": "15001" },
  "paymentMethod": "cash"
}
```

## Carrito — `/cart`

El carrito se mantiene en memoria por usuario (identificado por el token).

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/cart` | 🔒 | Devuelve `items`, `total` y `count`. |
| POST | `/cart/add` | 🔒 | Agrega un ítem (o incrementa su cantidad). |
| PUT | `/cart/:productId` | 🔒 | Actualiza la cantidad de un ítem. |
| DELETE | `/cart/:productId` | 🔒 | Elimina un ítem del carrito. |
| DELETE | `/cart` | 🔒 | Vacía el carrito. |

## Códigos de estado

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Recurso creado |
| 400 | Solicitud inválida / error de validación |
| 401 | No autenticado (token ausente o inválido) |
| 403 | Sin permisos (rol insuficiente) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
