import 'package:shorebird_code_push/shorebird_code_push.dart';

/// Single source of truth for "what build is running".
///
/// RULE: update this file on EVERY ship —
///   • new release  → bump [version] (pubspec.yaml too) and reset [patch] to 0
///   • shorebird patch → increment [patch], leave [version] alone
/// Always set [updatedAt] to the ship time (IST). Settings shows these values.
class AppVersion {
  static const String version = '0.23.0+25';
  static const int patch = 1;
  static const String updatedAt = '17 Oct 2026 · 5:52 PM';

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
}
