import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const [ventas, saldoTotal] = await Promise.all([
      prisma.venta.aggregate({
        _sum: {
          montoVenta: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.venta.aggregate({
        _sum: {
          saldoVenta: true,
        },
      }),
    ]);

    const totalVentas = Number(ventas._sum.montoVenta || 0);
    const cantidadVentas = ventas._count.id;
    const saldoPendiente = Number(saldoTotal._sum.saldoVenta || 0);
    const promedioVenta = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalVentas,
        cantidadVentas,
        saldoPendiente,
        promedioVenta,
      },
    });
  } catch (error: any) {
    console.error('Error fetching reporte ventas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener reporte' },
      { status: 500 }
    );
  }
}

