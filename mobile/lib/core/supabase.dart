import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'config.dart';

class AppStorage {
  static const _secure = FlutterSecureStorage();

  static const _sessionKey = 'sb_session';

  static Future<void> saveSession(String json) async {
    await _secure.write(key: _sessionKey, value: json);
  }

  static Future<String?> readSession() async {
    return _secure.read(key: _sessionKey);
  }

  static Future<void> clear() async {
    await _secure.delete(key: _sessionKey);
  }
}

/// Thin auth wrapper around the Supabase SDK. `instance` exposes the raw
/// SupabaseClient; static helpers cover sign in/out and session restore.
class AuthService {
  static final SupabaseClient instance = Supabase.instance.client;

  /// Must be called once before runApp.
  static Future<void> init() async {
    await Supabase.initialize(
      url: AppConfig.supabaseUrl,
      publishableKey: AppConfig.supabaseAnonKey,
      authOptions: const FlutterAuthClientOptions(
        authFlowType: AuthFlowType.pkce,
        persistSession: false,
      ),
    );

    final stored = await AppStorage.readSession();
    if (stored != null) {
      try {
        final session = Session.fromJson(jsonDecode(stored) as Map<String, dynamic>);
        final refreshToken = session?.refreshToken;
        if (refreshToken != null && refreshToken.isNotEmpty) {
          await instance.auth.setSession(refreshToken);
        } else {
          await AppStorage.clear();
        }
      } catch (_) {
        await AppStorage.clear();
      }
    }

    instance.auth.onAuthStateChange.listen((data) {
      final session = data.session;
      if (session != null) {
        AppStorage.saveSession(session.toJson().toString());
      }
    });
  }

  static String? get accessToken {
    return instance.auth.currentSession?.accessToken;
  }

  static User? get user => instance.auth.currentUser;

  static bool get isSignedIn => accessToken != null;

  /// Refreshes the current session (access tokens expire hourly). Returns
  /// true when a new session was obtained and persisted.
  static Future<bool> refreshSession() async {
    try {
      final res = await instance.auth.refreshSession();
      if (res.session != null) {
        AppStorage.saveSession(res.session!.toJson().toString());
        return true;
      }
    } catch (_) {}
    return false;
  }

  static Future<void> signIn(String email, String password) async {
    final res = await instance.auth.signInWithPassword(
      email: email.trim(),
      password: password,
    );
    if (res.session != null) {
      AppStorage.saveSession(res.session!.toJson().toString());
    }
  }

  static Future<void> signOut() async {
    await instance.auth.signOut();
    await AppStorage.clear();
  }
}

/// Convenience for debug builds: print session state.
void debugPrintSession() {
  if (kDebugMode) {
    debugPrint('Supabase session: ${AuthService.accessToken != null}');
  }
}