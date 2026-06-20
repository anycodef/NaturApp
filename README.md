# NaturApp

NaturApp es una aplicación móvil de comercio electrónico de productos
naturales. Consta de dos partes independientes: un backend con API REST y
una aplicación móvil que la consume.

## Cómo lo construí

Partí de separar con claridad el servidor de la aplicación y, dentro de
cada uno, trabajar por módulos con una sola responsabilidad.

**Backend (Node.js + Express + MongoDB).** Implementé una API REST
organizada por recursos: un módulo de rutas por entidad (productos,
categorías, usuarios, pedidos y carrito) que se registran en `server.js`
bajo el prefijo `/api`. Los datos se modelan con Mongoose, con validación,
relaciones por `ObjectId` e índice de texto para la búsqueda. La
autenticación usa JSON Web Tokens: un middleware `authenticate` verifica
el token y otro `authorize` restringe acciones por rol. La lógica de
negocio vive en el servidor; por ejemplo, al crear un pedido se valida el
stock, se calcula el total y se descuenta el inventario en una sola
operación.

**Aplicación móvil (React Native + Expo Router).** La navegación es por
archivos dentro de `app/`. Toda la comunicación con el backend pasa por un
único módulo (`apiService`), de modo que la URL y las cabeceras se
configuran en un solo lugar. La lógica de cada dominio está en custom
hooks (`useProducts`, `useOrders`, etc.) y el estado que debe compartirse
entre pantallas —la sesión y el carrito— lo elevé a React Context para
tener una sola fuente de verdad. Las pantallas se limitan a consumir esos
hooks y renderizar.

**Detalles cuidados.** Carga inicial de productos y categorías en
paralelo, paginación infinita, *pull-to-refresh*, indicadores de carga,
manejo de errores con los mensajes del servidor y configuración del
backend mediante variable de entorno (no incrustada en el código).

Durante las pruebas en dispositivo detecté algunos defectos de diseño y
los corregí; quedan documentados en [docs/fixes.md](./docs/fixes.md).

Cada capa se explica en detalle en la carpeta [`docs/`](./docs).

## Estructura

```
NaturApp/
├── server/      Backend Express + MongoDB (modelos, rutas, middleware)
├── app/         Pantallas y navegación (Expo Router)
├── src/         Servicio HTTP, estado global, hooks y componentes
└── docs/        Documentación del proyecto
```

## Puesta en marcha

```bash
# 1. Base de datos
docker run -d --name naturapp-mongo -p 27017:27017 mongo:7

# 2. Backend
cd server && npm install && npm run seed && npm run dev

# 3. Aplicación móvil (desde la raíz)
cp .env.example .env   # define EXPO_PUBLIC_API_URL con tu IP LAN
npm install && npm start
```

El backend queda en `http://localhost:9090` (compruébalo con
`curl http://localhost:9090/api/health`). El seed crea dos usuarios:
`admin@naturapp.com / admin123` (admin) y `demo@naturapp.com / 123456`
(cliente). Los pasos detallados están en
[docs/getting-started.md](./docs/getting-started.md).

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [docs/architecture.md](./docs/architecture.md) | Arquitectura y estructura de carpetas. |
| [docs/backend.md](./docs/backend.md) | Modelos, middleware y rutas del servidor. |
| [docs/api-reference.md](./docs/api-reference.md) | Referencia de los endpoints REST. |
| [docs/frontend.md](./docs/frontend.md) | Navegación, estado, pantallas y componentes. |
| [docs/data-flow.md](./docs/data-flow.md) | Flujo de datos de extremo a extremo. |
| [docs/getting-started.md](./docs/getting-started.md) | Instalación y ejecución paso a paso. |
| [docs/dependencies.md](./docs/dependencies.md) | Versiones de dependencias y política de versionado. |
| [docs/fixes.md](./docs/fixes.md) | Defectos detectados y sus correcciones. |

## Notas

La aplicación móvil está fijada a Expo SDK 54. Las versiones del ecosistema
Expo y React Native están acopladas entre sí, por lo que no deben
actualizarse de forma aislada (ver
[docs/dependencies.md](./docs/dependencies.md)).
