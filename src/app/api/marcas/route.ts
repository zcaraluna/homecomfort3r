import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const marcas = await prisma.marca.findMany({
      where: {
        activa: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: marcas,
    });
  } catch (error: any) {
    console.error('Error fetching marcas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener marcas' },
      { status: 500 }
    );
  }
}

