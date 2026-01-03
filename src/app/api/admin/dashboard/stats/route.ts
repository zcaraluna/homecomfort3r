import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Ventas del mes actual
    const ventasMesActual = await prisma.venta.aggregate({
      where: {
        fecha: {
          gte: startOfMonth,
        },
      },
      _sum: {
        montoVenta: true,
      },
      _count: {
        id: true,
      },
    });

    // Ventas del mes anterior
    const ventasMesAnterior = await prisma.venta.aggregate({
      where: {
        fecha: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        montoVenta: true,
      },
    });

    // Compras del mes actual
    const comprasMesActual = await prisma.compra.aggregate({
      where: {
        fechaCompra: {
          gte: startOfMonth,
        },
      },
      _sum: {
        montoCompra: true,
      },
      _count: {
        id: true,
      },
    });

    // Compras del mes anterior
    const comprasMesAnterior = await prisma.compra.aggregate({
      where: {
        fechaCompra: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        montoCompra: true,
      },
    });

    // Productos activos
    const productosActivos = await prisma.producto.count({
      where: {
        activo: true,
      },
    });

    // Clientes activos
    const clientesActivos = await prisma.cliente.count({
      where: {
        activo: true,
      },
    });

    // Calcular tendencias
    const ventasActual = Number(ventasMesActual._sum.montoVenta || 0);
    const ventasAnterior = Number(ventasMesAnterior._sum.montoVenta || 0);
    const ventasTrend = ventasAnterior > 0
      ? ((ventasActual - ventasAnterior) / ventasAnterior) * 100
      : 0;

    const comprasActual = Number(comprasMesActual._sum.montoCompra || 0);
    const comprasAnterior = Number(comprasMesAnterior._sum.montoCompra || 0);
    const comprasTrend = comprasAnterior > 0
      ? ((comprasActual - comprasAnterior) / comprasAnterior) * 100
      : 0;

    // Saldos pendientes
    const saldoCompras = await prisma.compra.aggregate({
      _sum: {
        saldoCompra: true,
      },
    });

    const saldoVentas = await prisma.venta.aggregate({
      _sum: {
        saldoVenta: true,
      },
    });

    // Productos con stock bajo (menos de 10 unidades)
    const productosStockBajo = await prisma.producto.count({
      where: {
        activo: true,
        stock: {
          lt: 10,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ventas: {
          total: ventasActual,
          cantidad: ventasMesActual._count.id,
          trend: ventasTrend,
        },
        compras: {
          total: comprasActual,
          cantidad: comprasMesActual._count.id,
          trend: comprasTrend,
        },
        productos: {
          activos: productosActivos,
          stockBajo: productosStockBajo,
        },
        clientes: {
          activos: clientesActivos,
        },
        saldos: {
          compras: Number(saldoCompras._sum.saldoCompra || 0),
          ventas: Number(saldoVentas._sum.saldoVenta || 0),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

