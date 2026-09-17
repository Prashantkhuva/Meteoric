import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';

/// Lightweight wrapper around device_info_plus.
/// Caches values after first read — safe to call [info] multiple times.
class DeviceInfo {
  static DeviceInfoPlugin? _plugin;
  static AndroidDeviceInfo? _android;
  static String? _cachedSummary;

  static Future<void> init() async {
    _plugin = DeviceInfoPlugin();
    _android = await _plugin!.androidInfo;
  }

  static AndroidDeviceInfo get _device {
    if (_android == null) throw StateError('DeviceInfo.init() not called');
    return _android!;
  }

  /// Human-readable string for error reports: "Pixel 8 (Android 15, SDK 35)".
  static String get summary {
    if (_cachedSummary != null) return _cachedSummary!;
    if (!Platform.isAndroid) return 'unknown';
    final d = _device;
    _cachedSummary = '${d.model} (Android ${d.version.release}, SDK ${d.version.sdkInt})';
    return _cachedSummary!;
  }

  static String get model => Platform.isAndroid ? _device.model : 'unknown';
  static String get osVersion =>
      Platform.isAndroid ? 'Android ${_device.version.release}' : 'unknown';
  static int get sdkInt =>
      Platform.isAndroid ? _device.version.sdkInt : 0;
  static String get brand => Platform.isAndroid ? _device.brand : 'unknown';
  static String get device => Platform.isAndroid ? _device.device : 'unknown';
}
