'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Sucursal {
  nombre: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  email: string;
  ubicacionMaps: string;
  descripcion: string;
}

const SUCURSALES: Record<string, Sucursal> = {
  central: {
    nombre: 'Sucursal Dpto. Central',
    direccion: 'Rojas Cañada, Capiatá',
    telefono: '+595 21 123 456',
    whatsapp: '595981000000',
    email: 'central@homecomfort3r.com.py',
    ubicacionMaps: 'https://www.google.com/maps/embed?pb=...',
    descripcion: 'Nuestra sucursal principal ubicada en Capiatá, con amplio estacionamiento y fácil acceso.',
  },
  canindeyu: {
    nombre: 'Sucursal Dpto. Canindeyú',
    direccion: 'Nombre de calle, Ybyrarobana',
    telefono: '+595 61 789 012',
    whatsapp: '595981000001',
    email: 'canindeyu@homecomfort3r.com.py',
    ubicacionMaps: 'https://www.google.com/maps/embed?pb=...',
    descripcion: 'Sucursal estratégicamente ubicada en Ybyrarobana, ofreciendo los mejores electrodomésticos de la región.',
  },
};

export default function SucursalDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const sucursal = SUCURSALES[slug];

  if (!sucursal) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Sucursal no encontrada
        </h1>
        <Link href="/sucursales" className="text-brand-600 dark:text-brand-400 hover:underline">
          Volver a sucursales
        </Link>
      </div>
    );
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${sucursal.whatsapp}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/sucursales"
        className="text-brand-600 dark:text-brand-400 hover:underline mb-4 inline-block"
      >
        ← Volver a Sucursales
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {sucursal.nombre}
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Galería de Fotos */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 text-sm">Placeholder</span>
              </div>
            ))}
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Información de Contacto
          </h2>
          <div className="space-y-3">
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
          <button
            onClick={handleWhatsApp}
            className="mt-6 w-full px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.08c0 1.792.413 3.476 1.158 5.022L0 24l8.98-2.1a11.807 11.807 0 003.07.404c5.554 0 10.089-4.535 10.089-10.09 0-2.735-1.08-5.31-3.036-7.265" />
            </svg>
            Contactar por WhatsApp
          </button>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Sobre esta Sucursal
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{sucursal.descripcion}</p>
      </div>

      {/* Mapa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ubicación
        </h2>
        <iframe
          src={sucursal.ubicacionMaps}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

