'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroCedula: '',
    telefono1: '',
    telefono2: '',
    email: '',
    password: '',
    domicilio: '',
    ubicacionMaps: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/clientes/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          password: formData.password || undefined,
          telefono2: formData.telefono2 || undefined,
          domicilio: formData.domicilio || undefined,
          ubicacionMaps: formData.ubicacionMaps || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el cliente');
      }

      setSuccess(true);
      // Limpiar formulario
      setFormData({
        nombreCompleto: '',
        numeroCedula: '',
        telefono1: '',
        telefono2: '',
        email: '',
        password: '',
        domicilio: '',
        ubicacionMaps: '',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar. Por favor, intente nuevamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Regístrate para disfrutar de todas nuestras ofertas y servicios
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              ¡Registro exitoso! Ya puedes iniciar sesión.
            </div>
          )}

          {/* Botón de Google (en desarrollo) */}
          <div className="mb-6">
            <button
              type="button"
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 opacity-50 cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">
                En desarrollo
              </span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                O regístrate con email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
              <Input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <Label htmlFor="numeroCedula">Número de Cédula *</Label>
              <Input
                type="text"
                id="numeroCedula"
                name="numeroCedula"
                value={formData.numeroCedula}
                onChange={handleChange}
                placeholder="1234567"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono1">Teléfono 1 *</Label>
                <Input
                  type="tel"
                  id="telefono1"
                  name="telefono1"
                  value={formData.telefono1}
                  onChange={handleChange}
                  placeholder="+595 981 000000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono2">Teléfono 2 (Opcional)</Label>
                <Input
                  type="tel"
                  id="telefono2"
                  name="telefono2"
                  value={formData.telefono2}
                  onChange={handleChange}
                  placeholder="+595 981 000000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña (Opcional)</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Si no proporcionas una contraseña, podrás usar solo autenticación con Google
              </p>
            </div>

            <div>
              <Label htmlFor="domicilio">Domicilio</Label>
              <Input
                type="text"
                id="domicilio"
                name="domicilio"
                value={formData.domicilio}
                onChange={handleChange}
                placeholder="Dirección completa"
              />
            </div>

            <div>
              <Label htmlFor="ubicacionMaps">Ubicación en Google Maps</Label>
              <Input
                type="url"
                id="ubicacionMaps"
                name="ubicacionMaps"
                value={formData.ubicacionMaps}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Comparte el enlace de tu ubicación desde Google Maps para facilitar la entrega
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
              <Link
                href="/login"
                className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
              >
                Cancelar
              </Link>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/iniciar-sesion" className="text-brand-600 dark:text-brand-400 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

