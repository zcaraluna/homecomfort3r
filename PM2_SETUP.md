# Configuración PM2 para HomeComfort3R

## Instalación de PM2

Si no tienes PM2 instalado globalmente:

```bash
npm install -g pm2
```

## Compilar la aplicación

Antes de iniciar con PM2, asegúrate de compilar la aplicación:

```bash
npm run build
```

## Comandos PM2

### Iniciar la aplicación
```bash
npm run start:pm2
```

O directamente:
```bash
pm2 start ecosystem.config.js
```

### Ver el estado
```bash
pm2 status
```

### Ver logs
```bash
npm run logs:pm2
```

O directamente:
```bash
pm2 logs homecomfort3r
```

### Reiniciar la aplicación
```bash
npm run restart:pm2
```

O directamente:
```bash
pm2 restart homecomfort3r
```

### Detener la aplicación
```bash
npm run stop:pm2
```

O directamente:
```bash
pm2 stop homecomfort3r
```

### Eliminar la aplicación de PM2
```bash
npm run delete:pm2
```

O directamente:
```bash
pm2 delete homecomfort3r
```

### Guardar la configuración actual de PM2
```bash
pm2 save
```

### Configurar PM2 para iniciar automáticamente al reiniciar el servidor
```bash
pm2 startup
```

## Puerto

La aplicación está configurada para correr en el puerto **3333**.

Accede a la aplicación en: `http://localhost:3333`

## Logs

Los logs se guardan en la carpeta `logs/`:
- `logs/pm2-error.log` - Errores
- `logs/pm2-out.log` - Salida estándar

