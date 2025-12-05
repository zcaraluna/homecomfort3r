'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/ui/Toast';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioOferta: number | null;
  ofertaDia: boolean;
  ofertaSemana: boolean;
  ofertaMes: boolean;
  stock: number;
  imagen?: string | null;
  categoria: string;
  marca: string;
}

export default function ProductosPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroMarca, setFiltroMarca] = useState<string>('todos');
  const [ordenPrecio, setOrdenPrecio] = useState<string>('default');
  const [busqueda, setBusqueda] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState<string>('');

  const categorias = ['todos', 'Refrigeradores', 'Lavadoras', 'Microondas', 'Aires Acondicionados'];
  const marcas = ['todos', 'Samsung', 'LG', 'Whirlpool', 'Mabe'];

  useEffect(() => {
    cargarProductos();
  }, [filtroCategoria, filtroMarca, ordenPrecio, busqueda]);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroCategoria !== 'todos') {
        params.append('categoria', filtroCategoria.toLowerCase());
      }
      if (filtroMarca !== 'todos') {
        params.append('marca', filtroMarca.toLowerCase());
      }
      if (busqueda) {
        params.append('busqueda', busqueda);
      }
      if (ordenPrecio !== 'default') {
        params.append('orden', ordenPrecio);
      }

      const response = await fetch(`/api/productos?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProductos(data.productos);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    if (busqueda && !producto.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }
    return true;
  });

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (ordenPrecio === 'asc') {
      return (a.precioOferta || a.precio) - (b.precioOferta || b.precio);
    } else if (ordenPrecio === 'desc') {
      return (b.precioOferta || b.precio) - (a.precioOferta || a.precio);
    }
    return 0;
  });

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Nuestros Productos
      </h1>

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtro por Categoría */}
          <div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'todos' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Orden por Precio */}
          <div>
            <select
              value={ordenPrecio}
              onChange={(e) => setOrdenPrecio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="default">Ordenar por precio</option>
              <option value="asc">Menor a Mayor</option>
              <option value="desc">Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Filtro por Marca */}
        <div className="mt-4">
          <select
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
          >
            {marcas.map((marca) => (
              <option key={marca} value={marca}>
                {marca === 'todos' ? 'Todas las marcas' : marca}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosOrdenados.map((producto) => (
          <div
            key={producto.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-sm">Placeholder</span>
              {producto.ofertaDia && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Oferta del Día
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {producto.nombre}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                {producto.precioOferta ? (
                  <>
                    <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                      {formatearPrecio(producto.precioOferta)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatearPrecio(producto.precio)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatearPrecio(producto.precio)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToCart({
                      productoId: producto.id,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      precioOferta: producto.precioOferta,
                      imagen: producto.imagen || '',
                    });
                    setToastProduct(producto.nombre);
                    setShowToast(true);
                  }}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Agregar al Carrito
                </button>
                <Link
                  href={`/productos/${producto.id}`}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Ver
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {!loading && productosOrdenados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No se encontraron productos con los filtros seleccionados
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
  );
}

