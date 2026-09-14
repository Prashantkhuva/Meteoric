import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/update_state.dart';

void main() {
  group('UpdateState', () {
    late UpdateState state;

    setUp(() {
      state = UpdateState.instance;
      // Reset to clean state before each test
      state.dismiss();
    });

    test('starts with no update', () {
      expect(state.update, isNull);
      expect(state.hasUpdate, isFalse);
      expect(state.progress, isNull);
      expect(state.error, isNull);
      expect(state.checking, isFalse);
      expect(state.dismissed, isTrue);
    });

    test('hasUpdate returns false when update is null', () {
      expect(state.hasUpdate, isFalse);
    });

    test('hasUpdate returns false when dismissed is true', () {
      state.dismiss();
      expect(state.hasUpdate, isFalse);
    });

    test('dismiss clears update and sets dismissed flag', () {
      state.dismiss();
      expect(state.update, isNull);
      expect(state.dismissed, isTrue);
      expect(state.hasUpdate, isFalse);
    });

    test('showBanner returns false when no update and not force upgrade', () {
      expect(state.showBanner, isFalse);
    });

    test('shorebird state starts clean', () {
      expect(state.shorebirdChecking, isFalse);
      expect(state.shorebirdUpdateAvailable, isFalse);
      expect(state.shorebirdUpdating, isFalse);
      expect(state.shorebirdRestartReady, isFalse);
      expect(state.shorebirdError, isNull);
      expect(state.showShorebirdBanner, isFalse);
    });

    test('dismissShorebird clears shorebird state', () {
      state.dismissShorebird();
      expect(state.shorebirdUpdateAvailable, isFalse);
      expect(state.shorebirdError, isNull);
    });

    test('cancelDownload sets error message', () {
      state.cancelDownload();
      expect(state.downloading, isFalse);
      expect(state.progress, isNull);
      expect(state.error, 'Download cancelled.');
    });

    test('needsInstallPermission starts false', () {
      expect(state.needsInstallPermission, isFalse);
    });

    test('forceUpgrade returns false when no update', () {
      expect(state.forceUpgrade, isFalse);
    });
  });
}
