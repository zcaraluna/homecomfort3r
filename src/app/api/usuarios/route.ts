import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Rol } from '@prisma/client';

// Esquema de validación para crear usuario
const createUserSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').max(50, 'El usuario no puede exceder 50 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  apellido: z.string().min(1, 'El apellido es requerido').max(100),
  grado: z.string().optional(),
  numeroCedula: z.string().optional(),
  numeroCredencial: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
  rol: z.nativeEnum(Rol),
});

export async function POST(request: NextRequest) {
  try {
    // TODO: Validar que el usuario sea ADMIN
    // Por ahora permitimos crear usuarios sin validación de sesión
    
    const body = await request.json();
    
    // Validar datos de entrada
    const validationResult = createUserSchema.safeParse(body);
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

    // Verificar que el username no exista
    const existingUser = await prisma.usuario.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre de usuario ya existe',
        },
        { status: 400 }
      );
    }

    // Verificar que número de cédula no exista (si se proporciona)
    if (data.numeroCedula) {
      const existingCedula = await prisma.usuario.findUnique({
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
    }

    // Verificar que número de credencial no exista (si se proporciona)
    if (data.numeroCredencial) {
      const existingCredencial = await prisma.usuario.findUnique({
        where: { numeroCredencial: data.numeroCredencial },
      });

      if (existingCredencial) {
        return NextResponse.json(
          {
            success: false,
            error: 'El número de credencial ya está registrado',
          },
          { status: 400 }
        );
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Preparar datos para crear usuario
    const usuarioData: any = {
      username: data.username,
      password: hashedPassword,
      nombre: data.nombre,
      apellido: data.apellido,
      rol: data.rol,
      grado: data.grado || null,
      numeroCedula: data.numeroCedula || null,
      numeroCredencial: data.numeroCredencial || null,
      email: data.email || null,
      telefono: data.telefono || null,
    };

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: usuarioData,
    });

    // Retornar usuario creado (sin contraseña)
    const { password, ...usuarioSinPassword } = nuevoUsuario;

    return NextResponse.json(
      {
        success: true,
        usuario: usuarioSinPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

// Obtener lista de usuarios
export async function GET(request: NextRequest) {
  try {
    // TODO: Validar que el usuario sea ADMIN
    // Por ahora permitimos obtener usuarios sin validación de sesión

    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Remover contraseñas de la respuesta
    const usuariosSinPassword = usuarios.map(({ password, ...usuario }) => usuario);

    return NextResponse.json(
      {
        success: true,
        usuarios: usuariosSinPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los usuarios',
      },
      { status: 500 }
    );
  }
}

