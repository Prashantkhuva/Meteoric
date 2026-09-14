import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/updater.dart';

void main() {
  group('AppUpdate.fromJson', () {
    test('parses all fields correctly', () {
      final update = AppUpdate.fromJson({
        'version': '1.2.3',
        'build': 42,
        'url': 'https://example.com/app.apk',
        'notes': 'Bug fixes',
        'min_supported_build': 30,
      });
      expect(update.version, '1.2.3');
      expect(update.build, 42);
      expect(update.url, 'https://example.com/app.apk');
      expect(update.notes, 'Bug fixes');
      expect(update.minSupportedBuild, 30);
    });

    test('handles missing optional fields', () {
      final update = AppUpdate.fromJson({
        'version': '1.0.0',
        'build': 1,
        'url': 'https://example.com/app.apk',
      });
      expect(update.notes, isNull);
      expect(update.minSupportedBuild, isNull);
    });

    test('handles empty/null values gracefully', () {
      final update = AppUpdate.fromJson({});
      expect(update.version, '');
      expect(update.build, 0);
      expect(update.url, '');
    });

    test('handles numeric build as double', () {
      final update = AppUpdate.fromJson({
        'build': 42.0,
      });
      expect(update.build, 42);
    });

    test('toString formats correctly', () {
      final update = AppUpdate.fromJson({
        'version': '2.0.0',
        'build': 100,
        'url': 'https://example.com/app.apk',
      });
      expect(update.toString(), 'AppUpdate(v2.0.0, build=100)');
    });
  });
}
