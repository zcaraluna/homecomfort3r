'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Efecto para manejar la redirección cuando success es true
  useEffect(() => {
    if (success) {
      // Limpiar timer anterior si existe
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      
      // Redirigir después de 1.5 segundos
      redirectTimerRef.current = setTimeout(() => {
        window.location.href = '/administracion';
      }, 1500);
    }
    
    // Limpiar timer al desmontar
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [success]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos');
      return;
    }

    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const successLogin = await login(username, password);
      
      if (successLogin) {
        // Esperar un momento para asegurar que localStorage se actualizó
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Verificar que la sesión se guardó
        const sessionData = localStorage.getItem('user_session');
        if (sessionData) {
          // Establecer estados
          setIsLoading(false);
          // Forzar actualización del estado success
          setSuccess(true);
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
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 text-base font-semibold text-green-800 bg-green-100 border-2 border-green-400 rounded-lg dark:bg-green-900/40 dark:text-green-200 dark:border-green-500 shadow-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold">¡Login exitoso! Redirigiendo a administración en 1.5 segundos...</span>
                    </div>
                  </div>
                )}
                <div>
                  <Label>
                    Usuario <span className="text-error-500">*</span>
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
                    Contraseña <span className="text-error-500">*</span>
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
                  <Button 
                    className="w-full" 
                    size="sm" 
                    type="submit" 
                    disabled={isLoading || success}
                  >
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
