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

  bool get _locked =>
      _lockUntil != null && DateTime.now().isBefore(_lockUntil!);

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
            _error = 'Too many failed attempts. Locked for 60 seconds.';
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
    final lower = raw.toLowerCase();
    if (lower.contains('invalid login') ||
        lower.contains('invalid') ||
        lower.contains('credentials')) {
      return 'Invalid email or password.';
    }
    if (lower.contains('email not confirmed')) {
      return 'Please confirm your email first.';
    }
    if (lower.contains('rate limit') || lower.contains('429')) {
      return 'Too many attempts. Please try again later.';
    }
    if (lower.contains('network') ||
        lower.contains('sockethost') ||
        lower.contains('clientexception') ||
        lower.contains('handshake') ||
        lower.contains('connection')) {
      return 'Network error. Check your connection.';
    }
    return 'Something went wrong. Please try again.';
  }

  @override
  Widget build(BuildContext context) {
    return UnfocusOnTap(
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Stack(
          children: [
            const _LoginBackground(),
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 380),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Column(
                          children: [
                            Semantics(
                              label: 'Meteoric logo',
                              child: Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: AppColors.accent,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                clipBehavior: Clip.antiAlias,
                                child: Image.asset(
                                  'assets/m.png',
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            const Text(
                              'Meteoric',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 26,
                                fontWeight: FontWeight.w600,
                                letterSpacing: -0.5,
                                fontFamily: 'Inter',
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Admin Dashboard',
                              style: TextStyle(
                                color: AppColors.textFaint,
                                fontSize: 13,
                                letterSpacing: 0.4,
                                fontFamily: 'Inter',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 48),
                        Container(
                          padding: const EdgeInsets.all(28),
                          decoration: BoxDecoration(
                            color: AppColors.card.withValues(alpha: 0.9),
                            borderRadius: AppRadius.xlAll,
                            border: Border.all(color: AppColors.border),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.accent.withValues(alpha: 0.03),
                                blurRadius: 80,
                                spreadRadius: 4,
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _FieldLabel('Email'),
                              const SizedBox(height: 8),
                              TextField(
                                controller: _email,
                                keyboardType: TextInputType.emailAddress,
                                autocorrect: false,
                                enabled: !_loading,
                                style: const TextStyle(
                                  color: AppColors.text,
                                  fontSize: 14,
                                  fontFamily: 'Inter',
                                ),
                                decoration: InputDecoration(
                                  hintText: 'you@example.com',
                                  hintStyle: const TextStyle(
                                    color: AppColors.textFaint,
                                    fontSize: 14,
                                    fontFamily: 'Inter',
                                  ),
                                  filled: true,
                                  fillColor: AppColors.inputFillDark,
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: AppSpacing.lg,
                                    vertical: AppSpacing.md2,
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: AppRadius.lgAll,
                                    borderSide: const BorderSide(
                                      color: AppColors.border,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: AppRadius.lgAll,
                                    borderSide: const BorderSide(
                                      color: AppColors.accent,
                                    ),
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: AppRadius.lgAll,
                                    borderSide: const BorderSide(
                                      color: AppColors.border,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),
                              _FieldLabel('Password'),
                              const SizedBox(height: 8),
                              TextField(
                                controller: _password,
                                obscureText: _obscure,
                                enabled: !_loading,
                                onSubmitted: (_) => _submit(),
                                style: const TextStyle(
                                  color: AppColors.text,
                                  fontSize: 14,
                                  fontFamily: 'Inter',
                                ),
                                decoration: InputDecoration(
                                  hintText: 'Enter your password',
                                  hintStyle: const TextStyle(
                                    color: AppColors.textFaint,
                                    fontSize: 14,
                                    fontFamily: 'Inter',
                                  ),
                                  suffixIcon: Semantics(
                                    button: true,
                                    label: _obscure
                                        ? 'Show password'
                                        : 'Hide password',
                                    child: IconButton(
                                      icon: Icon(
                                        _obscure
                                            ? Icons.visibility_off
                                            : Icons.visibility,
                                        size: 18,
                                        color: AppColors.textMuted,
                                      ),
                                      onPressed: () =>
                                          setState(() => _obscure = !_obscure),
                                    ),
                                  ),
                                  filled: true,
                                  fillColor: AppColors.inputFillDark,
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: AppSpacing.lg,
                                    vertical: AppSpacing.md2,
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: AppRadius.lgAll,
                                    borderSide: const BorderSide(
                                      color: AppColors.border,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: AppRadius.lgAll,
                                    borderSide: const BorderSide(
                                      color: AppColors.accent,
                                    ),
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: AppRadius.lgAll,
                                    borderSide: const BorderSide(
                                      color: AppColors.border,
                                    ),
                                  ),
                                ),
                              ),
                              if (_error != null) ...[
                                const SizedBox(height: 16),
                                Semantics(
                                  liveRegion: true,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 12,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.red.withValues(
                                        alpha: 0.04,
                                      ),
                                      borderRadius: AppRadius.lgAll,
                                      border: Border.all(
                                        color: AppColors.red.withValues(
                                          alpha: 0.1,
                                        ),
                                      ),
                                    ),
                                    child: Text(
                                      _error!,
                                      style: const TextStyle(
                                        color: AppColors.red,
                                        fontSize: 13,
                                        fontFamily: 'Inter',
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                              const SizedBox(height: 24),
                              SizedBox(
                                height: 48,
                                child: Semantics(
                                  button: true,
                                  label: _locked
                                      ? 'Locked, try again shortly'
                                      : 'Sign in',
                                  child: Material(
                                    color: _loading
                                        ? AppColors.accent.withValues(
                                            alpha: 0.4,
                                          )
                                        : AppColors.accent,
                                    borderRadius: AppRadius.lgAll,
                                    child: InkWell(
                                      borderRadius: AppRadius.lgAll,
                                      onTap: _loading || _locked
                                          ? null
                                          : _submit,
                                      child: Center(
                                        child: _loading
                                            ? const Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  SizedBox(
                                                    width: 16,
                                                    height: 16,
                                                    child:
                                                        CircularProgressIndicator(
                                                          strokeWidth: 2,
                                                          color: AppColors
                                                              .onAccent,
                                                        ),
                                                  ),
                                                  SizedBox(width: 8),
                                                  Text(
                                                    'Signing in...',
                                                    style: TextStyle(
                                                      color: AppColors.onAccent,
                                                      fontSize: 14,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontFamily: 'Inter',
                                                    ),
                                                  ),
                                                ],
                                              )
                                            : Text(
                                                _locked
                                                    ? 'Locked — try again shortly'
                                                    : 'Sign in',
                                                style: const TextStyle(
                                                  color: AppColors.onAccent,
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  fontFamily: 'Inter',
                                                ),
                                              ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),
                        const Text(
                          'Protected area — authorized personnel only',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: AppColors.textFaint,
                            fontSize: 11,
                            letterSpacing: 0.4,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: const TextStyle(
        color: AppColors.textFaint,
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.3,
        fontFamily: 'Inter',
      ),
    );
  }
}

/// Dot-grid + glow orbs backdrop, matching the web login page.
class _LoginBackground extends StatelessWidget {
  const _LoginBackground();

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: IgnorePointer(
        child: Stack(
          children: [
            const CustomPaint(painter: _DotGridPainter(), size: Size.infinite),
            const _GlowOrb(top: -200, left: -200, size: 500, opacity: 0.025),
            Positioned(
              bottom: -150,
              right: -180,
              child: _GlowOrb(size: 400, opacity: 0.015),
            ),
            const _GlowOrb(top: 320, left: -300, size: 600, opacity: 0.010),
          ],
        ),
      ),
    );
  }
}

class _GlowOrb extends StatelessWidget {
  const _GlowOrb({
    this.top,
    this.left,
    required this.size,
    required this.opacity,
  });

  final double? top;
  final double? left;
  final double size;
  final double opacity;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: top,
      left: left,
      width: size,
      height: size,
      child: DecoratedBox(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [
              AppColors.accent.withValues(alpha: opacity),
              AppColors.accent.withValues(alpha: 0),
            ],
          ),
        ),
      ),
    );
  }
}

class _DotGridPainter extends CustomPainter {
  const _DotGridPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.borderSoft
      ..style = PaintingStyle.fill;
    const spacing = 32.0;
    const dotRadius = 1.0;
    for (double y = 0; y < size.height; y += spacing) {
      for (double x = 0; x < size.width; x += spacing) {
        canvas.drawCircle(Offset(x, y), dotRadius, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
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
