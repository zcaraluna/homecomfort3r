import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ClienteProvider } from '@/context/ClienteContext';
import { EnDesarrolloProvider, AvisoEnDesarrolloGlobal } from '@/components/common/EnDesarrollo';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Home Comfort 3R',
  description: 'Tu tienda de confianza para electrodomésticos en Paraguay',
  icons: {
    icon: '/images/logo/homecomfort3r.png',
    apple: '/images/logo/homecomfort3r.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
            <ClienteProvider>
              <CartProvider>
                <EnDesarrolloProvider>
                  <AvisoEnDesarrolloGlobal />
                  <SidebarProvider>{children}</SidebarProvider>
                </EnDesarrolloProvider>
              </CartProvider>
            </ClienteProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
