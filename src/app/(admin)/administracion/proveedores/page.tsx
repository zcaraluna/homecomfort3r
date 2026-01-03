'use client';

import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { PlusIcon } from '@/icons';
import StatusBadge from '@/components/admin/StatusBadge';

interface Proveedor {
  id: string;
  codigoProveedor: number;
  nombre: string;
  nombreComercial: string;
  ruc: string;
  telefono: string | null;
  correo: string | null;
  activo: boolean;
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/proveedores?limit=1000');
      const result = await response.json();
      if (result.success) {
        setProveedores(result.data);
      }
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProveedor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setIsModalOpen(true);
  };

  const handleDelete = async (proveedor: Proveedor) => {
    if (!confirm(`¿Estás seguro de desactivar el proveedor "${proveedor.nombre}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/proveedores/${proveedor.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchProveedores();
      } else {
        alert(result.error || 'Error al desactivar proveedor');
      }
    } catch (error) {
      console.error('Error deleting proveedor:', error);
      alert('Error al desactivar proveedor');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const url = selectedProveedor
        ? `/api/proveedores/${selectedProveedor.id}`
        : '/api/proveedores';
      const method = selectedProveedor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        setSelectedProveedor(null);
        fetchProveedores();
      } else {
        alert(result.error || 'Error al guardar proveedor');
      }
    } catch (error) {
      console.error('Error saving proveedor:', error);
      alert('Error al guardar proveedor');
    }
  };

  const columns: Column<Proveedor>[] = [
    {
      header: 'Código',
      accessor: 'codigoProveedor',
      sortable: true,
    },
    {
      header: 'Nombre',
      accessor: 'nombre',
      sortable: true,
    },
    {
      header: 'Nombre Comercial',
      accessor: 'nombreComercial',
    },
    {
      header: 'RUC',
      accessor: 'ruc',
    },
    {
      header: 'Teléfono',
      accessor: (row) => row.telefono || '-',
    },
    {
      header: 'Email',
      accessor: (row) => row.correo || '-',
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <StatusBadge
          status={row.activo ? 'Activo' : 'Inactivo'}
          variant={row.activo ? 'success' : 'default'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Proveedores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus proveedores
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando proveedores...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={proveedores}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={true}
          searchPlaceholder="Buscar por nombre, RUC..."
          pagination={true}
          pageSize={50}
        />
      )}

      {isModalOpen && (
        <ProveedorFormModal
          proveedor={selectedProveedor}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProveedor(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ProveedorFormModal({
  proveedor,
  onClose,
  onSave,
}: {
  proveedor: Proveedor | null;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    codigoProveedor: proveedor?.codigoProveedor || 0,
    nombre: proveedor?.nombre || '',
    nombreComercial: proveedor?.nombreComercial || '',
    ruc: proveedor?.ruc || '',
    ci: '',
    direccion: '',
    correo: proveedor?.correo || '',
    web: '',
    telefono: proveedor?.telefono || '',
    activo: proveedor?.activo ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      title={proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="proveedor-form"
            disabled={saving}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }
    >
      <form id="proveedor-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código Proveedor *
            </label>
            <input
              type="number"
              required
              value={formData.codigoProveedor}
              onChange={(e) => setFormData({ ...formData, codigoProveedor: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RUC *
            </label>
            <input
              type="text"
              required
              value={formData.ruc}
              onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Comercial *
            </label>
            <input
              type="text"
              required
              value={formData.nombreComercial}
              onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="activo" className="text-sm text-gray-700 dark:text-gray-300">
              Activo
            </label>
          </div>
        </div>
      </form>
    </FormModal>
  );
}

