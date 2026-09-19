import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/biometric_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('BiometricService.isEnabled', () {
    test('returns false by default', () async {
      expect(await BiometricService.isEnabled, isFalse);
    });

    test('returns true after enable saves preference', () async {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('biometric_enabled', true);
      expect(await BiometricService.isEnabled, isTrue);
    });
  });

  group('BiometricService.disable', () {
    test('sets preference to false', () async {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('biometric_enabled', true);

      final result = await BiometricService.disable();

      expect(result, isFalse);
      expect(await BiometricService.isEnabled, isFalse);
    });
  });
}
