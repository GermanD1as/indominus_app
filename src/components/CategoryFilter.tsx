import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { CATEGORIES } from '../data/products';
import type { Category } from '../data/products';

interface CategoryFilterProps {
  selected: 'all' | Category;
  onSelect: (cat: 'all' | Category) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {CATEGORIES.map((cat) => {
        const active = selected === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.75}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.white,
  },
});
