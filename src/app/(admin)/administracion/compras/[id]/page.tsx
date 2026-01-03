'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeftIcon } from '@/icons';
import StatusBadge from '@/components/admin/StatusBadge';

interface CompraDetalle {
  id: string;
  comprobanteProveedor: string;
  fechaCompra: string;
  montoCompra: number;
  saldoCompra: number;
  proveedor: { nombre: string; ruc: string; telefono: string | null; correo: string | null };
  nombreProveedor: string | null;
  moneda: { nombre: string; simbolo: string };
  productos: Array<{
    id: string;
    codigoProducto: number | null;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
    deposito: { nombre: string };
  }>;
  gastos: Array<{
    id: string;
    nombreGasto: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
    deposito: { nombre: string };
  }>;
}

export default function CompraDetallePage() {
  const router = useRouter();
  const params = useParams();
  const [compra, setCompra] = useState<CompraDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCompra();
    }
  }, [params.id]);

  const fetchCompra = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/compras/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setCompra(result.data);
      }
    } catch (error) {
      console.error('Error fetching compra:', error);
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
      return date.toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando compra...</p>
        </div>
      </div>
    );
  }

  if (!compra) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Compra no encontrada</p>
          <button
            onClick={() => router.push('/administracion/compras')}
            className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            Volver a Compras
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/administracion/compras')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Compra: {compra.comprobanteProveedor}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detalle de la compra
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información General
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comprobante</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{compra.comprobanteProveedor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(compra.fechaCompra)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
              <StatusBadge
                status={Number(compra.saldoCompra) > 0 ? 'Pendiente' : 'Pagada'}
                variant={Number(compra.saldoCompra) > 0 ? 'warning' : 'success'}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Proveedor
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {compra.proveedor?.nombre || compra.nombreProveedor || '-'}
              </p>
            </div>
            {compra.proveedor?.ruc && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">RUC</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{compra.proveedor.ruc}</p>
              </div>
            )}
            {compra.proveedor?.telefono && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{compra.proveedor.telefono}</p>
              </div>
            )}
            {compra.proveedor?.correo && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{compra.proveedor.correo}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productos
        </h2>
        {compra.productos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Depósito</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Precio Unit.</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {compra.productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{producto.codigoProducto || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{producto.nombreProducto}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{producto.deposito.nombre}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{producto.cantidad.toLocaleString('es-PY')}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(Number(producto.precioUnitario))}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">{formatCurrency(Number(producto.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay productos registrados</p>
        )}
      </div>

      {compra.gastos.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Gastos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Gasto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Depósito</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Precio Unit.</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {compra.gastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{gasto.nombreGasto}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{gasto.deposito.nombre}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{gasto.cantidad.toLocaleString('es-PY')}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(Number(gasto.precioUnitario))}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">{formatCurrency(Number(gasto.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monto Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(Number(compra.montoCompra))}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Saldo Pendiente</p>
            <p className={`text-2xl font-bold ${Number(compra.saldoCompra) > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
              {formatCurrency(Number(compra.saldoCompra))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

