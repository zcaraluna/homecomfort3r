# 👥 Usuarios de Ejemplo - s1mple_sys

Lista de usuarios creados para probar cada rol del sistema.

---

## 🔐 Credenciales de Acceso

### 1. **OPERADOR**
- **Usuario:** `operador1`
- **Contraseña:** `operador123`
- **Nombre:** Carlos González
- **Departamento:** Criminalística de Campo
- **Oficina:** Regional Central
- **Grado:** Oficial
- **Comportamiento:** Redirigido directamente a `/dashboard` (panel de su departamento/oficina)

---

### 2. **SUPERVISOR_DEPARTAMENTAL**
- **Usuario:** `supdept1`
- **Contraseña:** `supdept123`
- **Nombre:** María Rodríguez
- **Departamento:** Identidad Humana
- **Oficina:** Regional Ciudad del Este
- **Grado:** Subcomisario
- **Comportamiento:** Redirigido directamente a `/dashboard` (puede ver acciones de operadores de su departamento)

---

### 3. **SUPERVISOR_REGIONAL**
- **Usuario:** `supreg1`
- **Contraseña:** `supreg123`
- **Nombre:** Roberto Martínez
- **Departamento:** Laboratorio Forense (asignado por defecto)
- **Oficina:** Regional Itapúa
- **Grado:** Comisario
- **Comportamiento:** Redirigido a `/select-department` (puede acceder a cualquier departamento de su oficina)

---

### 4. **SUPERVISOR_GENERAL**
- **Usuario:** `supgen1`
- **Contraseña:** `supgen123`
- **Nombre:** Ana Fernández
- **Departamento:** Siniestros e Incendios (asignado por defecto)
- **Oficina:** Regional Caaguazú (asignada por defecto)
- **Grado:** Comisario Principal
- **Comportamiento:** Redirigido a `/select-office` → luego `/select-department` (puede acceder a cualquier departamento de cualquier oficina)

---

### 5. **ADMIN**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Nombre:** Administrador Sistema
- **Departamento:** Balística Forense
- **Oficina:** Dirección de Criminalística
- **Grado:** Administrador
- **Comportamiento:** Redirigido a `/select-office` → luego `/select-department` (puede crear, editar y eliminar usuarios, oficinas y departamentos)

---

### 6. **ADMIN (GUILLERMO RECALDE)**
- **Usuario:** `grecalde`
- **Contraseña:** `guillermo123`
- **Nombre:** GUILLERMO RECALDE
- **Departamento:** Informática Forense
- **Oficina:** Regional Asunción
- **Grado:** (sin grado)
- **CI:** 5995260
- **Credencial:** 60149
- **Comportamiento:** Redirigido a `/select-office` → luego `/select-department`

---

### Usuario Legacy (OPERADOR)
- **Usuario:** `funcionario1`
- **Contraseña:** `func123`
- **Nombre:** Juan Pérez
- **Departamento:** Balística Forense
- **Oficina:** Regional Ciudad del Este
- **Grado:** Suboficial

---

## 📋 Resumen de Roles y Redirecciones

| Rol | Usuario de Ejemplo | Redirección Después del Login |
|-----|-------------------|-------------------------------|
| OPERADOR | `operador1` | `/dashboard` (directo) |
| SUPERVISOR_DEPARTAMENTAL | `supdept1` | `/dashboard` (directo) |
| SUPERVISOR_REGIONAL | `supreg1` | `/select-department` |
| SUPERVISOR_GENERAL | `supgen1` | `/select-office` → `/select-department` |
| ADMIN | `admin`, `grecalde` | `/select-office` → `/select-department` |

---

## 💡 Notas

- Todos los usuarios tienen contraseñas simples para facilitar las pruebas
- Las contraseñas siguen el patrón: `{rol}123` o `{username}123`
- Los usuarios pueden iniciar sesión y probar las diferentes funcionalidades según su rol
- Después del login, cada usuario será redirigido según su nivel de acceso

