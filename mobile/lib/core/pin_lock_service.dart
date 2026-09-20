import 'dart:convert';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _kPinHashKey = 'pin_lock_hash';
const _kPinSaltKey = 'pin_lock_salt';
const _kPinCreatedKey = 'pin_lock_created_at';

/// App-lock PIN. Stores only a salted SHA-256 hash — the PIN value is never
/// written to disk, so it cannot be recovered from preferences.
///
/// (A 4-digit PIN has a 10^4 keyspace, so the hash alone is brute-forceable
/// offline regardless of algorithm; the salt prevents rainbow-table reuse
/// across devices, and [AppLockView] enforces a failed-attempt lockout.)
class PinLockService {
  PinLockService._();

  static final Random _random = Random.secure();

  /// Whether a PIN has been configured.
  static Future<bool> isSet() async {
    final prefs = await SharedPreferences.getInstance();
    final hash = prefs.getString(_kPinHashKey);
    final salt = prefs.getString(_kPinSaltKey);
    return hash != null && hash.isNotEmpty && salt != null;
  }

  /// Create or replace the PIN. Salt is re-rolled on every set so an old
  /// hash can never be reused after a reconfiguration.
  static Future<void> setPin(String pin) async {
    assert(
      pin.length == 4 && RegExp(r'^[0-9]{4}$').hasMatch(pin),
      'PIN must be exactly 4 digits',
    );
    final salt = _randomSalt(12);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kPinSaltKey, salt);
    await prefs.setString(_kPinHashKey, _hash(pin, salt));
    await prefs.setInt(_kPinCreatedKey, DateTime.now().millisecondsSinceEpoch);
  }

  /// Check a PIN against the stored hash. Returns false when no PIN is set.
  static Future<bool> verify(String pin) async {
    final prefs = await SharedPreferences.getInstance();
    final hash = prefs.getString(_kPinHashKey);
    final salt = prefs.getString(_kPinSaltKey);
    if (hash == null || salt == null) return false;
    return _hash(pin, salt) == hash;
  }

  /// Remove the PIN entirely.
  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kPinHashKey);
    await prefs.remove(_kPinSaltKey);
    await prefs.remove(_kPinCreatedKey);
  }

  /// Timestamp the PIN was created/updated (ms epoch). Null when unset.
  static Future<int?> createdAt() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_kPinCreatedKey);
  }

  static String _randomSalt(int bytes) {
    final list = List<int>.generate(bytes, (_) => _random.nextInt(256));
    return base64UrlEncode(list);
  }

  static String _hash(String pin, String salt) {
    final digest = sha256.convert(utf8.encode('$salt:$pin'));
    return digest.toString();
  }
}
