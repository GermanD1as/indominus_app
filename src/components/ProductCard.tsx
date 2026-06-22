import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/colors';
import type { Product } from '../data/products';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onTryOn: () => void;
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={[styles.star, i <= filled ? styles.starFilled : styles.starEmpty]}>
          {'\u2605'}
        </Text>
      ))}
    </View>
  );
}

function ColorDot({ color, small }: { color: string; small?: boolean }) {
  return (
    <View
      style={[
        styles.colorDot,
        { backgroundColor: color },
        small && styles.colorDotSmall,
      ]}
    />
  );
}

export function ProductCard({ product, onPress, onTryOn }: ProductCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.imagePlaceholder}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
        <View style={styles.placeholderCenter}>
          <View style={styles.placeholderIcon} />
          <Text style={styles.placeholderLabel}>{product.name[0]}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.row}>
          <StarRating rating={product.rating} />
          <Text style={styles.reviews}>({product.reviewCount})</Text>
        </View>

        <View style={styles.colorRow}>
          {product.colorways.slice(0, 3).map((c) => (
            <ColorDot key={c} color={c} small />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>${product.price}</Text>
          <TouchableOpacity
            style={styles.tryOnBtn}
            onPress={onTryOn}
            activeOpacity={0.8}>
            <Text style={styles.tryOnText}>Try On</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: CARD_WIDTH,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary + '33',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  categoryText: {
    color: Colors.primaryLight,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  placeholderCenter: {
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + '22',
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  placeholderLabel: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  info: {
    padding: 12,
  },
  brand: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 9,
    marginRight: 1,
  },
  starFilled: {
    color: Colors.warning,
  },
  starEmpty: {
    color: Colors.border,
  },
  reviews: {
    fontSize: 10,
    color: Colors.textDim,
    marginLeft: 4,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 4,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  colorDotSmall: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  tryOnBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tryOnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
