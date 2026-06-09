# PRODE - Despliegue con Docker

Guía completa para desplegar PRODE usando Docker y Docker Compose.

## Requisitos Previos

- Docker (20.10+)
- Docker Compose (2.0+)

Instálalo desde: https://docs.docker.com/get-docker/

## Instalación y Despliegue Rápido

### 1. Clonar el repositorio y entrar al directorio

```bash
cd Prode
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` y cambia `JWT_SECRET` por una clave segura:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=tu_clave_secreta_muy_segura
DB_HOST=db
DB_PORT=3306
DB_USER=prode
DB_PASSWORD=prode_password
DB_NAME=prode
```

### 3. Construir y ejecutar los contenedores

```bash
docker-compose up --build
```

Esto:
- Construye las imágenes Docker para backend y frontend
- Inicia ambos servicios
- Expone el frontend en `http://localhost:3000`
- Expone el backend en `http://localhost:5000`

### 4. Verificar que todo funciona

- Abre `http://localhost:3000` en tu navegador
- Regístrate e inicia sesión
- Crea un pronóstico para probar

## Comandos Útiles

### Iniciar en segundo plano

```bash
docker-compose up -d
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Detener los servicios

```bash
docker-compose down
```

### Detener y remover volúmenes (ADVERTENCIA: borra la base de datos)

```bash
docker-compose down -v
```

### Reconstruir sin usar caché

```bash
docker-compose up --build --no-cache
```

## Estructura de archivos Docker

```
Prode/
├── backend/
│   ├── Dockerfile           # Build backend
│   ├── .dockerignore        # Archivos a ignorar
│   └── .env                 # Variables de entorno
├── frontend/
│   ├── Dockerfile           # Build frontend (multi-stage)
│   ├── nginx.conf           # Config de Nginx
│   └── .dockerignore        # Archivos a ignorar
└── docker-compose.yml       # Orquestación de servicios
```

## Persistencia de Datos

- La base de datos MySQL se mantiene en el volumen Docker `db-data`
- Los datos persisten entre reinicios de contenedores
- Para hacer backup: usa `mysqldump` o herramientas de exportación de MySQL

## Escalado en Producción

Para producción con múltiples instancias:

### Con Nginx inverso

1. Usa un proxy inverso Nginx en un contenedor separado
2. Ajusta los puertos en `docker-compose.yml`
3. Usa `networks` para conectar contenedores

### Ejemplo con Nginx proxy

```yaml
nginx-proxy:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx-proxy.conf:/etc/nginx/conf.d/default.conf
  depends_on:
    - frontend
```

## Troubleshooting

### El backend no inicia

```bash
docker-compose logs backend
```

Verifica que el `.env` tenga las variables correctas.

### El frontend no se conecta al backend

Asegúrate que en `frontend/nginx.conf` el proxy apunta a `http://backend:5000` (nombre del servicio Docker).

### Puerto en uso

Si el puerto 3000 o 5000 ya está en uso, cambia en `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Frontend en puerto 8080
  - "8000:5000"  # Backend en puerto 8000
```

### Reiniciar contenedores

```bash
docker-compose restart
```

## Deployment en un servidor remoto

1. Instala Docker y Docker Compose en el servidor
2. Clona o copia los archivos al servidor
3. Configura `.env` con valores de producción
4. Ejecuta `docker-compose up -d`
5. Verifica acceso a `http://servidor:3000`

## Seguridad en Producción

- Cambia `JWT_SECRET` a una clave fuerte
- Usa HTTPS con certificados SSL (Let's Encrypt)
- Configura un firewall y limita acceso a puerto 5000
- Haz backups periódicos de la BD
- Usa políticas de reinicio: `restart: unless-stopped`

## Más información

- [Documentación de Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Nginx Documentation](https://nginx.org/en/docs/)
