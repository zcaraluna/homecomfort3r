'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ClienteSession {
  id: string;
  nombreCompleto: string;
  email: string;
  numeroCedula: string;
  telefono1?: string;
}

interface ClienteContextType {
  cliente: ClienteSession | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export function ClienteProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<ClienteSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const sessionData = localStorage.getItem('cliente_session');
      if (sessionData) {
        const parsedCliente = JSON.parse(sessionData);
        setCliente(parsedCliente);
      }
    } catch (error) {
      console.error('Error verificando sesión de cliente:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/clientes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.cliente) {
        setCliente(data.cliente);
        localStorage.setItem('cliente_session', JSON.stringify(data.cliente));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login de cliente:', error);
      return false;
    }
  };

  const logout = () => {
    setCliente(null);
    localStorage.removeItem('cliente_session');
  };

  return (
    <ClienteContext.Provider
      value={{
        cliente,
        login,
        logout,
        isLoading,
        isAuthenticated: !!cliente,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}

export function useCliente() {
  const context = useContext(ClienteContext);
  if (context === undefined) {
    throw new Error('useCliente debe ser usado dentro de un ClienteProvider');
  }
  return context;
}

