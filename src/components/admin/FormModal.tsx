'use client';

import React, { ReactNode, useEffect } from 'react';
import { CloseIcon } from '@/icons';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}: FormModalProps) {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar el valor actual del overflow
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Deshabilitar scroll
      document.body.style.overflow = 'hidden';
      // Restaurar cuando el componente se desmonte o el modal se cierre
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 999999 }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={onClose}
        style={{ zIndex: 999998 }}
      />

      {/* Modal */}
      <div className="relative flex min-h-full items-center justify-center p-4" style={{ zIndex: 999999 }}>
        <div
          className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

