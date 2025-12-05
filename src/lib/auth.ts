import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { Rol } from '@prisma/client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserSession {
  id: string;
  username: string;
  nombre: string;
  apellido: string;
  grado?: string | null;
  numeroCedula?: string | null;
  numeroCredencial?: string | null;
  email?: string | null;
  telefono?: string | null;
  rol: Rol;
}

/**
 * Autentica un usuario con username y password
 */
export async function authenticateUser(
  credentials: LoginCredentials
): Promise<UserSession | null> {
  try {
    // Buscar usuario por username
    const usuario = await prisma.usuario.findUnique({
      where: { username: credentials.username },
    });

    if (!usuario || !usuario.activo) {
      return null;
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(credentials.password, usuario.password);
    if (!isPasswordValid) {
      return null;
    }

    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() },
    });

    // Retornar datos de sesión
    return {
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
    };
  } catch (error) {
    console.error('Error en autenticación:', error);
    return null;
  }
}

/**
 * Obtiene un usuario por ID (para verificar sesión)
 */
export async function getUserById(userId: string): Promise<UserSession | null> {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario || !usuario.activo) {
      return null;
    }

    return {
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
    };
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
}

