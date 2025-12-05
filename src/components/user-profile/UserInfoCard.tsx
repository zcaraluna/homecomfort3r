"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { getRolLabel } from "@/lib/roles";

export default function UserInfoCard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Información Personal
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Nombre
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.nombre}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Apellido
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.apellido}
            </p>
          </div>

          {user.grado && (
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Grado
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.grado}
              </p>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Rol
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {getRolLabel(user.rol)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Número de Cédula
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.numeroCedula || "No registrado"}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Número de Credencial
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.numeroCredencial || "No registrado"}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Usuario
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.username}
            </p>
          </div>

          {user.email && (
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Correo Electrónico
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
          )}

          {user.telefono && (
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Teléfono
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.telefono}
              </p>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Departamento
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.departamentoNombre}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Oficina
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.oficinaNombre}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
