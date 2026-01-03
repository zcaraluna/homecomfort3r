# 📊 Modelo de Datos - Sistema de Ventas

## 📋 Resumen

Se han agregado **4 nuevos modelos** y actualizado **2 modelos existentes** en el schema de Prisma para gestionar el sistema de ventas, basado en el análisis del archivo de migración `migracion_ventas_productos_saldos.xlsx`.

---

## 🗂️ Modelos Creados/Actualizados

### 1. **Producto** (Actualizado)

Se agregaron campos del sistema anterior para migración:

**Nuevos campos:**
- `codigoProducto` (Int, único, opcional) - COD_PRODUCTO del sistema anterior
- `codigoBarras` (String, único, opcional) - CODIGO_PRODUCTO (código de barras/SKU)
- `rubro` (String, opcional) - RUBRO (categoría principal)
- `familia` (String, opcional) - FAMILIA (subcategoría)
- `proveedorDfl` (String, opcional) - PROVEEDOR_DFL (proveedor por defecto, denormalizado)
- `stockNegativo` (Boolean) - STOCK_NEGATIVO (permite stock negativo)

**Nuevas relaciones:**
- `existencias` → Existencia[]
- `ventaItems` → VentaItem[]

---

### 2. **Cliente** (Actualizado)

Se agregaron campos del sistema anterior para migración:

**Nuevos campos:**
- `codigoCliente` (Int, único, opcional) - CODIGO_CLIENTE del sistema anterior
- `idInterno` (Int, único, opcional) - ID del sistema anterior
- `nombreComercial` (String, opcional) - NOMBRE_COMPERCIAL
- `ruc` (String, opcional) - RUC del cliente
- `listaPrecioId` (String, opcional) - FK a ListaPrecio
- `condicion` (String, opcional) - CONDICION (CONTADO/CREDITO)

**Nuevas relaciones:**
- `listaPrecio` → ListaPrecio? (opcional)
- `ventas` → Venta[]

---

### 3. **ListaPrecio** (`listas_precio`) - Nuevo

Catálogo de listas de precios para clientes.

**Campos principales:**
- `codigo` (Int, único) - Código de la lista de precios
- `nombre` (String, único) - Nombre de la lista
- `descripcion` (String, opcional)
- `activa` (Boolean) - Estado activo

**Relaciones:**
- `clientes` → Cliente[] (N clientes pueden tener 1 lista de precios)

---

### 4. **Existencia** (`existencias`) - Nuevo

Stock de productos por sucursal y depósito.

**Campos principales:**
- `cantidad` (Decimal) - Cantidad en existencia
- `productoId` (String, FK) - Producto
- `sucursalId` (String, FK) - Sucursal
- `depositoId` (String, FK) - Depósito

**Relaciones:**
- `producto` → Producto (N existencias pertenecen a 1 producto)
- `sucursal` → Sucursal (N existencias están en 1 sucursal)
- `deposito` → Deposito (N existencias están en 1 depósito)

**Constraint único:** `[productoId, sucursalId, depositoId]` - Un producto solo puede tener una existencia por combinación de sucursal/depósito

---

### 5. **Venta** (`ventas`) - Nuevo

Encabezado de facturas de venta.

**Campos principales:**
- `numeroFactura` (String, único) - Número de factura (formato: 002-002-0000016)
- `tipoDocumento` (String) - Tipo de documento (default: "FACTURA DE VENTA")
- `condicion` (String) - Condición de pago (default: "CREDITO")
- `fecha` (DateTime) - Fecha de la venta
- `timbrado` (String) - Número de timbrado fiscal
- `timbradoVencimiento` (DateTime, opcional) - Fecha de vencimiento del timbrado
- `fechaVencimiento` (DateTime, opcional) - Fecha de vencimiento del pago

**Datos fiscales:**
- `gravada10` (Decimal) - Base gravada al 10%
- `iva10` (Decimal) - IVA calculado al 10%
- `gravada05` (Decimal) - Base gravada al 5%
- `iva05` (Decimal) - IVA calculado al 5%
- `exenta` (Decimal) - Monto exento

**Montos:**
- `montoVenta` (Decimal) - Monto total de la venta
- `saldoVenta` (Decimal) - Saldo pendiente de pago

**Datos denormalizados:**
- `nombreCliente` (String, opcional) - Nombre del cliente (para historial)

**Relaciones:**
- `cliente` → Cliente (N ventas pertenecen a 1 cliente)
- `moneda` → Moneda (N ventas usan 1 moneda)
- `items` → VentaItem[] (1 venta tiene N items)

---

### 6. **VentaItem** (`venta_items`) - Nuevo

Detalle de productos vendidos en una factura.

**Campos principales:**
- `codigoProducto` (Int, opcional) - Código del producto del sistema anterior
- `nombreProducto` (String, opcional) - Nombre del producto (denormalizado)
- `cantidad` (Decimal) - Cantidad vendida
- `iva` (Decimal) - Porcentaje de IVA
- `precioUnitario` (Decimal) - Precio unitario
- `montoTotal` (Decimal) - Monto total (cantidad × precio unitario)

**Relaciones:**
- `venta` → Venta (N items pertenecen a 1 venta)
- `producto` → Producto (N items son de 1 producto)
- `deposito` → Deposito (N items se vendieron desde 1 depósito)

---

## 🔗 Diagrama de Relaciones

```
┌─────────────┐
│  Cliente    │
│             │
│ id (PK)     │
│ codigoCliente│
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│      Venta          │
│                     │
│ id (PK)             │
│ numeroFactura (UK)  │
│ clienteId (FK)      │
│ monedaId (FK)       │
└──┬──────────────────┘
   │ 1
   │
   │ N
┌──▼──────────┐
│ VentaItem   │
│             │
│ ventaId (FK)│
│ productoId  │
│ depositoId  │
└─────────────┘
       │
       │ N
       │
┌──────▼──────┐
│  Producto   │
│             │
│ id (PK)     │
│ codigoProducto│
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────────┐
│  Existencia     │
│                 │
│ productoId (FK) │
│ sucursalId (FK) │
│ depositoId (FK) │
└─────────────────┘
```

---

## 📊 Estadísticas del Sistema Anterior

Basado en el archivo de migración:

- **663 productos** registrados
- **313 clientes** registrados
- **1,009 facturas de venta**
- **933 detalles de productos** vendidos
- **851 registros de existencias** por sucursal/depósito
- **14 listas de precios** diferentes

---

## 🔄 Campos de Migración

Para facilitar la migración y mantener referencias al sistema anterior:

- `codigoProducto` en Producto (COD_PRODUCTO)
- `codigoCliente` en Cliente (CODIGO_CLIENTE)
- `idInterno` en Cliente (ID)
- `codigoProducto` en VentaItem (COD_PRODUCTO)
- `numeroFactura` en Venta (FACTURA)

Estos campos permiten:
- ✅ Verificar integridad durante la migración
- ✅ Mantener referencias históricas
- ✅ Facilitar la reconciliación de datos

---

## 📝 Notas de Implementación

### 1. **Datos Denormalizados**
Se mantienen campos denormalizados (`nombreCliente`, `nombreProducto`, `proveedorDfl`) para:
- Historial inmutable
- Consultas rápidas sin joins
- Auditoría de cambios

### 2. **Relación con Producto**
La relación `VentaItem.producto` es **obligatoria** porque:
- Los productos deben existir en el catálogo
- Se mantiene `codigoProducto` y `nombreProducto` para referencia histórica

### 3. **Existencia**
El modelo `Existencia` permite:
- Stock por producto, sucursal y depósito
- Control granular de inventario
- Constraint único para evitar duplicados

### 4. **Lista de Precios**
El modelo `ListaPrecio` permite:
- Asignar diferentes listas de precios a clientes
- Gestión de precios por segmento
- Relación opcional con Cliente

### 5. **Diferencias entre Venta y Pedido**
- **Pedido:** Sistema nuevo, para e-commerce, estado de entrega
- **Venta:** Sistema anterior, facturación tradicional, saldo pendiente
- Pueden coexistir según requerimientos del negocio

---

## 🚀 Próximos Pasos

1. ✅ **Modelos creados** - Este documento
2. ⏳ **Generar Prisma Client** - `npm run db:generate`
3. ⏳ **Aplicar migración** - `npm run db:push` o `npm run db:migrate`
4. ⏳ **Crear script de migración** - Importar datos del Excel
5. ⏳ **Validar datos** - Verificar integridad referencial
6. ⏳ **Crear API endpoints** - CRUD para ventas y existencias

---

**Creado:** 2026-01-02  
**Basado en:** migracion_ventas_productos_saldos.xlsx

