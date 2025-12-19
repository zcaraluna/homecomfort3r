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
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-brand-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Contenido de texto */}
            <div className="text-center lg:text-center order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight">
                Bienvenido a <span className="text-brand-600 dark:text-brand-400">HomeComfort3R</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 lg:mb-8 max-w-2xl mx-auto">
                Tu tienda de confianza para electrodomésticos en Paraguay. Encuentra los mejores productos para tu hogar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EnlaceDesarrollo
                  href="/productos"
                  className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Ver Productos
                </EnlaceDesarrollo>
                <EnlaceDesarrollo
                  href="/sucursales"
                  className="px-6 py-3 border-2 border-brand-500 text-brand-500 dark:text-brand-400 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors font-semibold text-base"
                >
                  Nuestras Sucursales
                </EnlaceDesarrollo>
              </div>
            </div>
            
            {/* Logo/Imagen */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <Image
                  src="/images/logo/homecomfort3r.png"
                  alt="HomeComfort3R Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Marcas */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Nuestras Marcas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Trabajamos con las mejores marcas del mercado para ofrecerte calidad y confianza
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-full h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Marca {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ofrecemos el mejor servicio y productos de calidad para tu hogar
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Calidad Garantizada
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Productos de las mejores marcas con garantía oficial y servicio técnico especializado
              </p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Entrega a Domicilio
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Llevamos tus productos hasta la puerta de tu casa con instalación profesional incluida
              </p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Mejores Precios
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Ofertas especiales y promociones todos los días con planes de financiación flexibles
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

