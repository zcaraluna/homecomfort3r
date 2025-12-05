import { Rol } from '@prisma/client';

/**
 * Determina la ruta de redirección según el rol del usuario después del login
 */
export function getRedirectPathByRole(rol: Rol): string {
  // Todos los usuarios van directamente al dashboard
  return '/';
}

/**
 * Obtiene el label en español para un rol
 */
export function getRolLabel(rol: Rol): string {
  switch (rol) {
    case Rol.OPERADOR:
      return 'Operador';
    case Rol.SUPERVISOR_DEPARTAMENTAL:
      return 'Supervisor Departamental';
    case Rol.SUPERVISOR_REGIONAL:
      return 'Supervisor Regional';
    case Rol.SUPERVISOR_GENERAL:
      return 'Supervisor General';
    case Rol.ADMIN:
      return 'Administrador';
    default:
      return rol;
  }
}

