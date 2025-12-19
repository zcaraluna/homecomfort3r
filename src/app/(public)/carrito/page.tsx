'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCliente } from '@/context/ClienteContext';
import Button from '@/components/ui/button/Button';

export default function CarritoPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const { isAuthenticated } = useCliente();
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [listaNombre, setListaNombre] = useState('');
  const [listaDescripcion, setListaDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fromListaRegalos, setFromListaRegalos] = useState(false);

  // Verificar si viene de lista de regalos
  useEffect(() => {
    const fromLista = sessionStorage.getItem('from_lista_regalos');
    if (fromLista === 'true') {
      setFromListaRegalos(true);
      sessionStorage.removeItem('from_lista_regalos');
    }
  }, []);

  const formatearPrecio = (precio: number) => {
    const formatter = new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    });
    return formatter.format(precio).replace(/,/g, '.');
  };

  if (items.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-lg mx-auto text-center">
              <div className="mb-10">
                <div className="w-40 h-40 mx-auto bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tu carrito está vacío
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10">
                Agrega productos para comenzar tu compra
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center justify-center px-10 py-4 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors text-lg"
              >
                Ver Productos
            </Link>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Carrito
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
            >
              Vaciar todo
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => {
                const precio = item.precioOferta || item.precio;
                const precioUnitario = precio;
                const precioTotal = precio * item.cantidad;
                return (
                  <div key={item.productoId} className="p-6">
                    <div className="flex gap-6">
                      {/* Imagen del producto */}
                      <div className="relative w-36 h-36 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                        {item.imagen ? (
                          <Image
                            src={item.imagen}
                            alt={item.nombre}
                            fill
                            className="object-cover"
                            sizes="144px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-gray-300 dark:text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {item.nombre}
                            </h3>
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatearPrecio(precioUnitario)}
                              </span>
                              {item.precioOferta && (
                                <span className="text-base text-gray-400 dark:text-gray-500 line-through">
                                  {formatearPrecio(item.precio)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productoId)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
                            title="Eliminar"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Controles y precio total */}
                        <div className="flex items-center justify-between">
                          {/* Controles de cantidad */}
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                              className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-400"
                              aria-label="Disminuir"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-16 text-center font-semibold text-gray-900 dark:text-white text-lg">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                              className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                              aria-label="Aumentar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          {/* Precio total */}
                          <div className="text-right">
                            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                              {formatearPrecio(precioTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
              {/* Header con fondo destacado */}
              <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-5">
                <h2 className="text-xl font-bold text-white">
                  Resumen del Pedido
                </h2>
                <p className="text-sm text-brand-100 mt-1">
                  {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
                </p>
              </div>

              {/* Contenido */}
              <div className="p-6">
                {/* Detalles de precio */}
                <div className="space-y-5 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      {formatearPrecio(getTotal())}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Envío
                      </span>
                    </div>
                    <span className="text-base font-bold text-green-600 dark:text-green-400">
                      Gratis
                    </span>
                  </div>

                  {/* Total destacado */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 -mx-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        Total a pagar
                      </span>
                      <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                        {formatearPrecio(getTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <button className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 active:bg-brand-800 transition-all duration-200 shadow-md hover:shadow-lg text-base">
                      Finalizar Compra
                    </button>
                  </Link>
                  
                  {!fromListaRegalos && (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push('/iniciar-sesion?redirect=/carrito');
                          return;
                        }
                        setShowCreateListModal(true);
                      }}
                      className="w-full px-4 py-3.5 bg-white dark:bg-gray-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                    >
                      Crear Lista de Regalos
                    </button>
                  )}
                  
                  <Link
                    href="/productos"
                    className="block text-center text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium py-3 text-sm"
                  >
                    ← Continuar comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Modal para crear lista de regalos */}
      {showCreateListModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowCreateListModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Crear Lista de Regalos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Convierte los productos de tu carrito en una lista de regalos compartible
              </p>

              {error && (
                <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Lista *
                  </label>
                  <input
                    type="text"
                    value={listaNombre}
                    onChange={(e) => setListaNombre(e.target.value)}
                    placeholder="Mi lista de cumpleaños"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    value={listaDescripcion}
                    onChange={(e) => setListaDescripcion(e.target.value)}
                    placeholder="Describe tu lista de regalos..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={async () => {
                      if (!listaNombre.trim()) {
                        setError('El nombre de la lista es requerido');
                        return;
                      }

                      setError('');
                      setLoading(true);

                      try {
                        const clienteSession = localStorage.getItem('cliente_session');
                        if (!clienteSession) {
                          throw new Error('No estás autenticado');
                        }

                        const cliente = JSON.parse(clienteSession);

                        const response = await fetch('/api/listas-regalo/crear', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'x-cliente-id': cliente.id,
                          },
                          body: JSON.stringify({
                            nombre: listaNombre,
                            descripcion: listaDescripcion || undefined,
                            items: items.map((item) => ({
                              productoId: item.productoId,
                              cantidad: item.cantidad,
                            })),
                          }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(data.error || 'Error al crear la lista');
                        }

                        // Limpiar carrito y redirigir
                        clearCart();
                        router.push(`/lista-regalos/${data.lista.slug}`);
                      } catch (err: unknown) {
                        const errorMessage = err instanceof Error ? err.message : 'Error al crear la lista';
                        setError(errorMessage);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="flex-1 bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 rounded-lg py-3 font-semibold"
                  >
                    {loading ? 'Creando...' : 'Crear Lista'}
                  </Button>
                  <Button
                    onClick={() => setShowCreateListModal(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
