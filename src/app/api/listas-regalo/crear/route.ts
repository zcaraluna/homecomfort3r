import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const crearListaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  items: z.array(
    z.object({
      productoId: z.string(),
      cantidad: z.number().min(1),
    })
  ).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = crearListaSchema.safeParse(body);
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

    // Generar slug único usando UUID (más corto y único)
    // Formato: primeros 8 caracteres del UUID + timestamp
    const uuid = randomUUID();
    const shortId = uuid.replace(/-/g, '').substring(0, 8);
    const timestamp = Date.now().toString(36);
    const slug = `${shortId}-${timestamp}`;

    // Obtener cliente de la sesión desde el header
    const clienteId = request.headers.get('x-cliente-id');

    if (!clienteId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debes iniciar sesión para crear una lista de regalos',
        },
        { status: 401 }
      );
    }

    // Verificar que el cliente existe y está activo
    const cliente = await prisma.cliente.findUnique({
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

    // Validar que los productos existan si se proporcionan items
    if (data.items && data.items.length > 0) {
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
    }

    // Crear la lista de regalos
    const lista = await prisma.listaRegalo.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        slug,
        clienteId: cliente.id,
        items: data.items && data.items.length > 0
          ? {
              create: data.items.map((item) => ({
                productoId: item.productoId,
                cantidad: item.cantidad,
              })),
            }
          : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        lista: {
          id: lista.id,
          nombre: lista.nombre,
          slug: lista.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando lista de regalos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

