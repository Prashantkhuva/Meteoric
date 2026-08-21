import 'dart:convert';
import 'dart:io';

import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

import 'app_version.dart';
import 'config.dart';

/// Remote release manifest served from the public Supabase Storage bucket
/// `app-releases` (`latest.json` + `meteoric-admin.apk`).
class AppUpdate {
  const AppUpdate({
    required this.version,
    required this.build,
    required this.url,
    this.notes,
  });

  factory AppUpdate.fromJson(Map<String, dynamic> json) => AppUpdate(
    version: json['version'] as String? ?? '',
    build: (json['build'] as num?)?.toInt() ?? 0,
    url: json['url'] as String? ?? '',
    notes: json['notes'] as String?,
  );

  final String version;
  final int build;
  final String url;
  final String? notes;
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

  /// Returns the available update, or null when up to date / unreachable.
  static Future<AppUpdate?> checkForUpdate() async {
    try {
      final res = await http
          .get(Uri.parse(_manifestUrl))
          .timeout(const Duration(seconds: 10));
      if (res.statusCode != 200) return null;
      final update = AppUpdate.fromJson(
        (jsonDecode(res.body) as Map).cast<String, dynamic>(),
      );
      if (update.url.isEmpty || update.build <= _localBuild) return null;
      return update;
    } catch (_) {
      return null;
    }
  }

  static int get _localBuild {
    final plus = AppVersion.version.split('+');
    return plus.length > 1 ? int.tryParse(plus[1]) ?? 0 : 0;
  }

  /// Downloads [update] to the app cache dir, reporting 0..1 progress.
  static Future<String> download(
    AppUpdate update, {
    void Function(double progress)? onProgress,
  }) async {
    final dir = await getTemporaryDirectory();
    final updatesDir = Directory('${dir.path}/updates');
    if (!updatesDir.existsSync()) updatesDir.createSync(recursive: true);
    final file = File('${updatesDir.path}/$_apkName');
    if (file.existsSync()) file.deleteSync();

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
      await for (final chunk in response.stream) {
        received += chunk.length;
        sink.add(chunk);
        if (total > 0 && onProgress != null) {
          onProgress(received / total);
        }
      }
      await sink.close();
      if (!file.existsSync()) throw Exception('Download incomplete');
      return file.path;
    } finally {
      client.close();
    }
  }

  /// Opens the Android package installer for the APK at [path].
  static Future<void> install(String path) async {
    await _channel.invokeMethod<void>('installApk', path);
  }
}
