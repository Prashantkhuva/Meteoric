import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/data_cache.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  late DataCache cache;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    cache = DataCache.instance;
    await cache.init();
    cache.clear();
  });

  tearDown(() {
    cache.clear();
  });

  group('getOrFetch', () {
    test('returns fetched data on fresh cache miss', () async {
      final result = await cache.getOrFetch(
        key: 'test_key',
        fetch: () async => {'name': 'Prashant'},
      );
      expect(result.$1, {'name': 'Prashant'});
      expect(result.$2, isFalse);
    });

    test('returns cached data on second call without re-fetching', () async {
      var fetchCount = 0;
      final fetcher = () async {
        fetchCount++;
        return {'name': 'Prashant'};
      };

      await cache.getOrFetch(key: 'k', fetch: fetcher);
      await cache.getOrFetch(key: 'k', fetch: fetcher);

      expect(fetchCount, 1);
    });

    test('returns stale cache on network error', () async {
      await cache.getOrFetch(
        key: 'stale_test_k',
        fetch: () async => {'name': 'cached'},
        ttl: const Duration(hours: -1),
      );

      final result = await cache.getOrFetch(
        key: 'stale_test_k',
        fetch: () async => throw Exception('network'),
      );

      expect(result.$1, {'name': 'cached'});
      expect(result.$2, isTrue);
    });

    test('rethrows when no stale cache available', () async {
      expect(
        () => cache.getOrFetch(
          key: 'missing',
          fetch: () async => throw Exception('network'),
        ),
        throwsException,
      );
    });
  });

  group('invalidate', () {
    test('removes specific entry', () async {
      await cache.getOrFetch(key: 'a', fetch: () async => {'v': 1});
      cache.invalidate('a');

      var fetched = false;
      await cache.getOrFetch(
        key: 'a',
        fetch: () async {
          fetched = true;
          return {'v': 2};
        },
      );
      expect(fetched, isTrue);
    });
  });

  group('invalidatePrefix', () {
    test('removes all entries matching prefix', () async {
      await cache.getOrFetch(key: 'leads_1', fetch: () async => {'v': 1});
      await cache.getOrFetch(key: 'leads_2', fetch: () async => {'v': 2});
      await cache.getOrFetch(key: 'clients_1', fetch: () async => {'v': 3});

      cache.invalidatePrefix('leads_');

      var leadFetches = 0;
      await cache.getOrFetch(
        key: 'leads_1',
        fetch: () async {
          leadFetches++;
          return {'v': 10};
        },
      );
      expect(leadFetches, 1);

      // clients_1 should still be cached
      var clientFetches = 0;
      await cache.getOrFetch(
        key: 'clients_1',
        fetch: () async {
          clientFetches++;
          return {'v': 30};
        },
      );
      expect(clientFetches, 0);
    });
  });

  group('clear', () {
    test('removes all cache entries', () async {
      await cache.getOrFetch(key: 'a', fetch: () async => {'v': 1});
      await cache.getOrFetch(key: 'b', fetch: () async => {'v': 2});
      cache.clear();

      var fetchCount = 0;
      await cache.getOrFetch(
        key: 'a',
        fetch: () async {
          fetchCount++;
          return {'v': 3};
        },
      );
      expect(fetchCount, 1);
    });
  });
}
