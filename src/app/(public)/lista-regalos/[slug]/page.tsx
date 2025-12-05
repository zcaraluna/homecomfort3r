'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/button/Button';
import Toast from '@/components/ui/Toast';

export default function ListaRegalosPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const [lista, setLista] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState<string>('');

  useEffect(() => {
    // Cargar lista de regalos desde API
    fetch(`/api/listas-regalo/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLista(data.lista);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando lista...</p>
        </div>
      </div>
    );
  }

  if (!lista) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Lista no encontrada
          </h1>
          <Link href="/productos" className="text-brand-600 dark:text-brand-400 hover:underline">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {lista.nombre}
        </h1>
        {lista.descripcion && (
          <p className="text-gray-600 dark:text-gray-400 mb-8">{lista.descripcion}</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lista.items?.map((item: any) => {
            const cantidadRestante = item.cantidad - item.cantidadComprada;
            const producto = item.producto;
            const precio = producto.precioOferta ? Number(producto.precioOferta) : Number(producto.precio);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500 text-sm">Placeholder</span>
                  {cantidadRestante === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Ya comprado</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {producto.nombre}
                  </h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                      {formatearPrecio(precio)}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Solicitado: {item.cantidad}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Comprado: {item.cantidadComprada}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full"
                        style={{
                          width: `${(item.cantidadComprada / item.cantidad) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  {cantidadRestante > 0 && (
                    <Button
                      onClick={() => {
                        // Marcar que viene de lista de regalos
                        sessionStorage.setItem('from_lista_regalos', 'true');
                        addToCart({
                          productoId: producto.id,
                          nombre: producto.nombre,
                          precio: Number(producto.precio),
                          precioOferta: producto.precioOferta ? Number(producto.precioOferta) : null,
                          imagen: producto.imagen || '',
                        });
                        setToastProduct(producto.nombre);
                        setShowToast(true);
                      }}
                      className="w-full bg-brand-600 text-white hover:bg-brand-700"
                    >
                      Agregar al Carrito
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {lista.items?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Esta lista aún no tiene productos
            </p>
          </div>
        )}

        {showToast && (
          <Toast
            message={`${toastProduct} agregado al carrito`}
            type="success"
            onClose={() => setShowToast(false)}
            actions={[
              {
                label: 'Continuar Comprando',
                onClick: () => {},
                primary: false,
              },
              {
                label: 'Finalizar Pedido',
                onClick: () => router.push('/carrito'),
                primary: true,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

