import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const clienteId = searchParams.get('clienteId');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { numeroFactura: { contains: search, mode: 'insensitive' } },
        { nombreCliente: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (clienteId) {
      where.clienteId = clienteId;
    }

    const [ventas, total] = await Promise.all([
      prisma.venta.findMany({
        where,
        skip,
        take: limit,
        include: {
          cliente: true,
          moneda: true,
        },
        orderBy: {
          fecha: 'desc',
        },
      }),
      prisma.venta.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: ventas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching ventas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener ventas' },
      { status: 500 }
    );
  }
}

