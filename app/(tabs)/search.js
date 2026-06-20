// app/(tabs)/search.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, FlatList, ActivityIndicator,
         StyleSheet, Text } from 'react-native';
import { ProductAPI } from '../../src/services/apiService';
import ProductCard from '../../src/components/ProductCard';
import { useCart } from '../../src/hooks/useCart';
import { useToast } from '../../src/context/ToastContext';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const timer = useRef(null);

  const handleAddToCart = async (item) => {
    try {
      await addItem(item);
      showToast(`${item.name} agregado al carrito`);
    } catch (err) {
      showToast(err.message, 'alert-circle');
    }
  };

  // Búsqueda en vivo con debounce: dispara mientras se escribe (a partir
  // de un carácter) sin esperar a palabras completas.
  const runSearch = useCallback(async (text) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await ProductAPI.search(text);
      setResults(res.data);
    } catch (err) {
      console.error('Error en búsqueda:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (timer.current) clearTimeout(timer.current);
    const term = text.trim();
    if (term.length < 1) {
      setResults([]);
      setSearched(false);
      return;
    }
    timer.current = setTimeout(() => runSearch(term), 300);
  }, [runSearch]);

  // Limpia el temporizador pendiente al desmontar
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#95A5A6" />
        <TextInput style={styles.input}
          placeholder="Buscar productos naturales..."
          value={query}
          onChangeText={handleSearch}
          placeholderTextColor="#95A5A6"
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader}
          size="large" color="#1A5276" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard product={item}
              onAddToCart={() => handleAddToCart(item)} />
          )}
          ListEmptyComponent={searched ? (
            <Text style={styles.empty}>
              No se encontraron resultados
            </Text>
          ) : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  searchBar: { flexDirection: 'row', alignItems: 'center',
               backgroundColor: '#FFF', margin: 12, padding: 12,
               borderRadius: 10, shadowColor: '#000',
               shadowOpacity: 0.08, shadowRadius: 4,
               elevation: 2 },
  input: { flex: 1, marginLeft: 10, fontSize: 16,
           color: '#2C3E50' },
  loader: { marginTop: 40 },
  list: { padding: 8 },
  empty: { textAlign: 'center', marginTop: 40,
           color: '#95A5A6', fontSize: 15 }
});
