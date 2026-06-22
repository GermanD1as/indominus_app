import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  requireNativeComponent,
  ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';
import { isARAvailable, getAREmitter, AR_EVENTS } from '../services/arBridge';
import { useArStore } from '../store/useArStore';

let UnityARView: React.ComponentType<{
  style?: ViewStyle;
  onBodyTracked?: (event: any) => void;
}> | null = null;

try {
  UnityARView = requireNativeComponent('UnityARView') as any;
} catch {
  UnityARView = null;
}

interface ARViewProps {
  style?: ViewStyle;
}

function TrackingIndicator({ confidence }: { confidence: number }) {
  const color =
    confidence > 0.8
      ? Colors.success
      : confidence > 0.4
      ? Colors.warning
      : Colors.error;
  const label =
    confidence > 0.8
      ? 'Tracking'
      : confidence > 0.4
      ? 'Partial'
      : 'No Body';
  return (
    <View style={[styles.trackingBadge, { borderColor: color + '66' }]}>
      <View style={[styles.trackingDot, { backgroundColor: color }]} />
      <Text style={[styles.trackingLabel, { color }]}>{label}</Text>
    </View>
  );
}

function ARNotAvailable() {
  return (
    <View style={styles.unavailable}>
      <View style={styles.unavailableIcon} />
      <Text style={styles.unavailableTitle}>AR Not Available</Text>
      <Text style={styles.unavailableBody}>
        {Platform.OS === 'ios' || Platform.OS === 'android'
          ? 'Unity AR module is not linked. Rebuild the native app with the Unity library embedded.'
          : 'AR Try-On requires an iOS or Android device.'}
      </Text>
    </View>
  );
}

export function ARView({ style }: ARViewProps) {
  const { status, bodyTrackingConfidence, setBodyTrackingConfidence } =
    useArStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [unityReady, setUnityReady] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    if (status === 'initializing' || status === 'loading_garment') {
      loop.start();
    } else {
      loop.stop();
      pulseAnim.setValue(1);
    }
    return () => loop.stop();
  }, [status, pulseAnim]);

  useEffect(() => {
    const emitter = getAREmitter();
    if (!emitter) return;

    const bodySub = emitter.addListener(AR_EVENTS.BODY_TRACKED, (data) => {
      setBodyTrackingConfidence(data.confidence ?? 0);
    });

    const stateSub = emitter.addListener(
      AR_EVENTS.SESSION_STATE_CHANGED,
      (data) => {
        if (data.state === 'ready') setUnityReady(true);
      },
    );

    return () => {
      bodySub.remove();
      stateSub.remove();
    };
  }, [setBodyTrackingConfidence]);

  if (!isARAvailable || !UnityARView) {
    return (
      <View style={[styles.container, style]}>
        <ARNotAvailable />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <UnityARView style={StyleSheet.absoluteFillObject as ViewStyle} />

      {!unityReady && (
        <View style={styles.loadingOverlay}>
          <Animated.View
            style={[styles.loadingRing, { transform: [{ scale: pulseAnim }] }]}
          />
          <Text style={styles.loadingLabel}>
            {status === 'initializing' ? 'Starting AR...' : 'Loading garment...'}
          </Text>
        </View>
      )}

      {unityReady && (
        <View style={styles.overlay}>
          <TrackingIndicator confidence={bodyTrackingConfidence} />
        </View>
      )}

      <View style={styles.scanGuide}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
  },
  loadingRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  loadingLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface + 'CC',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 6,
  },
  trackingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  trackingLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scanGuide: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.primary + '99',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  unavailable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  unavailableIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  unavailableTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  unavailableBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
