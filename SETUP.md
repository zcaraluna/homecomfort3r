# 🚀 Guía de Configuración - s1mple_sys

## Prerrequisitos

1. **Node.js 18+** instalado
2. **PostgreSQL** instalado y corriendo localmente
3. **npm** o **yarn** para gestionar paquetes

---

## 📦 Instalación

### 1. Instalar dependencias (si aún no lo has hecho)

```bash
npm install
```

### 2. Configurar Base de Datos

#### A. Crear base de datos en PostgreSQL

Conéctate a PostgreSQL y crea la base de datos:

```sql
CREATE DATABASE s1mple_sys;
```

#### B. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes copiar de `.env.example`):

```bash
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/s1mple_sys?schema=public"
```

**Reemplaza:**
- `usuario`: Tu usuario de PostgreSQL (usualmente `postgres`)
- `contraseña`: Tu contraseña de PostgreSQL
- `localhost:5432`: Host y puerto (por defecto 5432)
- `s1mple_sys`: Nombre de la base de datos

**Ejemplo:**
```env
DATABASE_URL="postgresql://postgres:mi_password@localhost:5432/s1mple_sys?schema=public"
```

### 3. Generar cliente de Prisma

```bash
npm run db:generate
```

### 4. Crear tablas en la base de datos

```bash
npm run db:push
```

Esto creará todas las tablas definidas en `prisma/schema.prisma`.

### 5. Poblar datos iniciales (Seed)

```bash
npm run db:seed
```

Esto creará:
- Oficinas/Regionales de ejemplo
- Departamentos de ejemplo
- Usuario administrador: `admin` / `admin123`
- Usuario funcionario: `funcionario1` / `func123`

---

## 🏃 Ejecutar el proyecto

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

---

## 🔑 Usuarios de Prueba

Después de ejecutar el seed, puedes usar:

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Departamento:** Balística Forense
- **Oficina:** Dirección de Criminalística

### Funcionario
- **Usuario:** `funcionario1`
- **Contraseña:** `func123`
- **Departamento:** Balística Forense
- **Oficina:** Regional Ciudad del Este

---

## 📝 Próximos Pasos

1. ✅ Base de datos configurada
2. ✅ Login funcional
3. ✅ Redirección por departamento
4. ⏳ Dashboard por departamento (próximo)
5. ⏳ Gestión de reportes (próximo)

---

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
```

---

## ❓ Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Revisa la URL en `.env`
- Verifica usuario y contraseña

### Error: "database does not exist"
- Crea la base de datos manualmente: `CREATE DATABASE s1mple_sys;`

### Error: "relation already exists"
- Usa `npm run db:push -- --force-reset` para resetear (⚠️ elimina todos los datos)

---

## 📚 Documentación

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

