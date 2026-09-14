import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/api_client.dart';

void main() {
  group('ApiException', () {
    test('stores message and status', () {
      final ex = ApiException('test error', status: 400);
      expect(ex.message, 'test error');
      expect(ex.status, 400);
    });

    test('isOffline returns true for status 0', () {
      final ex = ApiException.offline();
      expect(ex.isOffline, isTrue);
      expect(ex.status, 0);
      expect(ex.message, 'No internet connection');
    });

    test('isAuthError returns true for status 401', () {
      final ex = ApiException('Unauthorized', status: 401);
      expect(ex.isAuthError, isTrue);
    });

    test('isServerError returns true for status >= 500', () {
      expect(ApiException('', status: 500).isServerError, isTrue);
      expect(ApiException('', status: 502).isServerError, isTrue);
      expect(ApiException('', status: 499).isServerError, isFalse);
    });

    test('title returns correct heading for offline', () {
      expect(ApiException.offline().title, "You're offline");
    });

    test('title returns correct heading for auth error', () {
      expect(ApiException('', status: 401).title, 'Session expired');
    });

    test('title returns correct heading for server error', () {
      expect(ApiException('', status: 503).title, 'Server unavailable');
    });

    test('title returns generic heading for other errors', () {
      expect(ApiException('', status: 400).title, 'Something went wrong');
    });

    test('toString returns message', () {
      final ex = ApiException('test message');
      expect(ex.toString(), 'test message');
    });
  });
}
