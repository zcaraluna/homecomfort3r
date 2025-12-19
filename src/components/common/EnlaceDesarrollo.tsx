'use client';

import React from 'react';
import Link from 'next/link';
import { useEnDesarrollo } from './EnDesarrollo';

interface EnlaceDesarrolloProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function EnlaceDesarrollo({ href, children, className, onClick, ...props }: EnlaceDesarrolloProps) {
  const { mostrarAviso } = useEnDesarrollo();

  // Permitir navegación solo a la raíz
  if (href === '/') {
    return (
      <Link href={href} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  // Para todos los demás enlaces, mostrar aviso
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    mostrarAviso(e);
    if (onClick) onClick();
  };

  return (
    <a
      href="#"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

