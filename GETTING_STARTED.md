# PRODE - Getting Started

¡Bienvenido a PRODE! Aquí te muestro cómo comenzar a usar la aplicación.

## 🚀 Quick Start

### 1. Inicia el Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en: `http://localhost:5000`

### 2. Inicia el Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 🎯 Primeros Pasos

### Crear un Usuario

1. Ve a `http://localhost:3000`
2. Haz clic en **"Registrarse"**
3. Completa el formulario con:
   - Usuario
   - Email
   - Contraseña

### Agregar Partidos (datos de prueba)

Usa CURL o Postman para agregar partidos de prueba:

```bash
curl -X POST http://localhost:5000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-06-21T15:00:00",
    "team1": "Argentina",
    "team2": "Brasil",
    "stage": "Grupo A"
  }'
```

### Hacer Pronósticos

1. Inicia sesión en la app
2. Visita la pestaña **"Partidos"**
3. Ingresa los goles predichos para cada equipo
4. Haz clic en **"Guardar"**

### Ver Ranking

Ve a la pestaña **"Ranking"** para ver la competencia entre jugadores.

## 📊 Datos de Prueba

### SQL para agregar partidos de ejemplo

```sql
INSERT INTO matches (date, team1, team2, stage, status)
VALUES
  ('2026-06-21T15:00:00', 'Argentina', 'Brasil', 'Grupo A', 'pending'),
  ('2026-06-21T19:00:00', 'Francia', 'Alemania', 'Grupo B', 'pending'),
  ('2026-06-22T15:00:00', 'España', 'Italia', 'Grupo C', 'pending'),
  ('2026-06-22T19:00:00', 'Portugal', 'Países Bajos', 'Grupo D', 'pending');
```

## 🛠️ Desarrollo

### Frontend

- **Editor**: VS Code
- **Framework**: React 18
- **Build Tool**: Vite
- **Estilos**: CSS puro

### Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Base de Datos**: MySQL
- **Autenticación**: JWT

## 📝 Archivos Clave

- `backend/index.js` - Servidor principal
- `backend/database.js` - Configuración de BD
- `frontend/src/App.jsx` - Componente principal
- `frontend/src/api.js` - Cliente HTTP

## 🐛 Troubleshooting

### El backend no inicia

```bash
cd backend
npm install
npm run dev
```

### El frontend no se conecta

Verifica que el backend esté corriendo en `http://localhost:5000`

### Base de datos vacía

La tabla se crea automáticamente. Agrega datos de prueba con curl.

## 📚 Documentación

- Ver [README.md](../README.md) para documentación completa
- Ver [backend/README.md](../backend/README.md) para detalles del backend
- Ver [frontend/README.md](../frontend/README.md) para detalles del frontend
