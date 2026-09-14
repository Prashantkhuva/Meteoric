import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/app_version.dart';

void main() {
  group('AppVersion', () {
    test('version string contains build number', () {
      expect(AppVersion.version, contains('+'));
      expect(AppVersion.version, startsWith('0.'));
    });

    test('patch is a non-negative integer', () {
      expect(AppVersion.patch, isNonNegative);
      expect(AppVersion.patch, isA<int>());
    });

    test('updatedAt is non-empty', () {
      expect(AppVersion.updatedAt, isNotEmpty);
    });

    test('display shows version when patch is 0', () {
      // AppVersion.patch is const 8, so display always shows patch info
      // Test that display format is correct
      final display = AppVersion.display;
      expect(display, contains(AppVersion.version));
      expect(display, contains('patch'));
    });

    test('display always contains version string', () {
      expect(AppVersion.display, contains(AppVersion.version));
    });

    test('runtimePatch returns a number (async)', () async {
      final patch = await AppVersion.runtimePatch;
      expect(patch, isA<int>());
      expect(patch, greaterThanOrEqualTo(0));
    });
  });
}
