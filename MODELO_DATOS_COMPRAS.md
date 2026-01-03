# 📊 Modelo de Datos - Sistema de Compras y Proveedores

## 📋 Resumen

Se han agregado **7 nuevos modelos** al schema de Prisma para gestionar el sistema de compras y proveedores, basado en el análisis del archivo de migración `migracion_compras_proveed_detalles.xlsx`.

---

## 🗂️ Modelos Creados

### 1. **Proveedor** (`proveedores`)

Gestiona la información de los proveedores.

**Campos principales:**
- `codigoProveedor` (Int, único) - Código del proveedor del sistema anterior
- `idInterno` (Int, único, opcional) - ID interno del sistema anterior (para migración)
- `nombre` (String) - Nombre legal
- `nombreComercial` (String) - Nombre comercial
- `ruc` (String, único) - RUC del proveedor (formato: 80009246-5)
- `ci` (String, opcional) - Cédula de identidad
- `direccion`, `correo`, `web`, `telefono` (opcionales)

**Relaciones:**
- `compras` → Compra[] (1 proveedor tiene N compras)

---

### 2. **Moneda** (`monedas`)

Catálogo de monedas del sistema.

**Campos principales:**
- `codigo` (String, único) - Código de moneda (ej: "PYG", "USD")
- `nombre` (String, único) - Nombre de la moneda (ej: "Guaraníes")
- `simbolo` (String) - Símbolo (ej: "₲", "$")

**Relaciones:**
- `compras` → Compra[] (1 moneda tiene N compras)

---

### 3. **Deposito** (`depositos`)

Catálogo de depósitos/almacenes.

**Campos principales:**
- `nombre` (String, único) - Nombre del depósito (ej: "CASA CENTRAL")
- `descripcion` (String, opcional)

**Relaciones:**
- `compraProductos` → CompraProducto[]
- `compraGastos` → CompraGasto[]

---

### 4. **TipoGasto** (`tipos_gasto`)

Catálogo de tipos de gasto.

**Campos principales:**
- `codigo` (Int, único) - Código del tipo de gasto del sistema anterior
- `nombre` (String, único) - Nombre del tipo (ej: "Servicios Informáticos", "Combustible")

**Relaciones:**
- `compraGastos` → CompraGasto[]

---

### 5. **Compra** (`compras`)

Encabezado de las facturas/compras.

**Campos principales:**
- `idCompraCab` (Int, único, opcional) - ID del sistema anterior (para migración)
- `tipoDocumento` (String) - Tipo de documento (default: "FACTURA")
- `timbrado` (String) - Número de timbrado fiscal
- `timbradoVencimiento` (DateTime, opcional) - Fecha de vencimiento del timbrado
- `comprobanteProveedor` (String) - Número de comprobante del proveedor
- `fechaCompra` (DateTime) - Fecha de la compra
- `fechaVencimiento` (DateTime, opcional) - Fecha de vencimiento del pago

**Datos fiscales:**
- `porcentajeImpuesto` (Decimal) - Porcentaje de IVA (default: 10.00)
- `exenta` (Decimal) - Monto exento de IVA
- `gravada05` (Decimal) - Base gravada al 5%
- `gravada10` (Decimal) - Base gravada al 10%
- `iva05` (Decimal) - IVA calculado al 5%
- `iva10` (Decimal) - IVA calculado al 10%
- `iva` (Decimal) - IVA total

**Montos:**
- `montoCompra` (Decimal) - Monto total de la compra
- `saldoCompra` (Decimal) - Saldo pendiente de pago

**Datos denormalizados (para historial):**
- `nombreProveedor` (String, opcional) - Nombre del proveedor
- `rucProveedor` (String, opcional) - RUC del proveedor

**Relaciones:**
- `proveedor` → Proveedor (N compras pertenecen a 1 proveedor)
- `moneda` → Moneda (N compras usan 1 moneda)
- `productos` → CompraProducto[] (1 compra tiene N productos)
- `gastos` → CompraGasto[] (1 compra tiene N gastos)

---

### 6. **CompraProducto** (`compra_productos`)

Detalle de productos comprados en una factura.

**Campos principales:**
- `codigoProducto` (Int, opcional) - Código del producto del sistema anterior
- `nombreProducto` (String) - Nombre del producto (denormalizado)
- `tipoDetalle` (String) - Tipo de detalle (default: "MERCADERIA")
- `iva` (Decimal) - Porcentaje de IVA (default: 10.00)
- `cantidad` (Decimal) - Cantidad comprada
- `precioUnitario` (Decimal) - Precio unitario
- `total` (Decimal) - Total (cantidad × precio unitario)

**Relaciones:**
- `compra` → Compra (N productos pertenecen a 1 compra)
- `producto` → Producto? (opcional, si existe en el catálogo)
- `deposito` → Deposito (N productos van a 1 depósito)

---

### 7. **CompraGasto** (`compra_gastos`)

Detalle de gastos asociados a una compra.

**Campos principales:**
- `codigoGasto` (Int, opcional) - Código del gasto del sistema anterior
- `nombreGasto` (String, opcional) - Nombre del gasto (denormalizado)
- `tipoDetalle` (String) - Tipo de detalle (default: "GASTO")
- `iva` (Decimal) - Porcentaje de IVA (default: 0.00)
- `cantidad` (Decimal) - Cantidad (default: 1.000)
- `precioUnitario` (Decimal) - Precio unitario
- `total` (Decimal) - Total del gasto

**Relaciones:**
- `compra` → Compra (N gastos pertenecen a 1 compra)
- `tipoGasto` → TipoGasto (N gastos son de 1 tipo)
- `deposito` → Deposito (N gastos van a 1 depósito)

---

## 🔗 Diagrama de Relaciones

```
┌─────────────┐
│  Proveedor  │
│             │
│ codigo (PK) │
│ ruc (UK)    │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│      Compra         │
│                     │
│ id (PK)             │
│ proveedorId (FK)    │
│ monedaId (FK)       │
│ idCompraCab (UK)    │
└──┬──────────────┬───┘
   │ 1            │ 1
   │              │
   │ N            │ N
┌──▼──────────┐ ┌─▼────────────┐
│CompraProducto│ │ CompraGasto  │
│              │ │              │
│ compraId (FK)│ │ compraId (FK)│
│ productoId   │ │ tipoGastoId  │
│ depositoId   │ │ depositoId   │
└──────────────┘ └──────────────┘
       │                  │
       │                  │
       │ N                │ N
┌──────▼──────┐    ┌──────▼──────┐
│  Producto  │    │  TipoGasto   │
│            │    │              │
│ id (PK)    │    │ codigo (UK)  │
└────────────┘    └──────────────┘
```

---

## 📊 Estadísticas del Sistema Anterior

Basado en el archivo de migración:

- **115 proveedores** registrados
- **1,019 facturas de compra**
- **1,111 detalles de productos** comprados
- **300 detalles de gastos** asociados a compras

---

## 🔄 Campos de Migración

Para facilitar la migración y mantener referencias al sistema anterior, se incluyen:

- `idInterno` en Proveedor (ID_INTERNO)
- `idCompraCab` en Compra (ID_COMPRACAB)
- `codigoProducto` en CompraProducto (COD_PRODUCTO)
- `codigoGasto` en CompraGasto (COD_GASTO)
- `codigo` en TipoGasto (COD_GASTO)

Estos campos permiten:
- ✅ Verificar integridad durante la migración
- ✅ Mantener referencias históricas
- ✅ Facilitar la reconciliación de datos

---

## 📝 Notas de Implementación

### 1. **Datos Denormalizados**
Se mantienen campos denormalizados (`nombreProveedor`, `rucProveedor`, `nombreProducto`, `nombreGasto`) para:
- Historial inmutable
- Consultas rápidas sin joins
- Auditoría de cambios

### 2. **Relación con Producto**
La relación `CompraProducto.producto` es **opcional** porque:
- Los productos del sistema anterior pueden no existir en el nuevo catálogo
- Se mantiene `codigoProducto` y `nombreProducto` para referencia

### 3. **Decimales**
Todos los campos monetarios usan `Decimal` con precisión:
- Montos: `Decimal(12, 2)` - Hasta 999,999,999,999.99
- Porcentajes: `Decimal(5, 2)` - Hasta 999.99%
- Cantidades: `Decimal(10, 3)` - Hasta 9,999,999.999

### 4. **Timestamps**
Todos los modelos incluyen `createdAt` y `updatedAt` para auditoría.

---

## 🚀 Próximos Pasos

1. ✅ **Modelos creados** - Este documento
2. ⏳ **Generar Prisma Client** - `npm run db:generate`
3. ⏳ **Aplicar migración** - `npm run db:push` o `npm run db:migrate`
4. ⏳ **Crear script de migración** - Importar datos del Excel
5. ⏳ **Validar datos** - Verificar integridad referencial
6. ⏳ **Crear API endpoints** - CRUD para compras y proveedores

---

**Creado:** 2026-01-02  
**Basado en:** migracion_compras_proveed_detalles.xlsx

