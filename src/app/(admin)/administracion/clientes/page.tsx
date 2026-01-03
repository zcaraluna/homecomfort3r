'use client';

import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { PlusIcon } from '@/icons';
import StatusBadge from '@/components/admin/StatusBadge';
import SearchSelect from '@/components/admin/SearchSelect';

interface Cliente {
  id: string;
  nombreCompleto: string;
  numeroCedula: string;
  email: string;
  telefono1: string;
  ruc: string | null;
  codigoCliente: number | null;
  activo: boolean;
  listaPrecio: { nombre: string; id: string } | null;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [filterTemporales, setFilterTemporales] = useState<'all' | 'temporales' | 'no-temporales'>('all');
  const [listasPrecio, setListasPrecio] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchClientes();
    fetchListasPrecio();
  }, [filterTemporales]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('limit', '1000');
      if (filterTemporales === 'temporales') {
        params.append('temporales', 'true');
      } else if (filterTemporales === 'no-temporales') {
        params.append('temporales', 'false');
      }

      const response = await fetch(`/api/clientes?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setClientes(result.data);
      }
    } catch (error) {
      console.error('Error fetching clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchListasPrecio = async () => {
    try {
      const response = await fetch('/api/listas-precio');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setListasPrecio(result.data.map((lp: any) => ({ value: lp.id, label: lp.nombre })));
        }
      }
    } catch (error) {
      console.error('Error fetching listas precio:', error);
    }
  };

  const handleCreate = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    if (!confirm(`¿Estás seguro de desactivar el cliente "${cliente.nombreCompleto}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchClientes();
      } else {
        alert(result.error || 'Error al desactivar cliente');
      }
    } catch (error) {
      console.error('Error deleting cliente:', error);
      alert('Error al desactivar cliente');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const url = selectedCliente
        ? `/api/clientes/${selectedCliente.id}`
        : '/api/clientes';
      const method = selectedCliente ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        setSelectedCliente(null);
        fetchClientes();
      } else {
        alert(result.error || 'Error al guardar cliente');
      }
    } catch (error) {
      console.error('Error saving cliente:', error);
      alert('Error al guardar cliente');
    }
  };

  const isTemporal = (cliente: Cliente) => {
    return (
      cliente.nombreCompleto.startsWith('* ') ||
      cliente.email.includes('cliente_temp_') ||
      cliente.numeroCedula.startsWith('TEMP_')
    );
  };

  const columns: Column<Cliente>[] = [
    {
      header: 'Código',
      accessor: (row) => row.codigoCliente || '-',
    },
    {
      header: 'Nombre',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.nombreCompleto}</span>
          {isTemporal(row) && (
            <StatusBadge status="Temporal" variant="warning" />
          )}
        </div>
      ),
    },
    {
      header: 'Cédula/RUC',
      accessor: (row) => row.ruc || row.numeroCedula,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Teléfono',
      accessor: 'telefono1',
    },
    {
      header: 'Lista Precio',
      accessor: (row) => row.listaPrecio?.nombre || '-',
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
            Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus clientes
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filtrar:
        </label>
        <select
          value={filterTemporales}
          onChange={(e) => setFilterTemporales(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          <option value="all">Todos</option>
          <option value="temporales">Solo Temporales (*)</option>
          <option value="no-temporales">No Temporales</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando clientes...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={clientes}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={true}
          searchPlaceholder="Buscar por nombre, cédula, email..."
          pagination={true}
          pageSize={50}
        />
      )}

      {isModalOpen && (
        <ClienteFormModal
          cliente={selectedCliente}
          listasPrecio={listasPrecio}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCliente(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ClienteFormModal({
  cliente,
  listasPrecio,
  onClose,
  onSave,
}: {
  cliente: Cliente | null;
  listasPrecio: { value: string; label: string }[];
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    nombreCompleto: cliente?.nombreCompleto.replace(/^\* /, '') || '',
    numeroCedula: cliente?.numeroCedula.replace(/^TEMP_/, '') || '',
    email: cliente?.email.replace(/cliente_temp_\d+@migrado\.local/, '') || '',
    telefono1: cliente?.telefono1 || '',
    telefono2: '',
    domicilio: '',
    nombreComercial: '',
    ruc: cliente?.ruc || '',
    listaPrecioId: cliente?.listaPrecio?.id || '',
    condicion: 'CONTADO',
    activo: cliente?.activo ?? true,
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
      title={cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
      size="lg"
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
            form="cliente-form"
            disabled={saving}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }
    >
      <form id="cliente-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={formData.nombreCompleto}
              onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cédula *
            </label>
            <input
              type="text"
              required
              value={formData.numeroCedula}
              onChange={(e) => setFormData({ ...formData, numeroCedula: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RUC
            </label>
            <input
              type="text"
              value={formData.ruc}
              onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono 1 *
            </label>
            <input
              type="text"
              required
              value={formData.telefono1}
              onChange={(e) => setFormData({ ...formData, telefono1: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono 2
            </label>
            <input
              type="text"
              value={formData.telefono2}
              onChange={(e) => setFormData({ ...formData, telefono2: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lista de Precio
            </label>
            <SearchSelect
              options={listasPrecio}
              value={formData.listaPrecioId}
              onChange={(value) => setFormData({ ...formData, listaPrecioId: value })}
              placeholder="Seleccionar lista de precio"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domicilio
            </label>
            <input
              type="text"
              value={formData.domicilio}
              onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
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

