'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  productoId: string;
  nombre: string;
  precio: number;
  precioOferta: number | null;
  imagen: string;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (producto: Omit<CartItem, 'cantidad'>) => void;
  removeFromCart: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error cargando carrito:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (producto: Omit<CartItem, 'cantidad'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productoId === producto.productoId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productoId === producto.productoId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevItems, { ...producto, cantidad: 1 }];
    });
  };

  const removeFromCart = (productoId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productoId !== productoId));
  };

  const updateQuantity = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productoId === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const precio = item.precioOferta || item.precio;
      return total + precio * item.cantidad;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

