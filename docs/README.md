# NaturApp — Documentación

NaturApp es una aplicación móvil de comercio electrónico de productos
naturales. Está compuesta por dos capas independientes:

- **Backend** — API REST en Node.js + Express, persistencia en MongoDB
  (Mongoose) y autenticación con JWT.
- **Frontend** — Aplicación React Native con Expo Router que consume la
  API REST del backend.

## Índice de documentación

| Documento | Contenido |
|-----------|-----------|
| [getting-started.md](./getting-started.md) | Requisitos, instalación y ejecución del backend y la app. |
| [architecture.md](./architecture.md) | Arquitectura modular cliente-servidor y estructura de carpetas. |
| [backend.md](./backend.md) | Modelos, middleware y rutas del servidor. |
| [api-reference.md](./api-reference.md) | Referencia completa de endpoints REST. |
| [frontend.md](./frontend.md) | Navegación, hooks, pantallas y componentes. |
| [data-flow.md](./data-flow.md) | Flujo de datos de extremo a extremo (toque → render). |
| [dependencies.md](./dependencies.md) | Versiones de dependencias y política de versionado. |
| [fixes.md](./fixes.md) | Defectos heredados de la guía y sus reparaciones. |

## Resumen rápido

```
NaturApp/
├── server/        # Backend Express + MongoDB (API REST)
├── app/           # Rutas de Expo Router (pantallas)
├── src/
│   ├── services/  # Cliente HTTP centralizado (apiService.js)
│   ├── hooks/     # Lógica de negocio del frontend (custom hooks)
│   └── components/ # Componentes de UI reutilizables
└── docs/          # Esta documentación
```

Para arrancar todo desde cero, sigue
[getting-started.md](./getting-started.md).
