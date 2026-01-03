'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getRolLabel } from "@/lib/roles";
import CardMetric from "@/components/admin/CardMetric";
import { DollarLineIcon, ShoppingCartIcon, BoxIcon, GroupIcon, ReceiptIcon } from "@/icons";

interface DashboardStats {
  ventas: {
    total: number;
    cantidad: number;
    trend: number;
  };
  compras: {
    total: number;
    cantidad: number;
    trend: number;
  };
  productos: {
    activos: number;
    stockBajo: number;
  };
  clientes: {
    activos: number;
  };
  saldos: {
    compras: number;
    ventas: number;
  };
}

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
          Bienvenido, {user.nombre} {user.apellido}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Panel de control del sistema
        </p>
      </div>

      {/* Métricas */}
      {loadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <CardMetric
            title="Ventas del Mes"
            value={formatCurrency(stats.ventas.total)}
            icon={<ReceiptIcon className="w-6 h-6 text-brand-500" />}
            trend={{
              value: Math.abs(stats.ventas.trend),
              isPositive: stats.ventas.trend >= 0,
              label: 'vs mes anterior',
            }}
            onClick={() => router.push('/ventas')}
          />
          <CardMetric
            title="Compras del Mes"
            value={formatCurrency(stats.compras.total)}
            icon={<ShoppingCartIcon className="w-6 h-6 text-brand-500" />}
            trend={{
              value: Math.abs(stats.compras.trend),
              isPositive: stats.compras.trend >= 0,
              label: 'vs mes anterior',
            }}
            onClick={() => router.push('/compras')}
          />
          <CardMetric
            title="Productos Activos"
            value={stats.productos.activos.toString()}
            icon={<BoxIcon className="w-6 h-6 text-brand-500" />}
            onClick={() => router.push('/productos')}
          />
          <CardMetric
            title="Clientes Activos"
            value={stats.clientes.activos.toString()}
            icon={<GroupIcon className="w-6 h-6 text-brand-500" />}
            onClick={() => router.push('/clientes')}
          />
        </div>
      ) : null}

      {/* Alertas y Resumen */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Saldos Pendientes */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Saldos Pendientes
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Compras por pagar
                </span>
                <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(stats.saldos.compras)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Ventas por cobrar
                </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(stats.saldos.ventas)}
                </span>
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Alertas
            </h2>
            <div className="space-y-3">
              {stats.productos.stockBajo > 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {stats.productos.stockBajo} productos con stock bajo
                  </span>
                </div>
              )}
              {stats.saldos.compras > 0 && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    Compras pendientes de pago
                  </span>
                </div>
              )}
              {stats.saldos.ventas > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    Ventas pendientes de cobro
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Información del Usuario */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información de Sesión
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Rol</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white/90 mt-1">
              {getRolLabel(user.rol)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Usuario</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white/90 mt-1">
              {user.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
