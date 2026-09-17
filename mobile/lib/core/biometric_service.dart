import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _kBiometricKey = 'biometric_enabled';

/// Thin wrapper around `local_auth`. Handles preference persistence
/// and the native auth prompt.
class BiometricService {
  BiometricService._();
  static final _auth = LocalAuthentication();

  /// Whether the device supports biometric auth at all.
  static Future<bool> get isAvailable async {
    try {
      return await _auth.canCheckBiometrics;
    } on PlatformException {
      return false;
    }
  }

  /// Whether biometric lock is enabled by the user.
  static Future<bool> get isEnabled async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_kBiometricKey) ?? false;
  }

  /// Toggle the preference. Returns the new value.
  static Future<bool> toggle() async {
    final prefs = await SharedPreferences.getInstance();
    final next = !(prefs.getBool(_kBiometricKey) ?? false);
    await prefs.setBool(_kBiometricKey, next);
    return next;
  }

  /// Show the native biometric prompt. Returns true on success.
  static Future<bool> authenticate({String? reason}) async {
    try {
      return await _auth.authenticate(
        localizedReason: reason ?? 'Verify your identity',
      );
    } on PlatformException {
      return false;
    }
  }
}
