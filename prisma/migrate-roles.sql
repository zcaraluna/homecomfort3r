-- Script SQL para migrar los roles antiguos a los nuevos
-- Ejecutar este script en PostgreSQL antes de ejecutar npm run db:push

-- Paso 1: Actualizar usuarios con rol FUNCIONARIO a OPERADOR
UPDATE usuarios 
SET rol = 'OPERADOR'::text 
WHERE rol::text = 'FUNCIONARIO';

-- Paso 2: Actualizar usuarios con rol SUPERVISOR a SUPERVISOR_DEPARTAMENTAL
UPDATE usuarios 
SET rol = 'SUPERVISOR_DEPARTAMENTAL'::text 
WHERE rol::text = 'SUPERVISOR';

-- Paso 3: Verificar que todos los usuarios tienen valores válidos
SELECT rol, COUNT(*) 
FROM usuarios 
GROUP BY rol;

