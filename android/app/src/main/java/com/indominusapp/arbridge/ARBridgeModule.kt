package com.indominusapp.arbridge

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * ARBridgeModule — React Native ↔ Unity AR bridge for Android.
 *
 * Unity as a Library is embedded as a Gradle dependency and communicates
 * over JNI. The native (JNI) functions are declared below; they are resolved
 * once UnityFramework.jar and libUnityAR.so are present in the build.
 *
 * Steps to activate:
 *  1. Export your Unity project to Android ("Export Project" in Build Settings).
 *  2. Copy the exported `unityLibrary/` module into this project root.
 *  3. Add `include ':unityLibrary'` to settings.gradle.
 *  4. Add `implementation project(':unityLibrary')` to app/build.gradle.
 *  5. Replace JNI stub bodies with real Unity calls.
 *  6. Define UNITY_LINKED=true in gradle.properties to enable.
 */
class ARBridgeModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "ARBridgeModule"
        private val UNITY_LINKED = BuildConfig.UNITY_LINKED
    }

    override fun getName(): String = NAME

    // ── JNI declarations (resolved when unityLibrary is linked) ────────────
    private external fun nativeStartARSession()
    private external fun nativeStopARSession()
    private external fun nativeLoadGarment(assetId: String, colorIndex: Int)
    private external fun nativeClearGarment()
    private external fun nativeSetGarmentOpacity(opacity: Float)
    private external fun nativeCaptureSnapshot(): String?
    private external fun nativeIsARSupported(): Boolean

    // ── Event emission ──────────────────────────────────────────────────────
    private fun emit(event: String, payload: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(event, payload)
    }

    fun onBodyTracked(confidence: Double) {
        val map = Arguments.createMap().apply { putDouble("confidence", confidence) }
        emit("onBodyTracked", map)
    }

    fun onGarmentLoaded(assetId: String) {
        val map = Arguments.createMap().apply { putString("assetId", assetId) }
        emit("onGarmentLoaded", map)
    }

    fun onARError(code: String, message: String) {
        val map = Arguments.createMap().apply {
            putString("code", code)
            putString("message", message)
        }
        emit("onARError", map)
    }

    fun onSessionStateChanged(state: String) {
        val map = Arguments.createMap().apply { putString("state", state) }
        emit("onSessionStateChanged", map)
    }

    // ── React-exposed methods ───────────────────────────────────────────────
    @ReactMethod
    fun startARSession(promise: Promise) {
        if (!UNITY_LINKED) {
            promise.reject("AR_NOT_LINKED", "Unity library not linked. See setup guide.")
            return
        }
        try {
            nativeStartARSession()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("AR_START_FAILED", e.message, e)
        }
    }

    @ReactMethod
    fun stopARSession(promise: Promise) {
        if (!UNITY_LINKED) { promise.resolve(null); return }
        try { nativeStopARSession(); promise.resolve(null) }
        catch (e: Exception) { promise.reject("AR_STOP_FAILED", e.message, e) }
    }

    @ReactMethod
    fun loadGarment(assetId: String, colorIndex: Int, promise: Promise) {
        if (!UNITY_LINKED) {
            promise.reject("AR_NOT_LINKED", "Unity library not linked.")
            return
        }
        try { nativeLoadGarment(assetId, colorIndex); promise.resolve(null) }
        catch (e: Exception) { promise.reject("GARMENT_LOAD_FAILED", e.message, e) }
    }

    @ReactMethod
    fun clearGarment(promise: Promise) {
        if (!UNITY_LINKED) { promise.resolve(null); return }
        try { nativeClearGarment(); promise.resolve(null) }
        catch (e: Exception) { promise.reject("GARMENT_CLEAR_FAILED", e.message, e) }
    }

    @ReactMethod
    fun setGarmentOpacity(opacity: Double, promise: Promise) {
        if (!UNITY_LINKED) { promise.resolve(null); return }
        try { nativeSetGarmentOpacity(opacity.toFloat()); promise.resolve(null) }
        catch (e: Exception) { promise.reject("OPACITY_FAILED", e.message, e) }
    }

    @ReactMethod
    fun captureSnapshot(promise: Promise) {
        if (!UNITY_LINKED) {
            promise.reject("AR_NOT_LINKED", "Unity library not linked.")
            return
        }
        try {
            val path = nativeCaptureSnapshot()
            if (path != null) promise.resolve(path)
            else promise.reject("SNAPSHOT_FAILED", "Snapshot returned null")
        } catch (e: Exception) { promise.reject("SNAPSHOT_FAILED", e.message, e) }
    }

    @ReactMethod
    fun isARSupported(promise: Promise) {
        if (!UNITY_LINKED) { promise.resolve(false); return }
        try { promise.resolve(nativeIsARSupported()) }
        catch (e: Exception) { promise.resolve(false) }
    }
}
