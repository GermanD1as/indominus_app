#import "ARBridgeModule.h"
#import <React/RCTLog.h>

// ---------------------------------------------------------------------------
// Unity as a Library — forward declarations
// When Unity is embedded as a framework, these symbols resolve at link time.
// Remove the stub implementations below once you link UnityFramework.
// ---------------------------------------------------------------------------
#ifdef UNITY_FRAMEWORK_LINKED
extern void UnityAR_StartSession(void);
extern void UnityAR_StopSession(void);
extern void UnityAR_LoadGarment(const char *assetId, int colorIndex);
extern void UnityAR_ClearGarment(void);
extern void UnityAR_SetOpacity(float opacity);
extern const char *UnityAR_CaptureSnapshot(void); // returns temp file path
extern bool UnityAR_IsSupported(void);
#endif

@implementation ARBridgeModule {
  BOOL _hasListeners;
}

RCT_EXPORT_MODULE(ARBridgeModule);

// ── Events ────────────────────────────────────────────────────────────────
- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"onBodyTracked",
    @"onGarmentLoaded",
    @"onARError",
    @"onSessionStateChanged",
  ];
}

- (void)startObserving {
  _hasListeners = YES;
}

- (void)stopObserving {
  _hasListeners = NO;
}

// ── Helper ─────────────────────────────────────────────────────────────────
- (void)emitEvent:(NSString *)name body:(NSDictionary *)body {
  if (_hasListeners) {
    [self sendEventWithName:name body:body];
  }
}

// ── Exported Methods ───────────────────────────────────────────────────────
RCT_EXPORT_METHOD(startARSession
                  : (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
#ifdef UNITY_FRAMEWORK_LINKED
  dispatch_async(dispatch_get_main_queue(), ^{
    UnityAR_StartSession();
    [self emitEvent:@"onSessionStateChanged" body:@{@"state": @"initializing"}];
    resolve(nil);
  });
#else
  RCTLogWarn(@"[ARBridgeModule] Unity framework not linked. Rebuild with UnityFramework embedded.");
  reject(@"AR_NOT_LINKED", @"Unity framework not linked", nil);
#endif
}

RCT_EXPORT_METHOD(stopARSession
                  : (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
#ifdef UNITY_FRAMEWORK_LINKED
  dispatch_async(dispatch_get_main_queue(), ^{
    UnityAR_StopSession();
    resolve(nil);
  });
#else
  resolve(nil);
#endif
}

RCT_EXPORT_METHOD(loadGarment
                  : (NSString *)assetId
                  colorIndex:(NSInteger)colorIndex
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
#ifdef UNITY_FRAMEWORK_LINKED
  dispatch_async(dispatch_get_main_queue(), ^{
    UnityAR_LoadGarment([assetId UTF8String], (int)colorIndex);
    [self emitEvent:@"onGarmentLoaded" body:@{@"assetId": assetId}];
    resolve(nil);
  });
#else
  reject(@"AR_NOT_LINKED", @"Unity framework not linked", nil);
#endif
}

RCT_EXPORT_METHOD(clearGarment
                  : (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
#ifdef UNITY_FRAMEWORK_LINKED
  dispatch_async(dispatch_get_main_queue(), ^{
    UnityAR_ClearGarment();
    resolve(nil);
  });
#else
  resolve(nil);
#endif
}

RCT_EXPORT_METHOD(setGarmentOpacity
                  : (double)opacity
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
#ifdef UNITY_FRAMEWORK_LINKED
  dispatch_async(dispatch_get_main_queue(), ^{
    UnityAR_SetOpacity((float)opacity);
    resolve(nil);
  });
#else
  resolve(nil);
#endif
}

RCT_EXPORT_METHOD(captureSnapshot
                  : (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
#ifdef UNITY_FRAMEWORK_LINKED
  dispatch_async(dispatch_get_main_queue(), ^{
    const char *path = UnityAR_CaptureSnapshot();
    if (path) {
      resolve(@(path));
    } else {
      reject(@"SNAPSHOT_FAILED", @"Snapshot returned null path", nil);
    }
  });
#else
  reject(@"AR_NOT_LINKED", @"Unity framework not linked", nil);
#endif
}

RCT_EXPORT_METHOD(isARSupported
                  : (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
#ifdef UNITY_FRAMEWORK_LINKED
  resolve(@(UnityAR_IsSupported()));
#else
  resolve(@NO);
#endif
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
