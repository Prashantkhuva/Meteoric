import 'package:flutter/foundation.dart';

/// Stub FCM service — Firebase deps removed for now.
/// Preserves the same API so callers don't break.
/// Re-enable by adding `firebase_core` + `firebase_messaging` to pubspec.yaml.
class FcmService {
  FcmService._();
  static final instance = FcmService._();

  /// Initialize FCM. No-op without Firebase deps.
  Future<void> init() async {
    debugPrint('FCM: stub — Firebase not configured');
  }

  /// Remove FCM token on sign out. No-op.
  Future<void> removeToken() async {
    // No-op
  }
}
