import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuario o correo electrónico requerido'),
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

    // Solo "admin" es usuario administrativo, el resto son clientes
    const isAdmin = username.toLowerCase() === 'admin';

    if (isAdmin) {
      // Intentar como usuario administrativo (solo para "admin")
      const usuario = await prisma.usuario.findUnique({
        where: { username: 'admin' },
      });

      if (usuario && usuario.activo) {
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (isPasswordValid) {
          // Actualizar último acceso
          await prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultimoAcceso: new Date() },
          });

          return NextResponse.json(
            {
              success: true,
              user: {
                id: usuario.id,
                username: usuario.username,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                grado: usuario.grado,
                numeroCedula: usuario.numeroCedula,
                numeroCredencial: usuario.numeroCredencial,
                email: usuario.email,
                telefono: usuario.telefono,
                rol: usuario.rol,
              },
              type: 'admin',
            },
            { status: 200 }
          );
        }
      }
    }

    // Intentar como cliente (por email o por username que no sea "admin")
    // Primero intentar por email si contiene @
    if (username.includes('@')) {
      const cliente = await prisma.cliente.findUnique({
        where: { email: username },
      });

      if (cliente && cliente.activo) {
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
                type: 'cliente',
              },
              { status: 200 }
            );
          }
        }
      }
    }

    // Si no es email, intentar buscar como usuario (user1, user2, etc.) y tratarlo como cliente
    if (!isAdmin) {
      const usuario = await prisma.usuario.findUnique({
        where: { username },
      });

      if (usuario && usuario.activo) {
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (isPasswordValid) {
          // Convertir usuario a formato cliente
          return NextResponse.json(
            {
              success: true,
              cliente: {
                id: usuario.id,
                nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
                email: usuario.email || `${usuario.username}@homecomfort3r.com`,
                numeroCedula: usuario.numeroCedula || '',
                telefono1: usuario.telefono || '',
              },
              type: 'cliente',
            },
            { status: 200 }
          );
        }
      }
    }

    // Si no se encontró ni como usuario ni como cliente
    return NextResponse.json(
      {
        success: false,
        error: 'Usuario o contraseña incorrectos',
      },
      { status: 401 }
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
