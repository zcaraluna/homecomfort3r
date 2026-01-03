'use client';

import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@/icons';
import StatusBadge from '@/components/admin/StatusBadge';

interface Compra {
  id: string;
  comprobanteProveedor: string;
  fechaCompra: string;
  montoCompra: number;
  saldoCompra: number;
  proveedor: { nombre: string };
  nombreProveedor: string | null;
}

export default function ComprasPage() {
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/compras?limit=1000');
      const result = await response.json();
      if (result.success) {
        setCompras(result.data);
      }
    } catch (error) {
      console.error('Error fetching compras:', error);
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

  const columns: Column<Compra>[] = [
    {
      header: 'Comprobante',
      accessor: 'comprobanteProveedor',
    },
    {
      header: 'Proveedor',
      accessor: (row) => row.proveedor?.nombre || row.nombreProveedor || '-',
    },
    {
      header: 'Fecha',
      accessor: (row) => new Date(row.fechaCompra).toLocaleDateString('es-PY'),
    },
    {
      header: 'Monto Total',
      accessor: (row) => formatCurrency(Number(row.montoCompra)),
    },
    {
      header: 'Saldo Pendiente',
      accessor: (row) => (
        <span className={Number(row.saldoCompra) > 0 ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-green-600 dark:text-green-400'}>
          {formatCurrency(Number(row.saldoCompra))}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <StatusBadge
          status={Number(row.saldoCompra) > 0 ? 'Pendiente' : 'Pagada'}
          variant={Number(row.saldoCompra) > 0 ? 'warning' : 'success'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Compras
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Historial de compras realizadas
          </p>
        </div>
        <button
          onClick={() => router.push('/compras/nueva')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Compra
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando compras...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={compras}
          columns={columns}
          onView={(row) => router.push(`/compras/${row.id}`)}
          searchable={true}
          searchPlaceholder="Buscar por comprobante o proveedor..."
          pagination={true}
          pageSize={50}
        />
      )}
    </div>
  );
}

