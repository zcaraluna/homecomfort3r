'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SUCURSALES = {
  central: {
    nombre: 'Sucursal Dpto. Central',
    slug: 'central',
  },
  canindeyu: {
    nombre: 'Sucursal Dpto. Canindeyú',
    slug: 'canindeyu',
  },
};

export default function SucursalSelector() {
  const [selectedSucursal, setSelectedSucursal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si ya hay una sucursal seleccionada en localStorage
    const savedSucursal = localStorage.getItem('sucursal_seleccionada');
    if (!savedSucursal) {
      setShowModal(true);
    }
  }, []);

  const handleSelectSucursal = (slug: string) => {
    setSelectedSucursal(slug);
    localStorage.setItem('sucursal_seleccionada', slug);
    setShowModal(false);
    // Opcional: enviar estadística al backend
    // fetch('/api/estadisticas/sucursal', { method: 'POST', body: JSON.stringify({ sucursal: slug }) });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido a HomeComfort3R
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Por favor, selecciona la sucursal que te interesa para una mejor experiencia:
        </p>
        
        <div className="space-y-3">
          {Object.entries(SUCURSALES).map(([key, sucursal]) => (
            <button
              key={key}
              onClick={() => handleSelectSucursal(sucursal.slug)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedSucursal === sucursal.slug
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {sucursal.nombre}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Esta información nos ayuda a mejorar nuestro servicio
        </p>
      </div>
    </div>
  );
}

