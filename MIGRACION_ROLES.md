# 🔄 Guía de Migración de Roles

El enum de roles ha cambiado. Los valores antiguos (`FUNCIONARIO`, `SUPERVISOR`) deben migrarse a los nuevos valores antes de actualizar el schema.

## 📋 Nuevos Roles

- `OPERADOR` (antes: `FUNCIONARIO`)
- `SUPERVISOR_DEPARTAMENTAL` (antes: `SUPERVISOR`)
- `SUPERVISOR_REGIONAL` (nuevo)
- `SUPERVISOR_GENERAL` (nuevo)
- `ADMIN` (sin cambios)

## 🚀 Pasos para Migrar

### Opción 1: Script Automático (Recomendado)

1. **Ejecutar el script de migración:**
   ```bash
   npm run db:migrate-roles
   ```

   Este script:
   - Actualiza `FUNCIONARIO` → `OPERADOR`
   - Actualiza `SUPERVISOR` → `SUPERVISOR_DEPARTAMENTAL`
   - Muestra un resumen de los cambios

2. **Actualizar el schema de la base de datos:**
   ```bash
   npm run db:push
   ```

### Opción 2: SQL Manual

Si prefieres hacerlo manualmente, puedes ejecutar este SQL directamente en PostgreSQL:

```sql
-- Actualizar FUNCIONARIO a OPERADOR
UPDATE usuarios 
SET rol = 'OPERADOR'::text 
WHERE rol::text = 'FUNCIONARIO';

-- Actualizar SUPERVISOR a SUPERVISOR_DEPARTAMENTAL
UPDATE usuarios 
SET rol = 'SUPERVISOR_DEPARTAMENTAL'::text 
WHERE rol::text = 'SUPERVISOR';

-- Verificar resultados
SELECT rol, COUNT(*) 
FROM usuarios 
GROUP BY rol;
```

Luego ejecuta:
```bash
npm run db:push
```

## ⚠️ Nota Importante

Después de la migración, los usuarios existentes deberán iniciar sesión nuevamente para que sus sesiones en `localStorage` se actualicen con los nuevos valores de rol.

