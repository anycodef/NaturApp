// src/context/ToastContext.js
// Notificación breve y NO bloqueante (toast). Reemplaza a los Alert de
// confirmación: aparece, se mantiene un momento y se desvanece sola, sin
// exigir que el usuario pulse "OK".
import { createContext, useContext, useState, useRef,
         useCallback } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState('checkmark-circle');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  const insets = useSafeAreaInsets();

  const showToast = useCallback((msg, iconName = 'checkmark-circle') => {
    setMessage(msg);
    setIcon(iconName);
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(opacity, {
      toValue: 1, duration: 200, useNativeDriver: true
    }).start();
    timer.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0, duration: 250, useNativeDriver: true
      }).start();
    }, 2200);
  }, [opacity]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View pointerEvents="none"
        style={[styles.container,
          { opacity, bottom: insets.bottom + 28 }]}>
        <Animated.View style={styles.toast}>
          <Ionicons name={icon} size={18} color="#FFFFFF" />
          <Text style={styles.text} numberOfLines={2}>
            {message}
          </Text>
        </Animated.View>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>');
  }
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', paddingHorizontal: 24
  },
  toast: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C2833', paddingHorizontal: 18,
    paddingVertical: 12, borderRadius: 24, maxWidth: '100%',
    shadowColor: '#000', shadowOpacity: 0.25,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 6
  },
  text: {
    color: '#FFFFFF', fontSize: 14, fontWeight: '600',
    marginLeft: 8, flexShrink: 1
  }
});
