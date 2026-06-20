// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  // Respeta la barra de navegación del sistema (Android/iOS) para que
  // los botones inferiores no queden tapados.
  const insets = useSafeAreaInsets();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#1A5276',
      tabBarInactiveTintColor: '#95A5A6',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#ECF0F1',
        height: 60 + insets.bottom,
        paddingBottom: 8 + insets.bottom,
        paddingTop: 8,
      },
      headerStyle: { backgroundColor: '#1A5276' },
      headerTintColor: '#FFFFFF',
    }}>
      <Tabs.Screen name="home" options={{
        title: 'Inicio',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name="home" size={size} color={color} />,
        headerTitle: 'NaturApp'
      }} />
      <Tabs.Screen name="search" options={{
        title: 'Buscar',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name="search" size={size} color={color} />,
      }} />
      <Tabs.Screen name="cart" options={{
        title: 'Carrito',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name="cart" size={size} color={color} />,
      }} />
      <Tabs.Screen name="orders" options={{
        title: 'Pedidos',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name="receipt" size={size} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Perfil',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name="person" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
