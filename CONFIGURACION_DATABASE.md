# 🗄️ Configuración de Base de Datos

## ❌ Error Actual

```
Error: The datasource.url property is required in your Prisma config file when using prisma db push.
```

## ✅ Solución

Necesitas crear o actualizar el archivo `.env.local` con la variable `DATABASE_URL`.

### Formato de la URL de PostgreSQL

```env
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/nombre_base_datos?schema=public"
```

### Ejemplo para PostgreSQL Local

```env
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/homecomfort3r?schema=public"
```

### Ejemplo para PostgreSQL Remoto

```env
DATABASE_URL="postgresql://usuario:contraseña@tu-servidor.com:5432/nombre_db?schema=public"
```

### Ejemplo con SSL (Producción)

```env
DATABASE_URL="postgresql://usuario:contraseña@host:5432/db?schema=public&sslmode=require"
```

---

## 📝 Pasos para Configurar

### 1. Crear/Actualizar `.env.local`

Crea el archivo `.env.local` en la raíz del proyecto con:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/homecomfort3r?schema=public"
```

**Reemplaza:**
- `TU_CONTRASEÑA` → Tu contraseña de PostgreSQL
- `homecomfort3r` → El nombre de tu base de datos
- `localhost:5432` → Tu host y puerto (si es diferente)

### 2. Verificar que el archivo existe

El archivo debe estar en:
```
C:\Users\recal\Documents\GitHub\homecomfort3r\.env.local
```

### 3. Ejecutar nuevamente

```powershell
npm run db:push
```

---

## 🔍 Verificar Configuración

### Verificar que Prisma lee el .env.local

Puedes verificar que Prisma está leyendo correctamente el archivo ejecutando:

```powershell
npx prisma db push --schema=prisma/schema.prisma
```

Si sigue sin funcionar, verifica que:
1. ✅ El archivo `.env.local` existe en la raíz del proyecto
2. ✅ Tiene la variable `DATABASE_URL` definida
3. ✅ La URL tiene el formato correcto
4. ✅ No hay espacios extra alrededor del `=`
5. ✅ La contraseña no tiene caracteres especiales que necesiten escape

---

## 🛠️ Solución Alternativa: Usar .env

Si prefieres usar `.env` en lugar de `.env.local`, actualiza `prisma.config.ts`:

```typescript
// Cambiar esta línea:
config({ path: resolve(process.cwd(), ".env.local") });

// Por esta:
config({ path: resolve(process.cwd(), ".env") });
```

---

## 📋 Checklist

- [ ] Archivo `.env.local` existe en la raíz del proyecto
- [ ] Variable `DATABASE_URL` está definida
- [ ] Formato de URL es correcto
- [ ] Credenciales de PostgreSQL son correctas
- [ ] Base de datos existe (o se creará automáticamente)
- [ ] PostgreSQL está corriendo

---

## ⚠️ Nota de Seguridad

**NUNCA** subas el archivo `.env.local` al repositorio. Debe estar en `.gitignore`.

Verifica que `.gitignore` incluya:
```
.env.local
.env
*.env
```

