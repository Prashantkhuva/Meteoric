/// Single source of truth for "what build is running".
///
/// RULE: update this file on EVERY ship —
///   • new release  → bump [version] (pubspec.yaml too) and reset [patch] to 0
///   • shorebird patch → increment [patch], leave [version] alone
/// Always set [updatedAt] to the ship time. Settings shows these values.
class AppVersion {
  static const String version = '0.10.2+1';
  static const int patch = 0;
  static const String updatedAt = '1 Sep 2026 · 9:00 PM';

  static String get display => patch > 0 ? '$version (patch $patch)' : version;
}
