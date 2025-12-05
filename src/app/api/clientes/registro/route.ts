import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registroSchema = z.object({
  nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
  numeroCedula: z.string().min(1, 'El número de cédula es requerido'),
  telefono1: z.string().min(1, 'El teléfono es requerido'),
  telefono2: z.string().optional(),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  domicilio: z.string().optional(),
  ubicacionMaps: z.string().url('URL inválida').optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = registroSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || 'Datos inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verificar que el email no exista
    const existingEmail = await prisma.cliente.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'El email ya está registrado',
        },
        { status: 400 }
      );
    }

    // Verificar que la cédula no exista
    const existingCedula = await prisma.cliente.findUnique({
      where: { numeroCedula: data.numeroCedula },
    });

    if (existingCedula) {
      return NextResponse.json(
        {
          success: false,
          error: 'El número de cédula ya está registrado',
        },
        { status: 400 }
      );
    }

    // Obtener la sucursal seleccionada del localStorage (se enviará desde el cliente)
    const sucursalSeleccionada = body.sucursalSeleccionada || null;
    let sucursalId = null;

    if (sucursalSeleccionada) {
      const sucursal = await prisma.sucursal.findUnique({
        where: { slug: sucursalSeleccionada },
      });
      if (sucursal) {
        sucursalId = sucursal.id;
      }
    }

    // Hash de la contraseña (si se proporciona)
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;

    // Crear cliente
    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombreCompleto: data.nombreCompleto,
        numeroCedula: data.numeroCedula,
        telefono1: data.telefono1,
        telefono2: data.telefono2 || null,
        email: data.email,
        password: hashedPassword,
        domicilio: data.domicilio || null,
        ubicacionMaps: data.ubicacionMaps || null,
        sucursalId: sucursalId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        cliente: {
          id: nuevoCliente.id,
          nombreCompleto: nuevoCliente.nombreCompleto,
          email: nuevoCliente.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registrando cliente:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

