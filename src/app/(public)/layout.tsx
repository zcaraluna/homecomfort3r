'use client';

import React from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      <WhatsAppFloat />
    </div>
  );
}

