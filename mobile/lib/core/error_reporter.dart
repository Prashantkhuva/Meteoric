import 'dart:async';
import 'dart:convert';
import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'app_logs.dart';
import 'app_version.dart';
import 'config.dart';
import 'supabase.dart';

/// Observer that tracks the current route name for error reporting.
class ErrorRouteObserver extends NavigatorObserver {
  static String currentScreen = 'unknown';

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    currentScreen = _routeName(route);
    AppLogs.log('nav', 'push $currentScreen');
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    if (previousRoute != null) {
      currentScreen = _routeName(previousRoute);
    }
    AppLogs.log('nav', 'pop → $currentScreen');
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    if (newRoute != null) {
      currentScreen = _routeName(newRoute);
      AppLogs.log('nav', 'replace $currentScreen');
    }
  }

  String _routeName(Route<dynamic> route) {
    final name = route.settings.name;
    if (name != null && name.isNotEmpty) return name;
    return route.runtimeType.toString();
  }
}

/// Captures global Flutter errors and sends them to the API which creates
/// Linear issues automatically.
///
/// Usage: call [ErrorReporter.init] before [runApp()].
class ErrorReporter {
  ErrorReporter._();

  static final Set<String> _recent = {};
  static const _dedupWindow = Duration(seconds: 30);

  /// Call once in main(), before runApp().
  static void init() {
    FlutterError.onError = (details) {
      if (kReleaseMode) {
        _report(
          error: details.exception.toString(),
          stack: details.stack?.toString() ?? '',
          screen: ErrorRouteObserver.currentScreen,
          fatal: false,
        );
      }
    };

    PlatformDispatcher.instance.onError = (error, stack) {
      if (kReleaseMode) {
        _report(
          error: error.toString(),
          stack: stack.toString(),
          screen: ErrorRouteObserver.currentScreen,
          fatal: true,
        );
      }
      return true;
    };
  }

  /// Report a caught exception manually from try/catch blocks.
  static void report(
    dynamic error,
    StackTrace stack, {
    String? screen,
    String? endpoint,
  }) {
    if (kReleaseMode) {
      _report(
        error: error.toString(),
        stack: stack.toString(),
        screen: screen ?? ErrorRouteObserver.currentScreen,
        endpoint: endpoint,
        fatal: false,
      );
    }
  }

  static Future<void> _report({
    required String error,
    required String stack,
    required String screen,
    String? endpoint,
    bool fatal = false,
  }) async {
    // Dedup: skip if same error within 30s
    final fingerprint = '$error|$screen';
    if (_recent.contains(fingerprint)) return;
    _recent.add(fingerprint);
    Future.delayed(_dedupWindow, () => _recent.remove(fingerprint));

    // Keep only first 20 lines of stack trace
    final shortStack = stack.split('\n').take(20).join('\n');

    AppLogs.log('error', error);

    try {
      final token = AuthService.accessToken;
      if (token == null) return;

      await http.post(
        Uri.parse('${AppConfig.apiBaseUrl}/api/admin/report-error'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'error': error,
          'stack': shortStack,
          'screen': screen,
          'endpoint': endpoint,
          'logs': AppLogs.dump(),
          'version': AppVersion.version,
          'patch': AppVersion.patch,
          'platform': Platform.operatingSystem,
          'osVersion': Platform.operatingSystemVersion,
          'fatal': fatal,
        }),
      );
    } catch (_) {
      // Never crash the app while reporting an error
    }
  }
}
