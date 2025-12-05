'use client';

import React from 'react';
import Link from 'next/link';

const SUCURSALES = [
  {
    slug: 'central',
    nombre: 'Sucursal Dpto. Central',
    direccion: 'Rojas Cañada, Capiatá',
    telefono: '+595 21 123 456',
    whatsapp: '595981000000',
    email: 'central@homecomfort3r.com.py',
    ubicacionMaps: 'https://www.google.com/maps/embed?pb=...', // Reemplazar con URL real
  },
  {
    slug: 'canindeyu',
    nombre: 'Sucursal Dpto. Canindeyú',
    direccion: 'Nombre de calle, Ybyrarobana',
    telefono: '+595 61 789 012',
    whatsapp: '595981000001',
    email: 'canindeyu@homecomfort3r.com.py',
    ubicacionMaps: 'https://www.google.com/maps/embed?pb=...', // Reemplazar con URL real
  },
];

export default function SucursalesPage() {
  const handleWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Nuestras Sucursales
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {SUCURSALES.map((sucursal) => (
          <div
            key={sucursal.slug}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">Placeholder</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {sucursal.nombre}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{sucursal.direccion}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{sucursal.telefono}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{sucursal.email}</span>
                </div>
              </div>

              <div className="mb-6">
                <iframe
                  src={sucursal.ubicacionMaps}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/sucursales/${sucursal.slug}`}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-center"
                >
                  Ver Detalles
                </Link>
                <button
                  onClick={() => handleWhatsApp(sucursal.whatsapp)}
                  className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

