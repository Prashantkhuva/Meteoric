import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/pin_lock_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('PinLockService.isSet', () {
    test('returns false by default', () async {
      expect(await PinLockService.isSet(), isFalse);
    });

    test('returns true after setPin', () async {
      await PinLockService.setPin('1234');
      expect(await PinLockService.isSet(), isTrue);
    });

    test('returns false after clear', () async {
      await PinLockService.setPin('1234');
      await PinLockService.clear();
      expect(await PinLockService.isSet(), isFalse);
    });
  });

  group('PinLockService.setPin', () {
    test('rejects non-4-digit PINs', () async {
      expect(() => PinLockService.setPin('123'), throwsAssertionError);
      expect(() => PinLockService.setPin('12345'), throwsAssertionError);
      expect(() => PinLockService.setPin('12a4'), throwsAssertionError);
    });

    test('stores only a salted hash, never the raw PIN', () async {
      await PinLockService.setPin('1234');
      final prefs = await SharedPreferences.getInstance();
      final stored = prefs.getString('pin_lock_hash');
      final salt = prefs.getString('pin_lock_salt');

      expect(stored, isNotNull);
      expect(salt, isNotNull);
      expect(stored, isNot('1234'));
      expect(stored, isNot(contains('1234')));
    });

    test('re-rolls salt on each set, producing a different hash', () async {
      await PinLockService.setPin('1234');
      final firstHash = (await SharedPreferences.getInstance()).getString(
        'pin_lock_hash',
      );

      await PinLockService.setPin('1234');
      final secondHash = (await SharedPreferences.getInstance()).getString(
        'pin_lock_hash',
      );

      expect(firstHash, isNot(secondHash));
    });
  });

  group('PinLockService.verify', () {
    test('returns true for correct PIN', () async {
      await PinLockService.setPin('2468');
      expect(await PinLockService.verify('2468'), isTrue);
    });

    test('returns false for wrong PIN', () async {
      await PinLockService.setPin('2468');
      expect(await PinLockService.verify('0000'), isFalse);
    });

    test('returns false when no PIN is set', () async {
      expect(await PinLockService.verify('1234'), isFalse);
    });

    test('verify survives across instances (persists in prefs)', () async {
      await PinLockService.setPin('1357');
      expect(await PinLockService.verify('1357'), isTrue);
    });
  });

  group('PinLockService.createdAt', () {
    test('returns null when no PIN is set', () async {
      expect(await PinLockService.createdAt(), isNull);
    });

    test('returns timestamp after setPin', () async {
      await PinLockService.setPin('1234');
      final createdAt = await PinLockService.createdAt();
      expect(createdAt, isNotNull);
      final age = DateTime.now().difference(
        DateTime.fromMillisecondsSinceEpoch(createdAt!),
      );
      expect(age.inSeconds, lessThan(10));
    });
  });

  group('PinLockService.clear', () {
    test('removes all stored PIN data', () async {
      await PinLockService.setPin('1234');
      await PinLockService.clear();

      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getString('pin_lock_hash'), isNull);
      expect(prefs.getString('pin_lock_salt'), isNull);
      expect(prefs.getString('pin_lock_created_at'), isNull);
      expect(await PinLockService.isSet(), isFalse);
    });
  });
}
