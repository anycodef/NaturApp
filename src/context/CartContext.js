// src/context/CartContext.js
// Estado del carrito GLOBAL: una sola fuente de verdad compartida por
// todas las pantallas, de modo que agregar desde cualquier lugar se
// refleje de inmediato en la pantalla del carrito.
import { createContext, useContext, useState, useEffect,
         useCallback } from 'react';
import { CartAPI } from '../services/apiService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setItems([]); setTotal(0); setCount(0);
  }, []);

  // Cargar carrito desde el servidor (solo si hay sesión activa)
  const loadCart = useCallback(async () => {
    if (!user) { reset(); return; }
    setLoading(true);
    try {
      const res = await CartAPI.get();
      setItems(res.data.items);
      setTotal(res.data.total);
      setCount(res.data.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, reset]);

  // Sincroniza el carrito cuando la sesión queda lista o cambia
  useEffect(() => {
    if (!authLoading) loadCart();
  }, [authLoading, user, loadCart]);

  const requireAuth = () => {
    if (!user) throw new Error('Inicia sesión para usar el carrito');
  };

  const addItem = useCallback(async (product) => {
    requireAuth();
    await CartAPI.addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    await loadCart();
  }, [user, loadCart]);

  const updateQuantity = useCallback(async (productId, qty) => {
    try {
      await CartAPI.updateQuantity(productId, qty);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }, [loadCart]);

  const removeItem = useCallback(async (productId) => {
    try {
      await CartAPI.removeItem(productId);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }, [loadCart]);

  const clearCart = useCallback(async () => {
    try {
      await CartAPI.clear();
      reset();
    } catch (err) {
      setError(err.message);
    }
  }, [reset]);

  return (
    <CartContext.Provider value={{
      items, total, count, loading, error,
      addItem, updateQuantity, removeItem, clearCart, loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return ctx;
}
