'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { PlusIcon, PencilIcon, EyeIcon } from '@/icons';
import StatusBadge from '@/components/admin/StatusBadge';
import CurrencyInput from '@/components/admin/CurrencyInput';
import SearchSelect from '@/components/admin/SearchSelect';

interface Producto {
  id: string;
  nombre: string;
  codigoProducto: number | null;
  codigoBarras: string | null;
  precio: number;
  precioOferta: number | null;
  stock: number;
  activo: boolean;
  categoria: { nombre: string; id: string };
  marca: { nombre: string; id: string };
  rubro: string | null;
  familia: string | null;
  descripcion?: string | null;
  stockNegativo?: boolean;
}

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<{ value: string; label: string }[]>([]);
  const [marcas, setMarcas] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchMarcas();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/productos?limit=1000');
      const result = await response.json();
      if (result.success) {
        setProductos(result.data);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const result = await response.json();
      if (result.success) {
        setCategorias(result.data.map((c: any) => ({ value: c.id, label: c.nombre })));
      }
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const fetchMarcas = async () => {
    try {
      const response = await fetch('/api/marcas');
      const result = await response.json();
      if (result.success) {
        setMarcas(result.data.map((m: any) => ({ value: m.id, label: m.nombre })));
      }
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  const handleCreate = () => {
    setSelectedProducto(null);
    setIsModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleView = (producto: Producto) => {
    router.push(`/administracion/productos/${producto.id}`);
  };

  const handleDelete = async (producto: Producto) => {
    if (!confirm(`¿Estás seguro de desactivar el producto "${producto.nombre}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/productos/${producto.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchProductos();
      } else {
        alert(result.error || 'Error al desactivar producto');
      }
    } catch (error) {
      console.error('Error deleting producto:', error);
      alert('Error al desactivar producto');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const url = selectedProducto
        ? `/api/productos/${selectedProducto.id}`
        : '/api/productos';
      const method = selectedProducto ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        setSelectedProducto(null);
        fetchProductos();
      } else {
        alert(result.error || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error saving producto:', error);
      alert('Error al guardar producto');
    }
  };

  const columns: Column<Producto>[] = [
    {
      header: 'Código',
      accessor: (row) => row.codigoProducto || '-',
    },
    {
      header: 'Nombre',
      accessor: 'nombre',
      sortable: true,
    },
    {
      header: 'Categoría',
      accessor: (row) => row.categoria.nombre,
    },
    {
      header: 'Marca',
      accessor: (row) => row.marca.nombre,
    },
    {
      header: 'Precio',
      accessor: (row) => `₲ ${row.precio.toLocaleString('es-PY')}`,
    },
    {
      header: 'Stock',
      accessor: 'stock',
      sortable: true,
      className: (row: Producto) => row.stock < 10 ? 'text-red-600 dark:text-red-400 font-semibold' : '',
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
            Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando productos...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={productos}
          columns={columns}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          searchable={true}
          searchPlaceholder="Buscar por nombre, código o código de barras..."
          pagination={true}
          pageSize={50}
        />
      )}

      {isModalOpen && (
        <ProductoFormModal
          producto={selectedProducto}
          categorias={categorias}
          marcas={marcas}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProducto(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ProductoFormModal({
  producto,
  categorias,
  marcas,
  onClose,
  onSave,
}: {
  producto: Producto | null;
  categorias: { value: string; label: string }[];
  marcas: { value: string; label: string }[];
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || 0,
    precioOferta: producto?.precioOferta || null,
    stock: producto?.stock || 0,
    categoriaId: producto?.categoria.id || '',
    marcaId: producto?.marca.id || '',
    codigoProducto: producto?.codigoProducto || null,
    codigoBarras: producto?.codigoBarras || '',
    rubro: producto?.rubro || '',
    familia: producto?.familia || '',
    proveedorDfl: '',
    stockNegativo: producto?.stockNegativo || false,
    activo: producto?.activo ?? true,
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
      title={producto ? 'Editar Producto' : 'Nuevo Producto'}
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
            form="producto-form"
            disabled={saving}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }
    >
      <form id="producto-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Código de Producto
            </label>
            <input
              type="number"
              value={formData.codigoProducto || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  codigoProducto: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código de Barras
            </label>
            <input
              type="text"
              value={formData.codigoBarras}
              onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría *
            </label>
            <SearchSelect
              options={categorias}
              value={formData.categoriaId}
              onChange={(value) => setFormData({ ...formData, categoriaId: value })}
              placeholder="Seleccionar categoría"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Marca *
            </label>
            <SearchSelect
              options={marcas}
              value={formData.marcaId}
              onChange={(value) => setFormData({ ...formData, marcaId: value })}
              placeholder="Seleccionar marca"
            />
          </div>

          <CurrencyInput
            label="Precio *"
            value={formData.precio}
            onChange={(value) => setFormData({ ...formData, precio: value })}
          />

          <CurrencyInput
            label="Precio Oferta"
            value={formData.precioOferta || 0}
            onChange={(value) => setFormData({ ...formData, precioOferta: value || null })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Inicial *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rubro
            </label>
            <input
              type="text"
              value={formData.rubro}
              onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Familia
            </label>
            <input
              type="text"
              value={formData.familia}
              onChange={(e) => setFormData({ ...formData, familia: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="stockNegativo"
              checked={formData.stockNegativo}
              onChange={(e) => setFormData({ ...formData, stockNegativo: e.target.checked })}
              className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="stockNegativo" className="text-sm text-gray-700 dark:text-gray-300">
              Permitir stock negativo
            </label>
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

