'use client';

import React, { createContext, useContext, useState } from 'react';

interface EnDesarrolloContextType {
  mostrar: boolean;
  mostrarAviso: (e: React.MouseEvent) => void;
  setMostrar: (value: boolean) => void;
}

const EnDesarrolloContext = createContext<EnDesarrolloContextType | undefined>(undefined);

export function EnDesarrolloProvider({ children }: { children: React.ReactNode }) {
  const [mostrar, setMostrar] = useState(false);

  const mostrarAviso = (e: React.MouseEvent) => {
    e.preventDefault();
    setMostrar(true);
    setTimeout(() => setMostrar(false), 3000);
  };

  return (
    <EnDesarrolloContext.Provider value={{ mostrar, mostrarAviso, setMostrar }}>
      {children}
    </EnDesarrolloContext.Provider>
  );
}

export function useEnDesarrollo() {
  const context = useContext(EnDesarrolloContext);
  if (!context) {
    throw new Error('useEnDesarrollo debe usarse dentro de EnDesarrolloProvider');
  }
  return context;
}

export function AvisoEnDesarrollo({ mostrar, onClose }: { mostrar: boolean; onClose: () => void }) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-brand-600 p-6 max-w-md w-full pointer-events-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            En Desarrollo
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Esta sección está en desarrollo. Pronto estará disponible.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AvisoEnDesarrolloGlobal() {
  const { mostrar, setMostrar } = useEnDesarrollo();
  return <AvisoEnDesarrollo mostrar={mostrar} onClose={() => setMostrar(false)} />;
}

