import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/formatters.dart';

void main() {
  group('parseJsonList', () {
    test('returns list when given a List', () {
      final result = parseJsonList([
        {'id': 1},
        {'id': 2},
      ]);
      expect(result.length, 2);
      expect(result[0]['id'], 1);
    });

    test('parses JSON string into list', () {
      final result = parseJsonList('[{"id":1},{"id":2}]');
      expect(result.length, 2);
      expect(result[1]['id'], 2);
    });

    test('returns empty list for null', () {
      expect(parseJsonList(null), isEmpty);
    });

    test('returns empty list for invalid JSON string', () {
      expect(parseJsonList('not json'), isEmpty);
    });

    test('returns empty list for non-list JSON', () {
      expect(parseJsonList('{"key":"value"}'), isEmpty);
    });
  });

  group('parseJsonNum', () {
    test('returns num directly', () {
      expect(parseJsonNum(42), 42);
      expect(parseJsonNum(3.14), 3.14);
    });

    test('parses numeric string', () {
      expect(parseJsonNum('100'), 100);
      expect(parseJsonNum('3.14'), 3.14);
    });

    test('returns fallback for non-numeric string', () {
      expect(parseJsonNum('abc'), 0);
      expect(parseJsonNum('abc', 5), 5);
    });

    test('returns fallback for null', () {
      expect(parseJsonNum(null), 0);
      expect(parseJsonNum(null, -1), -1);
    });

    test('returns fallback for unsupported types', () {
      expect(parseJsonNum(true), 0);
      expect(parseJsonNum([]), 0);
    });
  });

  group('Fmt.date', () {
    test('returns dash for null', () {
      expect(Fmt.date(null), '—');
    });

    test('returns dash for empty string', () {
      expect(Fmt.date(''), '—');
    });

    test('formats valid ISO date', () {
      final result = Fmt.date('2026-01-15T10:30:00Z');
      expect(result, contains('Jan'));
      expect(result, contains('15'));
      expect(result, contains('2026'));
    });

    test('returns raw string for invalid date', () {
      expect(Fmt.date('not-a-date'), 'not-a-date');
    });
  });

  group('Fmt.shortDate', () {
    test('returns dash for null', () {
      expect(Fmt.shortDate(null), '—');
    });

    test('formats without year', () {
      final result = Fmt.shortDate('2026-01-15T10:30:00Z');
      expect(result, contains('Jan'));
      expect(result, contains('15'));
      expect(result.contains('2026'), isFalse);
    });
  });

  group('Fmt.money', () {
    test('returns dash for null', () {
      expect(Fmt.money(null), '—');
    });

    test('formats USD by default', () {
      expect(Fmt.money(1234), '\$1,234');
    });

    test('formats USD explicitly', () {
      expect(Fmt.money(1234, currency: 'USD'), '\$1,234');
    });

    test('formats INR', () {
      final result = Fmt.money(1234, currency: 'INR');
      expect(result, contains('₹'));
      expect(result, contains('1,234'));
    });

    test('formats EUR', () {
      final result = Fmt.money(1234, currency: 'EUR');
      expect(result, contains('€'));
    });

    test('formats GBP', () {
      final result = Fmt.money(1234, currency: 'GBP');
      expect(result, contains('£'));
    });

    test('rounds decimals (decimalDigits=0)', () {
      expect(Fmt.money(1234.56), '\$1,235');
    });
  });

  group('Fmt.timeAgo', () {
    test('returns dash for null', () {
      expect(Fmt.timeAgo(null), '—');
    });

    test('returns just now for very recent', () {
      final now = DateTime.now().toUtc().toIso8601String();
      expect(Fmt.timeAgo(now), 'just now');
    });

    test('returns minutes ago', () {
      final fiveMinAgo =
          DateTime.now().subtract(const Duration(minutes: 5)).toUtc().toIso8601String();
      expect(Fmt.timeAgo(fiveMinAgo), '5m ago');
    });

    test('returns hours ago', () {
      final twoHoursAgo =
          DateTime.now().subtract(const Duration(hours: 2)).toUtc().toIso8601String();
      expect(Fmt.timeAgo(twoHoursAgo), '2h ago');
    });

    test('returns days ago', () {
      final threeDaysAgo =
          DateTime.now().subtract(const Duration(days: 3)).toUtc().toIso8601String();
      expect(Fmt.timeAgo(threeDaysAgo), '3d ago');
    });
  });

  group('Fmt.percent', () {
    test('returns dash for null', () {
      expect(Fmt.percent(null), '—');
    });

    test('formats with default suffix', () {
      expect(Fmt.percent(85), '85%');
    });

    test('formats with custom suffix', () {
      expect(Fmt.percent(85, suffix: '%'), '85%');
    });
  });
}
