'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { useCliente } from '@/context/ClienteContext';

export default function CrearListaRegalosPage() {
  const router = useRouter();
  const { cliente, isLoading: clienteLoading, isAuthenticated } = useCliente();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [listaSlug, setListaSlug] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  useEffect(() => {
    if (!clienteLoading && !isAuthenticated) {
      // No redirigir automáticamente, mostrar mensaje
    }
  }, [clienteLoading, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated || !cliente) {
      setError('Debes iniciar sesión para crear una lista de regalos');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/listas-regalo/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cliente-id': cliente.id,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la lista');
      }

      setSuccess(true);
      setListaSlug(data.lista.slug);
    } catch (err: any) {
      setError(err.message || 'Error al crear la lista. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success && listaSlug) {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Lista Creada Exitosamente!
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Comparte este enlace con tus conocidos:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <code className="text-sm text-brand-600 dark:text-brand-400 break-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/lista-regalos/${listaSlug}` : `/lista-regalos/${listaSlug}`}
              </code>
            </div>
            <button
              onClick={() => {
                const url = `${window.location.origin}/lista-regalos/${listaSlug}`;
                navigator.clipboard.writeText(url);
                alert('Enlace copiado al portapapeles');
              }}
              className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Copiar Enlace
            </button>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push(`/lista-regalos/${listaSlug}`)}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              Ver Mi Lista
            </Button>
            <Button
              onClick={() => router.push('/productos')}
              className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Agregar Productos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (clienteLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Inicio de Sesión Requerido
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Para crear una lista de regalos, necesitas estar registrado e iniciar sesión en tu cuenta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/iniciar-sesion"
                className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-semibold"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="px-6 py-3 border-2 border-brand-600 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors font-semibold"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Crear Lista de Regalos
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nombre">Nombre de la Lista *</Label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Mi lista de cumpleaños"
                required
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe tu lista de regalos..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Lista'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/productos')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

