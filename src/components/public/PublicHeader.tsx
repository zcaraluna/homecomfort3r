'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCliente } from '@/context/ClienteContext';
import EnlaceDesarrollo from '@/components/common/EnlaceDesarrollo';
import CartIcon from './CartIcon';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, cliente, logout } = useCliente();

  const navItems = [
    { href: '/productos', label: 'Productos' },
    { href: '/sucursales', label: 'Sucursales' },
    { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-12 w-12 md:h-16 md:w-16">
              <Image
                src="/images/logo/homecomfort3r.png"
                alt="HomeComfort3R"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              HomeComfort3R
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <EnlaceDesarrollo
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                {item.label}
              </EnlaceDesarrollo>
            ))}
            <CartIcon />
            {isAuthenticated && cliente ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {cliente.nombreCompleto}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/registro"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                >
                  Registrarse
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <EnlaceDesarrollo
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                >
                  {item.label}
                </EnlaceDesarrollo>
              ))}
              {isAuthenticated && cliente ? (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300 px-4">
                    {cliente.nombreCompleto}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-center"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/registro"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium text-center"
                  >
                    Registrarse
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-center"
                  >
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

