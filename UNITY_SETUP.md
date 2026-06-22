# Unity as a Library — AR Try-On Setup Guide

This guide walks you through embedding Unity AR Foundation into the React Native
bare workflow project so the AR Try-On screen renders real body-tracked garments.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Unity Hub | Latest |
| Unity Editor | 2022.3 LTS |
| Xcode | 14+ (iOS 16+ device, A12+) |
| Android Studio | Flamingo / Giraffe |
| Node | 18+ |
| CocoaPods | 1.13+ |
| React Native CLI | 0.72+ |

---

## Step 1 — Create the Unity AR Project

1. Open **Unity Hub → New Project → 3D (URP)** — name it `ARClothingUnity`.
2. Open **Window → Package Manager** and install:
   - **AR Foundation** (5.x)
   - **ARKit XR Plugin** (iOS) and/or **ARCore XR Plugin** (Android)
   - **XR Plugin Management**
3. In **Project Settings → XR Plug-in Management**:
   - iOS: enable **ARKit**
   - Android: enable **ARCore**
4. Enable **Human Body Tracking** in the ARKit settings panel.

---

## Step 2 — Build Unity as a Library

### iOS

1. **File → Build Settings → iOS** → switch platform.
2. Check **Export as XCFramework** and **Build as Library**.
3. Click **Export** (not Build & Run) — choose a folder, e.g. `unity-ios-export/`.
4. Copy `unity-ios-export/UnityFramework/UnityFramework.xcframework` into
   `ios/UnityFramework/`.
5. In your Xcode project add it as an **Embedded Framework**:
   - Target → General → Frameworks, Libraries... → Add
   - Set **Embed** to `Embed & Sign`.
6. In `ios/Podfile`, **above** `use_react_native!(...)` add:
   ```ruby
   pod 'UnityFramework', :path => './UnityFramework'
   ```
7. Run `pod install` from the `ios/` directory.
8. Open `ARBridgeModule.mm` and add `-DUNITY_FRAMEWORK_LINKED` to the
   target's **Other C Flags** in Xcode, or define it at the top of the file.

### Android

1. **File → Build Settings → Android** → switch platform.
2. Check **Export Project** → click **Export** → choose `unity-android-export/`.
3. Copy the exported `unityLibrary/` folder into your RN project root so it sits
   alongside `android/`.
4. In `android/settings.gradle` add:
   ```groovy
   include ':unityLibrary'
   project(':unityLibrary').projectDir = new File('../unityLibrary')
   ```
5. In `android/app/build.gradle` add:
   ```groovy
   dependencies {
       implementation project(':unityLibrary')
   }
   ```
6. In `android/gradle.properties` add:
   ```properties
   UNITY_LINKED=true
   ```
7. In `ARBridgeModule.kt` the `UNITY_LINKED` flag reads from `BuildConfig`,
   which will now be `true`.

---

## Step 3 — Write the Unity-side C API (iOS) / JNI (Android)

### iOS (C bridge in Unity)

Create `Assets/Plugins/iOS/UnityARBridge.mm` inside your Unity project:

```objc
#include <string>
#include "ARManager.h"   // your Unity AR manager header

extern "C" {
  void UnityAR_StartSession()  { ARManager::Get()->StartSession(); }
  void UnityAR_StopSession()   { ARManager::Get()->StopSession(); }
  void UnityAR_LoadGarment(const char* assetId, int colorIndex) {
    ARManager::Get()->LoadGarment(std::string(assetId), colorIndex);
  }
  void UnityAR_ClearGarment() { ARManager::Get()->ClearGarment(); }
  void UnityAR_SetOpacity(float o) { ARManager::Get()->SetGarmentOpacity(o); }
  const char* UnityAR_CaptureSnapshot() {
    return ARManager::Get()->CaptureSnapshot().c_str();
  }
  bool UnityAR_IsSupported() { return ARManager::Get()->IsSupported(); }
}
```

### Android (JNI bridge in Unity)

Create `Assets/Plugins/Android/UnityARBridge.java`:

```java
package com.unity3d.player;

public class UnityARBridge {
    public static native void startARSession();
    public static native void stopARSession();
    public static native void loadGarment(String assetId, int colorIndex);
    public static native void clearGarment();
    public static native void setGarmentOpacity(float opacity);
    public static native String captureSnapshot();
    public static native boolean isARSupported();
}
```

Then in your Unity C# `ARManager.cs` use `AndroidJavaClass` to call back to
React Native via `ARBridgeModule` (post body-tracking events, etc.).

---

## Step 4 — Garment Assets (Skinned Mesh)

For each product's `unityAssetId` (e.g. `garment_shirt_apex_tech`):

1. Import a **skinned mesh** FBX of the garment into Unity.
2. Add an **ARBodyTrackingManager** component that drives the garment's
   skeleton from the detected human body pose joints.
3. Create an **Addressable Asset** with the label matching the `unityAssetId`.
4. At runtime, `ARManager.LoadGarment(assetId, colorIndex)` loads the
   Addressable, instantiates it, and attaches it to the tracked body.

---

## Step 5 — Run on Device

### iOS

```bash
cd ios && pod install && cd ..
npx react-native run-ios --device "Your iPhone"
```

### Android

```bash
npx react-native run-android
```

---

## Body Tracking Joint Map (AR Foundation)

| Unity Joint | Used for |
|-------------|---------|
| `Hips` | Root anchor |
| `LeftShoulder` / `RightShoulder` | Shirt/jacket shoulder fit |
| `LeftUpperArm` / `RightUpperArm` | Sleeve alignment |
| `Spine` | Torso scaling |
| `Neck` | Collar position |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ARBridgeModule not linked` | Ensure `UNITY_FRAMEWORK_LINKED` (iOS) or `UNITY_LINKED=true` (Android) is set and Unity library is embedded |
| Body tracking confidence stays 0 | Ensure **Human Body Tracking** is enabled in ARKit settings; requires A12+ chip |
| Garment flickers | Increase shadow distance in URP settings; check skinned mesh bind poses |
| `pod install` fails with UnityFramework | Confirm `.xcframework` is at `ios/UnityFramework/` and Podfile path is correct |

---

## JS-Side AR Store Flow

```
User taps "Try On"
  → selectProduct(product)           [useArStore]
  → ARScreen mounts
  → NativeAR.startARSession()        [iOS: UnityAR_StartSession / Android: nativeStartARSession]
  → status: 'tracking'
  → NativeAR.loadGarment(assetId, colorIndex)
  → status: 'ready'
  → AR_EVENTS.BODY_TRACKED fires     [confidence updates TrackingIndicator]
  → Capture button → NativeAR.captureSnapshot()
```
