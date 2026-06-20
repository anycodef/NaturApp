# NaturApp

NaturApp es una aplicación móvil de comercio electrónico de productos
naturales. El proyecto está dividido en dos partes que funcionan de forma
independiente: un backend que expone una API REST y una aplicación móvil
que la consume.

- **Backend:** Node.js con Express, persistencia en MongoDB mediante
  Mongoose y autenticación basada en JSON Web Tokens.
- **Aplicación móvil:** React Native con Expo Router (navegación basada en
  archivos).

## Funcionalidades

- Catálogo de productos con filtrado por categoría, búsqueda y paginación.
- Detalle de producto con información nutricional y control de stock.
- Carrito de compras por usuario.
- Registro, inicio de sesión y perfil con tokens JWT.
- Creación, listado y cancelación de pedidos, con validación de stock en
  el servidor.

## Arquitectura

La aplicación sigue una arquitectura modular cliente-servidor. Cada capa
se organiza en módulos con una responsabilidad única, lo que facilita su
desarrollo y mantenimiento por separado.

```
NaturApp/
├── server/          Backend Express + MongoDB (API REST)
│   ├── models/      Esquemas de Mongoose
│   ├── routes/      Endpoints REST (un módulo por recurso)
│   ├── middleware/  Autenticación y autorización JWT
│   ├── server.js    Punto de entrada del servidor
│   └── seed.js      Carga de datos de ejemplo
├── app/             Pantallas y navegación (Expo Router)
├── src/
│   ├── services/    Cliente HTTP centralizado
│   ├── context/     Estado global (sesión y carrito)
│   ├── hooks/       Lógica de negocio del frontend
│   └── components/  Componentes de interfaz reutilizables
└── docs/            Documentación del proyecto
```

Los detalles de cada capa están en la carpeta [`docs/`](./docs).

## Requisitos

- Node.js 18 o superior.
- MongoDB 7 (instalación local o contenedor Docker).
- Expo Go en un dispositivo físico, o un emulador Android/iOS.

## Puesta en marcha

### 1. Base de datos

El backend se conecta por defecto a
`mongodb://localhost:27017/naturapp`. La forma más rápida de tener una
instancia es Docker:

```bash
docker run -d --name naturapp-mongo -p 27017:27017 mongo:7
```

### 2. Backend

```bash
cd server
npm install
npm run seed     # carga categorías, productos y usuarios de ejemplo
npm run dev      # arranca el servidor con recarga automática
```

El servidor queda disponible en `http://localhost:9090`. Puede
comprobarse con `curl http://localhost:9090/api/health`.

Usuarios creados por el seed:

| Correo | Contraseña | Rol |
|--------|------------|-----|
| `admin@naturapp.com` | `admin123` | admin |
| `demo@naturapp.com` | `123456` | customer |

### 3. Aplicación móvil

Antes de arrancar, define la URL del backend por variable de entorno
(copiando la plantilla) para que el dispositivo pueda alcanzarlo dentro de
la red local:

```bash
cp .env.example .env   # luego edita EXPO_PUBLIC_API_URL con tu IP LAN
npm install
npm start
```

Luego escanea el código QR con Expo Go o abre la app en un emulador.

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [docs/getting-started.md](./docs/getting-started.md) | Instalación y ejecución paso a paso. |
| [docs/architecture.md](./docs/architecture.md) | Arquitectura y estructura de carpetas. |
| [docs/backend.md](./docs/backend.md) | Modelos, middleware y rutas del servidor. |
| [docs/api-reference.md](./docs/api-reference.md) | Referencia de los endpoints REST. |
| [docs/frontend.md](./docs/frontend.md) | Navegación, estado, pantallas y componentes. |
| [docs/data-flow.md](./docs/data-flow.md) | Flujo de datos de extremo a extremo. |
| [docs/dependencies.md](./docs/dependencies.md) | Versiones de dependencias y política de versionado. |
| [docs/fixes.md](./docs/fixes.md) | Defectos detectados y sus correcciones. |

## Notas

La aplicación móvil está fijada a Expo SDK 54. Las versiones del ecosistema
Expo y React Native están acopladas entre sí, por lo que no deben
actualizarse de forma aislada. Más detalles en
[docs/dependencies.md](./docs/dependencies.md).
