import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkDates() {
  console.log('🔍 Verificando fechas en la base de datos...\n');

  try {
    // Verificar fechas en Compras
    console.log('📦 COMPRAS:');
    const compras = await prisma.compra.findMany({
      take: 10,
      orderBy: { fechaCompra: 'desc' },
      select: {
        id: true,
        comprobanteProveedor: true,
        fechaCompra: true,
      },
    });

    console.log(`Total de compras: ${await prisma.compra.count()}`);
    console.log(`\nPrimeras 10 compras (más recientes):`);
    compras.forEach((compra, index) => {
      const fecha = compra.fechaCompra;
      const fechaDate = fecha ? new Date(fecha) : null;
      const isValid = fechaDate && !isNaN(fechaDate.getTime());
      const timestamp = fecha ? new Date(fecha).getTime() : null;
      
      console.log(`\n${index + 1}. Comprobante: ${compra.comprobanteProveedor}`);
      console.log(`   Fecha raw: ${fecha}`);
      console.log(`   Timestamp: ${timestamp}`);
      console.log(`   Fecha Date: ${fechaDate}`);
      console.log(`   Es válida: ${isValid}`);
      if (fechaDate) {
        console.log(`   Formato: ${fechaDate.toLocaleDateString('es-PY')}`);
        console.log(`   ISO: ${fechaDate.toISOString()}`);
      }
      
      if (!isValid || (timestamp && timestamp < 0)) {
        console.log(`   ⚠️  FECHA INVÁLIDA O PROBLEMÁTICA`);
      }
    });

    // Verificar fechas nulas en Compras (usando raw query porque Prisma no permite null directamente)
    const comprasNullResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM compras WHERE fecha_compra IS NULL
    `;
    const comprasNull = Number(comprasNullResult[0]?.count || 0);
    console.log(`\n⚠️  Compras con fecha NULL: ${comprasNull}`);

    // Verificar fechas en Ventas
    console.log('\n\n💵 VENTAS:');
    const ventas = await prisma.venta.findMany({
      take: 10,
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        numeroFactura: true,
        fecha: true,
      },
    });

    console.log(`Total de ventas: ${await prisma.venta.count()}`);
    console.log(`\nPrimeras 10 ventas (más recientes):`);
    ventas.forEach((venta, index) => {
      const fecha = venta.fecha;
      const fechaDate = fecha ? new Date(fecha) : null;
      const isValid = fechaDate && !isNaN(fechaDate.getTime());
      const timestamp = fecha ? new Date(fecha).getTime() : null;
      
      console.log(`\n${index + 1}. Factura: ${venta.numeroFactura}`);
      console.log(`   Fecha raw: ${fecha}`);
      console.log(`   Timestamp: ${timestamp}`);
      console.log(`   Fecha Date: ${fechaDate}`);
      console.log(`   Es válida: ${isValid}`);
      if (fechaDate) {
        console.log(`   Formato: ${fechaDate.toLocaleDateString('es-PY')}`);
        console.log(`   ISO: ${fechaDate.toISOString()}`);
      }
      
      if (!isValid || (timestamp && timestamp < 0)) {
        console.log(`   ⚠️  FECHA INVÁLIDA O PROBLEMÁTICA`);
      }
    });

    // Verificar fechas nulas en Ventas
    const ventasNullResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM ventas WHERE fecha IS NULL
    `;
    const ventasNull = Number(ventasNullResult[0]?.count || 0);
    console.log(`\n⚠️  Ventas con fecha NULL: ${ventasNull}`);

    // Verificar fechas problemáticas (timestamp 0 o negativo)
    console.log('\n\n🔍 ANÁLISIS DETALLADO:');
    
    // Compras con fechas problemáticas
    const todasCompras = await prisma.compra.findMany({
      select: {
        id: true,
        comprobanteProveedor: true,
        fechaCompra: true,
      },
    });

    let comprasInvalidas = 0;
    let comprasTimestampCero = 0;
    let comprasTimestampNegativo = 0;
    
    todasCompras.forEach((compra) => {
      if (compra.fechaCompra) {
        const timestamp = new Date(compra.fechaCompra).getTime();
        if (isNaN(timestamp)) {
          comprasInvalidas++;
        } else if (timestamp === 0) {
          comprasTimestampCero++;
        } else if (timestamp < 0) {
          comprasTimestampNegativo++;
        }
      }
    });

    console.log(`\nCompras con fechas inválidas (NaN): ${comprasInvalidas}`);
    console.log(`Compras con timestamp 0: ${comprasTimestampCero}`);
    console.log(`Compras con timestamp negativo: ${comprasTimestampNegativo}`);

    // Ventas con fechas problemáticas
    const todasVentas = await prisma.venta.findMany({
      select: {
        id: true,
        numeroFactura: true,
        fecha: true,
      },
    });

    let ventasInvalidas = 0;
    let ventasTimestampCero = 0;
    let ventasTimestampNegativo = 0;
    
    todasVentas.forEach((venta) => {
      if (venta.fecha) {
        const timestamp = new Date(venta.fecha).getTime();
        if (isNaN(timestamp)) {
          ventasInvalidas++;
        } else if (timestamp === 0) {
          ventasTimestampCero++;
        } else if (timestamp < 0) {
          ventasTimestampNegativo++;
        }
      }
    });

    console.log(`\nVentas con fechas inválidas (NaN): ${ventasInvalidas}`);
    console.log(`Ventas con timestamp 0: ${ventasTimestampCero}`);
    console.log(`Ventas con timestamp negativo: ${ventasTimestampNegativo}`);

    // Mostrar ejemplos de fechas problemáticas
    console.log('\n\n📋 EJEMPLOS DE FECHAS PROBLEMÁTICAS:');
    
    const comprasProblema = todasCompras.filter((c) => {
      if (!c.fechaCompra) return true;
      const timestamp = new Date(c.fechaCompra).getTime();
      return isNaN(timestamp) || timestamp <= 0;
    }).slice(0, 5);

    if (comprasProblema.length > 0) {
      console.log('\nCompras con fechas problemáticas:');
      comprasProblema.forEach((c) => {
        console.log(`  - ${c.comprobanteProveedor}: fechaCompra = ${c.fechaCompra}`);
      });
    }

    const ventasProblema = todasVentas.filter((v) => {
      if (!v.fecha) return true;
      const timestamp = new Date(v.fecha).getTime();
      return isNaN(timestamp) || timestamp <= 0;
    }).slice(0, 5);

    if (ventasProblema.length > 0) {
      console.log('\nVentas con fechas problemáticas:');
      ventasProblema.forEach((v) => {
        console.log(`  - ${v.numeroFactura}: fecha = ${v.fecha}`);
      });
    }

  } catch (error) {
    console.error('❌ Error al verificar fechas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDates();

