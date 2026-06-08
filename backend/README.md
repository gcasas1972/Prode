# Backend - PRODE

Servidor Express para la aplicación PRODE de pronósticos del Mundial.

## Requisitos

- Node.js 14+
- npm

## Instalación

```bash
npm install
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=cambiar_esta_clave_en_produccion
DATABASE_PATH=./prode.db
```

## Ejecución

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

## API Endpoints

Ver [README.md](../README.md#-api-endpoints) principal para más detalles.

## Estructura del Código

- `index.js` - Configuración principal del servidor
- `database.js` - Manejo de SQLite y migraciones
- `routes/` - Endpoints de la API
  - `auth.js` - Autenticación de usuarios
  - `matches.js` - Gestión de partidos
  - `predictions.js` - Gestión de pronósticos
  - `users.js` - Datos de usuarios
