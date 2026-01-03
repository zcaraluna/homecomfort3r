# 📦 Instrucciones para Migración de Datos

## 🚀 Ejecutar Migración

Una vez que tengas la base de datos configurada y las tablas creadas, ejecuta:

```bash
npm run db:migrate-data
```

## ⚠️ Requisitos Previos

1. ✅ Base de datos configurada en `.env.local`
2. ✅ Tablas creadas (`npm run db:push` ya ejecutado)
3. ✅ Archivos Excel en la raíz del proyecto:
   - `migracion_compras_proveed_detalles.xlsx`
   - `migracion_ventas_productos_saldos.xlsx`

## 📋 Orden de Migración

El script migra los datos en este orden para mantener integridad referencial:

1. **Catálogos:**
   - Monedas (Guaraníes)
   - Depósitos (CASA CENTRAL, SUCURSAL CAPIATA)
   - Listas de Precio (desde datos de clientes)

2. **Entidades Principales:**
   - Proveedores (115 registros)
   - Clientes (313 registros)
   - Productos (663 registros)
   - Tipos de Gasto (desde datos de compras)

3. **Transacciones:**
   - Compras (1,019 facturas)
   - Detalles de Productos Comprados (1,111 registros)
   - Detalles de Gastos Comprados (300 registros)
   - Ventas (1,009 facturas)
   - Detalles de Ventas (933 registros)
   - Existencias (851 registros)

## 🔄 Comportamiento del Script

### Upsert (Actualizar o Crear)
- **Proveedores:** Se actualizan si ya existen por `codigoProveedor`
- **Clientes:** Se actualizan si ya existen por `codigoCliente`, o se crean nuevos
- **Productos:** Se actualizan si ya existen por `codigoProducto` o `codigoBarras`, o se crean nuevos
- **Existencias:** Se actualizan si ya existen por combinación producto/sucursal/depósito

### Creación
- **Compras, Ventas, Detalles:** Siempre se crean nuevos (son transacciones históricas)

## ⚠️ Consideraciones Importantes

### 1. Productos Necesitan Categoría y Marca
El script asigna la primera categoría y marca disponibles. Si no hay categorías o marcas en la base de datos, los productos no se podrán crear.

**Solución:** Asegúrate de tener al menos una categoría y una marca creadas antes de ejecutar la migración.

### 2. Clientes y Email
Los clientes del sistema anterior no tienen email. El script genera emails temporales:
- Formato: `cliente_{codigoCliente}@migrado.local`
- Si el cliente ya existe, se actualiza pero no se cambia el email

### 3. Cédula de Clientes
Si un cliente no tiene cédula, se genera una temporal: `MIGRADO_{codigoCliente}`

### 4. Sucursales
El script busca sucursales por nombre. Asegúrate de que existan:
- "CASA CENTRAL" (o el nombre exacto que uses)
- "SUCURSAL CAPIATA" (o el nombre exacto que uses)

### 5. Errores y Advertencias
El script mostrará advertencias si:
- Un proveedor no se encuentra para una compra
- Un cliente no se encuentra para una venta
- Un producto no se encuentra para un detalle
- Una sucursal no se encuentra para una existencia

Estos casos se saltan y el script continúa.

## 📊 Validación Post-Migración

Después de ejecutar la migración, verifica:

1. **Conteo de registros:**
   ```sql
   SELECT 
     (SELECT COUNT(*) FROM proveedores) as proveedores,
     (SELECT COUNT(*) FROM clientes) as clientes,
     (SELECT COUNT(*) FROM productos) as productos,
     (SELECT COUNT(*) FROM compras) as compras,
     (SELECT COUNT(*) FROM ventas) as ventas;
   ```

2. **Integridad referencial:**
   - Verifica que no haya registros huérfanos
   - Verifica que los totales coincidan con el sistema anterior

3. **Usar Prisma Studio:**
   ```bash
   npm run db:studio
   ```

## 🔄 Re-ejecutar Migración

Si necesitas re-ejecutar la migración:

- **Compras y Ventas:** Se crearán duplicados (son transacciones históricas)
- **Proveedores, Clientes, Productos:** Se actualizarán si ya existen

**Recomendación:** Si necesitas re-ejecutar, primero limpia las tablas de transacciones:
```sql
TRUNCATE TABLE compras CASCADE;
TRUNCATE TABLE ventas CASCADE;
TRUNCATE TABLE compra_productos CASCADE;
TRUNCATE TABLE compra_gastos CASCADE;
TRUNCATE TABLE venta_items CASCADE;
```

## 📝 Logs

El script mostrará progreso en tiempo real:
- ✅ Confirmaciones de cada fase
- ⚠️ Advertencias de registros no encontrados
- 📊 Resumen final con conteos

---

**Creado:** 2026-01-02  
**Script:** `prisma/migrate-data.ts`

