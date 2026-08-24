/// App configuration.
///
/// Values are injected at build time via `--dart-define`:
///   flutter run --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_ANON_KEY=... --dart-define=API_BASE_URL=...
///
/// Defaults below match the Meteoric production project (public values only —
/// the same values the website exposes to every browser).
class AppConfig {
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://hlxjljckxthmtssqrzwo.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'sb_publishable_jcEMlKqumlyPz2bhakwOQg_T-zMNSWM',
  );

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://withmeteoric.com',
  );

  static const String siteUrl = String.fromEnvironment(
    'SITE_URL',
    defaultValue: 'https://withmeteoric.com',
  );
}
