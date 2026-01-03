import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.producto = {
        nombre: { contains: search, mode: 'insensitive' },
      };
    }

    const [existencias, total] = await Promise.all([
      prisma.existencia.findMany({
        where,
        skip,
        take: limit,
        include: {
          producto: true,
          sucursal: true,
          deposito: true,
        },
        orderBy: {
          producto: {
            nombre: 'asc',
          },
        },
      }),
      prisma.existencia.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: existencias,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching existencias:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener existencias' },
      { status: 500 }
    );
  }
}

