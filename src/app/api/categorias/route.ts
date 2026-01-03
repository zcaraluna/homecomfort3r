import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const categorias = await prisma.categoria.findMany({
      where: {
        activa: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: categorias,
    });
  } catch (error: any) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

