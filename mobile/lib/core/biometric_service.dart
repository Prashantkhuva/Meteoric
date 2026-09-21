import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _kBiometricKey = 'biometric_enabled';

/// Thin wrapper around `local_auth`. Handles preference persistence
/// and the native auth prompt.
class BiometricService {
  BiometricService._();
  static final _auth = LocalAuthentication();

  /// Whether the device supports biometric auth AND has enrolled biometrics.
  static Future<bool> get isAvailable async {
    try {
      final canCheck = await _auth.canCheckBiometrics;
      debugPrint('[Biometric] canCheckBiometrics=$canCheck');
      if (!canCheck) return false;
      final available = await _auth.getAvailableBiometrics();
      debugPrint('[Biometric] available types=$available');
      return available.isNotEmpty;
    } on PlatformException catch (e) {
      debugPrint('[Biometric] isAvailable PlatformException: ${e.message}');
      return false;
    } catch (e) {
      debugPrint('[Biometric] isAvailable unexpected error: $e');
      return false;
    }
  }

  /// Whether biometric lock is enabled by the user.
  static Future<bool> get isEnabled async {
    final prefs = await SharedPreferences.getInstance();
    final val = prefs.getBool(_kBiometricKey) ?? false;
    debugPrint('[Biometric] isEnabled=$val');
    return val;
  }

  /// Enable biometric lock. Prompts user to authenticate first.
  /// Returns true only if authentication succeeds and preference is saved.
  static Future<bool> enable({String? reason}) async {
    debugPrint('[Biometric] enable() called, reason=$reason');
    final authed = await authenticate(
      reason: reason ?? 'Enable biometric lock',
    );
    debugPrint('[Biometric] enable() authenticate result=$authed');
    if (!authed) return false;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kBiometricKey, true);
    debugPrint('[Biometric] enable() preference saved=true');
    return true;
  }

  /// Disable biometric lock. No prompt needed.
  static Future<bool> disable() async {
    debugPrint('[Biometric] disable() called');
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kBiometricKey, false);
    debugPrint('[Biometric] disable() preference saved=false');
    return false;
  }

  /// Toggle the preference. Prompts on enable, returns new value.
  static Future<bool> toggle({String? reason}) async {
    final current = await isEnabled;
    debugPrint('[Biometric] toggle() current=$current');
    if (current) return disable();
    return enable(reason: reason);
  }

  /// Show the native biometric prompt. Returns true on success.
  static Future<bool> authenticate({String? reason}) async {
    try {
      debugPrint('[Biometric] authenticate() showing prompt...');
      final result = await _auth.authenticate(
        localizedReason: reason ?? 'Verify your identity',
        // False: with `true`, the prompt can stay stuck open when the app
        // backgrounds mid-request and then force-closes on resume (seen on
        // some OEM devices — the stuck modal blocks the PIN keypad beneath).
        persistAcrossBackgrounding: false,
      );
      debugPrint('[Biometric] authenticate() result=$result');
      return result;
    } on PlatformException catch (e) {
      debugPrint(
        '[Biometric] authenticate() PlatformException: code=${e.code} message=${e.message}',
      );
      return false;
    } catch (e) {
      debugPrint('[Biometric] authenticate() unexpected error: $e');
      return false;
    }
  }

  /// Force-dismiss the native fingerprint dialog. Android-only no-op when
  /// nothing is showing. Call after a failed/cancelled authenticate so the
  /// modal can never linger over the app UI.
  static Future<void> stopPrompt() async {
    try {
      await _auth.stopAuthentication();
    } catch (e) {
      debugPrint('[Biometric] stopPrompt() error: $e');
    }
  }
}
