// app/_layout.js
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import { ToastProvider } from '../src/context/ToastContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
          <Stack screenOptions={{
            headerStyle: { backgroundColor: '#1A5276' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}>
            <Stack.Screen name="index" options={{
              headerShown: false
            }} />
            <Stack.Screen name="(tabs)" options={{
              headerShown: false
            }} />
            <Stack.Screen name="product/[id]" options={{
              title: 'Detalle del Producto',
              presentation: 'card'
            }} />
            <Stack.Screen name="auth/login" options={{
              title: 'Iniciar Sesión',
              presentation: 'modal'
            }} />
            <Stack.Screen name="auth/register" options={{
              title: 'Registrarse',
              presentation: 'modal'
            }} />
            <Stack.Screen name="checkout" options={{
              title: 'Finalizar Compra'
            }} />
          </Stack>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
