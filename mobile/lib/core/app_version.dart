/// Single source of truth for "what build is running".
///
/// RULE: update this file on EVERY ship —
///   • new release  → bump [version] (pubspec.yaml too) and reset [patch] to 0
///   • shorebird patch → increment [patch], leave [version] alone
/// Always set [updatedAt] to the ship time. Settings shows these values.
class AppVersion {
  static const String version = '0.4.1+6';
  static const int patch = 0;
  static const String updatedAt = '21 Aug 2026 · 8:26 PM';

  static String get display => patch > 0 ? '$version (patch $patch)' : version;
}
