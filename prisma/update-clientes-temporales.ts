import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Cargar variables de entorno desde .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Actualizando clientes temporales...\n');

  try {
    // Buscar todos los clientes temporales
    // Identificados por email que contiene "cliente_temp_" o cédula que contiene "TEMP_"
    const clientesTemporales = await prisma.cliente.findMany({
      where: {
        OR: [
          { email: { contains: 'cliente_temp_' } },
          { numeroCedula: { startsWith: 'TEMP_' } },
        ],
      },
    });

    console.log(`📋 Encontrados ${clientesTemporales.length} clientes temporales\n`);

    let actualizados = 0;
    let yaActualizados = 0;

    for (const cliente of clientesTemporales) {
      // Verificar si ya tiene el asterisco
      if (cliente.nombreCompleto.startsWith('* ')) {
        yaActualizados++;
        continue;
      }

      // Agregar asterisco al nombre
      await prisma.cliente.update({
        where: { id: cliente.id },
        data: {
          nombreCompleto: `* ${cliente.nombreCompleto}`,
        },
      });

      actualizados++;
      console.log(`✅ Actualizado: ${cliente.codigoCliente} - * ${cliente.nombreCompleto}`);
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   - Clientes actualizados: ${actualizados}`);
    console.log(`   - Clientes ya con marcador: ${yaActualizados}`);
    console.log(`   - Total procesados: ${clientesTemporales.length}`);

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
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

