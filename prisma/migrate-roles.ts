/**
 * Script para migrar los roles antiguos a los nuevos antes de actualizar el enum
 * 
 * Ejecutar con: npx tsx prisma/migrate-roles.ts
 */

import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrateRoles() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando migración de roles...');

    // Paso 1: Verificar usuarios existentes
    console.log('📊 Verificando usuarios existentes...');
    const checkResult = await client.query(`
      SELECT rol::text as rol, COUNT(*) as count 
      FROM usuarios 
      GROUP BY rol::text
    `);
    console.log('Usuarios por rol actual:');
    checkResult.rows.forEach((row: any) => {
      console.log(`  - ${row.rol}: ${row.count}`);
    });

    // Paso 2: Eliminar el valor por defecto si existe
    console.log('\n📝 Eliminando valor por defecto de la columna rol...');
    try {
      await client.query(`
        ALTER TABLE usuarios 
        ALTER COLUMN rol DROP DEFAULT
      `);
      console.log('✅ Valor por defecto eliminado');
    } catch (err: any) {
      if (err.code !== '42804') {
        console.log('⚠️  El valor por defecto no existe o ya fue eliminado');
      }
    }

    // Paso 3: Cambiar la columna rol a text temporalmente (si no es text ya)
    console.log('\n📝 Verificando tipo de columna rol...');
    const columnInfo = await client.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' AND column_name = 'rol'
    `);
    
    if (columnInfo.rows[0]?.data_type !== 'text') {
      console.log('📝 Cambiando columna rol a tipo text temporalmente...');
      await client.query(`
        ALTER TABLE usuarios 
        ALTER COLUMN rol TYPE text USING rol::text
      `);
      console.log('✅ Columna cambiada a text');
    } else {
      console.log('✅ La columna ya es de tipo text');
    }

    // Paso 4: Actualizar FUNCIONARIO a OPERADOR
    console.log('\n📝 Actualizando FUNCIONARIO → OPERADOR...');
    const updateFuncResult = await client.query(`
      UPDATE usuarios 
      SET rol = 'OPERADOR' 
      WHERE rol = 'FUNCIONARIO'
      RETURNING id, username, rol
    `);
    console.log(`✅ ${updateFuncResult.rowCount} usuario(s) actualizado(s) a OPERADOR`);

    // Paso 5: Actualizar SUPERVISOR a SUPERVISOR_DEPARTAMENTAL
    console.log('\n📝 Actualizando SUPERVISOR → SUPERVISOR_DEPARTAMENTAL...');
    const updateSupResult = await client.query(`
      UPDATE usuarios 
      SET rol = 'SUPERVISOR_DEPARTAMENTAL' 
      WHERE rol = 'SUPERVISOR'
      RETURNING id, username, rol
    `);
    console.log(`✅ ${updateSupResult.rowCount} usuario(s) actualizado(s) a SUPERVISOR_DEPARTAMENTAL`);

    // Paso 6: Eliminar el enum antiguo si existe
    console.log('\n📝 Eliminando enum Rol antiguo si existe...');
    try {
      await client.query(`DROP TYPE IF EXISTS "Rol" CASCADE`);
      console.log('✅ Enum antiguo eliminado');
    } catch (err: any) {
      console.log('⚠️  No se pudo eliminar el enum (puede que ya no exista)');
    }

    // Paso 7: Verificar resultados finales
    console.log('\n📊 Estado final de usuarios:');
    const finalResult = await client.query(`
      SELECT rol, COUNT(*) as count 
      FROM usuarios 
      GROUP BY rol
    `);
    finalResult.rows.forEach((row: any) => {
      console.log(`  - ${row.rol}: ${row.count}`);
    });

    console.log('\n✅ Migración de datos completada!');
    console.log('💡 Ahora puedes ejecutar: npx prisma db push --accept-data-loss');
    console.log('⚠️  La columna rol ahora es de tipo text. db:push creará el nuevo enum.');
    
  } catch (error: any) {
    console.error('❌ Error durante la migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateRoles()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  });
