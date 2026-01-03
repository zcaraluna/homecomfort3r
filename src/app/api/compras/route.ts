import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const proveedorId = searchParams.get('proveedorId');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { comprobanteProveedor: { contains: search, mode: 'insensitive' } },
        { nombreProveedor: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (proveedorId) {
      where.proveedorId = proveedorId;
    }

    const [compras, total] = await Promise.all([
      prisma.compra.findMany({
        where,
        skip,
        take: limit,
        include: {
          proveedor: true,
          moneda: true,
        },
        orderBy: {
          fechaCompra: 'desc',
        },
      }),
      prisma.compra.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: compras,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching compras:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener compras' },
      { status: 500 }
    );
  }
}

