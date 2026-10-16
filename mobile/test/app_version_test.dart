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

    test('runtimePatch returns 0 without an engine (test env)', () async {
      final patch = await AppVersion.runtimePatch;
      expect(patch, 0);
    });
  });
}
