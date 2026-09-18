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

  /// Enable biometric lock. Prompts user to authenticate first.
  /// Returns true only if authentication succeeds and preference is saved.
  static Future<bool> enable({String? reason}) async {
    final authed = await authenticate(
      reason: reason ?? 'Enable biometric lock',
    );
    if (!authed) return false;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kBiometricKey, true);
    return true;
  }

  /// Disable biometric lock. No prompt needed.
  static Future<bool> disable() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kBiometricKey, false);
    return true;
  }

  /// Toggle the preference. Prompts on enable, returns new value.
  static Future<bool> toggle({String? reason}) async {
    final current = await isEnabled;
    if (current) return disable();
    return enable(reason: reason);
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
