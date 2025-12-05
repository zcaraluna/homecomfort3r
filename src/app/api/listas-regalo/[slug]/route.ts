import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const lista = await prisma.listaRegalo.findUnique({
      where: { slug },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
        cliente: {
          select: {
            nombreCompleto: true,
          },
        },
      },
    });

    if (!lista) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lista no encontrada',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lista,
    });
  } catch (error) {
    console.error('Error obteniendo lista de regalos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

