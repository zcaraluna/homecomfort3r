'use client';

import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';

interface Existencia {
  id: string;
  cantidad: number;
  producto: { nombre: string; codigoProducto: number | null };
  sucursal: { nombre: string };
  deposito: { nombre: string };
}

export default function ExistenciasPage() {
  const [existencias, setExistencias] = useState<Existencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExistencias();
  }, []);

  const fetchExistencias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/existencias?limit=1000');
      const result = await response.json();
      if (result.success) {
        setExistencias(result.data);
      }
    } catch (error) {
      console.error('Error fetching existencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Existencia>[] = [
    {
      header: 'Producto',
      accessor: (row) => row.producto.nombre,
    },
    {
      header: 'Código',
      accessor: (row) => row.producto.codigoProducto || '-',
    },
    {
      header: 'Sucursal',
      accessor: (row) => row.sucursal.nombre,
    },
    {
      header: 'Depósito',
      accessor: (row) => row.deposito.nombre,
    },
    {
      header: 'Cantidad',
      accessor: (row) => (
        <span className={Number(row.cantidad) < 10 ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
          {Number(row.cantidad).toLocaleString('es-PY')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Existencias
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Stock por sucursal y depósito
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando existencias...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={existencias}
          columns={columns}
          searchable={true}
          searchPlaceholder="Buscar por producto..."
          pagination={true}
          pageSize={50}
        />
      )}
    </div>
  );
}

