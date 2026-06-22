import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Colors } from '../constants/colors';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { useArStore } from '../store/useArStore';
import { useNavigation } from '@react-navigation/native';
import type { Category } from '../data/products';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function CatalogScreen() {
  const navigation = useNavigation<NavProp>();
  const [category, setCategory] = useState<'all' | Category>('all');
  const [query, setQuery] = useState('');
  const { selectProduct } = useArStore();

  const filtered = useMemo(() => {
    let list = category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }
    return list;
  }, [category, query]);

  const handleTryOn = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      selectProduct(product);
      navigation.navigate('AR');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>{filtered.length} items</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>AR</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search styles, brands..."
          placeholderTextColor={Colors.textDim}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <CategoryFilter selected={category} onSelect={setCategory} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            onTryOn={() => handleTryOn(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items match your search.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  searchInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textDim,
    fontSize: 15,
  },
});
