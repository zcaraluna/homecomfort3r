# 🔧 Solución: Error de Ejecución de Scripts en PowerShell

## ❌ Problema

```
npm : No se puede cargar el archivo C:\Program Files\nodejs\npm.ps1 porque la 
ejecución de scripts está deshabilitada en este sistema.
```

## ✅ Soluciones

### Opción 1: Usar CMD (Más Rápido)

En lugar de PowerShell, abre **CMD** (Símbolo del sistema):

1. Presiona `Win + R`
2. Escribe `cmd` y presiona Enter
3. Navega a tu proyecto:
   ```cmd
   cd C:\Users\recal\Documents\GitHub\homecomfort3r
   ```
4. Ejecuta el comando:
   ```cmd
   npm run db:push
   ```

### Opción 2: Cambiar Política de Ejecución (Permanente)

**Atención:** Requiere ejecutar PowerShell como Administrador.

1. Abre PowerShell como Administrador:
   - Presiona `Win + X`
   - Selecciona "Windows PowerShell (Administrador)" o "Terminal (Administrador)"

2. Verifica la política actual:
   ```powershell
   Get-ExecutionPolicy
   ```

3. Cambia la política (temporal para la sesión actual):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```

4. O cambia la política permanentemente (para el usuario actual):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

5. Cierra y vuelve a abrir PowerShell en Cursor

### Opción 3: Ejecutar Comando Específico

Puedes ejecutar el comando de Prisma directamente sin npm:

```powershell
npx prisma db push
```

O usando el path completo de node:

```powershell
node node_modules/.bin/prisma db push
```

### Opción 4: Configurar Cursor para Usar CMD

Puedes configurar Cursor para usar CMD en lugar de PowerShell:

1. Abre configuración de Cursor (`Ctrl + ,`)
2. Busca `terminal.integrated.defaultProfile.windows`
3. Cambia el valor a `Command Prompt`

---

## 🎯 Recomendación

**Usa la Opción 1 (CMD)** si solo necesitas ejecutar el comando ahora.

**Usa la Opción 2** si quieres seguir usando PowerShell en el futuro.

---

## 📝 Nota

La política `RemoteSigned` permite:
- ✅ Ejecutar scripts locales (firmados o no)
- ✅ Ejecutar scripts remotos solo si están firmados
- ✅ Ejecutar npm y otros comandos normalmente

Es segura y recomendada para desarrollo.

