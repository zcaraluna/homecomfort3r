import { Rol } from '@prisma/client';

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
  departamentoId?: string | null;
  departamentoNombre?: string | null;
  oficinaId?: string | null;
  oficinaNombre?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: UserSession;
  error?: string;
}

