# PRODE - Pronósticos del Mundial 2026

Una aplicación full-stack para realizar pronósticos del Mundial de Fútbol 2026. Los usuarios pueden registrarse, hacer pronósticos de los partidos y competir en un ranking basado en puntuación.

## 🚀 Características

- ✅ Registro e inicio de sesión de usuarios
- ✅ Gestión del fixture del Mundial
- ✅ Sistema de pronósticos en tiempo real
- ✅ Ranking de jugadores
- ✅ Sistema de puntuación automático
- ✅ Interface responsiva

## 📋 Tecnologías

### Frontend
- **React 18** - UI moderna
- **Vite** - Build tool rápido
- **Axios** - Cliente HTTP

### Backend
- **Node.js + Express** - Servidor API
- **SQLite3** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## 📁 Estructura del Proyecto

```
Prode/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── Auth.jsx         # Componentes de autenticación
│   │   ├── Matches.jsx      # Componente de partidos
│   │   ├── Ranking.jsx      # Componente de ranking
│   │   ├── App.jsx          # Componente principal
│   │   ├── api.js           # Cliente API
│   │   └── main.jsx         # Punto de entrada
│   ├── package.json
│   └── index.html
│
└── backend/                  # Servidor Express
    ├── routes/
    │   ├── auth.js          # Rutas de autenticación
    │   ├── matches.js       # Rutas de partidos
    │   ├── predictions.js   # Rutas de pronósticos
    │   └── users.js         # Rutas de usuarios
    ├── database.js          # Configuración de SQLite
    ├── index.js             # Servidor principal
    ├── package.json
    └── .env                 # Variables de entorno
```

## 🔧 Instalación

### Backend

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (`.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=tu_secret_key_aqui
DATABASE_PATH=./prode.db
```

4. Inicia el servidor:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Frontend

1. En otra terminal, navega a la carpeta frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Partidos
- `GET /api/matches` - Obtener todos los partidos
- `GET /api/matches/:id` - Obtener partido específico
- `POST /api/matches` - Crear nuevo partido (admin)
- `PUT /api/matches/:id` - Actualizar resultado del partido

### Pronósticos
- `GET /api/predictions/user/:userId` - Obtener pronósticos del usuario
- `POST /api/predictions` - Crear pronóstico
- `PUT /api/predictions/:id` - Actualizar pronóstico

### Usuarios
- `GET /api/users/ranking` - Obtener ranking de jugadores
- `GET /api/users/:id` - Obtener perfil de usuario

## 🎮 Cómo Usar

1. **Registrarse**: Crea una nueva cuenta con tu usuario y email
2. **Iniciar Sesión**: Accede con tus credenciales
3. **Ver Partidos**: Visualiza todos los partidos del Mundial
4. **Hacer Pronósticos**: Predice los goles de cada equipo antes del partido
5. **Ver Ranking**: Compite con otros jugadores según tus aciertos

## 🏆 Sistema de Puntuación

- **Resultado exacto**: +3 puntos
- **Ganador correcto**: +1 punto
- **Pronóstico incorrecto**: 0 puntos

## 📚 Base de Datos

### Tabla `users`
- `id` - ID único
- `username` - Nombre de usuario
- `email` - Email
- `password` - Contraseña encriptada
- `points` - Puntos totales
- `created_at` - Fecha de creación

### Tabla `matches`
- `id` - ID único
- `date` - Fecha del partido
- `team1` - Equipo 1
- `team2` - Equipo 2
- `result_team1` - Goles equipo 1
- `result_team2` - Goles equipo 2
- `stage` - Fase del torneo
- `status` - Estado (pending/completed)

### Tabla `predictions`
- `id` - ID único
- `user_id` - ID del usuario
- `match_id` - ID del partido
- `predicted_team1` - Goles predichos equipo 1
- `predicted_team2` - Goles predichos equipo 2
- `points_earned` - Puntos ganados

## 🛠️ Desarrollo

Para agregar nuevas funcionalidades:

1. **Backend**: Crea nuevas rutas en `backend/routes/`
2. **Frontend**: Crea nuevos componentes en `frontend/src/`
3. **Base de Datos**: Modifica `backend/database.js` si necesitas nuevas tablas

## 📄 Licencia

Proyecto de demostración - Uso libre

## 👨‍💻 Autor

PRODE 2026
