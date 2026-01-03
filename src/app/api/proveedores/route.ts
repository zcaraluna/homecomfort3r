import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const proveedorSchema = z.object({
  codigoProveedor: z.number().int(),
  idInterno: z.number().int().optional().nullable(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  nombreComercial: z.string().min(1, 'El nombre comercial es requerido'),
  ruc: z.string().min(1, 'El RUC es requerido'),
  ci: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  correo: z.string().email('Email inválido').optional().nullable(),
  web: z.string().url('URL inválida').optional().nullable(),
  telefono: z.string().optional().nullable(),
  activo: z.boolean().optional(),
});

// GET - Listar proveedores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const activo = searchParams.get('activo');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { nombreComercial: { contains: search, mode: 'insensitive' } },
        { ruc: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (activo !== null) {
      where.activo = activo === 'true';
    }

    const [proveedores, total] = await Promise.all([
      prisma.proveedor.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          nombre: 'asc',
        },
      }),
      prisma.proveedor.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: proveedores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching proveedores:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener proveedores' },
      { status: 500 }
    );
  }
}

// POST - Crear proveedor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = proveedorSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const proveedor = await prisma.proveedor.create({
      data: {
        ...validationResult.data,
        activo: validationResult.data.activo ?? true,
      },
    });

    return NextResponse.json(
      { success: true, data: proveedor },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating proveedor:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Ya existe un proveedor con ese código o RUC' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al crear proveedor' },
      { status: 500 }
    );
  }
}

