import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const clienteUpdateSchema = z.object({
  nombreCompleto: z.string().min(1).optional(),
  numeroCedula: z.string().min(1).optional(),
  telefono1: z.string().min(1).optional(),
  telefono2: z.string().optional().nullable(),
  email: z.string().email().optional(),
  password: z.string().optional().nullable(),
  domicilio: z.string().optional().nullable(),
  nombreComercial: z.string().optional().nullable(),
  ruc: z.string().optional().nullable(),
  listaPrecioId: z.string().uuid().optional().nullable(),
  condicion: z.string().optional(),
  activo: z.boolean().optional(),
});

// GET - Obtener cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      include: {
        listaPrecio: true,
        seleccionSucursal: true,
        ventas: {
          take: 10,
          orderBy: { fecha: 'desc' },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cliente,
    });
  } catch (error: any) {
    console.error('Error fetching cliente:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener cliente' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validationResult = clienteUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = { ...validationResult.data };

    // Hash password si se proporciona
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    // Si se actualiza el nombre y es temporal, quitar el asterisco
    if (data.nombreCompleto && data.nombreCompleto.startsWith('* ')) {
      // Mantener el asterisco si es temporal
    } else if (data.nombreCompleto) {
      // Si se actualiza y no tiene asterisco, verificar si era temporal
      const clienteActual = await prisma.cliente.findUnique({
        where: { id: params.id },
      });
      
      if (clienteActual?.nombreCompleto.startsWith('* ')) {
        // Si era temporal y se actualiza, quitar el asterisco
        data.nombreCompleto = data.nombreCompleto.replace(/^\* /, '');
      }
    }

    const cliente = await prisma.cliente.update({
      where: { id: params.id },
      data,
      include: {
        listaPrecio: true,
        seleccionSucursal: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: cliente,
    });
  } catch (error: any) {
    console.error('Error updating cliente:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Ya existe un cliente con ese email o cédula' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al actualizar cliente' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cliente (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await prisma.cliente.update({
      where: { id: params.id },
      data: { activo: false },
    });

    return NextResponse.json({
      success: true,
      data: cliente,
    });
  } catch (error: any) {
    console.error('Error deleting cliente:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al eliminar cliente' },
      { status: 500 }
    );
  }
}

