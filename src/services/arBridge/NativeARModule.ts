import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { ARBridgeModule } = NativeModules;

export type ARStatus =
  | 'idle'
  | 'initializing'
  | 'tracking'
  | 'loading_garment'
  | 'ready'
  | 'error';

export interface ARBodyPose {
  confidence: number;
  joints: Record<string, { x: number; y: number; z: number }>;
}

export interface ARGarmentInfo {
  assetId: string;
  loadTimeMs: number;
}

export interface ARError {
  code: string;
  message: string;
}

export interface NativeARModuleInterface {
  startARSession(): Promise<void>;
  stopARSession(): Promise<void>;
  loadGarment(assetId: string, colorIndex: number): Promise<void>;
  clearGarment(): Promise<void>;
  setGarmentOpacity(opacity: number): Promise<void>;
  captureSnapshot(): Promise<string>;
  isARSupported(): Promise<boolean>;
}

const isARAvailable = ARBridgeModule != null;

const stub = (): Promise<void> =>
  Platform.OS === 'android' || Platform.OS === 'ios'
    ? Promise.reject(new Error('ARBridgeModule not linked — rebuild native code'))
    : Promise.reject(new Error('AR is only supported on iOS and Android'));

export const NativeAR: NativeARModuleInterface = {
  startARSession: isARAvailable
    ? () => ARBridgeModule.startARSession()
    : stub,
  stopARSession: isARAvailable
    ? () => ARBridgeModule.stopARSession()
    : stub,
  loadGarment: isARAvailable
    ? (assetId: string, colorIndex: number) =>
        ARBridgeModule.loadGarment(assetId, colorIndex)
    : stub,
  clearGarment: isARAvailable
    ? () => ARBridgeModule.clearGarment()
    : stub,
  setGarmentOpacity: isARAvailable
    ? (opacity: number) => ARBridgeModule.setGarmentOpacity(opacity)
    : stub,
  captureSnapshot: isARAvailable
    ? () => ARBridgeModule.captureSnapshot()
    : () => Promise.reject(new Error('ARBridgeModule not linked')),
  isARSupported: isARAvailable
    ? () => ARBridgeModule.isARSupported()
    : () => Promise.resolve(false),
};

let emitter: NativeEventEmitter | null = null;

export function getAREmitter(): NativeEventEmitter | null {
  if (!isARAvailable) return null;
  if (!emitter) {
    emitter = new NativeEventEmitter(ARBridgeModule);
  }
  return emitter;
}

export const AR_EVENTS = {
  BODY_TRACKED: 'onBodyTracked',
  GARMENT_LOADED: 'onGarmentLoaded',
  AR_ERROR: 'onARError',
  SESSION_STATE_CHANGED: 'onSessionStateChanged',
} as const;

export { isARAvailable };
