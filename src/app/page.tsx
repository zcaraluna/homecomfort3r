'use client';

import React from 'react';
import Image from 'next/image';
import EnlaceDesarrollo from '@/components/common/EnlaceDesarrollo';
import SucursalSelector from '@/components/public/SucursalSelector';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <SucursalSelector />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800 py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <Image
                  src="/images/logo/homecomfort3r.png"
                  alt="HomeComfort3R Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Bienvenido a HomeComfort3R
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Tu tienda de confianza para electrodomésticos en Paraguay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnlaceDesarrollo
                href="/productos"
                className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-semibold text-lg"
              >
                Ver Productos
              </EnlaceDesarrollo>
              <EnlaceDesarrollo
                href="/sucursales"
                className="px-8 py-3 border-2 border-brand-600 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors font-semibold text-lg"
              >
                Nuestras Sucursales
              </EnlaceDesarrollo>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Marcas */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nuestras Marcas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500">Placeholder</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Productos de las mejores marcas con garantía oficial
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Entrega a Domicilio
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Llevamos tus productos hasta la puerta de tu casa
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Mejores Precios
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ofertas especiales y promociones todos los días
              </p>
            </div>
          </div>
        </div>
      </section>
      <WhatsAppFloat />
      <PublicFooter />
    </>
  );
}

