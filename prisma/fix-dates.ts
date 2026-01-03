import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Cargar variables de entorno
config({ path: resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Función para convertir número de Excel (días desde 1900) a Date
function excelDateToDate(excelDate: number): Date {
  // Excel cuenta desde el 1 de enero de 1900
  // Pero Excel tiene un bug: piensa que 1900 fue año bisiesto
  // Por eso restamos 2 días en lugar de 1
  const excelEpoch = new Date(1899, 11, 30); // 30 de diciembre de 1899
  const days = excelDate - 1; // Excel cuenta desde 1, no desde 0
  const date = new Date(excelEpoch);
  date.setDate(date.getDate() + days);
  return date;
}

// Función para convertir fecha DD/MM/YYYY a Date
function parseDate(dateStr: string | Date | number | null | undefined): Date | null {
  if (!dateStr) return null;
  
  // Si ya es un Date, retornarlo
  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? null : dateStr;
  }
  
  // Si es un número, verificar si es un número de Excel (días desde 1900)
  // Los números de Excel suelen ser > 1 y < 100000
  if (typeof dateStr === 'number') {
    // Si el número es pequeño (< 100000), probablemente es días de Excel
    if (dateStr > 1 && dateStr < 100000) {
      return excelDateToDate(dateStr);
    }
    // Si es un timestamp grande, tratarlo como milisegundos
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

async function fixDates() {
  console.log('🔧 Corrigiendo fechas en la base de datos...\n');

  try {
    // Leer los archivos Excel originales para obtener las fechas correctas
    const comprasFilePath = path.join(process.cwd(), 'migracion_compras_proveed_detalles.xlsx');
    const ventasFilePath = path.join(process.cwd(), 'migracion_ventas_productos_saldos.xlsx');

    console.log('📖 Leyendo archivos Excel...\n');

    // Leer compras
    const comprasWorkbook = XLSX.readFile(comprasFilePath);
    const comprasSheet = comprasWorkbook.Sheets['Facturas y Saldos compra'];
    const comprasData = XLSX.utils.sheet_to_json(comprasSheet, { defval: null });

    // Crear mapa de ID_COMPRACAB -> fecha correcta
    const comprasFechasMap = new Map<number, Date>();
    for (const row of comprasData as any[]) {
      const idCompraCab = parseInt(String(row.ID_COMPRACAB || ''), 10);
      if (!idCompraCab) continue;
      
      const fechaCorrecta = parseDate(row.FECHA_COMPRA);
      if (fechaCorrecta) {
        comprasFechasMap.set(idCompraCab, fechaCorrecta);
      }
    }

    console.log(`✅ ${comprasFechasMap.size} fechas de compras leídas del Excel\n`);

    // Leer ventas
    const ventasWorkbook = XLSX.readFile(ventasFilePath);
    const ventasSheet = ventasWorkbook.Sheets['Ventas y Saldos'];
    const ventasData = XLSX.utils.sheet_to_json(ventasSheet, { defval: null });

    // Crear mapa de FACTURA -> fecha correcta
    const ventasFechasMap = new Map<string, Date>();
    for (const row of ventasData as any[]) {
      const factura = String(row.FACTURA || '').trim();
      if (!factura) continue;
      
      const fechaCorrecta = parseDate(row.FECHA);
      if (fechaCorrecta) {
        ventasFechasMap.set(factura, fechaCorrecta);
      }
    }

    console.log(`✅ ${ventasFechasMap.size} fechas de ventas leídas del Excel\n`);

    // Corregir fechas en compras
    console.log('📦 Corrigiendo fechas de compras...\n');
    let comprasCorregidas = 0;
    let comprasNoEncontradas = 0;

    const todasCompras = await prisma.compra.findMany({
      select: {
        id: true,
        idCompraCab: true,
        fechaCompra: true,
        comprobanteProveedor: true,
      },
    });

    for (const compra of todasCompras) {
      if (!compra.idCompraCab) {
        comprasNoEncontradas++;
        continue;
      }
      
      const fechaCorrecta = comprasFechasMap.get(compra.idCompraCab);
      
      if (fechaCorrecta) {
        // Verificar si la fecha actual es incorrecta (timestamp < 1000000 = antes de 1970)
        const fechaActual = compra.fechaCompra;
        const timestampActual = fechaActual ? new Date(fechaActual).getTime() : 0;
        
        if (timestampActual < 1000000) {
          await prisma.compra.update({
            where: { id: compra.id },
            data: { fechaCompra: fechaCorrecta },
          });
          comprasCorregidas++;
          if (comprasCorregidas % 100 === 0) {
            console.log(`  ✅ ${comprasCorregidas} compras corregidas...`);
          }
        }
      } else {
        comprasNoEncontradas++;
      }
    }

    console.log(`\n✅ ${comprasCorregidas} compras corregidas`);
    if (comprasNoEncontradas > 0) {
      console.log(`⚠️  ${comprasNoEncontradas} compras no encontradas en el Excel`);
    }

    // Corregir fechas en ventas
    console.log('\n💵 Corrigiendo fechas de ventas...\n');
    let ventasCorregidas = 0;
    let ventasNoEncontradas = 0;

    const todasVentas = await prisma.venta.findMany({
      select: {
        id: true,
        numeroFactura: true,
        fecha: true,
      },
    });

    for (const venta of todasVentas) {
      const fechaCorrecta = ventasFechasMap.get(venta.numeroFactura);
      
      if (fechaCorrecta) {
        // Verificar si la fecha actual es incorrecta (timestamp < 1000000 = antes de 1970)
        const fechaActual = venta.fecha;
        const timestampActual = fechaActual ? new Date(fechaActual).getTime() : 0;
        
        if (timestampActual < 1000000) {
          await prisma.venta.update({
            where: { id: venta.id },
            data: { fecha: fechaCorrecta },
          });
          ventasCorregidas++;
          if (ventasCorregidas % 100 === 0) {
            console.log(`  ✅ ${ventasCorregidas} ventas corregidas...`);
          }
        }
      } else {
        ventasNoEncontradas++;
      }
    }

    console.log(`\n✅ ${ventasCorregidas} ventas corregidas`);
    if (ventasNoEncontradas > 0) {
      console.log(`⚠️  ${ventasNoEncontradas} ventas no encontradas en el Excel`);
    }

    console.log('\n============================================================');
    console.log('✅ CORRECCIÓN DE FECHAS COMPLETADA');
    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ Error al corregir fechas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

fixDates();

