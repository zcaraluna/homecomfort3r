import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const [compras, saldoTotal] = await Promise.all([
      prisma.compra.aggregate({
        _sum: {
          montoCompra: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.compra.aggregate({
        _sum: {
          saldoCompra: true,
        },
      }),
    ]);

    const totalCompras = Number(compras._sum.montoCompra || 0);
    const cantidadCompras = compras._count.id;
    const saldoPendiente = Number(saldoTotal._sum.saldoCompra || 0);
    const promedioCompra = cantidadCompras > 0 ? totalCompras / cantidadCompras : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCompras,
        cantidadCompras,
        saldoPendiente,
        promedioCompra,
      },
    });
  } catch (error: any) {
    console.error('Error fetching reporte compras:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener reporte' },
      { status: 500 }
    );
  }
}

