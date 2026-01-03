'use client';

import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@/icons';
import StatusBadge from '@/components/admin/StatusBadge';

interface Venta {
  id: string;
  numeroFactura: string;
  fecha: string;
  montoVenta: number;
  saldoVenta: number;
  cliente: { nombreCompleto: string };
  nombreCliente: string | null;
}

export default function VentasPage() {
  const router = useRouter();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ventas?limit=1000');
      const result = await response.json();
      if (result.success) {
        setVentas(result.data);
      }
    } catch (error) {
      console.error('Error fetching ventas:', error);
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

  const columns: Column<Venta>[] = [
    {
      header: 'Factura',
      accessor: 'numeroFactura',
    },
    {
      header: 'Cliente',
      accessor: (row) => row.cliente?.nombreCompleto || row.nombreCliente || '-',
    },
    {
      header: 'Fecha',
      accessor: (row) => new Date(row.fecha).toLocaleDateString('es-PY'),
    },
    {
      header: 'Monto Total',
      accessor: (row) => formatCurrency(Number(row.montoVenta)),
    },
    {
      header: 'Saldo Pendiente',
      accessor: (row) => (
        <span className={Number(row.saldoVenta) > 0 ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-green-600 dark:text-green-400'}>
          {formatCurrency(Number(row.saldoVenta))}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <StatusBadge
          status={Number(row.saldoVenta) > 0 ? 'Pendiente' : 'Cobrada'}
          variant={Number(row.saldoVenta) > 0 ? 'warning' : 'success'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ventas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Historial de ventas realizadas
          </p>
        </div>
        <button
          onClick={() => router.push('/administracion/ventas/nueva')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Venta
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando ventas...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={ventas}
          columns={columns}
          onView={(row) => router.push(`/administracion/ventas/${row.id}`)}
          searchable={true}
          searchPlaceholder="Buscar por factura o cliente..."
          pagination={true}
          pageSize={50}
        />
      )}
    </div>
  );
}

