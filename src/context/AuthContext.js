// src/context/AuthContext.js
// Estado de autenticación GLOBAL: restaura el token una sola vez al
// arrancar la app y lo comparte con todas las pantallas.
import { createContext, useContext, useState, useEffect,
         useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthAPI, setToken, clearToken } from '../services/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restaurar sesión al iniciar la app (una sola vez, a nivel raíz)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          setToken(token);
          const res = await AuthAPI.getProfile();
          setUser(res.data);
        }
      } catch (err) {
        await AsyncStorage.removeItem('auth_token');
        clearToken();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await AuthAPI.login(email, password);
      await AsyncStorage.setItem('auth_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const res = await AuthAPI.register(userData);
      await AsyncStorage.setItem('auth_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('auth_token');
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
