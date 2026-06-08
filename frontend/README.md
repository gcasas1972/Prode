# Frontend - PRODE

Interfaz React para la aplicación PRODE de pronósticos del Mundial.

## Requisitos

- Node.js 14+
- npm

## Instalación

```bash
npm install
```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

### Build para producción
```bash
npm run build
```

### Preview de producción
```bash
npm run preview
```

## Estructura del Código

- `main.jsx` - Punto de entrada
- `App.jsx` - Componente principal
- `api.js` - Cliente HTTP y endpoints
- `Auth.jsx` - Componentes de login/registro
- `Matches.jsx` - Componente de partidos y pronósticos
- `Ranking.jsx` - Componente de ranking

## Características

- Autenticación de usuarios
- Visualización de partidos
- Hacer pronósticos
- Ver ranking en tiempo real
- Interface responsiva

## Configuración del Proxy

El archivo `vite.config.js` incluye un proxy para redirigir llamadas a `/api` hacia `http://localhost:5000`.
