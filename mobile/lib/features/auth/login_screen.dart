import 'package:flutter/material.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../home/home_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _loading = false;
  bool _obscure = true;
  String? _error;

  int _attempts = 0;
  DateTime? _lockUntil;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  bool get _locked => _lockUntil != null && DateTime.now().isBefore(_lockUntil!);

  Future<void> _submit() async {
    if (_locked) return;
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      await AuthService.signIn(_email.text, _password.text);
      if (mounted) {
        setState(() => _loading = false);
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const _AuthSuccess()),
        );
      }
    } catch (err) {
      _attempts++;
      if (_attempts >= 5) {
        _lockUntil = DateTime.now().add(const Duration(seconds: 60));
        _attempts = 0;
        if (mounted) {
          setState(() {
            _loading = false;
            _error = 'Too many attempts. Try again in 60 seconds.';
          });
        }
        return;
      }
      if (mounted) {
        setState(() {
          _loading = false;
          _error = _friendlyError(err.toString());
        });
      }
    }
  }

  String _friendlyError(String raw) {
    if (raw.contains('Invalid login credentials')) {
      return 'Invalid email or password';
    }
    if (raw.contains('rate limit') || raw.contains('429')) {
      return 'Too many attempts. Try again in a minute.';
    }
    return 'Unable to sign in. Check your connection and try again.';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'METEORIC',
                    style: TextStyle(
                      color: AppColors.accent,
                      fontSize: 30,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 6,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'ADMIN',
                    style: TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 11,
                      letterSpacing: 3,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(height: 40),
                  const Text(
                    'Sign in to continue',
                    style: TextStyle(
                      color: AppColors.text,
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    autocorrect: false,
                    enabled: !_loading,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      hintText: 'you@withmeteoric.com',
                    ),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _password,
                    obscureText: _obscure,
                    enabled: !_loading,
                    onSubmitted: (_) => _submit(),
                    decoration: InputDecoration(
                      labelText: 'Password',
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscure ? Icons.visibility_off : Icons.visibility,
                          size: 18,
                          color: AppColors.textMuted,
                        ),
                        onPressed: () => setState(() => _obscure = !_obscure),
                      ),
                    ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 14),
                    Text(
                      _error!,
                      style: const TextStyle(color: AppColors.red, fontSize: 12, fontFamily: 'Inter'),
                    ),
                  ],
                  const SizedBox(height: 24),
                  AccentButton(
                    onPressed: _loading ? null : _submit,
                    child: _loading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF121212)),
                          )
                        : const Text('SIGN IN'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Shown after a successful sign-in so auth state settles before swapping to
/// the home shell (session listeners update AuthService.isSignedIn).
class _AuthSuccess extends StatefulWidget {
  const _AuthSuccess();

  @override
  State<_AuthSuccess> createState() => _AuthSuccessState();
}

class _AuthSuccessState extends State<_AuthSuccess> {
  @override
  void initState() {
    super.initState();
    Future<void>.delayed(const Duration(milliseconds: 400), () {
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const HomeShell()),
          (_) => false,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
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
}