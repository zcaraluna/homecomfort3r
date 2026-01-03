'use client';

import React, { useState, useEffect } from 'react';
import CardMetric from '@/components/admin/CardMetric';
import { DollarLineIcon } from '@/icons';

interface EstadoCuentas {
  saldoCompras: number;
  saldoVentas: number;
  totalPendiente: number;
}

export default function EstadoCuentasPage() {
  const [estado, setEstado] = useState<EstadoCuentas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstado();
  }, []);

  const fetchEstado = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reportes/cuentas');
      const result = await response.json();
      if (result.success) {
        setEstado(result.data);
      }
    } catch (error) {
      console.error('Error fetching estado:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Estado de Cuentas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Saldos pendientes de compras y ventas
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando estado...</p>
          </div>
        </div>
      ) : estado ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <CardMetric
            title="Compras por Pagar"
            value={formatCurrency(estado.saldoCompras)}
            icon={<DollarLineIcon className="w-6 h-6 text-orange-500" />}
          />
          <CardMetric
            title="Ventas por Cobrar"
            value={formatCurrency(estado.saldoVentas)}
            icon={<DollarLineIcon className="w-6 h-6 text-blue-500" />}
          />
          <CardMetric
            title="Total Pendiente"
            value={formatCurrency(estado.totalPendiente)}
            icon={<DollarLineIcon className="w-6 h-6 text-brand-500" />}
          />
        </div>
      ) : null}
    </div>
  );
}

