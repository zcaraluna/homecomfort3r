import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ventaItemSchema = z.object({
  productoId: z.string().uuid(),
  cantidad: z.number().min(0.001),
  precioUnitario: z.number().min(0),
  iva: z.number().min(0),
  montoTotal: z.number().min(0),
});

const crearVentaSchema = z.object({
  clienteId: z.string().uuid(),
  numeroFactura: z.string().min(1, 'El número de factura es requerido'),
  tipoDocumento: z.string().optional(),
  condicion: z.string().optional(),
  fecha: z.string(),
  timbrado: z.string().optional(),
  timbradoVencimiento: z.string().optional().nullable(),
  fechaVencimiento: z.string().optional().nullable(),
  gravada10: z.number().min(0),
  iva10: z.number().min(0),
  gravada05: z.number().min(0).optional(),
  iva05: z.number().min(0).optional(),
  exenta: z.number().min(0).optional(),
  montoVenta: z.number().min(0),
  saldoVenta: z.number().min(0),
  numeroCuotas: z.number().int().min(1).max(60).optional().nullable(),
  porcentajeRecargoPorCuota: z.number().min(0).max(100).optional().nullable(),
  montoRecargo: z.number().min(0).optional().nullable(),
  montoConRecargo: z.number().min(0).optional().nullable(),
  valorCuota: z.number().min(0).optional().nullable(),
        items: z.array(ventaItemSchema),
        depositoId: z.string().uuid().optional(),
});

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = crearVentaSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || 'Datos inválidos',
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verificar que el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
    });

    if (!cliente) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Obtener moneda por defecto (Guaraníes)
    const moneda = await prisma.moneda.findUnique({
      where: { codigo: 'PYG' },
    });

    if (!moneda) {
      return NextResponse.json(
        { success: false, error: 'Moneda no encontrada' },
        { status: 500 }
      );
    }

    // Usar el número de factura proporcionado
    const numeroFactura = data.numeroFactura.trim();

    // Verificar que no existe ya una venta con este número
    const ventaExistente = await prisma.venta.findUnique({
      where: { numeroFactura },
    });

    if (ventaExistente) {
      return NextResponse.json(
        {
          success: false,
          error: `Ya existe una venta con el número de factura ${numeroFactura}. Por favor usa otro número.`,
        },
        { status: 400 }
      );
    }

    // Verificar stock de productos antes de crear la venta
    for (const item of data.items) {
      const producto = await prisma.producto.findUnique({
        where: { id: item.productoId },
      });

      if (!producto) {
        return NextResponse.json(
          { success: false, error: `Producto ${item.productoId} no encontrado` },
          { status: 404 }
        );
      }

      if (!producto.stockNegativo && producto.stock < item.cantidad) {
        return NextResponse.json(
          {
            success: false,
            error: `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // Crear la venta y sus items en una transacción
    const venta = await prisma.$transaction(async (tx) => {
      // Crear la venta
      const nuevaVenta = await tx.venta.create({
        data: {
          numeroFactura,
          tipoDocumento: data.tipoDocumento || 'FACTURA DE VENTA',
          condicion: data.condicion || 'CONTADO',
          fecha: new Date(data.fecha),
          timbrado: data.timbrado || '',
          timbradoVencimiento: data.timbradoVencimiento
            ? new Date(data.timbradoVencimiento)
            : null,
          fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
          clienteId: data.clienteId,
          nombreCliente: cliente.nombreCompleto,
          monedaId: moneda.id,
          gravada10: data.gravada10,
          iva10: data.iva10,
          gravada05: data.gravada05 || 0,
          iva05: data.iva05 || 0,
          exenta: data.exenta || 0,
          montoVenta: data.montoVenta,
          saldoVenta: data.saldoVenta,
          numeroCuotas: data.numeroCuotas,
          porcentajeRecargoPorCuota: data.porcentajeRecargoPorCuota,
          montoRecargo: data.montoRecargo,
          montoConRecargo: data.montoConRecargo,
          valorCuota: data.valorCuota,
        },
      });

      // Obtener depósito (por defecto CASA CENTRAL o el especificado)
      let deposito;
      if (data.depositoId) {
        deposito = await tx.deposito.findUnique({
          where: { id: data.depositoId },
        });
      } else {
        deposito = await tx.deposito.findUnique({
          where: { nombre: 'CASA CENTRAL' },
        });
      }

      if (!deposito) {
        throw new Error('Depósito no encontrado');
      }

      // Crear items de venta y actualizar stock
      for (const item of data.items) {
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId },
        });

        if (!producto) continue;

        // Crear item de venta
        await tx.ventaItem.create({
          data: {
            ventaId: nuevaVenta.id,
            productoId: item.productoId,
            codigoProducto: producto.codigoProducto,
            nombreProducto: producto.nombre,
            depositoId: deposito.id,
            cantidad: item.cantidad,
            iva: item.iva,
            precioUnitario: item.precioUnitario,
            montoTotal: item.montoTotal,
          },
        });

        // Actualizar stock del producto
        await tx.producto.update({
          where: { id: item.productoId },
          data: {
            stock: {
              decrement: item.cantidad,
            },
          },
        });

        // Actualizar existencia en depósito
        const existencia = await tx.existencia.findFirst({
          where: {
            productoId: item.productoId,
            depositoId: deposito.id,
          },
        });

        if (existencia) {
          await tx.existencia.update({
            where: { id: existencia.id },
            data: {
              cantidad: {
                decrement: item.cantidad,
              },
            },
          });
        }
      }

      return nuevaVenta;
    });

    return NextResponse.json({
      success: true,
      data: venta,
    });
  } catch (error: any) {
    console.error('Error creating venta:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al crear la venta',
      },
      { status: 500 }
    );
  }
}
