import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().min(1, 'Usuario o correo electrónico requerido'),
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

    // Si contiene @, intentar buscar como cliente por email
    if (email.includes('@')) {
      const cliente = await prisma.cliente.findUnique({
        where: { email },
      });

      if (cliente && cliente.activo) {
        // Verificar contraseña si existe
        if (cliente.password) {
          const isPasswordValid = await bcrypt.compare(password, cliente.password);
          if (isPasswordValid) {
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
          }
        }
      }
    }

    // Si no es email o no se encontró como cliente, intentar buscar como usuario por username
    const usuario = await prisma.usuario.findUnique({
      where: { username: email },
    });

    if (usuario && usuario.activo) {
      const isPasswordValid = await bcrypt.compare(password, usuario.password);
      if (isPasswordValid) {
        // Retornar como cliente (convertir usuario a formato cliente)
        return NextResponse.json(
          {
            success: true,
            cliente: {
              id: usuario.id,
              nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
              email: usuario.email || '',
              numeroCedula: usuario.numeroCedula || '',
              telefono1: usuario.telefono || '',
            },
          },
          { status: 200 }
        );
      }
    }

    // Si no se encontró ni como cliente ni como usuario
    return NextResponse.json(
      {
        success: false,
        error: 'Usuario o contraseña incorrectos',
      },
      { status: 401 }
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

