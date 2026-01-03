# 📊 Análisis Exhaustivo del Archivo de Migración
## migracion_compras_proveed_detalles.xlsx

**Fecha de análisis:** 2026-01-02  
**Archivo:** migracion_compras_proveed_detalles.xlsx

---

## 📋 RESUMEN EJECUTIVO

El archivo contiene **4 hojas** con datos del sistema anterior de compras y proveedores:

1. **Proveedore** - 115 registros de proveedores
2. **Facturas y Saldos compra** - 1,019 facturas de compra
3. **DetComprasPRoductos** - 1,111 detalles de productos comprados
4. **DetComprasGastos** - 300 detalles de gastos asociados a compras

**Total de registros:** 2,545 registros

---

## 📊 ANÁLISIS DETALLADO POR HOJA

### 1️⃣ HOJA: "Proveedore" (115 registros)

#### Estructura de Datos:
| Columna | Tipo | Completitud | Valores Únicos | Descripción |
|---------|------|-------------|----------------|-------------|
| (índice) | Number | 100% | 115 | Índice secuencial |
| ID_INTERNO | Number | 100% | 115 | ID interno del sistema anterior |
| CODIGO_PROVEEDOR | Number | 100% | 115 | Código único del proveedor |
| NOMBRE | String | 100% | 115 | Nombre legal del proveedor |
| NOMBRE_COMPERCIAL | String | 100% | 115 | Nombre comercial |
| RUC_PROVEEDOR | String | 100% | 115 | RUC único (formato: 80009246-5) |
| CI | String | 1% | 1 | Cédula de identidad (casi siempre nulo) |
| DIRECCION | String | 87% | 92 | Dirección física |
| CORREO | String | 3% | 4 | Email del proveedor |
| WEB | String | 3% | 3 | Sitio web |
| TELEFONO | String | 51% | 59 | Teléfono de contacto |

#### Observaciones:
- ✅ **Clave primaria candidata:** `CODIGO_PROVEEDOR` o `RUC_PROVEEDOR` (ambos únicos)
- ⚠️ **Campos opcionales:** CI (99% nulos), CORREO (97% nulos), WEB (97% nulos)
- 📝 **Datos completos:** NOMBRE, NOMBRE_COMPERCIAL, RUC_PROVEEDOR están siempre presentes

#### Ejemplos de datos:
- GLOBO SA (RUC: 80009246-5)
- TUPI S.A. (RUC: 80031970-2)
- MG EXPRESS (RUC: 80060064-9)

---

### 2️⃣ HOJA: "Facturas y Saldos compra" (1,019 registros)

#### Estructura de Datos:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| (índice) | Number | Índice secuencial |
| TIPODOCUMENTO | String | Tipo de documento (siempre "FACTURA") |
| ID_COMPRACAB | Number | ID único de la compra (clave primaria) |
| TIMBRADO_COMPRA | Number | Número de timbrado fiscal |
| TIMBRADO_VENCIMIENTO | Date | Fecha de vencimiento del timbrado |
| COMPROBANTE_PROV | String | Número de comprobante del proveedor |
| FECHA_COMPRA | Date | Fecha de la compra |
| COD_PROVEEDOR | Number | Código del proveedor (FK) |
| NOMBRE_PROVEEDOR | String | Nombre del proveedor (denormalizado) |
| RUC_PROVEEDOR | String | RUC del proveedor (denormalizado) |
| ID_MONEDA | Number | ID de la moneda (siempre 1 = Guaraníes) |
| COTIZACION_COMPRA | Decimal | Cotización (siempre 1.00) |
| PORCENTAJE_IMPUESTO | Decimal | Porcentaje de IVA (10.00) |
| EXENTA | Decimal | Monto exento de IVA |
| GRAVADA_05 | Decimal | Base gravada al 5% |
| GRAVADA_10 | Decimal | Base gravada al 10% |
| IVA_05 | Decimal | IVA calculado al 5% |
| IVA_10 | Decimal | IVA calculado al 10% |
| IVA | Decimal | IVA total |
| MONTO_COMPRA | Decimal | Monto total de la compra |
| SALDO_COMPRA | Decimal | Saldo pendiente (siempre 0 en muestra) |
| VENCIMIENTO | Date | Fecha de vencimiento del pago |

#### Observaciones:
- ✅ **Clave primaria:** `ID_COMPRACAB` (único por registro)
- 🔗 **Relación:** `COD_PROVEEDOR` → Proveedore.CODIGO_PROVEEDOR
- 📊 **Datos fiscales:** Timbrado, comprobante, fechas, impuestos
- 💰 **Cálculos:** IVA al 10% (predominante), montos en guaraníes
- 📅 **Rango de fechas:** Desde 17/11/2023 hasta fechas más recientes

#### Relaciones:
- **1 Proveedor** → **N Facturas** (por COD_PROVEEDOR)
- **1 Factura** → **N Detalles de Productos** (por ID_COMPRACAB)
- **1 Factura** → **N Detalles de Gastos** (por ID_COMPRACAB)

---

### 3️⃣ HOJA: "DetComprasPRoductos" (1,111 registros)

#### Estructura de Datos:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| (índice) | Number | Índice secuencial |
| ID_COMPRACAB | Number | ID de la compra (FK) |
| COMPROBANTE | String | Número de comprobante |
| COD_PRODUCTO | Number | Código del producto |
| PRODUCTO | String | Nombre/descripción del producto |
| TIPO_DETALLE | String | Tipo (siempre "MERCADERIA") |
| DEPOSITO | String | Depósito (siempre "CASA CENTRAL") |
| IVA | Decimal | Porcentaje de IVA (10.00) |
| CANTIDAD | Decimal | Cantidad comprada |
| UNITARIO | Decimal | Precio unitario |
| TOTAL | Decimal | Total (CANTIDAD × UNITARIO) |

#### Observaciones:
- 🔗 **Relación:** `ID_COMPRACAB` → Facturas.ID_COMPRACAB
- 📦 **Productos:** 46 productos únicos en la muestra
- 🏪 **Depósito:** Todos los registros son "CASA CENTRAL"
- 💰 **Precios:** En guaraníes, valores altos (ej: 1,990,000)

#### Ejemplos de productos:
- AIRE ACOND. JAM SPLIT 12.000BTUF/C JF-12CHRN1 R410A ECO +KIT DE INST
- HERVIDORA JAM DE VIDRIO 1.7 LT
- COCINA SPEED 1H INFLAROJO C/OLLA 2000W SCIR2000W

---

### 4️⃣ HOJA: "DetComprasGastos" (300 registros)

#### Estructura de Datos:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| (índice) | Number | Índice secuencial |
| ID_COMPRACAB | Number | ID de la compra (FK) |
| COMPROBANTE | String | Número de comprobante |
| COD_GASTO | Number | Código del tipo de gasto |
| TIPOGASTO | String | Nombre del tipo de gasto |
| TIPO_DETALLE | String | Tipo (siempre "GASTO") |
| DEPOSITO | String | Depósito |
| IVA | Decimal | Porcentaje de IVA (0.00 o 10.00) |
| CANTIDAD | Decimal | Cantidad (siempre 1.000) |
| UNITARIO | Decimal | Precio unitario |
| TOTAL | Decimal | Total del gasto |

#### Observaciones:
- 🔗 **Relación:** `ID_COMPRACAB` → Facturas.ID_COMPRACAB
- 📊 **Tipos de gasto:** 9 tipos únicos
- 💰 **IVA variable:** Algunos con IVA 0%, otros con 10%

#### Tipos de gasto encontrados:
- Servicios Informáticos
- Combustible
- Muebles y Equipos
- (6 tipos más)

---

## 🔗 RELACIONES IDENTIFICADAS

```
Proveedore (1)
    │
    ├── CODIGO_PROVEEDOR
    │
    └── Facturas y Saldos compra (N)
            │
            ├── ID_COMPRACAB
            │
            ├── DetComprasPRoductos (N)
            │       └── ID_COMPRACAB
            │
            └── DetComprasGastos (N)
                    └── ID_COMPRACAB
```

### Diagrama de Relaciones:

```
┌─────────────────┐
│   Proveedore    │
│                 │
│ CODIGO_PROVEEDOR│ (PK)
│ RUC_PROVEEDOR   │ (UNIQUE)
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼──────────────────────┐
│  Facturas y Saldos compra      │
│                                │
│ ID_COMPRACAB (PK)              │
│ COD_PROVEEDOR (FK)             │
│ TIMBRADO_COMPRA                │
│ COMPROBANTE_PROV               │
│ FECHA_COMPRA                   │
│ MONTO_COMPRA                   │
│ SALDO_COMPRA                   │
└────┬───────────────────┬───────┘
     │ 1                 │ 1
     │                   │
     │ N                 │ N
┌────▼──────────┐  ┌─────▼────────────┐
│DetCompras     │  │DetComprasGastos   │
│PRoductos      │  │                   │
│               │  │                   │
│ID_COMPRACAB(FK)│  │ID_COMPRACAB (FK) │
│COD_PRODUCTO   │  │COD_GASTO          │
│PRODUCTO       │  │TIPOGASTO           │
│CANTIDAD       │  │CANTIDAD           │
│UNITARIO       │  │UNITARIO           │
│TOTAL          │  │TOTAL               │
└───────────────┘  └───────────────────┘
```

---

## 📐 DISEÑO DEL MODELO DE DATOS

### Modelo Propuesto para Prisma:

#### 1. **Proveedor** (Proveedore)
- Información completa del proveedor
- RUC único como identificador principal
- Campos opcionales para datos de contacto

#### 2. **Compra** (Facturas y Saldos compra)
- Encabezado de la compra/factura
- Relación con Proveedor
- Información fiscal (timbrado, comprobante)
- Cálculos de impuestos (IVA 5%, 10%, exento)
- Saldo pendiente de pago

#### 3. **CompraProducto** (DetComprasPRoductos)
- Detalle de productos comprados
- Relación con Compra y Producto
- Cantidad, precio unitario, total
- Depósito de almacenamiento

#### 4. **CompraGasto** (DetComprasGastos)
- Detalle de gastos asociados a la compra
- Relación con Compra y TipoGasto
- Cantidad, precio unitario, total
- IVA aplicable

#### 5. **TipoGasto** (Nuevo - catálogo)
- Catálogo de tipos de gasto
- Relación con CompraGasto

#### 6. **Moneda** (Nuevo - catálogo)
- Catálogo de monedas
- Relación con Compra

#### 7. **Deposito** (Nuevo - catálogo)
- Catálogo de depósitos/almacenes
- Relación con CompraProducto y CompraGasto

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### 1. **Datos Denormalizados:**
- En "Facturas y Saldos compra" hay campos denormalizados:
  - `NOMBRE_PROVEEDOR` (debería venir de Proveedor)
  - `RUC_PROVEEDOR` (debería venir de Proveedor)
- **Decisión:** Mantener para historial, pero también usar relaciones

### 2. **Campos Opcionales:**
- Muchos campos tienen valores nulos (CI, CORREO, WEB)
- **Decisión:** Hacerlos opcionales en el modelo

### 3. **Formato de Fechas:**
- Fechas en formato DD/MM/YYYY (string)
- **Decisión:** Convertir a DateTime en Prisma

### 4. **Formato de Números:**
- Números como strings (ej: "1990000.00")
- **Decisión:** Convertir a Decimal en Prisma

### 5. **Relación con Productos:**
- `COD_PRODUCTO` en DetComprasPRoductos
- **Decisión:** Relacionar con modelo Producto existente o crear referencia

### 6. **Saldos:**
- `SALDO_COMPRA` siempre 0 en la muestra
- **Decisión:** Campo importante para gestión de pagos pendientes

---

## 🎯 PRÓXIMOS PASOS

1. ✅ **Análisis completado** - Este documento
2. ⏳ **Diseñar schema Prisma** - Modelos y relaciones
3. ⏳ **Crear scripts de migración** - Importar datos del Excel
4. ⏳ **Validar integridad** - Verificar relaciones y datos
5. ⏳ **Implementar API** - Endpoints para gestión de compras

---

## 📝 NOTAS ADICIONALES

- El sistema anterior parece ser un sistema de facturación/compras
- Los datos están en español con formato paraguayo (RUC, guaraníes)
- Hay 12 proveedores únicos en las facturas (de 115 totales)
- El sistema maneja IVA al 5% y 10% (aunque en la muestra solo se ve 10%)
- Todos los depósitos son "CASA CENTRAL" (posiblemente solo una sucursal en el sistema anterior)

---

**Análisis realizado por:** Sistema de Análisis Automático  
**Herramienta:** scripts/analizar-migracion.ts

