# Guía de Despliegue - HomeComfort3R

## Pasos para desplegar en el servidor

### 1. Instalar dependencias y generar Prisma
```bash
cd /home/bitcanc/web/homecomfort3r.s1mple.cloud/public_html
npm install
npx prisma generate
```

### 2. Compilar la aplicación
```bash
npm run build
```

### 3. Iniciar con PM2
```bash
npm run start:pm2
```

### 4. Verificar que está corriendo
```bash
pm2 status
pm2 logs homecomfort3r
```

### 5. Configurar nginx

Copiar los archivos de configuración al servidor:

```bash
# Copiar configuración HTTP
cp nginx.conf /home/bitcanc/conf/web/homecomfort3r.s1mple.cloud/nginx.conf

# Copiar configuración HTTPS
cp nginx.ssl.conf /home/bitcanc/conf/web/homecomfort3r.s1mple.cloud/nginx.ssl.conf

# Verificar configuración
nginx -t

# Recargar nginx
systemctl reload nginx
```

## Comandos útiles

### PM2
```bash
pm2 status                    # Ver estado
pm2 logs homecomfort3r        # Ver logs
pm2 restart homecomfort3r     # Reiniciar
pm2 stop homecomfort3r        # Detener
pm2 delete homecomfort3r      # Eliminar
```

### Recompilar después de cambios
```bash
npm run build
pm2 restart homecomfort3r
```

