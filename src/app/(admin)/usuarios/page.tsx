'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Rol } from '@prisma/client';
import { getRolLabel } from '@/lib/roles';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';

export default function CrearUsuarioPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    grado: '',
    numeroCedula: '',
    numeroCredencial: '',
    email: '',
    telefono: '',
    rol: Rol.OPERADOR,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
      return;
    }

    // Verificar que sea ADMIN
    if (user && user.rol !== Rol.ADMIN) {
      router.push('/');
      return;
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        email: formData.email || undefined,
        telefono: formData.telefono || undefined,
        grado: formData.grado || undefined,
        numeroCedula: formData.numeroCedula || undefined,
        numeroCredencial: formData.numeroCredencial || undefined,
      };

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el usuario');
      }

      setSuccess(true);
      // Limpiar formulario
      setFormData({
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        grado: '',
        numeroCedula: '',
        numeroCredencial: '',
        email: '',
        telefono: '',
        rol: Rol.OPERADOR,
      });

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al crear el usuario. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user.rol !== Rol.ADMIN) {
    return null;
  }

  const rolOptions = Object.values(Rol).map((rol) => ({
    value: rol,
    label: getRolLabel(rol),
  }));

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Crear Nuevo Usuario
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete el formulario para crear un nuevo usuario en el sistema
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              Usuario creado exitosamente
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Usuario *</Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre de usuario"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Ingrese la contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ingrese el apellido"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="grado">Grado</Label>
                  <Input
                    type="text"
                    id="grado"
                    name="grado"
                    value={formData.grado}
                    onChange={handleChange}
                    placeholder="Ej: Oficial, Suboficial"
                  />
                </div>

                <div>
                  <Label htmlFor="rol">Rol *</Label>
                  <Select
                    options={rolOptions}
                    placeholder="Seleccione un rol"
                    defaultValue={formData.rol}
                    onChange={(value) => handleSelectChange('rol', value)}
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+595 981 000000"
                  />
                </div>
              </div>
            </div>

            {/* Información de Identificación */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Información de Identificación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numeroCedula">Número de Cédula</Label>
                  <Input
                    type="text"
                    id="numeroCedula"
                    name="numeroCedula"
                    value={formData.numeroCedula}
                    onChange={handleChange}
                    placeholder="Ingrese el número de cédula"
                  />
                </div>

                <div>
                  <Label htmlFor="numeroCredencial">Número de Credencial</Label>
                  <Input
                    type="text"
                    id="numeroCredencial"
                    name="numeroCredencial"
                    value={formData.numeroCredencial}
                    onChange={handleChange}
                    placeholder="Ingrese el número de credencial"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Usuario'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/')}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
