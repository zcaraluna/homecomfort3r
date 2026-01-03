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
  tipoDocumento?: string | null;
  condicion?: string | null;
  timbrado?: string | null;
  gravada10?: number | null;
  iva10?: number | null;
  gravada05?: number | null;
  iva05?: number | null;
  exenta?: number | null;
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('es-PY');
    } catch {
      return '-';
    }
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
      accessor: (row) => formatDate(row.fecha),
    },
  ];

  const renderExpandedContent = (row: Venta) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
      <div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Monto Total</p>
        <p className="text-gray-900 dark:text-white font-semibold">{formatCurrency(Number(row.montoVenta))}</p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Saldo Pendiente</p>
        <p className={`font-semibold ${Number(row.saldoVenta) > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
          {formatCurrency(Number(row.saldoVenta))}
        </p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Estado</p>
        <StatusBadge
          status={Number(row.saldoVenta) > 0 ? 'Pendiente' : 'Cobrada'}
          variant={Number(row.saldoVenta) > 0 ? 'warning' : 'success'}
        />
      </div>
      {row.tipoDocumento && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Tipo Documento</p>
          <p className="text-gray-900 dark:text-white">{row.tipoDocumento}</p>
        </div>
      )}
      {row.condicion && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Condición</p>
          <p className="text-gray-900 dark:text-white">{row.condicion}</p>
        </div>
      )}
      {row.timbrado && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Timbrado</p>
          <p className="text-gray-900 dark:text-white">{row.timbrado}</p>
        </div>
      )}
      {(row.gravada10 || row.iva10) && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Gravada 10% / IVA 10%</p>
          <p className="text-gray-900 dark:text-white">
            {formatCurrency(Number(row.gravada10 || 0))} / {formatCurrency(Number(row.iva10 || 0))}
          </p>
        </div>
      )}
      {(row.gravada05 || row.iva05) && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Gravada 5% / IVA 5%</p>
          <p className="text-gray-900 dark:text-white">
            {formatCurrency(Number(row.gravada05 || 0))} / {formatCurrency(Number(row.iva05 || 0))}
          </p>
        </div>
      )}
      {row.exenta && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Exenta</p>
          <p className="text-gray-900 dark:text-white">{formatCurrency(Number(row.exenta))}</p>
        </div>
      )}
      <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-2">
        <button
          onClick={() => router.push(`/administracion/ventas/${row.id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Ver Detalles Completos
        </button>
      </div>
    </div>
  );

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
          expandable={true}
          renderExpandedContent={renderExpandedContent}
          searchable={true}
          searchPlaceholder="Buscar por factura o cliente..."
          pagination={true}
          pageSize={50}
        />
      )}
    </div>
  );
}
