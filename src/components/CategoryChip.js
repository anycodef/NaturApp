import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.activeChip]}
      onPress={onPress}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
  },
  activeChip: {
    backgroundColor: '#148F77',
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  activeLabel: {
    color: '#FFF',
  },
});
