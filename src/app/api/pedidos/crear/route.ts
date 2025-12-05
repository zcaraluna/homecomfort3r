import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { MetodoPago } from '@prisma/client';

const crearPedidoSchema = z.object({
  items: z.array(
    z.object({
      productoId: z.string(),
      cantidad: z.number().min(1),
      precio: z.number(),
    })
  ),
  metodoPago: z.nativeEnum(MetodoPago),
  direccionEntrega: z.string().optional(),
  notas: z.string().optional(),
  sucursalSlug: z.string(),
  // Datos de contacto para compras como invitado
  nombreCompleto: z.string().optional(),
  numeroDocumento: z.string().optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = crearPedidoSchema.safeParse(body);
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

    // Obtener sucursal
    const sucursal = await prisma.sucursal.findUnique({
      where: { slug: data.sucursalSlug },
    });

    if (!sucursal) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sucursal no encontrada',
        },
        { status: 400 }
      );
    }

    // Obtener cliente de la sesión desde el header (opcional)
    const clienteId = request.headers.get('x-cliente-id');
    let cliente = null;

    if (clienteId) {
      // Si hay clienteId, verificar que existe y está activo
      cliente = await prisma.cliente.findUnique({
        where: { id: clienteId },
      });

      if (!cliente || !cliente.activo) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cliente no encontrado o inactivo',
          },
          { status: 401 }
        );
      }
    } else {
      // Compra como invitado - validar que se proporcionen datos de contacto
      if (!data.nombreCompleto || !data.numeroDocumento || !data.email || !data.telefono) {
        return NextResponse.json(
          {
            success: false,
            error: 'Para compras como invitado, debes proporcionar nombre completo, número de documento, email y teléfono',
          },
          { status: 400 }
        );
      }
    }

    // Validar que los productos existan
    const productoIds = data.items.map((item) => item.productoId);
    const productosExistentes = await prisma.producto.findMany({
      where: {
        id: { in: productoIds },
      },
    });

    if (productosExistentes.length !== productoIds.length) {
      const productosNoEncontrados = productoIds.filter(
        (id) => !productosExistentes.some((p) => p.id === id)
      );
      return NextResponse.json(
        {
          success: false,
          error: `Los siguientes productos no existen: ${productosNoEncontrados.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generar número de pedido
    const numeroPedido = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calcular total
    const total = data.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Crear pedido
    const pedido = await prisma.pedido.create({
      data: {
        numeroPedido,
        metodoPago: data.metodoPago,
        total,
        direccionEntrega: data.direccionEntrega || null,
        notas: data.notas || null,
        sucursalId: sucursal.id,
        clienteId: cliente?.id || null,
        // Datos de contacto para invitados
        nombreCompleto: cliente ? null : data.nombreCompleto || null,
        numeroDocumento: cliente ? null : data.numeroDocumento || null,
        email: cliente ? null : data.email || null,
        telefono: cliente ? null : data.telefono || null,
        items: {
          create: data.items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
        },
      },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        pedido: {
          id: pedido.id,
          numeroPedido: pedido.numeroPedido,
          total: pedido.total,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando pedido:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

