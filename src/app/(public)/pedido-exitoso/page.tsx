'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';

function PedidoContent() {
  const searchParams = useSearchParams();
  const numeroPedido = searchParams.get('pedido');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Tu pedido ha sido procesado exitosamente
        </p>
        {numeroPedido && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            Número de pedido: <span className="font-semibold">{numeroPedido}</span>
          </p>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Te hemos enviado un correo electrónico con los detalles de tu pedido.
            Nuestro equipo se pondrá en contacto contigo pronto para coordinar la entrega.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Si tienes alguna pregunta, no dudes en contactarnos por WhatsApp.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/productos">
            <Button className="bg-brand-600 text-white hover:bg-brand-700">
              Seguir Comprando
            </Button>
          </Link>
          <Link href="/">
            <Button className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PedidoExitosoPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <PedidoContent />
    </Suspense>
  );
}

