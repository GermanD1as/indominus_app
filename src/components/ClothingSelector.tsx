import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useArStore } from '../store/useArStore';
import type { Product } from '../data/products';

interface ClothingSelectorProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

function ColorSwatch({
  color,
  selected,
  onPress,
}: {
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.swatch, { backgroundColor: color }, selected && styles.swatchSelected]}>
      {selected && <View style={styles.swatchCheck} />}
    </TouchableOpacity>
  );
}

function MiniCard({
  product,
  selected,
  onPress,
}: {
  product: Product;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.miniCard, selected && styles.miniCardSelected]}>
      <View style={styles.miniImage}>
        <Text style={styles.miniInitial}>{product.name[0]}</Text>
      </View>
      <Text style={styles.miniName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.miniPrice}>${product.price}</Text>
    </TouchableOpacity>
  );
}

export function ClothingSelector({ products, onSelectProduct }: ClothingSelectorProps) {
  const { selectedProduct, selectedColorIndex, selectColor } = useArStore();

  return (
    <View style={styles.container}>
      {selectedProduct && (
        <View style={styles.colorSection}>
          <Text style={styles.sectionLabel}>Colorway</Text>
          <View style={styles.swatches}>
            {selectedProduct.colorways.map((color, idx) => (
              <ColorSwatch
                key={color}
                color={color}
                selected={selectedColorIndex === idx}
                onPress={() => selectColor(idx)}
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.catalogLabel}>Catalog</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {products.map((p) => (
          <MiniCard
            key={p.id}
            product={p}
            selected={selectedProduct?.id === p.id}
            onPress={() => onSelectProduct(p)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 16,
    marginBottom: 8,
  },
  catalogLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  colorSection: {
    marginBottom: 4,
  },
  swatches: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: Colors.primary,
  },
  swatchCheck: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  miniCard: {
    width: 90,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  miniCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  miniImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  miniInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  miniName: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: 4,
  },
  miniPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
});
