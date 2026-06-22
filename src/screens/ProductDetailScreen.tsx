import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors } from '../constants/colors';
import { PRODUCTS } from '../data/products';
import { useArStore } from '../store/useArStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

function SizeButton({
  size,
  selected,
  onPress,
}: {
  size: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.sizeBtn, selected && styles.sizeBtnSelected]}>
      <Text style={[styles.sizeBtnText, selected && styles.sizeBtnTextSelected]}>
        {size}
      </Text>
    </TouchableOpacity>
  );
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
      style={[styles.colorSwatch, { backgroundColor: color }, selected && styles.colorSwatchSelected]}
    />
  );
}

export function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const product = PRODUCTS.find((p) => p.id === productId);
  const { selectProduct, selectColor } = useArStore();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Product not found.</Text>
      </SafeAreaView>
    );
  }

  const handleTryOn = () => {
    selectProduct(product);
    selectColor(selectedColor);
    navigation.navigate('AR');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>{'<'}</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroImage}>
            <Text style={styles.heroInitial}>{product.name[0]}</Text>
          </View>
          <View style={styles.heroOverlay}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{product.category}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Text
                  key={i}
                  style={[
                    styles.star,
                    i <= Math.round(product.rating)
                      ? styles.starFilled
                      : styles.starEmpty,
                  ]}>
                  {'\u2605'}
                </Text>
              ))}
            </View>
            <Text style={styles.ratingValue}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Colorway</Text>
          <View style={styles.colorRow}>
            {product.colorways.map((color, idx) => (
              <ColorSwatch
                key={color}
                color={color}
                selected={selectedColor === idx}
                onPress={() => setSelectedColor(idx)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeRow}>
            {product.sizes.map((size) => (
              <SizeButton
                key={size}
                size={size}
                selected={selectedSize === size}
                onPress={() => setSelectedSize(size)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagRow}>
            {product.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tryOnBtn} onPress={handleTryOn} activeOpacity={0.85}>
          <Text style={styles.tryOnText}>Try On with AR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backArrow: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
    lineHeight: 22,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  hero: {
    height: 280,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInitial: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.primary,
  },
  heroOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '33',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.primary + '66',
  },
  categoryBadgeText: {
    color: Colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  body: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  brand: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 28,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginLeft: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
  },
  starFilled: {
    color: Colors.warning,
  },
  starEmpty: {
    color: Colors.border,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: Colors.primary,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  sizeBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '22',
  },
  sizeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sizeBtnTextSelected: {
    color: Colors.primary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  notFound: {
    color: Colors.textSecondary,
    padding: 32,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  addToCartBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  addToCartText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  tryOnBtn: {
    flex: 1.4,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  tryOnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
