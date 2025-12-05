import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || 'Datos inválidos',
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Buscar cliente por email
    const cliente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (!cliente || !cliente.activo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email o contraseña incorrectos',
        },
        { status: 401 }
      );
    }

    // Verificar contraseña si existe
    if (cliente.password) {
      const isPasswordValid = await bcrypt.compare(password, cliente.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email o contraseña incorrectos',
          },
          { status: 401 }
        );
      }
    } else {
      // Si no tiene contraseña, solo verificar que el email exista
      // (para clientes registrados con Google OAuth)
    }

    return NextResponse.json(
      {
        success: true,
        cliente: {
          id: cliente.id,
          nombreCompleto: cliente.nombreCompleto,
          email: cliente.email,
          numeroCedula: cliente.numeroCedula,
          telefono1: cliente.telefono1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en login de cliente:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

