'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, PlusIcon, TrashBinIcon } from '@/icons';
import SearchSelect from '@/components/admin/SearchSelect';
import CurrencyInput from '@/components/admin/CurrencyInput';

interface Cliente {
  id: string;
  nombreCompleto: string;
  numeroCedula: string;
  ruc: string | null;
}

interface Producto {
  id: string;
  nombre: string;
  codigoProducto: number | null;
  precio: number;
  precioOferta: number | null;
  stock: number;
}

interface VentaItem {
  productoId: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  porcentajeIva: number; // 10 o 5
  subtotal: number;
  iva: number;
  total: number;
}

export default function NuevaVentaPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<{ value: string; label: string }[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [items, setItems] = useState<VentaItem[]>([]);
  const [tipoVenta, setTipoVenta] = useState<'contado' | 'cuotas'>('contado');
  const [numeroCuotas, setNumeroCuotas] = useState<number>(12);
  const [porcentajeRecargoPorCuota, setPorcentajeRecargoPorCuota] = useState<number>(2);
  const [timbrado, setTimbrado] = useState<string>('');
  const [timbradoVencimiento, setTimbradoVencimiento] = useState<string>('');
  const [fechaVencimiento, setFechaVencimiento] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [buscandoProducto, setBuscandoProducto] = useState(false);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombreCompleto: '',
    numeroCedula: '',
    ruc: '',
    telefono1: '',
    telefono2: '',
    email: '',
    domicilio: '',
  });
  const [creandoCliente, setCreandoCliente] = useState(false);

  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, []);

  useEffect(() => {
    if (busquedaProducto.length >= 2) {
      const filtrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        (p.codigoProducto && String(p.codigoProducto).includes(busquedaProducto))
      );
      setProductosFiltrados(filtrados.slice(0, 10));
    } else {
      setProductosFiltrados([]);
    }
  }, [busquedaProducto, productos]);

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes?limit=1000&activo=true');
      const result = await response.json();
      if (result.success) {
        setClientes(
          result.data.map((c: Cliente) => ({
            value: c.id,
            label: `${c.nombreCompleto} - ${c.ruc || c.numeroCedula}`,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const crearCliente = async () => {
    if (!nuevoCliente.nombreCompleto || !nuevoCliente.numeroCedula || !nuevoCliente.telefono1 || !nuevoCliente.email) {
      alert('Por favor completa los campos requeridos: Nombre, Cédula, Teléfono y Email');
      return;
    }

    setCreandoCliente(true);
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCompleto: nuevoCliente.nombreCompleto,
          numeroCedula: nuevoCliente.numeroCedula,
          ruc: nuevoCliente.ruc || null,
          telefono1: nuevoCliente.telefono1,
          telefono2: nuevoCliente.telefono2 || null,
          email: nuevoCliente.email,
          domicilio: nuevoCliente.domicilio || null,
          activo: true,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Actualizar lista de clientes
        await fetchClientes();
        // Seleccionar el nuevo cliente
        setClienteSeleccionado(result.data.id);
        // Cerrar modal y limpiar formulario
        setMostrarModalCliente(false);
        setNuevoCliente({
          nombreCompleto: '',
          numeroCedula: '',
          ruc: '',
          telefono1: '',
          telefono2: '',
          email: '',
          domicilio: '',
        });
      } else {
        alert(result.error || 'Error al crear el cliente');
      }
    } catch (error) {
      console.error('Error creating cliente:', error);
      alert('Error al crear el cliente');
    } finally {
      setCreandoCliente(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/productos?limit=1000&activo=true');
      const result = await response.json();
      if (result.success) {
        setProductos(result.data);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const agregarProducto = (producto: Producto) => {
    const precioFinal = producto.precioOferta || producto.precio;
    const cantidad = 1;
    const porcentajeIva = 10; // IVA 10% por defecto (puedes hacerlo configurable)
    const subtotal = precioFinal * cantidad;
    const iva = subtotal * (porcentajeIva / 100);
    const total = subtotal + iva;

    const nuevoItem: VentaItem = {
      productoId: producto.id,
      producto,
      cantidad,
      precioUnitario: precioFinal,
      porcentajeIva,
      subtotal,
      iva,
      total,
    };

    setItems([...items, nuevoItem]);
    setBusquedaProducto('');
    setProductosFiltrados([]);
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    if (cantidad <= 0) return;
    const item = items[index];
    const subtotal = item.precioUnitario * cantidad;
    const iva = subtotal * (item.porcentajeIva / 100);
    const total = subtotal + iva;

    const nuevosItems = [...items];
    nuevosItems[index] = {
      ...item,
      cantidad,
      subtotal,
      iva,
      total,
    };
    setItems(nuevosItems);
  };

  const actualizarPrecio = (index: number, precio: number) => {
    if (precio < 0) return;
    const item = items[index];
    const subtotal = precio * item.cantidad;
    const iva = subtotal * (item.porcentajeIva / 100);
    const total = subtotal + iva;

    const nuevosItems = [...items];
    nuevosItems[index] = {
      ...item,
      precioUnitario: precio,
      subtotal,
      iva,
      total,
    };
    setItems(nuevosItems);
  };

  const actualizarIva = (index: number, porcentajeIva: number) => {
    if (porcentajeIva !== 10 && porcentajeIva !== 5) return;
    const item = items[index];
    const subtotal = item.precioUnitario * item.cantidad;
    const iva = subtotal * (porcentajeIva / 100);
    const total = subtotal + iva;

    const nuevosItems = [...items];
    nuevosItems[index] = {
      ...item,
      porcentajeIva,
      subtotal,
      iva,
      total,
    };
    setItems(nuevosItems);
  };

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Separar IVA 10% y 5%
    const gravada10 = items
      .filter((item) => item.porcentajeIva === 10)
      .reduce((sum, item) => sum + item.subtotal, 0);
    const iva10 = items
      .filter((item) => item.porcentajeIva === 10)
      .reduce((sum, item) => sum + item.iva, 0);
    
    const gravada05 = items
      .filter((item) => item.porcentajeIva === 5)
      .reduce((sum, item) => sum + item.subtotal, 0);
    const iva05 = items
      .filter((item) => item.porcentajeIva === 5)
      .reduce((sum, item) => sum + item.iva, 0);
    
    const ivaTotal = iva10 + iva05;
    const montoVenta = subtotal + ivaTotal;

    // Calcular recargo si es a cuotas
    let montoRecargo = 0;
    let montoConRecargo = montoVenta;
    let valorCuota = 0;

    if (tipoVenta === 'cuotas' && numeroCuotas > 0 && porcentajeRecargoPorCuota > 0) {
      const porcentajeRecargoTotal = (porcentajeRecargoPorCuota / 100) * numeroCuotas;
      montoRecargo = montoVenta * porcentajeRecargoTotal;
      montoConRecargo = montoVenta + montoRecargo;
      valorCuota = montoConRecargo / numeroCuotas;
    }

    return {
      subtotal,
      gravada10,
      iva10,
      gravada05,
      iva05,
      ivaTotal,
      montoVenta,
      montoRecargo,
      montoConRecargo,
      valorCuota,
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado) {
      alert('Por favor selecciona un cliente');
      return;
    }
    if (items.length === 0) {
      alert('Por favor agrega al menos un producto');
      return;
    }

    setLoading(true);
    try {
      const totales = calcularTotales();
      const fechaActual = new Date().toISOString().split('T')[0];

      const ventaData = {
        clienteId: clienteSeleccionado,
        tipoDocumento: 'FACTURA DE VENTA',
        condicion: tipoVenta === 'contado' ? 'CONTADO' : 'CREDITO',
        fecha: fechaActual,
        timbrado: timbrado || '',
        timbradoVencimiento: timbradoVencimiento || null,
        fechaVencimiento: fechaVencimiento || null,
        gravada10: totales.gravada10,
        iva10: totales.iva10,
        gravada05: totales.gravada05,
        iva05: totales.iva05,
        exenta: 0,
        montoVenta: totales.montoVenta,
        saldoVenta: tipoVenta === 'contado' ? 0 : totales.montoConRecargo,
        numeroCuotas: tipoVenta === 'cuotas' ? numeroCuotas : null,
        porcentajeRecargoPorCuota: tipoVenta === 'cuotas' ? porcentajeRecargoPorCuota : null,
        montoRecargo: tipoVenta === 'cuotas' ? totales.montoRecargo : null,
        montoConRecargo: tipoVenta === 'cuotas' ? totales.montoConRecargo : null,
        valorCuota: tipoVenta === 'cuotas' ? totales.valorCuota : null,
        items: items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          iva: item.iva,
          montoTotal: item.total,
        })),
      };

      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Venta creada exitosamente');
        router.push('/administracion/ventas');
      } else {
        alert(result.error || 'Error al crear la venta');
      }
    } catch (error) {
      console.error('Error creating venta:', error);
      alert('Error al crear la venta');
    } finally {
      setLoading(false);
    }
  };

  const totales = calcularTotales();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/administracion/ventas')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nueva Venta
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Registra una nueva venta
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Cliente */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información del Cliente
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cliente *
                    </label>
                    <button
                      type="button"
                      onClick={() => setMostrarModalCliente(true)}
                      className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                    >
                      + Nuevo Cliente
                    </button>
                  </div>
                  <SearchSelect
                    options={clientes}
                    value={clienteSeleccionado}
                    onChange={setClienteSeleccionado}
                    placeholder="Buscar y seleccionar cliente..."
                  />
                </div>
              </div>
            </div>

            {/* Agregar Productos */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Productos
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    placeholder="Buscar producto por nombre o código..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  {productosFiltrados.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {productosFiltrados.map((producto) => (
                        <button
                          key={producto.id}
                          type="button"
                          onClick={() => agregarProducto(producto)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {producto.nombre}
                              </p>
                              {producto.codigoProducto && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Código: {producto.codigoProducto}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(producto.precioOferta || producto.precio)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Stock: {producto.stock}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lista de Productos Agregados */}
                {items.length > 0 && (
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.producto.nombre}
                          </p>
                          {item.producto.codigoProducto && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Código: {item.producto.codigoProducto}
                            </p>
                          )}
                        </div>
                        <div className="w-24">
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Cantidad
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) =>
                              actualizarCantidad(index, parseInt(e.target.value) || 1)
                            }
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Precio Unit.
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.precioUnitario}
                            onChange={(e) =>
                              actualizarPrecio(index, parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            IVA %
                          </label>
                          <select
                            value={item.porcentajeIva}
                            onChange={(e) =>
                              actualizarIva(index, parseInt(e.target.value))
                            }
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="10">10%</option>
                            <option value="5">5%</option>
                          </select>
                        </div>
                        <div className="w-32 text-right">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.total)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen y Configuración */}
          <div className="space-y-6">
            {/* Configuración de Venta */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configuración
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Venta *
                  </label>
                  <select
                    value={tipoVenta}
                    onChange={(e) => setTipoVenta(e.target.value as 'contado' | 'cuotas')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="contado">Contado</option>
                    <option value="cuotas">A Cuotas</option>
                  </select>
                </div>

                {tipoVenta === 'cuotas' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número de Cuotas *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={numeroCuotas}
                        onChange={(e) => setNumeroCuotas(parseInt(e.target.value) || 12)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        % Recargo por Cuota *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={porcentajeRecargoPorCuota}
                        onChange={(e) =>
                          setPorcentajeRecargoPorCuota(parseFloat(e.target.value) || 2)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Ejemplo: 2% por cuota = 24% total en 12 cuotas
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timbrado
                  </label>
                  <input
                    type="text"
                    value={timbrado}
                    onChange={(e) => setTimbrado(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vencimiento Timbrado
                  </label>
                  <input
                    type="date"
                    value={timbradoVencimiento}
                    onChange={(e) => setTimbradoVencimiento(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {tipoVenta === 'cuotas' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha Vencimiento Primera Cuota
                    </label>
                    <input
                      type="date"
                      value={fechaVencimiento}
                      onChange={(e) => setFechaVencimiento(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Resumen de Totales */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumen
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(totales.subtotal)}
                  </span>
                </div>
                {totales.gravada10 > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Gravada 10%:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatCurrency(totales.gravada10)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">IVA 10%:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatCurrency(totales.iva10)}
                      </span>
                    </div>
                  </>
                )}
                {totales.gravada05 > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Gravada 5%:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatCurrency(totales.gravada05)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">IVA 5%:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatCurrency(totales.iva05)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-gray-600 dark:text-gray-400">IVA Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(totales.ivaTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monto Venta:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(totales.montoVenta)}
                  </span>
                </div>

                {tipoVenta === 'cuotas' && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Recargo ({numeroCuotas} cuotas × {porcentajeRecargoPorCuota}%):
                        </span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">
                          {formatCurrency(totales.montoRecargo)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-900 dark:text-white">
                          Total con Recargo:
                        </span>
                        <span className="text-brand-600 dark:text-brand-400">
                          {formatCurrency(totales.montoConRecargo)}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Valor por Cuota:
                          </span>
                          <span className="font-bold text-lg text-brand-600 dark:text-brand-400">
                            {formatCurrency(totales.valorCuota)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {numeroCuotas} cuotas de {formatCurrency(totales.valorCuota)}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {tipoVenta === 'contado' && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">Total a Pagar:</span>
                      <span className="text-brand-600 dark:text-brand-400">
                        {formatCurrency(totales.montoVenta)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/administracion/ventas')}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || items.length === 0 || !clienteSeleccionado}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar Venta'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Modal para crear nuevo cliente */}
      {mostrarModalCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Nuevo Cliente
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalCliente(false);
                    setNuevoCliente({
                      nombreCompleto: '',
                      numeroCedula: '',
                      ruc: '',
                      telefono1: '',
                      telefono2: '',
                      email: '',
                      domicilio: '',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={nuevoCliente.nombreCompleto}
                    onChange={(e) =>
                      setNuevoCliente({ ...nuevoCliente, nombreCompleto: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cédula / RUC *
                    </label>
                    <input
                      type="text"
                      value={nuevoCliente.numeroCedula}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, numeroCedula: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Ej: 1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      RUC (opcional)
                    </label>
                    <input
                      type="text"
                      value={nuevoCliente.ruc}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, ruc: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Ej: 80012345-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={nuevoCliente.email}
                    onChange={(e) =>
                      setNuevoCliente({ ...nuevoCliente, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Ej: juan@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono 1 *
                    </label>
                    <input
                      type="text"
                      value={nuevoCliente.telefono1}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, telefono1: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Ej: 0981 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono 2 (opcional)
                    </label>
                    <input
                      type="text"
                      value={nuevoCliente.telefono2}
                      onChange={(e) =>
                        setNuevoCliente({ ...nuevoCliente, telefono2: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Ej: 0982 654 321"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domicilio (opcional)
                  </label>
                  <textarea
                    value={nuevoCliente.domicilio}
                    onChange={(e) =>
                      setNuevoCliente({ ...nuevoCliente, domicilio: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Ej: Av. Principal 123, Asunción"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalCliente(false);
                    setNuevoCliente({
                      nombreCompleto: '',
                      numeroCedula: '',
                      ruc: '',
                      telefono1: '',
                      telefono2: '',
                      email: '',
                      domicilio: '',
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={crearCliente}
                  disabled={creandoCliente}
                  className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creandoCliente ? 'Creando...' : 'Crear Cliente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

