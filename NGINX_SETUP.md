# Configuración Nginx para HomeComfort3R

## Instrucciones para actualizar Nginx

Tu configuración actual de nginx apunta a los puertos 8080 (HTTP) y 8443 (HTTPS), pero necesitas que apunte al puerto 3333 donde corre la aplicación con PM2.

## Opción 1: Modificar los archivos de configuración directamente

Edita los siguientes archivos en el servidor:

### 1. Archivo HTTP: `/home/bitcanc/conf/web/homecomfort3r.s1mple.cloud/nginx.conf`

Cambia estas líneas:

**Antes:**
```nginx
location / {
    proxy_pass http://64.176.18.16:8080;
    ...
}

location @fallback {
    proxy_pass http://64.176.18.16:8080;
}
```

**Después:**
```nginx
location / {
    proxy_pass http://64.176.18.16:3333;
    ...
}

location @fallback {
    proxy_pass http://64.176.18.16:3333;
}
```

### 2. Archivo HTTPS: `/home/bitcanc/conf/web/homecomfort3r.s1mple.cloud/nginx.ssl.conf`

Cambia estas líneas:

**Antes:**
```nginx
location / {
    proxy_ssl_server_name on;
    proxy_ssl_name $host;
    proxy_pass https://64.176.18.16:8443;
    ...
}

location @fallback {
    proxy_ssl_server_name on;
    proxy_ssl_name $host;
    proxy_pass https://64.176.18.16:8443;
}
```

**Después:**
```nginx
location / {
    proxy_pass http://64.176.18.16:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    ...
}

location @fallback {
    proxy_pass http://64.176.18.16:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**Nota:** En HTTPS, aunque nginx recibe HTTPS, hace proxy a HTTP en el puerto 3333 (la aplicación Next.js maneja HTTP internamente).

## Opción 2: Usar archivos de configuración personalizados

Si HestiaCP permite incluir archivos personalizados, puedes crear:

### `/home/bitcanc/conf/web/homecomfort3r.s1mple.cloud/nginx.conf_custom`

```nginx
# Sobrescribir proxy_pass para HTTP
location / {
    proxy_pass http://64.176.18.16:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

location @fallback {
    proxy_pass http://64.176.18.16:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### `/home/bitcanc/conf/web/homecomfort3r.s1mple.cloud/nginx.ssl.conf_custom`

```nginx
# Sobrescribir proxy_pass para HTTPS
location / {
    proxy_pass http://64.176.18.16:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_cache_bypass $http_upgrade;
}

location @fallback {
    proxy_pass http://64.176.18.16:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_cache_bypass $http_upgrade;
}
```

## Después de modificar

1. Verificar la configuración de nginx:
```bash
nginx -t
```

2. Recargar nginx:
```bash
systemctl reload nginx
```

O desde HestiaCP, recargar el dominio.

## Verificar que funciona

1. Asegúrate de que PM2 esté corriendo:
```bash
pm2 status
```

2. Verifica que la aplicación responda en el puerto 3333:
```bash
curl http://localhost:3333
```

3. Accede al dominio: `https://homecomfort3r.s1mple.cloud`

