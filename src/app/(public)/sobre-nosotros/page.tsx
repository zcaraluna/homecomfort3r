'use client';

import React from 'react';

export default function SobreNosotrosPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Sobre Nosotros
      </h1>

      <div className="max-w-4xl mx-auto">
        {/* Sección Principal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">Placeholder</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestra Historia
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              HomeComfort3R nació con la visión de llevar los mejores electrodomésticos a los hogares paraguayos. 
              Fundada con el compromiso de ofrecer calidad, servicio y confianza, nos hemos convertido en una de las 
              tiendas más reconocidas del país.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Desde nuestros inicios, hemos trabajado incansablemente para establecer relaciones duraderas con nuestros 
              clientes, ofreciendo productos de las mejores marcas y un servicio al cliente excepcional. Nuestro equipo 
              está comprometido con la satisfacción de cada cliente que confía en nosotros.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Con dos sucursales estratégicamente ubicadas en el Departamento Central y Canindeyú, estamos cerca de ti 
              para brindarte la mejor experiencia de compra y el mejor servicio post-venta.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Calidad
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Productos de las mejores marcas con garantía oficial
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Confianza
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Años de experiencia sirviendo a familias paraguayas
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Servicio
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Atención personalizada y soporte post-venta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

