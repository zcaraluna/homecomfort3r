'use client';

import React, { useState, useEffect } from 'react';
import CardMetric from '@/components/admin/CardMetric';
import { ShoppingCartIcon } from '@/icons';

interface ReporteCompras {
  totalCompras: number;
  cantidadCompras: number;
  saldoPendiente: number;
  promedioCompra: number;
}

export default function ReporteComprasPage() {
  const [reporte, setReporte] = useState<ReporteCompras | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReporte();
  }, []);

  const fetchReporte = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reportes/compras');
      const result = await response.json();
      if (result.success) {
        setReporte(result.data);
      }
    } catch (error) {
      console.error('Error fetching reporte:', error);
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
          Reporte de Compras
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen de compras del sistema
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando reporte...</p>
          </div>
        </div>
      ) : reporte ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <CardMetric
            title="Total Compras"
            value={formatCurrency(reporte.totalCompras)}
            icon={<ShoppingCartIcon className="w-6 h-6 text-brand-500" />}
          />
          <CardMetric
            title="Cantidad de Compras"
            value={reporte.cantidadCompras.toString()}
            icon={<ShoppingCartIcon className="w-6 h-6 text-brand-500" />}
          />
          <CardMetric
            title="Saldo Pendiente"
            value={formatCurrency(reporte.saldoPendiente)}
            icon={<ShoppingCartIcon className="w-6 h-6 text-brand-500" />}
          />
          <CardMetric
            title="Promedio por Compra"
            value={formatCurrency(reporte.promedioCompra)}
            icon={<ShoppingCartIcon className="w-6 h-6 text-brand-500" />}
          />
        </div>
      ) : null}
    </div>
  );
}

