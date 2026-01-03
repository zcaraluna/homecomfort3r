import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Cargar variables de entorno desde .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Función para convertir fecha DD/MM/YYYY a Date
function parseDate(dateStr: string | Date | number | null | undefined): Date | null {
  if (!dateStr) return null;
  
  // Si ya es un Date, retornarlo
  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? null : dateStr;
  }
  
  // Si es un número (timestamp), convertirlo
  if (typeof dateStr === 'number') {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }
  
  // Si es string, parsearlo
  if (typeof dateStr === 'string') {
    const trimmed = dateStr.trim();
    if (!trimmed) return null;
    
    // Formato: DD/MM/YYYY
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mes es 0-indexed
      const year = parseInt(parts[2], 10);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }
    
    // Intentar parsear como ISO date
    const isoDate = new Date(trimmed);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
  }
  
  return null;
}

// Función para convertir string a Decimal (número)
function parseDecimal(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

// Función para convertir string a Int
function parseIntSafe(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Math.floor(value);
  const parsed = Number.parseInt(String(value), 10);
  return isNaN(parsed) ? null : parsed;
}

// Función para limpiar strings
function cleanString(value: string | null | undefined): string | null {
  if (!value) return null;
  return String(value).trim() || null;
}

async function main() {
  console.log('🚀 Iniciando migración de datos...\n');

  try {
    // ============================================
    // FASE 1: CATÁLOGOS
    // ============================================
    console.log('📋 FASE 1: Creando catálogos...\n');

    // 1.1 Moneda (Guaraníes)
    let moneda = await prisma.moneda.upsert({
      where: { codigo: 'PYG' },
      update: {},
      create: {
        codigo: 'PYG',
        nombre: 'Guaraníes',
        simbolo: '₲',
        activa: true,
      },
    });
    console.log('✅ Moneda creada:', moneda.nombre);

    // 1.2 Depósitos
    const depositosData = [
      { nombre: 'CASA CENTRAL' },
      { nombre: 'SUCURSAL CAPIATA' },
    ];

    const depositosMap = new Map<string, string>();
    for (const dep of depositosData) {
      const deposito = await prisma.deposito.upsert({
        where: { nombre: dep.nombre },
        update: {},
        create: {
          nombre: dep.nombre,
          activo: true,
        },
      });
      depositosMap.set(dep.nombre, deposito.id);
      console.log('✅ Depósito creado:', deposito.nombre);
    }

    // 1.3 Listas de Precio (se crearán desde datos de clientes)
    const listasPrecioMap = new Map<number, string>();
    console.log('⏳ Listas de precio se crearán durante migración de clientes...\n');

    // ============================================
    // FASE 2: PROVEEDORES (Archivo de Compras)
    // ============================================
    console.log('📦 FASE 2: Migrando proveedores...\n');

    const comprasFilePath = path.join(process.cwd(), 'migracion_compras_proveed_detalles.xlsx');
    const comprasWorkbook = XLSX.readFile(comprasFilePath);
    const proveedoresSheet = comprasWorkbook.Sheets['Proveedore'];
    const proveedoresData = XLSX.utils.sheet_to_json(proveedoresSheet, { defval: null });

    const proveedoresMap = new Map<number, string>(); // CODIGO_PROVEEDOR -> id

    for (const row of proveedoresData as any[]) {
      const codigoProveedor = parseIntSafe(row.CODIGO_PROVEEDOR);
      if (!codigoProveedor) continue;

      const ruc = cleanString(row.RUC_PROVEEDOR);
      const nombre = cleanString(row.NOMBRE) || 'Sin nombre';
      const nombreComercial = cleanString(row.NOMBRE_COMPERCIAL) || nombre;

      // Buscar proveedor existente por codigoProveedor o RUC
      let proveedor = await prisma.proveedor.findFirst({
        where: {
          OR: [
            { codigoProveedor },
            ...(ruc ? [{ ruc }] : []),
          ],
        },
      });

      if (proveedor) {
        // Actualizar proveedor existente
        proveedor = await prisma.proveedor.update({
          where: { id: proveedor.id },
          data: {
            codigoProveedor,
            nombre,
            nombreComercial,
            ruc: ruc || proveedor.ruc, // Mantener RUC existente si el nuevo está vacío
            ci: cleanString(row.CI) || proveedor.ci,
            direccion: cleanString(row.DIRECCION) || proveedor.direccion,
            correo: cleanString(row.CORREO) || proveedor.correo,
            web: cleanString(row.WEB) || proveedor.web,
            telefono: cleanString(row.TELEFONO) || proveedor.telefono,
          },
        });
      } else {
        // Crear nuevo proveedor
        // Si el RUC está vacío, generar uno único temporal
        const rucFinal = ruc || `TEMP_${codigoProveedor}`;
        
        try {
          proveedor = await prisma.proveedor.create({
            data: {
              codigoProveedor,
              idInterno: parseIntSafe(row.ID_INTERNO),
              nombre,
              nombreComercial,
              ruc: rucFinal,
              ci: cleanString(row.CI),
              direccion: cleanString(row.DIRECCION),
              correo: cleanString(row.CORREO),
              web: cleanString(row.WEB),
              telefono: cleanString(row.TELEFONO),
              activo: true,
            },
          });
        } catch (error: any) {
          // Si falla por RUC duplicado, intentar con RUC temporal único
          if (error.code === 'P2002' && error.meta?.target?.includes('ruc')) {
            const rucUnico = `TEMP_${codigoProveedor}_${Date.now()}`;
            proveedor = await prisma.proveedor.create({
              data: {
                codigoProveedor,
                idInterno: parseIntSafe(row.ID_INTERNO),
                nombre,
                nombreComercial,
                ruc: rucUnico,
                ci: cleanString(row.CI),
                direccion: cleanString(row.DIRECCION),
                correo: cleanString(row.CORREO),
                web: cleanString(row.WEB),
                telefono: cleanString(row.TELEFONO),
                activo: true,
              },
            });
            console.log(`⚠️  Proveedor ${codigoProveedor} creado con RUC temporal: ${rucUnico}`);
          } else {
            throw error;
          }
        }
      }

      proveedoresMap.set(codigoProveedor, proveedor.id);
    }

    console.log(`✅ ${proveedoresMap.size} proveedores migrados\n`);

    // ============================================
    // FASE 3: CLIENTES (Archivo de Ventas)
    // ============================================
    console.log('👥 FASE 3: Migrando clientes...\n');

    const ventasFilePath = path.join(process.cwd(), 'migracion_ventas_productos_saldos.xlsx');
    const ventasWorkbook = XLSX.readFile(ventasFilePath);
    const clientesSheet = ventasWorkbook.Sheets['Clietnes'];
    const clientesData = XLSX.utils.sheet_to_json(clientesSheet, { defval: null });

    const clientesMap = new Map<number, string>(); // CODIGO_CLIENTE -> id

    // Primero, crear todas las listas de precio
    const listasPrecioCodigos = new Set<number>();
    for (const row of clientesData as any[]) {
      const listaPrecio = parseIntSafe(row.LISTAPRECIO);
      if (listaPrecio) listasPrecioCodigos.add(listaPrecio);
    }

    for (const codigo of listasPrecioCodigos) {
      const listaPrecio = await prisma.listaPrecio.upsert({
        where: { codigo },
        update: {},
        create: {
          codigo,
          nombre: `Lista de Precio ${codigo}`,
          activa: true,
        },
      });
      listasPrecioMap.set(codigo, listaPrecio.id);
    }
    console.log(`✅ ${listasPrecioMap.size} listas de precio creadas`);

    // Ahora migrar clientes
    for (const row of clientesData as any[]) {
      const codigoCliente = parseIntSafe(row.CODIGO_CLIENTE);
      if (!codigoCliente) continue;

      const nombre = cleanString(row.NOMBRE) || 'Sin nombre';
      const cedula = cleanString(row.CEDULA);
      const email = cedula ? `cliente_${codigoCliente}@migrado.local` : `cliente_${codigoCliente}@migrado.local`;
      
      // Buscar si ya existe un cliente con este código
      const clienteExistente = await prisma.cliente.findUnique({
        where: { codigoCliente },
      });

      let cliente;
      if (clienteExistente) {
        // Actualizar cliente existente
        cliente = await prisma.cliente.update({
          where: { id: clienteExistente.id },
          data: {
            nombreCompleto: nombre,
            nombreComercial: cleanString(row.NOMBRE_COMPERCIAL) || nombre,
            ruc: cleanString(row.RUC),
            listaPrecioId: parseIntSafe(row.LISTAPRECIO) ? listasPrecioMap.get(parseIntSafe(row.LISTAPRECIO)!) || null : null,
            condicion: cleanString(row.CONDICION) || 'CONTADO',
          },
        });
      } else {
        // Crear nuevo cliente
        cliente = await prisma.cliente.create({
          data: {
            codigoCliente,
            idInterno: parseIntSafe(row.ID),
            nombreCompleto: nombre,
            numeroCedula: cedula || `MIGRADO_${codigoCliente}`,
            telefono1: cleanString(row.TELEFONO) || '000000000',
            email,
            domicilio: cleanString(row.DIRECCION),
            nombreComercial: cleanString(row.NOMBRE_COMPERCIAL) || nombre,
            ruc: cleanString(row.RUC),
            listaPrecioId: parseIntSafe(row.LISTAPRECIO) ? listasPrecioMap.get(parseIntSafe(row.LISTAPRECIO)!) || null : null,
            condicion: cleanString(row.CONDICION) || 'CONTADO',
            activo: row.ACTIVO === 'S',
          },
        });
      }

      clientesMap.set(codigoCliente, cliente.id);
    }

    console.log(`✅ ${clientesMap.size} clientes migrados\n`);

    // ============================================
    // FASE 4: PRODUCTOS (Archivo de Ventas)
    // ============================================
    console.log('📦 FASE 4: Migrando productos...\n');

    const productosSheet = ventasWorkbook.Sheets['Productos'];
    const productosData = XLSX.utils.sheet_to_json(productosSheet, { defval: null });

    const productosMap = new Map<number, string>(); // COD_PRODUCTO -> id

    // Obtener categorías y marcas existentes para asignar
    const categorias = await prisma.categoria.findMany();
    const marcas = await prisma.marca.findMany();
    const categoriaDefault = categorias[0]?.id || null;
    const marcaDefault = marcas[0]?.id || null;

    if (!categoriaDefault || !marcaDefault) {
      console.log('⚠️  Advertencia: No hay categorías o marcas. Los productos necesitan categoría y marca.');
    }

    for (const row of productosData as any[]) {
      const codigoProducto = parseIntSafe(row.COD_PRODUCTO);
      if (!codigoProducto) continue;

      const nombre = cleanString(row.DESCRIPCION) || 'Sin descripción';
      const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 100);

      // Buscar si ya existe
      const productoExistente = await prisma.producto.findFirst({
        where: {
          OR: [
            { codigoProducto },
            { codigoBarras: cleanString(row.CODIGO_PRODUCTO) },
          ],
        },
      });

      let producto;
      if (productoExistente) {
        // Verificar si el codigoProducto ya existe en otro producto
        const otroProductoConCodigo = await prisma.producto.findFirst({
          where: {
            codigoProducto,
            NOT: { id: productoExistente.id },
          },
        });

        // Actualizar producto existente
        // Solo actualizar codigoProducto si no existe en otro producto
        const updateData: any = {
          nombre,
          descripcion: nombre,
          rubro: cleanString(row.RUBRO),
          familia: cleanString(row.FAMILIA),
          proveedorDfl: cleanString(row.PROVEEDOR_DFL),
          stockNegativo: row.STOCK_NEGATIVO === 'S',
          activo: row.ACTIVO === 'S',
        };

        // Solo actualizar codigoProducto si no hay conflicto
        if (!otroProductoConCodigo) {
          updateData.codigoProducto = codigoProducto;
        }

        // Solo actualizar codigoBarras si no hay conflicto
        const codigoBarras = cleanString(row.CODIGO_PRODUCTO);
        if (codigoBarras) {
          const otroProductoConBarras = await prisma.producto.findFirst({
            where: {
              codigoBarras,
              NOT: { id: productoExistente.id },
            },
          });
          if (!otroProductoConBarras) {
            updateData.codigoBarras = codigoBarras;
          }
        }

        producto = await prisma.producto.update({
          where: { id: productoExistente.id },
          data: updateData,
        });
      } else {
        // Crear nuevo producto
        producto = await prisma.producto.create({
          data: {
            codigoProducto,
            codigoBarras: cleanString(row.CODIGO_PRODUCTO),
            nombre,
            slug: `${slug}-${codigoProducto}`,
            descripcion: nombre,
            precio: 0, // Se actualizará desde ventas/compras
            rubro: cleanString(row.RUBRO),
            familia: cleanString(row.FAMILIA),
            proveedorDfl: cleanString(row.PROVEEDOR_DFL),
            stockNegativo: row.STOCK_NEGATIVO === 'S',
            categoriaId: categoriaDefault!,
            marcaId: marcaDefault!,
            activo: row.ACTIVO === 'S',
          },
        });
      }

      productosMap.set(codigoProducto, producto.id);
    }

    console.log(`✅ ${productosMap.size} productos migrados\n`);

    // ============================================
    // FASE 5: TIPOS DE GASTO (Archivo de Compras)
    // ============================================
    console.log('💰 FASE 5: Migrando tipos de gasto...\n');

    const gastosSheet = comprasWorkbook.Sheets['DetComprasGastos'];
    const gastosData = XLSX.utils.sheet_to_json(gastosSheet, { defval: null });

    const tiposGastoMap = new Map<number, string>(); // COD_GASTO -> id

    for (const row of gastosData as any[]) {
      const codigoGasto = parseIntSafe(row.COD_GASTO);
      if (!codigoGasto) continue;

      const nombreGasto = cleanString(row.TIPOGASTO);
      if (!nombreGasto) continue;

      if (!tiposGastoMap.has(codigoGasto)) {
        const tipoGasto = await prisma.tipoGasto.upsert({
          where: { codigo: codigoGasto },
          update: {},
          create: {
            codigo: codigoGasto,
            nombre: nombreGasto,
            activo: true,
          },
        });
        tiposGastoMap.set(codigoGasto, tipoGasto.id);
      }
    }

    console.log(`✅ ${tiposGastoMap.size} tipos de gasto migrados\n`);

    // ============================================
    // FASE 6: COMPRAS (Archivo de Compras)
    // ============================================
    console.log('🛒 FASE 6: Migrando compras...\n');

    const comprasSheet = comprasWorkbook.Sheets['Facturas y Saldos compra'];
    const comprasData = XLSX.utils.sheet_to_json(comprasSheet, { defval: null });

    const comprasMap = new Map<number, string>(); // ID_COMPRACAB -> id

    for (const row of comprasData as any[]) {
      const idCompraCab = parseIntSafe(row.ID_COMPRACAB);
      if (!idCompraCab) continue;

      const codigoProveedor = parseIntSafe(row.COD_PROVEEDOR);
      if (!codigoProveedor) {
        console.log(`⚠️  Código de proveedor inválido para compra ${idCompraCab}`);
        continue;
      }
      const proveedorId = proveedoresMap.get(codigoProveedor);
      if (!proveedorId) {
        console.log(`⚠️  Proveedor ${codigoProveedor} no encontrado para compra ${idCompraCab}`);
        continue;
      }

      const fechaCompra = parseDate(row.FECHA_COMPRA);
      if (!fechaCompra) {
        console.log(`⚠️  Fecha inválida para compra ${idCompraCab}`);
        continue;
      }

      // Verificar si ya existe una compra con este idCompraCab
      const compraExistente = await prisma.compra.findUnique({
        where: { idCompraCab },
      });

      let compra;
      if (compraExistente) {
        // Si ya existe, usar la existente
        compra = compraExistente;
      } else {
        // Crear nueva compra
        compra = await prisma.compra.create({
          data: {
            idCompraCab,
            tipoDocumento: cleanString(row.TIPODOCUMENTO) || 'FACTURA',
            timbrado: cleanString(row.TIMBRADO_COMPRA) || '',
            timbradoVencimiento: parseDate(row.TIMBRADO_VENCIMIENTO),
            comprobanteProveedor: cleanString(row.COMPROBANTE_PROV) || '',
            fechaCompra,
            fechaVencimiento: parseDate(row.VENCIMIENTO),
            proveedorId,
            nombreProveedor: cleanString(row.NOMBRE_PROVEEDOR),
            rucProveedor: cleanString(row.RUC_PROVEEDOR),
            monedaId: moneda.id,
            cotizacion: parseDecimal(row.COTIZACION_COMPRA),
            porcentajeImpuesto: parseDecimal(row.PORCENTAJE_IMPUESTO),
            exenta: parseDecimal(row.EXENTA),
            gravada05: parseDecimal(row.GRAVADA_05),
            gravada10: parseDecimal(row.GRAVADA_10),
            iva05: parseDecimal(row.IVA_05),
            iva10: parseDecimal(row.IVA_10),
            iva: parseDecimal(row.IVA),
            montoCompra: parseDecimal(row.MONTO_COMPRA),
            saldoCompra: parseDecimal(row.SALDO_COMPRA),
          },
        });
      }

      comprasMap.set(idCompraCab, compra.id);
    }

    console.log(`✅ ${comprasMap.size} compras migradas\n`);

    // ============================================
    // FASE 7: DETALLES DE PRODUCTOS COMPRADOS
    // ============================================
    console.log('📦 FASE 7: Migrando detalles de productos comprados...\n');

    const compraProductosSheet = comprasWorkbook.Sheets['DetComprasPRoductos'];
    const compraProductosData = XLSX.utils.sheet_to_json(compraProductosSheet, { defval: null });

    let compraProductosCount = 0;
    for (const row of compraProductosData as any[]) {
      const idCompraCab = parseIntSafe(row.ID_COMPRACAB);
      if (!idCompraCab) continue;
      const compraId = comprasMap.get(idCompraCab);
      if (!compraId) continue;

      const codigoProducto = parseIntSafe(row.COD_PRODUCTO);
      const productoId = codigoProducto ? productosMap.get(codigoProducto) || null : null;

      const depositoNombre = cleanString(row.DEPOSITO) || 'CASA CENTRAL';
      const depositoId = depositosMap.get(depositoNombre);
      if (!depositoId) continue;

      await prisma.compraProducto.create({
        data: {
          compraId,
          productoId,
          codigoProducto,
          nombreProducto: cleanString(row.PRODUCTO) || '',
          tipoDetalle: cleanString(row.TIPO_DETALLE) || 'MERCADERIA',
          depositoId,
          iva: parseDecimal(row.IVA),
          cantidad: parseDecimal(row.CANTIDAD),
          precioUnitario: parseDecimal(row.UNITARIO),
          total: parseDecimal(row.TOTAL),
        },
      });

      compraProductosCount++;
    }

    console.log(`✅ ${compraProductosCount} detalles de productos comprados migrados\n`);

    // ============================================
    // FASE 8: DETALLES DE GASTOS COMPRADOS
    // ============================================
    console.log('💰 FASE 8: Migrando detalles de gastos comprados...\n');

    let compraGastosCount = 0;
    for (const row of gastosData as any[]) {
      const idCompraCab = parseIntSafe(row.ID_COMPRACAB);
      if (!idCompraCab) continue;
      const compraId = comprasMap.get(idCompraCab);
      if (!compraId) continue;

      const codigoGasto = parseIntSafe(row.COD_GASTO);
      if (!codigoGasto) continue;
      const tipoGastoId = tiposGastoMap.get(codigoGasto);
      if (!tipoGastoId) continue;

      const depositoNombre = cleanString(row.DEPOSITO) || 'CASA CENTRAL';
      const depositoId = depositosMap.get(depositoNombre);
      if (!depositoId) continue;

      await prisma.compraGasto.create({
        data: {
          compraId,
          tipoGastoId,
          codigoGasto,
          nombreGasto: cleanString(row.TIPOGASTO) || '',
          tipoDetalle: cleanString(row.TIPO_DETALLE) || 'GASTO',
          depositoId,
          iva: parseDecimal(row.IVA),
          cantidad: parseDecimal(row.CANTIDAD),
          precioUnitario: parseDecimal(row.UNITARIO),
          total: parseDecimal(row.TOTAL),
        },
      });

      compraGastosCount++;
    }

    console.log(`✅ ${compraGastosCount} detalles de gastos comprados migrados\n`);

    // ============================================
    // FASE 9: VENTAS (Archivo de Ventas)
    // ============================================
    console.log('💵 FASE 9: Migrando ventas...\n');

    const ventasSheet = ventasWorkbook.Sheets['Ventas y Saldos'];
    const ventasData = XLSX.utils.sheet_to_json(ventasSheet, { defval: null });

    const ventasMap = new Map<string, string>(); // FACTURA -> id

    for (const row of ventasData as any[]) {
      const numeroFactura = cleanString(row.FACTURA);
      if (!numeroFactura) continue;

      const codigoCliente = parseIntSafe(row.COD_CLIENTE);
      if (!codigoCliente) continue;
      let clienteId = clientesMap.get(codigoCliente);
      
      // Si el cliente no existe, crear uno temporal
      if (!clienteId) {
        const nombreCliente = cleanString(row.NOMBRE) || `Cliente ${codigoCliente}`;
        const nombreClienteConMarcador = `* ${nombreCliente}`; // Marcador para identificar clientes temporales
        const emailTemp = `cliente_temp_${codigoCliente}@migrado.local`;
        
        // Verificar si ya existe un cliente temporal con este código
        const clienteTemp = await prisma.cliente.findFirst({
          where: {
            OR: [
              { codigoCliente },
              { email: emailTemp },
            ],
          },
        });

        if (clienteTemp) {
          clienteId = clienteTemp.id;
        } else {
          const nuevoCliente = await prisma.cliente.create({
            data: {
              codigoCliente,
              nombreCompleto: nombreClienteConMarcador,
              numeroCedula: `TEMP_${codigoCliente}`,
              telefono1: '000000000',
              email: emailTemp,
              activo: true,
            },
          });
          clienteId = nuevoCliente.id;
          clientesMap.set(codigoCliente, clienteId);
          console.log(`📝 Cliente temporal creado: ${codigoCliente} - ${nombreClienteConMarcador}`);
        }
      }

      const fecha = parseDate(row.FECHA);
      if (!fecha) {
        console.log(`⚠️  Fecha inválida para venta ${numeroFactura}`);
        continue;
      }

      // Verificar si ya existe una venta con este numeroFactura
      const ventaExistente = await prisma.venta.findUnique({
        where: { numeroFactura },
      });

      let venta;
      if (ventaExistente) {
        // Si ya existe, usar la existente
        venta = ventaExistente;
      } else {
        // Crear nueva venta
        venta = await prisma.venta.create({
          data: {
            numeroFactura,
            tipoDocumento: cleanString(row.DOCUMENTO) || 'FACTURA DE VENTA',
            condicion: cleanString(row.CONDICION) || 'CREDITO',
            fecha,
            timbrado: cleanString(row.TIMBRADO) || '',
            timbradoVencimiento: parseDate(row.VENCIMIENTO_TIMBRADO),
            fechaVencimiento: parseDate(row.FECHA_VENCIMEITNO),
            clienteId,
            nombreCliente: cleanString(row.NOMBRE),
            monedaId: moneda.id,
            gravada10: parseDecimal(row.GRAVADA_10),
            iva10: parseDecimal(row.IVA_10),
            gravada05: parseDecimal(row.GRAVADA_05),
            iva05: parseDecimal(row.IVA_05),
            exenta: parseDecimal(row.EXENTA),
            montoVenta: parseDecimal(row.MONTO_VENTA),
            saldoVenta: parseDecimal(row.SALDO_VENTA),
          },
        });
      }

      ventasMap.set(numeroFactura, venta.id);
    }

    console.log(`✅ ${ventasMap.size} ventas migradas\n`);

    // ============================================
    // FASE 10: DETALLES DE VENTAS
    // ============================================
    console.log('📋 FASE 10: Migrando detalles de ventas...\n');

    const detalleVentasSheet = ventasWorkbook.Sheets['Detalle Ventas'];
    const detalleVentasData = XLSX.utils.sheet_to_json(detalleVentasSheet, { defval: null });

    let ventaItemsCount = 0;
    for (const row of detalleVentasData as any[]) {
      const numeroFactura = cleanString(row.FACTURA);
      if (!numeroFactura) continue;
      const ventaId = ventasMap.get(numeroFactura);
      if (!ventaId) continue;

      const codigoProducto = parseIntSafe(row.COD_PRODUCTO);
      if (!codigoProducto) continue;
      const productoId = productosMap.get(codigoProducto);
      if (!productoId) {
        console.log(`⚠️  Producto ${codigoProducto} no encontrado para venta ${numeroFactura}`);
        continue;
      }

      const depositoNombre = cleanString(row.DEPOSITO) || 'CASA CENTRAL';
      const depositoId = depositosMap.get(depositoNombre);
      if (!depositoId) continue;

      await prisma.ventaItem.create({
        data: {
          ventaId,
          productoId,
          codigoProducto,
          nombreProducto: cleanString(row.NOMBRE_PRODUCTO) || '',
          depositoId,
          cantidad: parseDecimal(row.CANTIDAD),
          iva: parseDecimal(row.IVA),
          precioUnitario: parseDecimal(row.UNITARIO),
          montoTotal: parseDecimal(row.MONTOTOTAL),
        },
      });

      ventaItemsCount++;
    }

    console.log(`✅ ${ventaItemsCount} detalles de ventas migrados\n`);

    // ============================================
    // FASE 11: EXISTENCIAS (Archivo de Ventas)
    // ============================================
    console.log('📊 FASE 11: Migrando existencias...\n');

    const existenciasSheet = ventasWorkbook.Sheets['Existencias'];
    const existenciasData = XLSX.utils.sheet_to_json(existenciasSheet, { defval: null });

    // Obtener o crear sucursales
    const sucursales = await prisma.sucursal.findMany();
    const sucursalesMap = new Map<string, string>();
    
    // Mapear sucursales existentes
    for (const sucursal of sucursales) {
      sucursalesMap.set(sucursal.nombre.toUpperCase(), sucursal.id);
      // También mapear por slug
      sucursalesMap.set(sucursal.slug.toUpperCase(), sucursal.id);
    }
    
    // Crear sucursales que faltan si no existen
    const sucursalesNecesarias = [
      { nombre: 'CASA CENTRAL', slug: 'casa-central' },
      { nombre: 'SUCURSAL CAPIATA', slug: 'sucursal-capiata' },
    ];
    
    for (const sucursalData of sucursalesNecesarias) {
      if (!sucursalesMap.has(sucursalData.nombre.toUpperCase())) {
        const nuevaSucursal = await prisma.sucursal.upsert({
          where: { slug: sucursalData.slug },
          update: {},
          create: {
            nombre: sucursalData.nombre,
            slug: sucursalData.slug,
            direccion: sucursalData.nombre,
            ubicacionMaps: '',
            telefono: '000000000',
            whatsapp: '000000000',
            fotos: [],
            activa: true,
          },
        });
        sucursalesMap.set(sucursalData.nombre.toUpperCase(), nuevaSucursal.id);
        sucursalesMap.set(sucursalData.slug.toUpperCase(), nuevaSucursal.id);
        console.log(`✅ Sucursal creada: ${sucursalData.nombre}`);
      }
    }

    let existenciasCount = 0;
    for (const row of existenciasData as any[]) {
      const codigoProducto = parseIntSafe(row.CODIGO_PRODUCTO);
      if (!codigoProducto) continue;
      const productoId = productosMap.get(codigoProducto);
      if (!productoId) continue;

      const sucursalNombre = cleanString(row.SUCURSAL)?.toUpperCase() || 'CASA CENTRAL';
      const sucursalId = sucursalesMap.get(sucursalNombre);
      if (!sucursalId) {
        console.log(`⚠️  Sucursal ${sucursalNombre} no encontrada`);
        continue;
      }

      const depositoNombre = cleanString(row.DEPOSITO) || 'CASA CENTRAL';
      const depositoId = depositosMap.get(depositoNombre);
      if (!depositoId) continue;

      const cantidad = parseDecimal(row['SUM(CANTIDAD_EXISTENCIA)']);

      // Verificar si ya existe
      const existenciaExistente = await prisma.existencia.findFirst({
        where: {
          productoId,
          sucursalId,
          depositoId,
        },
      });

      if (existenciaExistente) {
        await prisma.existencia.update({
          where: { id: existenciaExistente.id },
          data: { cantidad },
        });
      } else {
        await prisma.existencia.create({
          data: {
            productoId,
            sucursalId,
            depositoId,
            cantidad,
          },
        });
      }

      existenciasCount++;
    }

    console.log(`✅ ${existenciasCount} existencias migradas\n`);

    // ============================================
    // RESUMEN FINAL
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log(`\n📊 Resumen:`);
    console.log(`   - Proveedores: ${proveedoresMap.size}`);
    console.log(`   - Clientes: ${clientesMap.size}`);
    console.log(`   - Productos: ${productosMap.size}`);
    console.log(`   - Compras: ${comprasMap.size}`);
    console.log(`   - Detalles de productos comprados: ${compraProductosCount}`);
    console.log(`   - Detalles de gastos comprados: ${compraGastosCount}`);
    console.log(`   - Ventas: ${ventasMap.size}`);
    console.log(`   - Detalles de ventas: ${ventaItemsCount}`);
    console.log(`   - Existencias: ${existenciasCount}`);
    console.log(`   - Tipos de gasto: ${tiposGastoMap.size}`);
    console.log(`   - Listas de precio: ${listasPrecioMap.size}`);
    console.log('\n');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

