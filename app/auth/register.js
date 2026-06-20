// app/auth/register.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,
         ActivityIndicator, StyleSheet, Alert,
         ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: ''
  });
  const { register, loading } = useAuth();
  const router = useRouter();

  const update = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error',
        'Completa nombre, correo y contraseña');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Error',
        'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      await register(form);
      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Error de registro', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>
        Únete a la comunidad NaturApp
      </Text>

      <TextInput style={styles.input}
        placeholder="Nombre completo"
        value={form.name}
        onChangeText={(t) => update('name', t)} />

      <TextInput style={styles.input}
        placeholder="Correo electrónico"
        value={form.email}
        onChangeText={(t) => update('email', t)}
        keyboardType="email-address" autoCapitalize="none" />

      <TextInput style={styles.input}
        placeholder="Teléfono (opcional)"
        value={form.phone}
        onChangeText={(t) => update('phone', t)}
        keyboardType="phone-pad" />

      <TextInput style={styles.input}
        placeholder="Contraseña (mín. 6 caracteres)"
        value={form.password}
        onChangeText={(t) => update('password', t)}
        secureTextEntry />

      <TouchableOpacity style={styles.button}
        onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace('/auth/login')}>
        <Text style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FFF',
               padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold',
           color: '#1A5276', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#7F8C8D',
              textAlign: 'center', marginTop: 8,
              marginBottom: 32 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1,
           borderColor: '#D5DBDB', borderRadius: 10,
           padding: 14, fontSize: 16, marginBottom: 14 },
  button: { backgroundColor: '#1A5276', padding: 16,
            borderRadius: 12, alignItems: 'center',
            marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 17,
                fontWeight: 'bold' },
  link: { color: '#2E86C1', textAlign: 'center',
          marginTop: 24, fontSize: 14 }
});
