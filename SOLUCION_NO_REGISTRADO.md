# Solución: "No registrado" en Perfil

## 🔍 Problema

Si ves "No registrado" para **Número de Cédula** o **Número de Credencial**, puede deberse a:

1. **Sesión antigua en localStorage**: Los datos guardados no incluyen esos campos
2. **Datos en BD son null**: El usuario en la base de datos no tiene esos valores

## ✅ Solución Rápida

### Opción 1: Cerrar sesión y volver a iniciar

1. Haz click en tu nombre en el header
2. Selecciona "Cerrar sesión"
3. Vuelve a iniciar sesión
4. Los nuevos campos deberían aparecer

### Opción 2: Limpiar localStorage manualmente

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Application" o "Almacenamiento"
3. Busca "Local Storage" → tu dominio
4. Elimina las claves:
   - `user_session`
   - `session_time`
5. Recarga la página y vuelve a iniciar sesión

## 🔧 Verificar Datos en Base de Datos

Si después de re-iniciar sesión aún ves "No registrado", verifica que los datos estén en la BD:

1. Ejecuta: `npm run db:studio`
2. Abre la tabla `usuarios`
3. Busca tu usuario por `username`
4. Verifica que los campos `numero_cedula` y `numero_credencial` tengan valores

## 📝 Para el Usuario GUILLERMO RECALDE

Los datos deberían ser:
- **numero_cedula**: `5995260`
- **numero_credencial**: `60149`

Si están en null, puedes editarlos directamente en Prisma Studio o ejecutar el seed nuevamente.

