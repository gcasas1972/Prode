# PRODE - Guía rápida para ejecutar con Docker (Linux)

## Resumen
Esta guía explica cómo ejecutar la aplicación PRODE (frontend + backend + MySQL) con Docker Compose en Linux, y cómo crear un usuario administrador.

## 1. Variables opcionales (.env)
Crea un archivo `.env` en la raíz del proyecto con valores sensibles (opcional):

```
JWT_SECRET=mi_secreto_largo
DB_USER=prode
DB_PASSWORD=prode_password
DB_NAME=prode
```

## 2. Iniciar con Docker Compose
Desde la raíz del proyecto (donde está `docker-compose.yml`):

```bash
docker compose up --build -d
```

Si tu sistema usa el binario antiguo:

```bash
docker-compose up --build -d
```

## 3. Verificar servicios
```
docker compose ps
docker compose logs -f backend
```

API health check:
```
curl http://localhost:5000/api/health
```

## 4. Acceder a la app
- Frontend: http://localhost:3000
- Backend API health: http://localhost:5000/api/health

## 5. Crear/activar administrador
Registra un usuario desde la app y luego conviértelo en admin desde la base de datos MySQL dentro del contenedor:

```bash
# Ver usuarios
docker compose exec db mysql -u root -pprode_root_password -e "USE prode; SELECT id, username, email, role FROM users;"

# Convertir un usuario en admin (reemplaza el email)
docker compose exec db mysql -u root -pprode_root_password -e "USE prode; UPDATE users SET role='admin' WHERE email='tu-email@ejemplo.com';"
```

Luego inicia sesión en la app con ese usuario; verás el formulario para cargar resultados.

## 6. Comandos útiles
```
# Parar
docker compose down

# Reiniciar y reconstruir
docker compose up --build -d

# Ver logs
docker compose logs -f backend
docker compose logs -f frontend
```

## 7. Notas
- `docker-compose.yml`, `backend/Dockerfile` y `frontend/Dockerfile` ya están en el repo.
- Si quieres que cree automáticamente un usuario admin al levantar los contenedores, puedo añadir un script de seed y modificar `docker-compose.yml`.

---
Generado por el equipo de desarrollo de PRODE.
