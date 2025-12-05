import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
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

    const { username, password } = validationResult.data;

    // Autenticar usuario
    const user = await authenticateUser({ username, password });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario o contraseña incorrectos',
        },
        { status: 401 }
      );
    }

    // Por ahora retornamos el usuario (luego agregaremos JWT/sesión)
    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

