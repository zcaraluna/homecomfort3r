import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const clienteSchema = z.object({
  nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
  numeroCedula: z.string().min(1, 'La cédula es requerida'),
  telefono1: z.string().min(1, 'El teléfono es requerido'),
  telefono2: z.string().optional().nullable(),
  email: z.string().email('Email inválido'),
  password: z.string().optional().nullable(),
  domicilio: z.string().optional().nullable(),
  codigoCliente: z.number().int().optional().nullable(),
  nombreComercial: z.string().optional().nullable(),
  ruc: z.string().optional().nullable(),
  listaPrecioId: z.string().uuid().optional().nullable(),
  condicion: z.string().optional(),
  activo: z.boolean().optional(),
});

// GET - Listar clientes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const activo = searchParams.get('activo');
    const temporales = searchParams.get('temporales'); // 'true' para solo temporales

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nombreCompleto: { contains: search, mode: 'insensitive' } },
        { numeroCedula: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { ruc: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (activo !== null) {
      where.activo = activo === 'true';
    }

    // Filtrar clientes temporales
    if (temporales === 'true') {
      where.OR = [
        { email: { contains: 'cliente_temp_', mode: 'insensitive' } },
        { numeroCedula: { startsWith: 'TEMP_' } },
        { nombreCompleto: { startsWith: '* ' } },
      ];
    } else if (temporales === 'false') {
      where.AND = [
        { email: { not: { contains: 'cliente_temp_', mode: 'insensitive' } } },
        { numeroCedula: { not: { startsWith: 'TEMP_' } } },
        { nombreCompleto: { not: { startsWith: '* ' } } },
      ];
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: limit,
        include: {
          listaPrecio: true,
          seleccionSucursal: true,
        },
        orderBy: {
          nombreCompleto: 'asc',
        },
      }),
      prisma.cliente.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: clientes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching clientes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

// POST - Crear cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = clienteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Hash password si se proporciona
    let hashedPassword = null;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const cliente = await prisma.cliente.create({
      data: {
        ...data,
        password: hashedPassword,
        activo: data.activo ?? true,
      },
      include: {
        listaPrecio: true,
        seleccionSucursal: true,
      },
    });

    return NextResponse.json(
      { success: true, data: cliente },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating cliente:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Ya existe un cliente con ese email o cédula' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}

