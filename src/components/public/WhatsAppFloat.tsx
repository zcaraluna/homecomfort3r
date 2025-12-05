'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SUCURSALES = {
  central: {
    nombre: 'Sucursal Dpto. Central',
    whatsapp: '595981000000', // Reemplazar con número real
  },
  canindeyu: {
    nombre: 'Sucursal Dpto. Canindeyú',
    whatsapp: '595981000001', // Reemplazar con número real
  },
};

export default function WhatsAppFloat() {
  const [showSelector, setShowSelector] = useState(false);

  const handleWhatsAppClick = (whatsapp: string) => {
    const url = `https://wa.me/${whatsapp}`;
    window.open(url, '_blank');
    setShowSelector(false);
  };

  return (
    <>
      {/* Botón flotante de WhatsApp */}
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.08c0 1.792.413 3.476 1.158 5.022L0 24l8.98-2.1a11.807 11.807 0 003.07.404c5.554 0 10.089-4.535 10.089-10.09 0-2.735-1.08-5.31-3.036-7.265" />
        </svg>
      </button>

      {/* Selector de sucursal */}
      {showSelector && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setShowSelector(false)}
          />
          <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-[250px]">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Selecciona una sucursal
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleWhatsAppClick(SUCURSALES.central.whatsapp)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                {SUCURSALES.central.nombre}
              </button>
              <button
                onClick={() => handleWhatsAppClick(SUCURSALES.canindeyu.whatsapp)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                {SUCURSALES.canindeyu.nombre}
              </button>
            </div>
            <button
              onClick={() => setShowSelector(false)}
              className="mt-3 w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </>
  );
}

