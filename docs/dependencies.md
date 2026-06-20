# Dependencias y Versionado

Este documento registra las dependencias del proyecto y la política de
versionado que debe respetarse al evolucionarlo.

## Política

- **El frontend está fijado a Expo SDK 54.** Las versiones del ecosistema
  Expo/React Native están acopladas entre sí; no deben actualizarse de
  forma aislada porque romperían la compatibilidad. Cualquier cambio de
  versión debe hacerse con una migración de SDK completa y coordinada.
- En el backend se **conservan las versiones ya presentes** de `express`
  y `cors`. Las dependencias nuevas que introduce la capa de datos
  (MongoDB, JWT, hashing) se añadieron sin alterar las existentes.

## Frontend (`package.json`)

Fijado a **Expo SDK 54**:

| Paquete | Versión |
|---------|---------|
| `expo` | `~54.0.0` |
| `expo-router` | `~6.0.24` |
| `expo-constants` | `~18.0.13` |
| `expo-linking` | `~8.0.12` |
| `expo-sqlite` | `~16.0.10` |
| `expo-status-bar` | `~3.0.9` |
| `react` | `19.1.0` |
| `react-native` | `0.81.5` |
| `react-native-safe-area-context` | `~5.6.0` |
| `react-native-screens` | `~4.16.0` |
| `@react-native-async-storage/async-storage` | `2.2.0` |

> `@expo/vector-icons` (Ionicons) viene incluido con el paquete `expo`,
> por lo que no requiere una entrada propia en `package.json`.

## Backend (`server/package.json`)

| Paquete | Versión | Rol |
|---------|---------|-----|
| `express` | `^4.19.2` | Servidor HTTP (versión conservada). |
| `cors` | `^2.8.5` | CORS (versión conservada). |
| `mongoose` | `^8.14.1` | ODM para MongoDB. |
| `jsonwebtoken` | `^9.0.2` | Generación y verificación de JWT. |
| `bcryptjs` | `^2.4.3` | Hashing de contraseñas. |
| `nodemon` (dev) | `^3.1.9` | Recarga automática en desarrollo. |

## Infraestructura

- **MongoDB 7** — base de datos. Puede ejecutarse con Docker:
  `docker run -d --name naturapp-mongo -p 27017:27017 mongo:7`.
