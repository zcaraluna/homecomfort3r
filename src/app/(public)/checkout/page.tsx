'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCliente } from '@/context/ClienteContext';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

// Forzar renderizado dinámico para evitar problemas con localStorage durante el build
export const dynamic = 'force-dynamic';

type MetodoPago = 'TRANSFERENCIA_BANCARIA' | 'PAGO_CONTRA_ENTREGA' | 'QR_BANCARD';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { isAuthenticated, cliente } = useCliente();
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('TRANSFERENCIA_BANCARIA');
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [notas, setNotas] = useState('');
  // Datos para compra como invitado
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si está autenticado, prellenar datos del cliente
  useEffect(() => {
    if (isAuthenticated && cliente) {
      setNombreCompleto(cliente.nombreCompleto || '');
      setEmail(cliente.email || '');
      setTelefono(cliente.telefono1 || '');
    }
  }, [isAuthenticated, cliente]);

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Obtener sucursal seleccionada
      const sucursalSeleccionada = localStorage.getItem('sucursal_seleccionada') || 'central';

      // Validar datos de contacto si es compra como invitado
      if (!isAuthenticated) {
        if (!nombreCompleto || !numeroDocumento || !email || !telefono) {
          setError('Por favor completa todos los datos de contacto');
          setLoading(false);
          return;
        }
      }

      // Preparar headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Agregar clienteId solo si está autenticado
      if (isAuthenticated) {
        const clienteSession = localStorage.getItem('cliente_session');
        if (clienteSession) {
          const clienteData = JSON.parse(clienteSession);
          headers['x-cliente-id'] = clienteData.id;
        }
      }

      const response = await fetch('/api/pedidos/crear', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.precioOferta || item.precio,
          })),
          metodoPago,
          direccionEntrega: direccionEntrega || undefined,
          notas: notas || undefined,
          sucursalSlug: sucursalSeleccionada,
          // Datos de contacto para invitados
          nombreCompleto: !isAuthenticated ? nombreCompleto : undefined,
          numeroDocumento: !isAuthenticated ? numeroDocumento : undefined,
          email: !isAuthenticated ? email : undefined,
          telefono: !isAuthenticated ? telefono : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      // Verificar que el pedido se creó correctamente
      if (!data.success || !data.pedido) {
        throw new Error('Error al procesar el pedido. Por favor, intente nuevamente.');
      }

      // Limpiar carrito y redirigir
      clearCart();
      router.push(`/pedido-exitoso?pedido=${data.pedido.numeroPedido}`);
    } catch (err: unknown) {
      console.error('Error en checkout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pedido. Por favor, intente nuevamente.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/carrito');
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Finalizar Compra
      </h1>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2 space-y-4">
          {/* Método de Pago */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Método de Pago
            </h2>
            <div>
              <Label htmlFor="metodoPago">Selecciona el método de pago</Label>
              <select
                id="metodoPago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                className="w-full mt-2 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="TRANSFERENCIA_BANCARIA">Transferencia Bancaria - Realiza la transferencia y envía el comprobante</option>
                <option value="PAGO_CONTRA_ENTREGA">Pago Contra Entrega - Paga cuando recibas tu pedido</option>
                <option value="QR_BANCARD" disabled>Pago por QR (Bancard) - Próximamente</option>
              </select>
            </div>
          </div>

          {/* Datos de Contacto (solo para invitados) */}
          {!isAuthenticated && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Datos de Contacto
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Completa tus datos para procesar el pedido. Puedes{' '}
                <a href="/iniciar-sesion" className="text-brand-600 dark:text-brand-400 hover:underline">
                  iniciar sesión
                </a>{' '}
                o{' '}
                <a href="/registro" className="text-brand-600 dark:text-brand-400 hover:underline">
                  registrarte
                </a>{' '}
                para una experiencia más rápida.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                  <Input
                    type="text"
                    id="nombreCompleto"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                  <Input
                    type="text"
                    id="numeroDocumento"
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                    placeholder="1234567"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+595 981 123456"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Método de Pago y Entrega en Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Dirección de Entrega */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Dirección de Entrega
              </h2>
              <div>
                <Label htmlFor="direccionEntrega">Dirección</Label>
                <Input
                  type="text"
                  id="direccionEntrega"
                  value={direccionEntrega}
                  onChange={(e) => setDireccionEntrega(e.target.value)}
                  placeholder="Ingresa tu dirección completa"
                />
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Notas Adicionales
              </h2>
              <textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Instrucciones especiales para la entrega..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              Resumen del Pedido
            </h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const precio = item.precioOferta || item.precio;
                return (
                  <div key={item.productoId} className="flex gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500 text-xs">Img</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                        {item.nombre}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Cantidad: {item.cantidad}
                      </div>
                      <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
                        {formatearPrecio(precio * item.cantidad)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <div className="space-y-3 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium">{formatearPrecio(getTotal())}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span className="text-sm">Envío</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Gratis</span>
              </div>
              <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-600 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                  {formatearPrecio(getTotal())}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold rounded-lg hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                'Confirmar Pedido'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

