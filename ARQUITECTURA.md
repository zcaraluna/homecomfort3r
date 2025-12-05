# Arquitectura del Sistema s1mple_sys

## 📋 Resumen del Sistema

Sistema de gestión simple con autenticación y control de usuarios. Permite gestionar usuarios con diferentes roles y permisos.

---

## 🏗️ Arquitectura Tecnológica

### Stack Propuesto

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Next.js API Routes (backend integrado)
- Prisma ORM (gestión de base de datos)
- NextAuth.js (autenticación)

**Base de Datos:**
- PostgreSQL (recomendado para producción) o
- MySQL (alternativa)
- SQLite (para desarrollo local)

**Otras Herramientas:**
- bcryptjs (hashing de contraseñas)
- Zod (validación de esquemas)
- jsonwebtoken (tokens JWT opcional)

---

## 📊 Modelo de Base de Datos

### 1. Tabla: `users` (Usuarios)
```sql
- id: UUID (PK)
- username: VARCHAR(50) UNIQUE (login)
- password: VARCHAR(255) (hash bcrypt)
- nombre: VARCHAR(100)
- apellido: VARCHAR(100)
- email: VARCHAR(255) NULL
- telefono: VARCHAR(20) NULL
- departamento_id: UUID (FK -> departments)
- rol: ENUM('supervisor', 'funcionario', 'admin')
- activo: BOOLEAN (default: true)
- ultimo_acceso: TIMESTAMP NULL
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 2. Tabla: `departments` (Departamentos)
```sql
- id: UUID (PK)
- nombre: VARCHAR(100) UNIQUE
  - 'Balística Forense'
  - 'Criminalística de Campo'
  - 'Identidad Humana'
  - 'Siniestros e Incendios'
  - 'Laboratorio Forense'
- descripcion: TEXT NULL
- activo: BOOLEAN (default: true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 3. Tabla: `reportes` (Informes)
```sql
- id: UUID (PK)
- numero_reporte: VARCHAR(50) UNIQUE (formato: DEP-YYYY-####)
- titulo: VARCHAR(255)
- departamento_id: UUID (FK -> departments)
- usuario_creador_id: UUID (FK -> users)
- usuario_asignado_id: UUID (FK -> users) NULL
- estado: ENUM('borrador', 'en_revision', 'aprobado', 'rechazado')
- contenido: JSONB (estructura flexible del informe)
- version: INTEGER (default: 1)
- reporte_padre_id: UUID (FK -> reportes) NULL (para versiones)
- fecha_creacion: TIMESTAMP
- fecha_modificacion: TIMESTAMP
- fecha_aprobacion: TIMESTAMP NULL
- aprobado_por_id: UUID (FK -> users) NULL
- observaciones: TEXT NULL
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 4. Tabla: `reporte_versiones` (Historial de Versiones)
```sql
- id: UUID (PK)
- reporte_id: UUID (FK -> reportes)
- version: INTEGER
- contenido: JSONB
- usuario_modificador_id: UUID (FK -> users)
- cambio_descripcion: TEXT NULL
- created_at: TIMESTAMP
```

### 5. Tabla: `notas` (Notas de Seguimiento)
```sql
- id: UUID (PK)
- reporte_id: UUID (FK -> reportes)
- usuario_id: UUID (FK -> users)
- contenido: TEXT
- privada: BOOLEAN (default: false)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 6. Tabla: `archivos_adjuntos` (Archivos Adjuntos)
```sql
- id: UUID (PK)
- reporte_id: UUID (FK -> reportes)
- nombre_archivo: VARCHAR(255)
- tipo_archivo: VARCHAR(50)
- tamaño: BIGINT (bytes)
- ruta: VARCHAR(500)
- usuario_subio_id: UUID (FK -> users)
- created_at: TIMESTAMP
```

### 7. Tabla: `auditoria` (Log de Auditoría)
```sql
- id: UUID (PK)
- tabla_afectada: VARCHAR(50)
- registro_id: UUID
- accion: ENUM('CREATE', 'UPDATE', 'DELETE', 'VIEW')
- usuario_id: UUID (FK -> users)
- cambios: JSONB NULL
- ip_address: VARCHAR(45) NULL
- created_at: TIMESTAMP
```

### 8. Tabla: `sesiones` (Sesiones de Usuario)
```sql
- id: UUID (PK)
- usuario_id: UUID (FK -> users)
- token: VARCHAR(255) UNIQUE
- expira_en: TIMESTAMP
- ip_address: VARCHAR(45) NULL
- user_agent: TEXT NULL
- activa: BOOLEAN (default: true)
- created_at: TIMESTAMP
```

---

## 🔐 Sistema de Autenticación

### Flujo de Login:
1. Usuario ingresa `username` y `password`
2. Backend verifica credenciales contra BD
3. Genera token JWT o sesión
4. Almacena sesión en cookies/httpOnly
5. Redirige al dashboard del departamento correspondiente

### Control de Acceso:
- Cada usuario solo accede a su departamento asignado
- Supervisores pueden ver todos los reportes de su departamento
- Funcionarios solo ven reportes asignados a ellos o que ellos crearon
- Admin tiene acceso total

---

## 📁 Estructura de API Routes

```
src/app/api/
├── auth/
│   ├── login/
│   │   └── route.ts
│   ├── logout/
│   │   └── route.ts
│   └── session/
│       └── route.ts
├── reportes/
│   ├── route.ts (GET, POST)
│   ├── [id]/
│   │   ├── route.ts (GET, PUT, DELETE)
│   │   ├── aprobar/
│   │   │   └── route.ts
│   │   ├── versiones/
│   │   │   └── route.ts
│   │   └── notas/
│   │       └── route.ts
│   └── departamento/
│       └── [departamentoId]/
│           └── route.ts
├── departamentos/
│   ├── route.ts (GET)
│   └── [id]/
│       └── route.ts
└── usuarios/
    ├── route.ts (GET - solo admin)
    └── [id]/
        └── route.ts
```

---

## 🎯 Funcionalidades Principales

### 1. Autenticación
- ✅ Login por username/password
- ✅ Logout
- ✅ Verificación de sesión
- ✅ Middleware de autenticación

### 2. Dashboard por Departamento
- Vista general de reportes del departamento
- Estadísticas (total, en revisión, aprobados, etc.)
- Reportes recientes
- Alertas y notificaciones

### 3. Gestión de Reportes
- Crear nuevo reporte (borrador)
- Editar reporte (genera nueva versión)
- Ver historial de versiones
- Aprobar/Rechazar reportes (supervisores)
- Buscar y filtrar reportes
- Exportar a PDF

### 4. Notas y Seguimiento
- Agregar notas a reportes
- Notas públicas o privadas
- Timeline de actividades

### 5. Archivos Adjuntos
- Subir archivos (imágenes, documentos)
- Ver y descargar archivos
- Validación de tipos y tamaños

### 6. Auditoría
- Log de todas las acciones
- Trazabilidad completa
- Reportes de actividad

---

## 📦 Dependencias Necesarias

```json
{
  "@prisma/client": "^5.0.0",
  "prisma": "^5.0.0",
  "bcryptjs": "^2.4.3",
  "@types/bcryptjs": "^2.4.6",
  "zod": "^3.22.0",
  "jsonwebtoken": "^9.0.0",
  "@types/jsonwebtoken": "^9.0.0",
  "next-auth": "^4.24.0",
  "date-fns": "^2.30.0"
}
```

---

## 🚀 Plan de Implementación

### Fase 1: Base y Autenticación
1. Configurar Prisma y base de datos
2. Crear modelos de datos
3. Implementar login funcional
4. Middleware de autenticación
5. Contexto de usuario autenticado

### Fase 2: Dashboard y Navegación
1. Dashboard por departamento
2. Sidebar dinámico según departamento
3. Navegación protegida
4. Redirección según rol

### Fase 3: Gestión de Reportes
1. CRUD de reportes
2. Sistema de versionado
3. Aprobación/Rechazo
4. Búsqueda y filtros

### Fase 4: Funcionalidades Avanzadas
1. Notas y comentarios
2. Archivos adjuntos
3. Exportación a PDF
4. Notificaciones en tiempo real

### Fase 5: Auditoría y Seguridad
1. Log de auditoría
2. Reportes de actividad
3. Mejoras de seguridad
4. Optimización

---

## 🔒 Consideraciones de Seguridad

1. **Contraseñas**: Hash con bcrypt (salt rounds: 10+)
2. **Sesiones**: Tokens JWT con expiración
3. **Validación**: Validar todos los inputs (Zod)
4. **SQL Injection**: Prisma ORM previene esto
5. **XSS**: Sanitizar inputs
6. **CSRF**: Usar tokens CSRF
7. **Rate Limiting**: Limitar intentos de login
8. **HTTPS**: Obligatorio en producción

---

## 📝 Próximos Pasos

1. **Elegir Base de Datos**: PostgreSQL (recomendado) o MySQL
2. **Configurar Prisma**: Instalar y configurar
3. **Crear Esquema**: Definir todos los modelos
4. **Implementar Auth**: Sistema de login básico
5. **Probar Flujo**: Verificar que todo funcione

¿Quieres que empecemos a implementar? Podemos comenzar con la configuración de Prisma y el esquema de base de datos.

