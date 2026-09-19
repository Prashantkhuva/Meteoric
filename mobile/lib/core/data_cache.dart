import 'dart:async';
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

/// Lightweight in-memory + SharedPreferences cache for API responses.
///
/// Usage:
///   final data = await DataCache.instance.getOrFetch(
///     key: 'leads_page_1',
///     ttl: const Duration(minutes: 5),
///     fetch: () => ApiClient.instance.leadsList(page: 1),
///   );
///
/// Returns cached data immediately if fresh, fetches if stale/expired.
/// Falls back to stale cache on network error.
class DataCache {
  DataCache._();
  static final DataCache instance = DataCache._();

  final _memCache = <String, _CacheEntry>{};
  SharedPreferences? _prefs;
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;
    _prefs = await SharedPreferences.getInstance();
    _initialized = true;
  }

  /// Get data from cache or fetch. Returns (data, isStale).
  /// On network error: returns stale cache if available, else null.
  Future<(Map<String, dynamic>?, bool)> getOrFetch({
    required String key,
    required Future<Map<String, dynamic>> Function() fetch,
    Duration ttl = const Duration(minutes: 5),
  }) async {
    // 1. Check memory cache
    final mem = _memCache[key];
    if (mem != null && !mem.isExpired) {
      return (mem.data, false);
    }

    // 2. Fetch from network
    try {
      final data = await fetch();
      _set(key, data, ttl);
      return (data, false);
    } catch (err) {
      // 3. Fall back to stale memory cache
      if (mem != null) {
        return (mem.data, true);
      }

      // 4. Fall back to disk cache
      final disk = _getDisk(key);
      if (disk != null) {
        return (disk, true);
      }

      rethrow;
    }
  }

  /// Get list data from cache or fetch. Returns (data, isStale).
  Future<(List<Map<String, dynamic>>?, bool)> getListOrFetch({
    required String key,
    required Future<List<Map<String, dynamic>>> Function() fetch,
    Duration ttl = const Duration(minutes: 5),
  }) async {
    final mem = _memCache[key];
    if (mem != null && !mem.isExpired) {
      final list = (mem.data['data'] as List?) ?? [];
      return (list.cast<Map<String, dynamic>>(), false);
    }

    try {
      final data = await fetch();
      _set(key, {'data': data}, ttl);
      return (data, false);
    } catch (err) {
      if (mem != null) {
        final list = (mem.data['data'] as List?) ?? [];
        return (list.cast<Map<String, dynamic>>(), true);
      }
      final disk = _getDisk(key);
      if (disk != null) {
        final list = (disk['data'] as List?) ?? [];
        return (list.cast<Map<String, dynamic>>(), true);
      }
      rethrow;
    }
  }

  void _set(String key, Map<String, dynamic> data, Duration ttl) {
    _memCache[key] = _CacheEntry(data: data, expiresAt: DateTime.now().add(ttl));
    _saveDisk(key, data);
  }

  Map<String, dynamic>? _getDisk(String key) {
    try {
      final raw = _prefs?.getString('dc_$key');
      if (raw == null) return null;
      return (jsonDecode(raw) as Map).cast<String, dynamic>();
    } catch (_) {
      return null;
    }
  }

  void _saveDisk(String key, Map<String, dynamic> data) {
    try {
      _prefs?.setString('dc_$key', jsonEncode(data));
    } catch (_) {
      // Disk full or similar — ignore
    }
  }

  /// Invalidate a specific cache entry.
  void invalidate(String key) {
    _memCache.remove(key);
    _prefs?.remove('dc_$key');
  }

  /// Invalidate all entries matching a prefix.
  void invalidatePrefix(String prefix) {
    _memCache.removeWhere((k, _) => k.startsWith(prefix));
    for (final key in _prefs?.getKeys() ?? <String>{}) {
      if (key.startsWith('dc_$prefix')) _prefs?.remove(key);
    }
  }

  /// Clear everything.
  void clear() {
    _memCache.clear();
    for (final key in _prefs?.getKeys() ?? <String>{}) {
      if (key.startsWith('dc_')) _prefs?.remove(key);
    }
  }
}

class _CacheEntry {
  final Map<String, dynamic> data;
  final DateTime expiresAt;

  _CacheEntry({required this.data, required this.expiresAt});

  bool get isExpired => DateTime.now().isAfter(expiresAt);
}
