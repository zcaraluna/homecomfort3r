"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { getRolLabel } from "@/lib/roles";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Sección de encabezado con avatar */}
      <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:gap-6">
        <div className="w-24 h-24 overflow-hidden border-2 border-gray-200 rounded-full dark:border-gray-800 bg-brand-500 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl font-bold text-white">
            {user.nombre.charAt(0)}{user.apellido.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">
            {user.nombre} {user.apellido}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {user.grado && (
              <span>{user.grado}</span>
            )}
          </div>
        </div>
      </div>

      {/* Información detallada */}
      <div>
        <h5 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
          Información Personal
        </h5>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              Nombre
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.nombre}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              Apellido
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.apellido}
            </p>
          </div>

          {user.grado && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                Grado
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.grado}
              </p>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              Rol
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {getRolLabel(user.rol)}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              Número de Cédula
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.numeroCedula || "No registrado"}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              Número de Credencial
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.numeroCredencial || "No registrado"}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              Usuario
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.username}
            </p>
          </div>

          {user.email && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                Correo Electrónico
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
          )}

          {user.telefono && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                Teléfono
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.telefono}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
