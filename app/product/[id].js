import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ApiService from '../../src/services/apiService';
import { Product } from '../../src/models/Product';
import { useCart } from '../../src/viewmodels/useCart';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getProductById(id);
        setProduct(Product.fromJSON(data));
      } catch (err) {
        setError('No se pudo cargar el detalle del producto');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItem(product);
      Alert.alert('Éxito', `${product.name} agregado al carrito`);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#148F77" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Producto no encontrado'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color="#F1C40F" />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.stockText}>
            {product.isAvailable()
              ? `Stock: ${product.stock} unidades`
              : 'Agotado'}
          </Text>
        </View>

        <Text style={styles.price}>{product.getFormattedPrice()}</Text>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{product.description}</Text>

        {product.benefits && product.benefits.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Beneficios</Text>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#148F77"
                />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addBtn,
            !product.isAvailable() && styles.disabledBtn,
          ]}
          onPress={handleAddToCart}
          disabled={!product.isAvailable()}
        >
          <Text style={styles.addBtnText}>
            {product.isAvailable() ? 'Agregar al Carrito' : 'Sin Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#888',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '600',
  },
  stockText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#148F77',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A5276',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  addBtn: {
    backgroundColor: '#148F77',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  disabledBtn: {
    backgroundColor: '#95A5A6',
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#E74C3C',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#1A5276',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
