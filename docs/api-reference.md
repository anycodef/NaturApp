# Referencia de la API REST

Base URL: `http://<host>:9090/api`

Las respuestas siguen el formato `{ success, data | message }`. En la
columna **Auth** de cada tabla se indica el nivel de acceso requerido:

- **Token** — requiere el header `Authorization: Bearer <token>`.
- **Token + admin** — además del token, requiere rol `admin`.
- **Público** — no requiere autenticación.

## Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor. |

## Productos — `/products`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/products` | — | Lista productos. Query: `category`, `search`, `page`, `limit`. Devuelve `data` + `pagination`. |
| GET | `/products/:id` | — | Detalle de un producto (con categoría poblada). |
| POST | `/products` | Token + admin | Crea un producto. |
| PUT | `/products/:id` | Token + admin | Actualiza un producto. |
| DELETE | `/products/:id` | Token + admin | Eliminación lógica (`isActive: false`). |

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
| POST | `/categories` | Token + admin | Crea una categoría. |
| PUT | `/categories/:id` | Token + admin | Actualiza una categoría. |
| DELETE | `/categories/:id` | Token + admin | Eliminación lógica. |

## Usuarios — `/users`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/users/register` | — | Registra un usuario y devuelve `{ user, token }`. |
| POST | `/users/login` | — | Autentica y devuelve `{ user, token }`. |
| GET | `/users/profile` | Token | Devuelve el perfil del usuario autenticado. |
| PUT | `/users/profile` | Token | Actualiza `name`, `phone`, `address`. |

Ejemplo de login:

```bash
curl -X POST http://localhost:9090/api/users/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@naturapp.com","password":"123456"}'
```

## Pedidos — `/orders`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/orders` | Token | Crea un pedido. Valida stock y calcula el total. |
| GET | `/orders` | Token | Lista los pedidos del usuario. |
| GET | `/orders/:id` | Token | Detalle de un pedido. |
| PUT | `/orders/:id/cancel` | Token | Cancela un pedido pendiente y restaura stock. |

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
| GET | `/cart` | Token | Devuelve `items`, `total` y `count`. |
| POST | `/cart/add` | Token | Agrega un ítem (o incrementa su cantidad). |
| PUT | `/cart/:productId` | Token | Actualiza la cantidad de un ítem. |
| DELETE | `/cart/:productId` | Token | Elimina un ítem del carrito. |
| DELETE | `/cart` | Token | Vacía el carrito. |

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
