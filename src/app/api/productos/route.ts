import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  precioOferta: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0),
  categoriaId: z.string().uuid('Categoría inválida'),
  marcaId: z.string().uuid('Marca inválida'),
  codigoProducto: z.number().int().optional().nullable(),
  codigoBarras: z.string().optional().nullable(),
  rubro: z.string().optional().nullable(),
  familia: z.string().optional().nullable(),
  proveedorDfl: z.string().optional().nullable(),
  stockNegativo: z.boolean().optional(),
  activo: z.boolean().optional(),
});

// GET - Listar productos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const categoriaId = searchParams.get('categoriaId');
    const marcaId = searchParams.get('marcaId');
    const activo = searchParams.get('activo');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
        { codigoBarras: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (marcaId) {
      where.marcaId = marcaId;
    }

    if (activo !== null) {
      where.activo = activo === 'true';
    }

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        include: {
          categoria: true,
          marca: true,
          sucursal: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.producto.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: productos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching productos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = productoSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generar slug único
    const baseSlug = data.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.producto.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const producto = await prisma.producto.create({
      data: {
        ...data,
        slug,
        imagenes: [],
      },
      include: {
        categoria: true,
        marca: true,
        sucursal: true,
      },
    });

    return NextResponse.json(
      { success: true, data: producto },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating producto:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Ya existe un producto con ese código o slug' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
