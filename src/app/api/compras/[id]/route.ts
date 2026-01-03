import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const compra = await prisma.compra.findUnique({
      where: { id },
      include: {
        proveedor: true,
        moneda: true,
        productos: {
          include: {
            producto: true,
            deposito: true,
          },
        },
        gastos: {
          include: {
            tipoGasto: true,
            deposito: true,
          },
        },
      },
    });

    if (!compra) {
      return NextResponse.json(
        { success: false, error: 'Compra no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: compra,
    });
  } catch (error: any) {
    console.error('Error fetching compra:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener compra' },
      { status: 500 }
    );
  }
}

