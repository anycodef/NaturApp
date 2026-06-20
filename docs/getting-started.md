# Guía de Inicio

Esta guía describe cómo levantar el backend y el frontend de NaturApp en
un entorno de desarrollo local.

## Requisitos

- **Node.js** 18 o superior.
- **MongoDB** 7 (local o vía contenedor).
- **Expo Go** (en un dispositivo físico) o un emulador Android/iOS para
  ejecutar la app.

## 1. Base de datos (MongoDB)

El backend se conecta por defecto a `mongodb://localhost:27017/naturapp`.
La forma más simple de tener una instancia local es Docker:

```bash
docker run -d --name naturapp-mongo -p 27017:27017 mongo:7
```

Para usar otra URI, define la variable de entorno `MONGODB_URI` antes de
arrancar el servidor.

## 2. Backend

```bash
cd server
npm install        # instala express, mongoose, jsonwebtoken, bcryptjs
npm run seed       # puebla categorías, productos y usuarios de ejemplo
npm run dev        # arranca el servidor con recarga automática (nodemon)
# o: npm start     # arranca sin recarga
```

El servidor escucha en `http://0.0.0.0:9090`. Verifica que esté activo:

```bash
curl http://localhost:9090/api/health
# { "status": "ok", "timestamp": "..." }
```

### Usuarios de ejemplo (creados por el seed)

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@naturapp.com` | `admin123` | admin |
| `demo@naturapp.com` | `123456` | customer |

El rol `admin` es el único autorizado para crear, actualizar o eliminar
productos y categorías.

## 3. Frontend (app móvil)

La URL del backend se configura por **variable de entorno**, no en el
código. Copia la plantilla y define la dirección del servidor:

```bash
cp .env.example .env
```

Edita `.env` y asigna a `EXPO_PUBLIC_API_URL` la IP LAN de la máquina que
ejecuta el backend (para dispositivos físicos) o `localhost` (para
emuladores que comparten red con el host):

```
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:9090/api
```

> El archivo `.env` está en `.gitignore`, de modo que cada quien define
> su propia URL sin versionarla. Si la variable no existe, `apiService.js`
> usa `http://localhost:9090/api` como valor por defecto.

Luego, desde la raíz del proyecto:

```bash
npm install        # instala las dependencias de Expo SDK 54
npm start          # inicia el servidor de desarrollo de Expo
```

Escanea el código QR con Expo Go o pulsa `a` / `i` para abrir el
emulador.

## Variables de entorno del backend

| Variable | Por defecto | Descripción |
|----------|-------------|-------------|
| `PORT` | `9090` | Puerto del servidor HTTP. |
| `MONGODB_URI` | `mongodb://localhost:27017/naturapp` | Cadena de conexión a MongoDB. |
| `JWT_SECRET` | `naturapp_secret_key` | Secreto para firmar los tokens JWT. |

> En producción, define siempre un `JWT_SECRET` propio y seguro.
