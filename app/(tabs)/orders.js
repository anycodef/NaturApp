import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useOrders } from '../../src/viewmodels/useOrders';

export default function OrdersScreen() {
  const { orders, loading, error, refresh } = useOrders();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const renderOrderItem = ({ item: order }) => {
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Pedido #{order.id}</Text>
            <Text style={styles.orderDate}>{order.getFormattedDate()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: order.getStatusColor() }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.orderBody}>
          <Text style={styles.label}>Dirección de entrega:</Text>
          <Text style={styles.value}>{order.address}</Text>

          <Text style={styles.label}>Productos:</Text>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name} x{item.quantity}
              </Text>
              <Text style={styles.itemPrice}>S/ {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>S/ {order.total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      {loading && orders.length === 0 ? (
        <ActivityIndicator size="large" color="#148F77" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
            <Text style={styles.retryBtnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          refreshing={loading}
          onRefresh={refresh}
          ListEmptyComponent={
            <Text style={styles.empty}>No tienes pedidos registrados.</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A5276',
    marginBottom: 16,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  orderBody: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#444',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  itemName: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#148F77',
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#999',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  error: {
    color: '#E74C3C',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#1A5276',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
