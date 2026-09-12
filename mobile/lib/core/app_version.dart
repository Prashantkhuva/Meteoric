import 'package:shorebird_code_push/shorebird_code_push.dart';

/// Single source of truth for "what build is running".
///
/// RULE: update this file on EVERY ship —
///   • new release  → bump [version] (pubspec.yaml too) and reset [patch] to 0
///   • shorebird patch → increment [patch], leave [version] alone
/// Always set [updatedAt] to the ship time (IST). Settings shows these values.
class AppVersion {
  static const String version = '0.14.0+1';
  static const int patch = 3;
  static const String updatedAt = '12 Sep 2026 · 6:34 PM';

  static final _updater = ShorebirdUpdater();

  /// Live patch number from Shorebird engine. Returns null when no patch
  /// is installed (base release).
  static Future<int> get runtimePatch async {
    try {
      final current = await _updater.readCurrentPatch();
      return current?.number ?? 0;
    } catch (_) {
      return 0;
    }
  }

  /// Build-time const for display before async lookup completes.
  static String get display => patch > 0 ? '$version (patch $patch)' : version;

  /// Runtime display with live patch number.
  static Future<String> get runtimeDisplay async {
    final p = await runtimePatch;
    return p > 0 ? '$version (patch $p)' : version;
  }
}
