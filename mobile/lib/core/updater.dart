import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

import 'app_version.dart';
import 'config.dart';

/// Remote release manifest served from the public Supabase Storage bucket
/// `app-releases` (`latest.json`).
class AppUpdate {
  const AppUpdate({
    required this.version,
    required this.build,
    required this.url,
    this.notes,
    this.minSupportedBuild,
  });

  factory AppUpdate.fromJson(Map<String, dynamic> json) => AppUpdate(
    version: json['version'] as String? ?? '',
    build: (json['build'] as num?)?.toInt() ?? 0,
    url: json['url'] as String? ?? '',
    notes: json['notes'] as String?,
    minSupportedBuild: (json['min_supported_build'] as num?)?.toInt(),
  );

  final String version;
  final int build;
  final String url;
  final String? notes;
  final int? minSupportedBuild;

  @override
  String toString() => 'AppUpdate(v$version, build=$build)';
}

/// In-app updater: checks a remote manifest, downloads the new APK with
/// progress, and hands it to the Android package installer via a platform
/// channel (see MainActivity.kt).
class Updater {
  Updater._();

  static const MethodChannel _channel = MethodChannel('meteoric/updater');
  static const String _manifestUrl =
      '${AppConfig.supabaseUrl}/storage/v1/object/public/app-releases/latest.json';
  static const String _apkName = 'meteoric-admin.apk';
  static const int _maxRetries = 2;

  /// Returns the available update, or null when up to date / unreachable.
  ///
  /// Retries up to [_maxRetries] times on network errors. Adds a cache-busting
  /// query parameter so CDN/proxy caches don't serve a stale manifest.
  static Future<AppUpdate?> checkForUpdate() async {
    for (var attempt = 0; attempt <= _maxRetries; attempt++) {
      try {
        final uri = Uri.parse('$_manifestUrl?t=${DateTime.now().millisecondsSinceEpoch}');
        final res = await http
            .get(uri)
            .timeout(const Duration(seconds: 10));
        if (res.statusCode != 200) {
          if (attempt < _maxRetries) continue;
          return null;
        }
        final update = AppUpdate.fromJson(
          (jsonDecode(res.body) as Map).cast<String, dynamic>(),
        );
        if (update.url.isEmpty) return null;

        // First check build number, then fall back to semver
        if (update.build > _localBuild) return update;
        if (update.build == _localBuild &&
            update.version.isNotEmpty &&
            _compareSemver(update.version, _localVersion) > 0) {
          return update;
        }
        return null; // Up to date
      } on SocketException {
        if (attempt < _maxRetries) continue;
        return null;
      } on TimeoutException {
        if (attempt < _maxRetries) continue;
        return null;
      } on http.ClientException {
        if (attempt < _maxRetries) continue;
        return null;
      } catch (_) {
        return null; // Unknown error — don't retry
      }
    }
    return null;
  }

  /// Parses "X.Y.Z" and returns +1 / 0 / -1 comparison.
  static int _compareSemver(String a, String b) {
    final pa = a.split('.').map(int.tryParse).toList();
    final pb = b.split('.').map(int.tryParse).toList();
    for (var i = 0; i < 3; i++) {
      final va = i < pa.length ? (pa[i] ?? 0) : 0;
      final vb = i < pb.length ? (pb[i] ?? 0) : 0;
      if (va != vb) return va.compareTo(vb);
    }
    return 0;
  }

  static String get _localVersion {
    final plus = AppVersion.version.split('+');
    return plus.first;
  }

  static int get _localBuild {
    final plus = AppVersion.version.split('+');
    return plus.length > 1 ? int.tryParse(plus[1]) ?? 0 : 0;
  }

  /// Downloads [update] to the app cache dir, reporting 0..1 progress.
  ///
  /// Retries once on transient failures. Uses an overall timeout of 5 minutes
  /// to prevent hung downloads on slow connections.
  static Future<String> download(
    AppUpdate update, {
    void Function(double progress)? onProgress,
  }) async {
    final dir = await getTemporaryDirectory();
    final updatesDir = Directory('${dir.path}/updates');
    if (!updatesDir.existsSync()) updatesDir.createSync(recursive: true);
    final file = File('${updatesDir.path}/$_apkName');
    if (file.existsSync()) file.deleteSync();

    Exception? lastError;
    for (var attempt = 0; attempt <= _maxRetries; attempt++) {
      final client = http.Client();
      try {
        final request = http.Request('GET', Uri.parse(update.url));
        final response = await client
            .send(request)
            .timeout(const Duration(seconds: 30));
        if (response.statusCode != 200) {
          throw Exception('Download failed (${response.statusCode})');
        }
        final total = response.contentLength ?? 0;
        final sink = file.openWrite();
        var received = 0;
        final completer = Completer<void>();

        // Overall 5-minute timeout for the entire download
        final timer = Timer(const Duration(minutes: 5), () {
          if (!completer.isCompleted) {
            client.close();
            completer.completeError(TimeoutException('Download timed out'));
          }
        });

        try {
          await response.stream.forEach((chunk) {
            received += chunk.length;
            sink.add(chunk);
            if (total > 0 && onProgress != null) {
              onProgress(received / total);
            }
          });
          await sink.close();
          if (!file.existsSync()) throw Exception('Download incomplete');
          timer.cancel();
          return file.path;
        } catch (e) {
          timer.cancel();
          await sink.close();
          rethrow;
        }
      } on SocketException catch (e) {
        lastError = Exception('Network error: ${e.message}');
      } on TimeoutException catch (_) {
        lastError = Exception('Connection timed out');
      } on http.ClientException catch (e) {
        lastError = Exception('Connection error: ${e.message}');
      } catch (e) {
        lastError = Exception(e.toString());
      } finally {
        client.close();
      }

      // Clean up partial download before retry
      if (file.existsSync()) file.deleteSync();

      if (attempt < _maxRetries) {
        // Brief delay before retry
        await Future<void>.delayed(const Duration(seconds: 2));
      }
    }
    throw lastError ?? Exception('Download failed');
  }

  /// Checks whether the app has permission to install unknown apps.
  static Future<bool> canInstallPackages() async {
    try {
      return await _channel.invokeMethod<bool>('canInstallPackages') ?? true;
    } catch (_) {
      return true; // Assume allowed on older Android versions
    }
  }

  /// Opens the system settings for "Install unknown apps" permission.
  static Future<void> requestInstallPermission() async {
    await _channel.invokeMethod<void>('requestInstallPermission');
  }

  /// Opens the Android package installer for the APK at [path].
  /// Checks install permission first — returns false if permission not granted.
  static Future<bool> install(String path) async {
    if (!await canInstallPackages()) return false;
    await _channel.invokeMethod<void>('installApk', path);
    return true;
  }
}
