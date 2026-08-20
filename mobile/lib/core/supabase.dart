import 'package:supabase_flutter/supabase_flutter.dart';
import 'config.dart';

/// Thin auth wrapper around the Supabase SDK. `instance` exposes the raw
/// SupabaseClient; static helpers cover sign in/out and session refresh.
///
/// Session persistence is handled by the SDK itself via
/// [SharedPreferencesLocalStorage] (reliable plain SharedPreferences —
/// flutter_secure_storage 11.x was silently dropping writes on Android).
class AuthService {
  static final SupabaseClient instance = Supabase.instance.client;

  /// Must be called once before runApp.
  static Future<void> init() async {
    await Supabase.initialize(
      url: AppConfig.supabaseUrl,
      publishableKey: AppConfig.supabaseAnonKey,
      authOptions: FlutterAuthClientOptions(
        authFlowType: AuthFlowType.pkce,
        persistSession: true,
        localStorage: SharedPreferencesLocalStorage(persistSessionKey: 'sb_session'),
      ),
    );
  }

  static String? get accessToken {
    return instance.auth.currentSession?.accessToken;
  }

  static User? get user => instance.auth.currentUser;

  static bool get isSignedIn => accessToken != null;

  /// Refreshes the current session (access tokens expire hourly). The SDK
  /// re-persists the rotated session automatically.
  static Future<bool> refreshSession() async {
    try {
      final res = await instance.auth.refreshSession();
      return res.session != null;
    } catch (_) {}
    return false;
  }

  static Future<void> signIn(String email, String password) async {
    await instance.auth.signInWithPassword(
      email: email.trim(),
      password: password,
    );
  }

  static Future<void> signOut() async {
    await instance.auth.signOut();
  }
}