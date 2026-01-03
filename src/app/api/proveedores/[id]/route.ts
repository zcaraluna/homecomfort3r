import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const proveedorUpdateSchema = z.object({
  codigoProveedor: z.number().int().optional(),
  nombre: z.string().min(1).optional(),
  nombreComercial: z.string().min(1).optional(),
  ruc: z.string().min(1).optional(),
  ci: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  correo: z.string().email().optional().nullable(),
  web: z.string().url().optional().nullable(),
  telefono: z.string().optional().nullable(),
  activo: z.boolean().optional(),
});

// GET - Obtener proveedor por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: params.id },
      include: {
        compras: {
          take: 10,
          orderBy: { fechaCompra: 'desc' },
        },
      },
    });

    if (!proveedor) {
      return NextResponse.json(
        { success: false, error: 'Proveedor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: proveedor,
    });
  } catch (error: any) {
    console.error('Error fetching proveedor:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener proveedor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar proveedor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validationResult = proveedorUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const proveedor = await prisma.proveedor.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return NextResponse.json({
      success: true,
      data: proveedor,
    });
  } catch (error: any) {
    console.error('Error updating proveedor:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Proveedor no encontrado' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Ya existe un proveedor con ese código o RUC' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al actualizar proveedor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar proveedor (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proveedor = await prisma.proveedor.update({
      where: { id: params.id },
      data: { activo: false },
    });

    return NextResponse.json({
      success: true,
      data: proveedor,
    });
  } catch (error: any) {
    console.error('Error deleting proveedor:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Proveedor no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al eliminar proveedor' },
      { status: 500 }
    );
  }
}

