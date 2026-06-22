import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { Colors } from '../constants/colors';
import { ARView } from '../components/ARView';
import { ClothingSelector } from '../components/ClothingSelector';
import { useArStore } from '../store/useArStore';
import { NativeAR, getAREmitter, AR_EVENTS, isARAvailable } from '../services/arBridge';
import { PRODUCTS } from '../data/products';
import type { Product } from '../data/products';

export function ARScreen() {
  const {
    status,
    selectedProduct,
    selectedColorIndex,
    lastError,
    setStatus,
    selectProduct,
    setError,
    setSnapshotUri,
    reset,
  } = useArStore();

  const captureScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;

    const startSession = async () => {
      if (!isARAvailable) return;
      setStatus('initializing');
      try {
        await NativeAR.startARSession();
        if (mounted) setStatus('tracking');
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to start AR session');
      }
    };

    startSession();

    const emitter = getAREmitter();
    const errorSub = emitter?.addListener(AR_EVENTS.AR_ERROR, (err) => {
      if (mounted) setError(err.message);
    });

    return () => {
      mounted = false;
      errorSub?.remove();
      NativeAR.stopARSession().catch(() => {});
      reset();
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct || !isARAvailable) return;

    const loadGarment = async () => {
      setStatus('loading_garment');
      try {
        await NativeAR.loadGarment(selectedProduct.unityAssetId, selectedColorIndex);
        setStatus('ready');
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load garment');
      }
    };

    loadGarment();
  }, [selectedProduct?.id, selectedColorIndex]);

  const handleSelectProduct = useCallback(
    (product: Product) => {
      selectProduct(product);
    },
    [selectProduct],
  );

  const handleCapture = async () => {
    Animated.sequence([
      Animated.timing(captureScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(captureScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    if (!isARAvailable) {
      Alert.alert('AR Not Available', 'Unity AR module is not linked. Build the native project first.');
      return;
    }

    try {
      const uri = await NativeAR.captureSnapshot();
      setSnapshotUri(uri);
      Alert.alert('Saved', 'Snapshot saved to your camera roll.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not capture snapshot.');
    }
  };

  const handleClear = async () => {
    selectProduct(null);
    if (isARAvailable) {
      await NativeAR.clearGarment().catch(() => {});
    }
    setStatus('tracking');
  };

  const statusLabel = () => {
    switch (status) {
      case 'idle': return 'Point camera at yourself';
      case 'initializing': return 'Starting AR session...';
      case 'tracking': return 'Body detected — pick a garment';
      case 'loading_garment': return `Loading ${selectedProduct?.name ?? 'garment'}...`;
      case 'ready': return selectedProduct ? `Wearing ${selectedProduct.name}` : 'Ready';
      case 'error': return lastError ?? 'Error occurred';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>AR Try-On</Text>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  status === 'ready'
                    ? Colors.success
                    : status === 'error'
                    ? Colors.error
                    : status === 'tracking'
                    ? Colors.warning
                    : Colors.textDim,
              },
            ]}
          />
          <Text style={styles.statusText} numberOfLines={1}>
            {statusLabel()}
          </Text>
        </View>
      </View>

      <ARView style={styles.arView} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={handleClear}
          activeOpacity={0.75}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: captureScale }] }}>
          <TouchableOpacity
            style={[styles.captureBtn, status !== 'ready' && styles.captureBtnDim]}
            onPress={handleCapture}
            activeOpacity={0.85}>
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.75}>
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ClothingSelector
        products={PRODUCTS}
        onSelectProduct={handleSelectProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 220,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    flexShrink: 1,
  },
  arView: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  clearBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  captureBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  captureBtnDim: {
    opacity: 0.4,
  },
  captureBtnInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
  },
  shareBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.primary + '22',
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  shareBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
