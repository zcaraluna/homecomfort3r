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
      {/* Backdrop sutil */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-200" />
      
      {/* Modal */}
      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 max-w-sm w-full pointer-events-auto transform transition-all duration-300 scale-100 opacity-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
            En Desarrollo
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
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

