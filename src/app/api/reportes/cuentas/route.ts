import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const [saldosCompras, saldosVentas] = await Promise.all([
      prisma.compra.aggregate({
        _sum: {
          saldoCompra: true,
        },
      }),
      prisma.venta.aggregate({
        _sum: {
          saldoVenta: true,
        },
      }),
    ]);

    const saldoCompras = Number(saldosCompras._sum.saldoCompra || 0);
    const saldoVentas = Number(saldosVentas._sum.saldoVenta || 0);
    const totalPendiente = saldoCompras + saldoVentas;

    return NextResponse.json({
      success: true,
      data: {
        saldoCompras,
        saldoVentas,
        totalPendiente,
      },
    });
  } catch (error: any) {
    console.error('Error fetching estado cuentas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener estado de cuentas' },
      { status: 500 }
    );
  }
}

