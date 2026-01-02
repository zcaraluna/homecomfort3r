'use client';

import React, { useState } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const successLogin = await login(username, password);
      
      if (successLogin) {
        // Esperar un momento para que el contexto se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar que la sesión se guardó
        const sessionData = localStorage.getItem('user_session');
        if (sessionData) {
          setIsLoading(false);
          setSuccess(true);
          
          // Esperar 1.5 segundos mostrando el mensaje de éxito, luego redirigir
          setTimeout(() => {
            window.location.href = '/administracion';
          }, 1500);
        } else {
          setIsLoading(false);
          setError('Error al guardar la sesión. Por favor, intente nuevamente.');
        }
      } else {
        setIsLoading(false);
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingrese su usuario y contraseña para iniciar sesión
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 text-sm font-medium text-green-700 bg-green-50 border-2 border-green-300 rounded-lg dark:bg-green-900/30 dark:text-green-300 dark:border-green-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>¡Login exitoso! Redirigiendo a administración...</span>
                    </div>
                  </div>
                )}
                <div>
                  <Label>
                    Usuario <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    placeholder="Ingrese su usuario"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading || success}
                  />
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading || success}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit" disabled={isLoading || success}>
                    {isLoading ? 'Iniciando sesión...' : success ? '¡Éxito!' : 'Iniciar Sesión'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
