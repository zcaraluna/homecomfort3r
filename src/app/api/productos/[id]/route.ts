import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productoUpdateSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional().nullable(),
  precio: z.number().min(0).optional(),
  precioOferta: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0).optional(),
  categoriaId: z.string().uuid().optional(),
  marcaId: z.string().uuid().optional(),
  codigoProducto: z.number().int().optional().nullable(),
  codigoBarras: z.string().optional().nullable(),
  rubro: z.string().optional().nullable(),
  familia: z.string().optional().nullable(),
  proveedorDfl: z.string().optional().nullable(),
  stockNegativo: z.boolean().optional(),
  activo: z.boolean().optional(),
});

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: params.id },
      include: {
        categoria: true,
        marca: true,
        sucursal: true,
      },
    });

    if (!producto) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: producto,
    });
  } catch (error: any) {
    console.error('Error fetching producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validationResult = productoUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Si se actualiza el nombre, actualizar el slug
    if (data.nombre) {
      const baseSlug = data.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const productoActual = await prisma.producto.findUnique({
        where: { id: params.id },
      });
      
      if (productoActual) {
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.producto.findFirst({
          where: {
            slug,
            NOT: { id: params.id },
          },
        })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        (data as any).slug = slug;
      }
    }

    const producto = await prisma.producto.update({
      where: { id: params.id },
      data,
      include: {
        categoria: true,
        marca: true,
        sucursal: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: producto,
    });
  } catch (error: any) {
    console.error('Error updating producto:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = await prisma.producto.update({
      where: { id: params.id },
      data: { activo: false },
    });

    return NextResponse.json({
      success: true,
      data: producto,
    });
  } catch (error: any) {
    console.error('Error deleting producto:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

