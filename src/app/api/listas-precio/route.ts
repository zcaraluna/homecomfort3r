import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const listasPrecio = await prisma.listaPrecio.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: listasPrecio,
    });
  } catch (error: any) {
    console.error('Error fetching listas precio:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener listas de precio' },
      { status: 500 }
    );
  }
}

