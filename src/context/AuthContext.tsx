'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/types/auth';

interface AuthContextType {
  user: UserSession | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionData = localStorage.getItem('user_session');
      if (sessionData) {
        const parsedUser = JSON.parse(sessionData);
        // Verificar que la sesión no haya expirado (24 horas)
        const sessionTime = localStorage.getItem('session_time');
        if (sessionTime) {
          const timeDiff = Date.now() - parseInt(sessionTime);
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          if (hoursDiff < 24) {
            setUser(parsedUser);
          } else {
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext: Iniciando login para:', username);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('AuthContext: Respuesta recibida, status:', response.status);
      
      if (!response.ok) {
        console.log('AuthContext: Respuesta no OK');
        return false;
      }

      const data = await response.json();
      console.log('AuthContext: Datos recibidos:', data);

      if (data.success && data.user) {
        console.log('AuthContext: Login exitoso, guardando usuario');
        setUser(data.user);
        localStorage.setItem('user_session', JSON.stringify(data.user));
        localStorage.setItem('session_time', Date.now().toString());
        console.log('AuthContext: Usuario guardado, retornando true');
        return true;
      }

      console.log('AuthContext: Login fallido, data.success:', data.success, 'data.user:', data.user);
      return false;
    } catch (error) {
      console.error('AuthContext: Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('session_time');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

