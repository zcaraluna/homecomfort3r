# 📊 Análisis Exhaustivo del Archivo de Migración - Ventas
## migracion_ventas_productos_saldos.xlsx

**Fecha de análisis:** 2026-01-02  
**Archivo:** migracion_ventas_productos_saldos.xlsx

---

## 📋 RESUMEN EJECUTIVO

El archivo contiene **5 hojas** con datos del sistema anterior de ventas, productos y clientes:

1. **Productos** - 663 productos registrados
2. **Existencias** - 851 registros de existencias por sucursal/depósito
3. **Ventas y Saldos** - 1,009 facturas de venta
4. **Detalle Ventas** - 933 detalles de productos vendidos
5. **Clietnes** - 313 clientes registrados (nota: hay un typo en el nombre de la hoja)

**Total de registros:** 3,769 registros

---

## 📊 ANÁLISIS DETALLADO POR HOJA

### 1️⃣ HOJA: "Productos" (663 registros)

#### Estructura de Datos:
| Columna | Tipo | Completitud | Valores Únicos | Descripción |
|---------|------|-------------|----------------|-------------|
| (índice) | Number | 100% | 663 | Índice secuencial |
| COD_PRODUCTO | Number | 100% | 663 | Código interno del producto (PK) |
| CODIGO_PRODUCTO | String/Number | 99.8% | 662 | Código de barras/SKU del producto |
| DESCRIPCION | String | 100% | 658 | Descripción completa del producto |
| RUBRO | String | 100% | 13 | Categoría principal (ej: ELECTRODOMESTICOS) |
| FAMILIA | String | 100% | 69 | Subcategoría (ej: TV/AUDIO/VIDEO) |
| MARCA | String | 100% | 110 | Marca del producto |
| UNIDAD_MEDIDA | String | 100% | 2 | Unidad de medida (siempre "UNIDAD") |
| IMPUESTO | String | 100% | 2 | Tipo de impuesto (siempre "Gravado 10%") |
| PROVEEDOR_DFL | String | 100% | 40 | Proveedor por defecto |
| ACTIVO | String | 100% | 1 | Estado activo (siempre "S") |
| STOCK_NEGATIVO | String | 100% | 2 | Permite stock negativo (S/N) |

#### Observaciones:
- ✅ **Clave primaria:** `COD_PRODUCTO` (único, 663 valores)
- 📦 **Código de barras:** `CODIGO_PRODUCTO` puede ser numérico o alfanumérico
- 🏷️ **Categorización:** RUBRO (13) → FAMILIA (69) → MARCA (110)
- ⚠️ **Proveedor por defecto:** Campo denormalizado, debería relacionarse con Proveedor
- 📊 **Impuestos:** Todos los productos están gravados al 10%

#### Ejemplos de productos:
- TV JAM 32" LED HD BASIC ULTRASILM-32F-FISDB C/ SOPORTE
- TELEFONO CELULAR SAMSUNG AO4E 32GB BLACK SM-AO42MZKDLTY
- SECADORA BLACK GOLD BABYLISS

#### Rubros identificados (13):
- ELECTRODOMESTICOS
- ELECTRONICA
- SALUD Y BELLEZA
- FERRETERIA
- MUEBLES
- (8 más)

---

### 2️⃣ HOJA: "Existencias" (851 registros)

#### Estructura de Datos:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| (índice) | Number | Índice secuencial |
| SUCURSAL | String | Nombre de la sucursal |
| DEPOSITO | String | Nombre del depósito |
| CODIGO_PRODUCTO | Number | Código del producto |
| NOMBRE_PRODUCTO | String | Nombre del producto (denormalizado) |
| SUM(CANTIDAD_EXISTENCIA) | Number | Cantidad total en existencia |

#### Observaciones:
- 🏪 **Sucursales:** 2 únicas (SUCURSAL CAPIATA, CASA CENTRAL)
- 📦 **Depósitos:** 2 únicos (SUCURSAL CAPIATA, CASA CENTRAL)
- 🔗 **Relación:** `CODIGO_PRODUCTO` → Productos.CODIGO_PRODUCTO
- ⚠️ **Datos agregados:** La columna `SUM(CANTIDAD_EXISTENCIA)` sugiere que es un resumen
- 📊 **Existencia:** Muchos productos con existencia 0

#### Relaciones:
- **1 Producto** → **N Existencias** (por CODIGO_PRODUCTO y SUCURSAL/DEPOSITO)

---

### 3️⃣ HOJA: "Ventas y Saldos" (1,009 registros)

#### Estructura de Datos:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| (índice) | Number | Índice secuencial |
| DOCUMENTO | String | Tipo de documento (siempre "FACTURA DE VENTA") |
| FACTURA | String | Número de factura (único, formato: 002-002-0000016) |
| CONDICION | String | Condición de pago (siempre "CREDITO") |
| FECHA | Date | Fecha de la venta |
| COD_CLIENTE | Number | Código del cliente (FK) |
| NOMBRE | String | Nombre del cliente (denormalizado) |
| TIMBRADO | Number | Número de timbrado fiscal |
| VENCIMIENTO_TIMBRADO | Date | Fecha de vencimiento del timbrado |
| MONEDA | String | Moneda (siempre "Guaranies") |
| GRAVADA_10 | Decimal | Base gravada al 10% |
| IVA_10 | Decimal | IVA calculado al 10% |
| GRAVADA_05 | Decimal | Base gravada al 5% (siempre 0) |
| IVA_05 | Decimal | IVA calculado al 5% (siempre 0) |
| EXENTA | Decimal | Monto exento (siempre 0) |
| MONTO_VENTA | Decimal | Monto total de la venta |
| SALDO_VENTA | Decimal | Saldo pendiente de pago |
| FECHA_VENCIMEITNO | Date | Fecha de vencimiento del pago (nota: typo en nombre) |

#### Observaciones:
- ✅ **Clave primaria:** `FACTURA` (único, formato: XXX-XXX-XXXXXXX)
- 🔗 **Relación:** `COD_CLIENTE` → Clientes.CODIGO_CLIENTE
- 💰 **Impuestos:** Solo IVA al 10%, no hay al 5% ni exentos
- 📅 **Rango de fechas:** Desde 20/12/2025 (fecha futura, posible error o dato de prueba)
- 💳 **Condición:** Todas las ventas son a crédito
- 📊 **Saldos:** Muchas ventas tienen saldo pendiente

#### Relaciones:
- **1 Cliente** → **N Ventas** (por COD_CLIENTE)
- **1 Venta** → **N Detalles de Ventas** (por FACTURA)

---

### 4️⃣ HOJA: "Detalle Ventas" (933 registros)

#### Estructura de Datos:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| (índice) | Number | Índice secuencial |
| FACTURA | String | Número de factura (FK) |
| COD_PRODUCTO | Number | Código del producto (FK) |
| NOMBRE_PRODUCTO | String | Nombre del producto (denormalizado) |
| DEPOSITO | String | Depósito de donde se vendió |
| CANTIDAD | Number | Cantidad vendida (siempre 1 en muestra) |
| IVA | Decimal | Porcentaje de IVA (0.00 en muestra) |
| UNITARIO | Decimal | Precio unitario |
| MONTOTOTAL | Decimal | Monto total (CANTIDAD × UNITARIO) |

#### Observaciones:
- 🔗 **Relación:** `FACTURA` → Ventas.FACTURA
- 🔗 **Relación:** `COD_PRODUCTO` → Productos.COD_PRODUCTO
- 🏪 **Depósitos:** 2 únicos (CASA CENTRAL, SUCURSAL CAPIATA)
- ⚠️ **IVA:** En la muestra todos tienen IVA 0.00 (posible error o productos exentos)
- 📦 **Cantidad:** En la muestra siempre es 1, pero puede variar

#### Relaciones:
- **1 Venta** → **N Detalles de Ventas** (por FACTURA)
- **1 Producto** → **N Detalles de Ventas** (por COD_PRODUCTO)

---

### 5️⃣ HOJA: "Clietnes" (313 registros) ⚠️ Typo en nombre

#### Estructura de Datos:
| Columna | Tipo | Completitud | Valores Únicos | Descripción |
|---------|------|-------------|----------------|-------------|
| (índice) | Number | 100% | 313 | Índice secuencial |
| ID | Number | 100% | 313 | ID interno del sistema anterior |
| CODIGO_CLIENTE | Number | 100% | 313 | Código único del cliente (PK) |
| NOMBRE | String | 100% | 313 | Nombre completo del cliente |
| NOMBRE_COMPERCIAL | String | 100% | 313 | Nombre comercial (igual a NOMBRE) |
| DIRECCION | String | 11% | 16 | Dirección (30% nulos) |
| TELEFONO | String | 6% | 20 | Teléfono (45% nulos) |
| CORREO | String | 0% | 0 | Email (100% nulos) |
| WEB | String | 0% | 0 | Sitio web (100% nulos) |
| RUC | String | 6% | 19 | RUC del cliente (70% nulos) |
| CEDULA | String | 10% | 31 | Cédula de identidad (30% nulos) |
| ACTIVO | String | 100% | 1 | Estado activo (siempre "S") |
| LISTAPRECIO | Number | 100% | 14 | Lista de precios asignada |
| MONEDA | String | 100% | 1 | Moneda (siempre "Guaranies") |
| CONDICION | String | 100% | 1 | Condición de pago (siempre "CONTADO") |

#### Observaciones:
- ✅ **Clave primaria:** `CODIGO_CLIENTE` (único, 313 valores)
- ⚠️ **Datos incompletos:** Muchos campos opcionales están vacíos
- 📊 **Lista de precios:** 14 listas de precios diferentes
- 💰 **Condición:** Todos los clientes tienen condición "CONTADO" (contradice Ventas que son "CREDITO")
- 🔗 **Relación:** `CODIGO_CLIENTE` → Ventas.COD_CLIENTE

#### Ejemplos de clientes:
- CABALLERO, MARIA BEATRIZ (CEDULA: 3684036)
- PEREIRA PEÑA, MARIA SOLEDAD (TELEFONO: 0981178992)
- SANCHEZ AQUINO, JAVIER (CEDULA: 3735803)

---

## 🔗 RELACIONES IDENTIFICADAS

```
Productos (1)
    │
    ├── COD_PRODUCTO
    │
    ├── Existencias (N)
    │       └── CODIGO_PRODUCTO + SUCURSAL + DEPOSITO
    │
    └── Detalle Ventas (N)
            └── COD_PRODUCTO

Clientes (1)
    │
    ├── CODIGO_CLIENTE
    │
    └── Ventas y Saldos (N)
            └── COD_CLIENTE
                    │
                    └── FACTURA
                            │
                            └── Detalle Ventas (N)
                                    └── FACTURA
```

### Diagrama de Relaciones:

```
┌─────────────────┐
│   Productos     │
│                 │
│ COD_PRODUCTO(PK)│
│ CODIGO_PRODUCTO │
└────┬────────────┘
     │ 1
     │
     │ N
┌────▼────────────┐      ┌──────────────┐
│  Existencias    │      │Detalle Ventas│
│                 │      │              │
│ CODIGO_PRODUCTO │      │COD_PRODUCTO  │
│ SUCURSAL        │      │FACTURA       │
│ DEPOSITO        │      └──────┬───────┘
│ CANTIDAD        │              │ N
└─────────────────┘              │
                                 │
                                 │ 1
┌─────────────────┐      ┌───────▼───────┐
│   Clientes      │      │Ventas y Saldos│
│                 │      │               │
│CODIGO_CLIENTE(PK)│      │FACTURA (PK)   │
└────┬────────────┘      │COD_CLIENTE(FK)│
     │ 1                 └────────────────┘
     │
     │ N
     │
```

---

## 📐 DISEÑO DEL MODELO DE DATOS

### Modelos Necesarios:

#### 1. **Producto** (Ya existe, pero necesita actualización)
- Agregar campos del sistema anterior:
  - `codigoProducto` (COD_PRODUCTO del sistema anterior)
  - `codigoBarras` (CODIGO_PRODUCTO)
  - `rubro` (RUBRO)
  - `familia` (FAMILIA)
  - `proveedorDfl` (PROVEEDOR_DFL - denormalizado)
  - `stockNegativo` (STOCK_NEGATIVO)

#### 2. **Existencia** (Nuevo)
- Stock por producto, sucursal y depósito
- Relación con Producto, Sucursal, Deposito

#### 3. **Venta** (Nuevo - diferente de Pedido)
- Encabezado de factura de venta
- Relación con Cliente
- Información fiscal (timbrado, comprobante)
- Cálculos de impuestos
- Saldo pendiente

#### 4. **VentaItem** (Nuevo)
- Detalle de productos vendidos
- Relación con Venta y Producto
- Precio, cantidad, total

#### 5. **Cliente** (Ya existe, pero necesita actualización)
- Agregar campos del sistema anterior:
  - `codigoCliente` (CODIGO_CLIENTE del sistema anterior)
  - `idInterno` (ID del sistema anterior)
  - `ruc` (RUC)
  - `cedula` (CEDULA)
  - `listaPrecio` (LISTAPRECIO)
  - `condicion` (CONDICION)

#### 6. **ListaPrecio** (Nuevo - catálogo)
- Catálogo de listas de precios
- Relación con Cliente

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### 1. **Integración con Modelos Existentes:**
- El modelo `Producto` ya existe, necesita actualización
- El modelo `Cliente` ya existe, necesita actualización
- El modelo `Sucursal` ya existe, puede usarse
- El modelo `Deposito` ya existe (creado en compras)

### 2. **Diferencias entre Venta y Pedido:**
- **Pedido:** Sistema nuevo, para e-commerce
- **Venta:** Sistema anterior, facturación tradicional
- Pueden coexistir o unificarse según requerimientos

### 3. **Datos Denormalizados:**
- NOMBRE en Ventas (debería venir de Cliente)
- NOMBRE_PRODUCTO en Detalle Ventas (debería venir de Producto)
- PROVEEDOR_DFL en Productos (debería relacionarse con Proveedor)

### 4. **Formato de Fechas:**
- Fechas en formato DD/MM/YYYY (string)
- Convertir a DateTime en Prisma

### 5. **Formato de Números:**
- Números como strings (ej: "1226000")
- Convertir a Decimal en Prisma

### 6. **Inconsistencias Detectadas:**
- **Condición de pago:** Clientes tienen "CONTADO" pero Ventas son "CREDITO"
- **IVA en Detalle Ventas:** Todos tienen 0.00 pero Ventas tienen IVA_10
- **Fechas futuras:** Algunas ventas tienen fecha 20/12/2025 (posible error)

---

## 🎯 PRÓXIMOS PASOS

1. ✅ **Análisis completado** - Este documento
2. ⏳ **Actualizar modelos existentes** - Producto, Cliente
3. ⏳ **Crear nuevos modelos** - Venta, VentaItem, Existencia, ListaPrecio
4. ⏳ **Crear scripts de migración** - Importar datos del Excel
5. ⏳ **Validar integridad** - Verificar relaciones y datos
6. ⏳ **Implementar API** - Endpoints para gestión de ventas

---

## 📝 NOTAS ADICIONALES

- El sistema anterior parece ser un sistema de facturación/ventas tradicional
- Los datos están en español con formato paraguayo (RUC, guaraníes)
- Hay 313 clientes registrados, pero solo 39 aparecen en ventas
- Hay 663 productos, pero solo algunos aparecen en ventas
- El sistema maneja 2 sucursales: CASA CENTRAL y SUCURSAL CAPIATA
- Hay 14 listas de precios diferentes para clientes
- Todas las ventas son a crédito, pero los clientes tienen condición "CONTADO"

---

**Análisis realizado por:** Sistema de Análisis Automático  
**Herramienta:** scripts/analizar-migracion-ventas.ts

