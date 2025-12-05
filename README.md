# s1mple_sys - Sistema de Usuarios y Autenticación

Plantilla base para proyectos Next.js con sistema completo de autenticación, gestión de usuarios, roles y permisos. Ideal para iniciar proyectos que requieren control de acceso y gestión de usuarios.

![Next.js Dashboard Preview](./banner.png)

## 🎯 Características

Esta plantilla incluye:

* ✅ **Sistema de Autenticación Completo**
  - Login/Logout funcional
  - Gestión de sesiones
  - Protección de rutas

* ✅ **Sistema de Roles y Permisos**
  - OPERADOR
  - SUPERVISOR_DEPARTAMENTAL
  - SUPERVISOR_REGIONAL
  - SUPERVISOR_GENERAL
  - ADMIN

* ✅ **Gestión de Usuarios**
  - CRUD de usuarios
  - Perfiles de usuario

* ✅ **Base de Datos con Prisma**
  - PostgreSQL
  - Migraciones
  - Seed de datos iniciales

* ✅ **UI Moderna**
  - Tailwind CSS V4
  - Dark Mode
  - Diseño responsive
  - Componentes reutilizables

## 🚀 Stack Tecnológico

* **Next.js 16.x** (App Router)
* **React 19**
* **TypeScript**
* **Tailwind CSS V4**
* **Prisma ORM**
* **PostgreSQL**
* **bcryptjs** (hashing de contraseñas)
* **Zod** (validación de esquemas)

## 📋 Prerrequisitos

* Node.js 18.x o superior (recomendado 20.x+)
* PostgreSQL instalado y corriendo
* npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd <nombre-del-proyecto>
```

### 2. Instalar dependencias

```bash
npm install
```

> 💡 Si encuentras errores de peer dependencies, usa: `npm install --legacy-peer-deps`

### 3. Configurar Base de Datos

#### A. Crear base de datos en PostgreSQL

```sql
CREATE DATABASE nombre_base_datos;
```

#### B. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos?schema=public"
```

**Reemplaza:**
- `usuario`: Tu usuario de PostgreSQL (usualmente `postgres`)
- `contraseña`: Tu contraseña de PostgreSQL
- `localhost:5432`: Host y puerto (por defecto 5432)
- `nombre_base_datos`: Nombre de tu base de datos

**Ejemplo:**
```env
DATABASE_URL="postgresql://postgres:mi_password@localhost:5432/mi_proyecto?schema=public"
```

### 4. Generar cliente de Prisma

```bash
npm run db:generate
```

### 5. Crear tablas en la base de datos

```bash
npm run db:push
```

Esto creará todas las tablas definidas en `prisma/schema.prisma`.

### 6. Poblar datos iniciales (Seed)

```bash
npm run db:seed
```

Esto creará:
- Oficinas/Regionales de ejemplo
- Departamentos de ejemplo
- Usuarios de prueba con diferentes roles

## 🏃 Ejecutar el Proyecto

### Modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Ver base de datos (Opcional)

```bash
npm run db:studio
```

Abre Prisma Studio en tu navegador para ver y editar datos directamente.

## 🔑 Usuarios de Prueba

Después de ejecutar el seed, puedes usar:

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Rol:** ADMIN

### Operador
- **Usuario:** `user1`
- **Contraseña:** `user123`
- **Rol:** OPERADOR

### Supervisor Departamental
- **Usuario:** `user2`
- **Contraseña:** `user123`
- **Rol:** SUPERVISOR_DEPARTAMENTAL

### Supervisor Regional
- **Usuario:** `user3`
- **Contraseña:** `user123`
- **Rol:** SUPERVISOR_REGIONAL

### Supervisor General
- **Usuario:** `user4`
- **Contraseña:** `user123`
- **Rol:** SUPERVISOR_GENERAL

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas de Next.js (App Router)
│   ├── (admin)/           # Rutas protegidas
│   │   ├── layout.tsx     # Layout con sidebar y header
│   │   ├── page.tsx       # Dashboard principal
│   │   └── profile/       # Página de perfil
│   ├── (full-width-pages)/ # Rutas sin sidebar
│   │   ├── (auth)/        # Páginas de autenticación
│   │   ├── select-office/ # Selección de oficina
│   │   └── select-department/ # Selección de departamento
│   └── api/               # API Routes
│       ├── auth/          # Endpoints de autenticación
│       └── oficinas/      # Endpoints de oficinas
├── components/            # Componentes React
│   ├── auth/              # Componentes de autenticación
│   ├── form/              # Componentes de formularios
│   ├── header/            # Componentes del header
│   ├── ui/                # Componentes UI básicos
│   └── user-profile/      # Componentes de perfil
├── context/               # Context API
│   ├── AuthContext.tsx    # Contexto de autenticación
│   ├── SidebarContext.tsx # Contexto del sidebar
│   └── ThemeContext.tsx   # Contexto del tema
├── lib/                   # Utilidades y helpers
│   ├── auth.ts            # Funciones de autenticación
│   ├── prisma.ts          # Cliente de Prisma
│   └── roles.ts           # Utilidades de roles
├── layout/                # Componentes de layout
│   ├── AppHeader.tsx      # Header de la aplicación
│   └── AppSidebar.tsx     # Sidebar de navegación
└── types/                 # Tipos TypeScript
    └── auth.ts            # Tipos de autenticación
```

## 🛠️ Comandos Útiles

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar cambios al esquema
npm run db:push

# Crear migración (para producción)
npm run db:migrate

# Poblar datos iniciales
npm run db:seed

# Abrir Prisma Studio
npm run db:studio

# Desarrollo
npm run dev

# Build producción
npm run build

# Iniciar producción
npm run start

# Linter
npm run lint
```

## 🔒 Seguridad

### ⚠️ Notas Importantes

Esta plantilla usa **localStorage** para las sesiones, lo cual es adecuado para desarrollo pero **NO es recomendado para producción**.

### Recomendaciones para Producción

1. **Migrar a JWT + Cookies httpOnly**
   - Implementar tokens JWT
   - Almacenar en cookies httpOnly
   - Validar en middleware del servidor

2. **Implementar Rate Limiting**
   - Limitar intentos de login
   - Proteger endpoints sensibles

3. **Validar Permisos en API**
   - Middleware de autenticación
   - Validación de roles y permisos

4. **HTTPS Obligatorio**
   - Usar HTTPS en producción
   - Configurar CORS correctamente

## 📝 Personalización

### Cambiar el nombre de la aplicación

1. Actualiza el nombre en `src/layout/AppSidebar.tsx` (línea 276)
2. Actualiza el título en `src/app/layout.tsx`

### Agregar nuevos roles

1. Edita `prisma/schema.prisma` (enum Rol)
2. Ejecuta `npm run db:push`
3. Actualiza `src/lib/roles.ts`

### Modificar el esquema de base de datos

1. Edita `prisma/schema.prisma`
2. Ejecuta `npm run db:push` (desarrollo) o `npm run db:migrate` (producción)

## ❓ Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Revisa la URL en `.env`
- Verifica usuario y contraseña

### Error: "database does not exist"
- Crea la base de datos manualmente: `CREATE DATABASE nombre_db;`

### Error: "relation already exists"
- Usa `npm run db:push -- --force-reset` para resetear (⚠️ elimina todos los datos)

### Error de build: "Module not found: Can't resolve '.prisma/client'"
- Ejecuta `npm run db:generate`

## 📚 Documentación Adicional

- [ARQUITECTURA.md](./ARQUITECTURA.md) - Arquitectura del sistema
- [SETUP.md](./SETUP.md) - Guía de configuración detallada
- [MIGRACION_ROLES.md](./MIGRACION_ROLES.md) - Guía de migración de roles

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 📄 Licencia

Este proyecto está basado en TailAdmin Next.js y está bajo la licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Soporte

Si encuentras algún problema o tienes preguntas, por favor abre un issue en el repositorio.

---

**¡Feliz desarrollo! 🚀**
