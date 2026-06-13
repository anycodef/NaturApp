import React from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useProfile } from '../../src/viewmodels/useProfile';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const {
    name,
    setName,
    email,
    setEmail,
    darkTheme,
    notifications,
    saveProfile,
    toggleTheme,
    toggleNotifications,
  } = useProfile();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido');
      return;
    }
    try {
      await saveProfile();
      Alert.alert('Perfil Guardado', 'Los datos del perfil se guardaron con éxito.');
    } catch (e) {
      Alert.alert('Error', 'No se pudieron guardar los datos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="#1A5276" />
          </View>
          <Text style={styles.userName}>{name || 'Usuario NaturApp'}</Text>
          <Text style={styles.userEmail}>{email || 'usuario@naturapp.com'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Personales</Text>

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Guardar Datos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLabelCol}>
              <Ionicons name="moon-outline" size={20} color="#333" style={styles.prefIcon} />
              <Text style={styles.preferenceText}>Tema Oscuro</Text>
            </View>
            <Switch
              value={darkTheme}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#148F77' }}
              thumbColor={darkTheme ? '#FFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLabelCol}>
              <Ionicons name="notifications-outline" size={20} color="#333" style={styles.prefIcon} />
              <Text style={styles.preferenceText}>Notificaciones</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#148F77' }}
              thumbColor={notifications ? '#FFF' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D6E4F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#1A5276',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A5276',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#148F77',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  preferenceLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefIcon: {
    marginRight: 10,
  },
  preferenceText: {
    fontSize: 15,
    color: '#333',
  },
});
