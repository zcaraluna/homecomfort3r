import 'dotenv/config';
import { PrismaClient, Rol } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Crear usuario user1 (OPERADOR)
  const user1Password = await bcrypt.hash('user123', 10);
  await prisma.usuario.upsert({
    where: { username: 'user1' },
    update: {},
    create: {
      username: 'user1',
      password: user1Password,
      nombre: 'Usuario',
      apellido: 'Uno',
      grado: 'Oficial',
      numeroCedula: '1000001',
      numeroCredencial: 'USER-001',
      email: 'user1@ejemplo.com',
      telefono: '+595 981 000001',
      rol: Rol.OPERADOR,
    },
  });
  console.log('✅ Usuario OPERADOR creado (username: user1, password: user123)');

  // Crear usuario user2 (SUPERVISOR_DEPARTAMENTAL)
  const user2Password = await bcrypt.hash('user123', 10);
  await prisma.usuario.upsert({
    where: { username: 'user2' },
    update: {},
    create: {
      username: 'user2',
      password: user2Password,
      nombre: 'Usuario',
      apellido: 'Dos',
      grado: 'Subcomisario',
      numeroCedula: '1000002',
      numeroCredencial: 'USER-002',
      email: 'user2@ejemplo.com',
      telefono: '+595 981 000002',
      rol: Rol.SUPERVISOR_DEPARTAMENTAL,
    },
  });
  console.log('✅ Usuario SUPERVISOR_DEPARTAMENTAL creado (username: user2, password: user123)');

  // Crear usuario user3 (SUPERVISOR_REGIONAL)
  const user3Password = await bcrypt.hash('user123', 10);
  await prisma.usuario.upsert({
    where: { username: 'user3' },
    update: {},
    create: {
      username: 'user3',
      password: user3Password,
      nombre: 'Usuario',
      apellido: 'Tres',
      grado: 'Comisario',
      numeroCedula: '1000003',
      numeroCredencial: 'USER-003',
      email: 'user3@ejemplo.com',
      telefono: '+595 981 000003',
      rol: Rol.SUPERVISOR_REGIONAL,
    },
  });
  console.log('✅ Usuario SUPERVISOR_REGIONAL creado (username: user3, password: user123)');

  // Crear usuario user4 (SUPERVISOR_GENERAL)
  const user4Password = await bcrypt.hash('user123', 10);
  await prisma.usuario.upsert({
    where: { username: 'user4' },
    update: {},
    create: {
      username: 'user4',
      password: user4Password,
      nombre: 'Usuario',
      apellido: 'Cuatro',
      grado: 'Comisario Principal',
      numeroCedula: '1000004',
      numeroCredencial: 'USER-004',
      email: 'user4@ejemplo.com',
      telefono: '+595 981 000004',
      rol: Rol.SUPERVISOR_GENERAL,
    },
  });
  console.log('✅ Usuario SUPERVISOR_GENERAL creado (username: user4, password: user123)');

  // Crear usuario admin (ADMIN)
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      grado: 'Administrador',
      numeroCedula: '0000000',
      numeroCredencial: 'ADMIN-001',
      email: 'admin@ejemplo.com',
      telefono: '+595 981 000000',
      rol: Rol.ADMIN,
    },
  });
  console.log('✅ Usuario ADMIN creado (username: admin, password: admin123)');

  // Crear cliente de prueba
  const clientePassword = await bcrypt.hash('cliente123', 10);
  const cliente = await prisma.cliente.upsert({
    where: { email: 'cliente@homecomfort3r.com.py' },
    update: {
      password: clientePassword,
    },
    create: {
      nombreCompleto: 'Cliente Prueba',
      numeroCedula: '5000000',
      telefono1: '+595 981 500000',
      email: 'cliente@homecomfort3r.com.py',
      password: clientePassword,
      domicilio: 'Dirección de prueba',
    },
  });
  console.log('✅ Cliente de prueba creado (email: cliente@homecomfort3r.com.py, password: cliente123)');

  // Crear usuario cliente (para panel de administración)
  // Reutilizar el mismo hash de contraseña
  await prisma.usuario.upsert({
    where: { username: 'cliente' },
    update: {},
    create: {
      username: 'cliente',
      password: clientePassword,
      nombre: 'Cliente',
      apellido: 'Prueba',
      email: 'cliente@homecomfort3r.com.py',
      telefono: '+595 981 500000',
      rol: Rol.ADMIN, // O el rol que prefieras
    },
  });
  console.log('✅ Usuario CLIENTE creado (username: cliente, password: cliente123)');

  // Crear sucursales
  const sucursalCentral = await prisma.sucursal.upsert({
    where: { slug: 'central' },
    update: {},
    create: {
      nombre: 'Sucursal Dpto. Central',
      slug: 'central',
      direccion: 'Rojas Cañada, Capiatá',
      ubicacionMaps: 'https://www.google.com/maps/embed?pb=...',
      telefono: '+595 21 123 456',
      whatsapp: '595981000000',
      email: 'central@homecomfort3r.com.py',
      fotos: [],
    },
  });

  const sucursalCanindeyu = await prisma.sucursal.upsert({
    where: { slug: 'canindeyu' },
    update: {},
    create: {
      nombre: 'Sucursal Dpto. Canindeyú',
      slug: 'canindeyu',
      direccion: 'Nombre de calle, Ybyrarobana',
      ubicacionMaps: 'https://www.google.com/maps/embed?pb=...',
      telefono: '+595 61 789 012',
      whatsapp: '595981000001',
      email: 'canindeyu@homecomfort3r.com.py',
      fotos: [],
    },
  });
  console.log('✅ Sucursales creadas');

  // Crear categorías
  const categoriaRefrigeradores = await prisma.categoria.upsert({
    where: { slug: 'refrigeradores' },
    update: {},
    create: {
      nombre: 'Refrigeradores',
      slug: 'refrigeradores',
      descripcion: 'Refrigeradores y congeladores',
    },
  });

  const categoriaLavadoras = await prisma.categoria.upsert({
    where: { slug: 'lavadoras' },
    update: {},
    create: {
      nombre: 'Lavadoras',
      slug: 'lavadoras',
      descripcion: 'Lavadoras y secadoras',
    },
  });

  const categoriaMicroondas = await prisma.categoria.upsert({
    where: { slug: 'microondas' },
    update: {},
    create: {
      nombre: 'Microondas',
      slug: 'microondas',
      descripcion: 'Hornos microondas',
    },
  });
  console.log('✅ Categorías creadas');

  // Crear marcas
  const marcaSamsung = await prisma.marca.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      nombre: 'Samsung',
      slug: 'samsung',
    },
  });

  const marcaLG = await prisma.marca.upsert({
    where: { slug: 'lg' },
    update: {},
    create: {
      nombre: 'LG',
      slug: 'lg',
    },
  });

  const marcaWhirlpool = await prisma.marca.upsert({
    where: { slug: 'whirlpool' },
    update: {},
    create: {
      nombre: 'Whirlpool',
      slug: 'whirlpool',
    },
  });
  console.log('✅ Marcas creadas');

  // Crear productos de ejemplo (con IDs específicos para que coincidan con el frontend)
  // Nota: Prisma usa UUIDs, así que necesitamos crear productos y luego actualizar el frontend
  // o crear productos y usar sus IDs reales en el frontend
  
  const producto1 = await prisma.producto.upsert({
    where: { slug: 'refrigerador-samsung-001' },
    update: {},
    create: {
      nombre: 'Refrigerador Samsung',
      slug: 'refrigerador-samsung-001',
      precio: 2500000,
      precioOferta: 2200000,
      ofertaDia: true,
      stock: 10,
      categoriaId: categoriaRefrigeradores.id,
      marcaId: marcaSamsung.id,
      sucursalId: sucursalCentral.id,
    },
  });

  const producto2 = await prisma.producto.upsert({
    where: { slug: 'lavadora-lg-001' },
    update: {},
    create: {
      nombre: 'Lavadora LG',
      slug: 'lavadora-lg-001',
      precio: 1800000,
      precioOferta: null,
      ofertaDia: false,
      stock: 8,
      categoriaId: categoriaLavadoras.id,
      marcaId: marcaLG.id,
      sucursalId: sucursalCentral.id,
    },
  });

  const producto3 = await prisma.producto.upsert({
    where: { slug: 'microondas-whirlpool-001' },
    update: {},
    create: {
      nombre: 'Microondas Whirlpool',
      slug: 'microondas-whirlpool-001',
      precio: 800000,
      precioOferta: 650000,
      ofertaDia: true,
      stock: 15,
      categoriaId: categoriaMicroondas.id,
      marcaId: marcaWhirlpool.id,
      sucursalId: sucursalCentral.id,
    },
  });
  console.log('✅ Productos de ejemplo creados');
  console.log(`   - Producto 1 ID: ${producto1.id}`);
  console.log(`   - Producto 2 ID: ${producto2.id}`);
  console.log(`   - Producto 3 ID: ${producto3.id}`);

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
