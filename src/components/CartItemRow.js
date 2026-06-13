import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>S/ {item.price.toFixed(2)}</Text>
        <Text style={styles.subtotal}>Subtotal: S/ {(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  subtotal: {
    fontSize: 12,
    color: '#148F77',
    fontWeight: 'bold',
    marginTop: 2,
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 4,
  },
});
