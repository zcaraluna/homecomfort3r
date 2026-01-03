'use client';

import React, { useState, useEffect } from 'react';
import CardMetric from '@/components/admin/CardMetric';
import { ReceiptIcon } from '@/icons';

interface ReporteVentas {
  totalVentas: number;
  cantidadVentas: number;
  saldoPendiente: number;
  promedioVenta: number;
}

export default function ReporteVentasPage() {
  const [reporte, setReporte] = useState<ReporteVentas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReporte();
  }, []);

  const fetchReporte = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reportes/ventas');
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
          Reporte de Ventas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen de ventas del sistema
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
            title="Total Ventas"
            value={formatCurrency(reporte.totalVentas)}
            icon={<ReceiptIcon className="w-6 h-6 text-brand-500" />}
          />
          <CardMetric
            title="Cantidad de Ventas"
            value={reporte.cantidadVentas.toString()}
            icon={<ReceiptIcon className="w-6 h-6 text-brand-500" />}
          />
          <CardMetric
            title="Saldo Pendiente"
            value={formatCurrency(reporte.saldoPendiente)}
            icon={<ReceiptIcon className="w-6 h-6 text-brand-500" />}
          />
          <CardMetric
            title="Promedio por Venta"
            value={formatCurrency(reporte.promedioVenta)}
            icon={<ReceiptIcon className="w-6 h-6 text-brand-500" />}
          />
        </div>
      ) : null}
    </div>
  );
}

