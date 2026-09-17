import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_quill/flutter_quill.dart';

import 'core/theme.dart';
import 'core/supabase.dart';
import 'core/notification_service.dart';
import 'core/error_reporter.dart';
import 'core/device_info.dart';
import 'core/data_cache.dart';
import 'features/auth/login_screen.dart';
import 'features/home/home_shell.dart';
import 'features/onboarding/onboarding_screen.dart';

final _navKey = GlobalKey<NavigatorState>();
final _routeObserver = ErrorRouteObserver();

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  ErrorReporter.init();
  await AuthService.init();
  await DeviceInfo.init();
  await DataCache.instance.init();
  await NotificationService.instance.init();
  runApp(const MeteoricAdminApp());
}

class MeteoricAdminApp extends StatelessWidget {
  const MeteoricAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Meteoric Admin',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      navigatorKey: _navKey,
      navigatorObservers: [_routeObserver],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        FlutterQuillLocalizations.delegate,
      ],
      supportedLocales: const [Locale('en')],
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    if (mounted) setState(() => _ready = true);
  }

  @override
  Widget build(BuildContext context) {
    if (!_ready) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: SizedBox(
            width: 22,
            height: 22,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        ),
      );
    }
    if (!AuthService.isSignedIn) return const LoginScreen();

    final user = AuthService.user;
    final onboarded = user?.userMetadata?['onboarding_completed'] ?? true;
    final isSuperadmin =
        user?.email == 'work.prashantkhuva@gmail.com';

    if (!onboarded && !isSuperadmin) return const OnboardingScreen();
    return const HomeShell();
  }
}
