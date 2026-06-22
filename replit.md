# AR Clothing Try-On — React Native Bare Workflow

An AR clothing try-on mobile app using React Native bare workflow with Unity as a Library for AR rendering (ARKit on iOS, ARCore on Android).

## Architecture

- **React Native 0.70** bare workflow (project name: `indominusApp`)
- **Unity 2022.3 LTS** embedded via "Unity as a Library" for AR rendering
- **AR Foundation** for body tracking (ARKit on iOS, ARCore on Android)
- **Zustand** for AR session state management
- **React Navigation v6** (bottom tabs + native stack)

## Source Structure

```
src/
  constants/colors.ts       — Dark tech color palette (#0C0C14 bg, #7C6FED primary)
  data/products.ts          — 9 products: shirts, hoodies, jackets
  services/arBridge/        — NativeModules bridge to Unity AR
  store/useArStore.ts       — Zustand AR session state
  components/
    ProductCard.tsx         — Grid card with Try On button
    CategoryFilter.tsx      — Horizontal pill filter
    ARView.tsx              — Native Unity AR viewport + overlays
    ClothingSelector.tsx    — Bottom sheet with garment + color picker
  screens/
    CatalogScreen.tsx       — Product grid + search
    ARScreen.tsx            — AR session + capture
    ProductDetailScreen.tsx — Full detail + size/color picker
    SettingsScreen.tsx      — AR settings + toggles
  navigation/index.tsx      — Bottom tab + stack navigation
```

## Native Bridge

- **iOS**: `ios/indominusApp/ARBridge/ARBridgeModule.mm` (Obj-C/C++)
- **Android**: `android/app/src/main/java/com/indominusapp/arbridge/ARBridgeModule.kt`

See `UNITY_SETUP.md` for the full step-by-step guide to embed Unity.

## Running Locally

This app requires macOS (for iOS) or Linux/Windows (for Android) with the full
React Native + Unity development environment. It cannot be previewed in Replit.

```bash
# iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios --device "Your iPhone"

# Android
npx react-native run-android
```

## User Preferences

- Dark space/tech aesthetic — no light mode
- No emojis in UI
- Primary color: #7C6FED (indigo/purple)
- Background: #0C0C14
