import 'dart:convert';

import 'package:flutter/services.dart';

/// Bridges to native Android helpers (see MainActivity.kt):
/// sharing generated files, opening URLs (WhatsApp / preview links).
class Native {
  Native._();

  static const MethodChannel _share = MethodChannel('meteoric/share');

  /// Writes [content] to a cache file and opens the Android share sheet.
  static Future<void> shareFile({
    required String name,
    required String mime,
    required String content,
  }) async {
    await _share.invokeMethod<void>('shareFile', {
      'name': name,
      'mime': mime,
      'content': content,
    });
  }

  /// Writes binary [bytes] (base64-encoded over the channel) to a cache
  /// file and opens the Android share sheet — used for generated PDFs.
  static Future<void> shareFileBytes({
    required String name,
    required String mime,
    required List<int> bytes,
  }) async {
    await _share.invokeMethod<void>('shareFileB64', {
      'name': name,
      'mime': mime,
      'b64': base64Encode(bytes),
    });
  }

  static Future<void> shareText(String text) =>
      shareFile(name: 'share.txt', mime: 'text/plain', content: text);

  /// Opens a URL in an external app (browser, WhatsApp, mail...).
  static Future<void> openUrl(String url) async {
    await _share.invokeMethod<void>('openUrl', url);
  }
}
