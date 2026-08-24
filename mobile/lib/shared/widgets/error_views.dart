import 'dart:async';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../core/api_client.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../../features/auth/login_screen.dart';

/// Entry point for full-screen error states. Classifies the thrown error and
/// renders the matching premium view:
///  - offline (status 0) → [NoInternetView] with live auto-recovery
///  - auth    (401)      → [SessionExpiredView] with re-sign-in action
///  - anything else      → [AppErrorView] with technical details
class ErrorStateView extends StatelessWidget {
  const ErrorStateView({super.key, this.error, this.onRetry, this.title});

  final Object? error;
  final VoidCallback? onRetry;

  /// Overrides the headline (e.g. "Couldn't load leads").
  final String? title;

  @override
  Widget build(BuildContext context) {
    final e = error;
    if (e is ApiException && e.isOffline) {
      return NoInternetView(onRetry: onRetry);
    }
    if (e is ApiException && e.isAuthError) {
      return const SessionExpiredView();
    }
    return AppErrorView(
      title: title ?? (e is ApiException ? e.title : null),
      message: e?.toString(),
      onRetry: onRetry,
    );
  }
}

/// Bordered square icon tile used across the error views — mirrors the web
/// admin's flat bordered-card aesthetic.
class _ErrorIconTile extends StatelessWidget {
  const _ErrorIconTile({required this.icon, required this.color});

  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 64,
      height: 64,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Icon(icon, color: color, size: 26),
    );
  }
}

class _Eyebrow extends StatelessWidget {
  const _Eyebrow(this.text, {this.color = AppColors.textFaint});

  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: TextStyle(
        color: color,
        fontSize: 10,
        fontWeight: FontWeight.w600,
        letterSpacing: 2,
        fontFamily: 'Inter',
      ),
    );
  }
}

class _Headline extends StatelessWidget {
  const _Headline(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: const TextStyle(
        color: AppColors.text,
        fontSize: 19,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.3,
        fontFamily: 'Inter',
      ),
    );
  }
}

class _BodyText extends StatelessWidget {
  const _BodyText(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: const TextStyle(
        color: AppColors.textMuted,
        fontSize: 12.5,
        height: 1.55,
        fontFamily: 'Inter',
      ),
    );
  }
}

/// Shared page shell — centers content, scroll-safe at any height.
class _ErrorPage extends StatelessWidget {
  const _ErrorPage({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) => SingleChildScrollView(
        physics: const ClampingScrollPhysics(),
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: constraints.maxHeight),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: children,
            ),
          ),
        ),
      ),
    );
  }
}

Widget _gap(double h) => SizedBox(height: h);

Widget _actionButton({
  required String label,
  required IconData icon,
  double width = 180,
  VoidCallback? onPressed,
}) {
  return SizedBox(
    width: width,
    child: AccentButton(
      onPressed: onPressed,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 15, color: const Color(0xFF121212)),
          const SizedBox(width: 7),
          Text(label),
        ],
      ),
    ),
  );
}

/// Full-screen "no internet" state with live auto-recovery: polls a
/// connectivity probe every few seconds and reloads automatically the moment
/// the network is back. A manual retry button is always available.
class NoInternetView extends StatefulWidget {
  const NoInternetView({super.key, this.onRetry});

  final VoidCallback? onRetry;

  @override
  State<NoInternetView> createState() => _NoInternetViewState();
}

class _NoInternetViewState extends State<NoInternetView>
    with SingleTickerProviderStateMixin {
  static const _probeUrl = 'https://www.google.com/generate_204';

  Timer? _timer;
  bool _checking = false;
  late final AnimationController _pulse = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
    lowerBound: 0.35,
    upperBound: 1,
  )..repeat(reverse: true);

  @override
  void initState() {
    super.initState();
    // The HTTP probe relies on native sockets; skip it on web where the
    // cross-origin request would never succeed anyway.
    if (!kIsWeb) {
      _timer = Timer.periodic(const Duration(seconds: 4), (_) => _probe());
    }
  }

  Future<void> _probe() async {
    if (_checking || !mounted) return;
    _checking = true;
    try {
      final res = await http
          .head(Uri.parse(_probeUrl))
          .timeout(const Duration(seconds: 3));
      if (res.statusCode < 500 && mounted) {
        _timer?.cancel();
        widget.onRetry?.call();
      }
    } catch (_) {
      // Still offline — keep waiting.
    } finally {
      _checking = false;
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _ErrorPage(
      children: [
        _gap(24),
        const _ErrorIconTile(
          icon: Icons.wifi_off_rounded,
          color: AppColors.red,
        ),
        _gap(18),
        const _Eyebrow('No connection', color: AppColors.red),
        _gap(8),
        const _Headline("You're offline"),
        _gap(10),
        const SizedBox(
          width: 300,
          child: _BodyText(
            'Meteoric needs an internet connection to load your data. '
            'Check your Wi-Fi or mobile data and try again.',
          ),
        ),
        _gap(22),
        _actionButton(
          label: 'TRY AGAIN',
          icon: Icons.refresh_rounded,
          onPressed: () {
            _timer?.cancel();
            widget.onRetry?.call();
          },
        ),
        _gap(16),
        FadeTransition(
          opacity: _pulse,
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 5,
                height: 5,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: AppColors.emerald,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
              SizedBox(width: 7),
              Text(
                'Waiting for connection…',
                style: TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 11,
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
        ),
        _gap(24),
      ],
    );
  }
}

/// Generic failure state with retry + expandable technical details.
class AppErrorView extends StatefulWidget {
  const AppErrorView({super.key, this.title, this.message, this.onRetry});

  final String? title;
  final String? message;
  final VoidCallback? onRetry;

  @override
  State<AppErrorView> createState() => _AppErrorViewState();
}

class _AppErrorViewState extends State<AppErrorView> {
  bool _showDetails = false;

  @override
  Widget build(BuildContext context) {
    final message = widget.message;
    final hasDetails = message != null && message.isNotEmpty;
    return _ErrorPage(
      children: [
        _gap(24),
        const _ErrorIconTile(
          icon: Icons.error_outline_rounded,
          color: AppColors.amber,
        ),
        _gap(18),
        const _Eyebrow('Something went wrong'),
        _gap(8),
        _Headline(widget.title ?? 'Something went wrong'),
        _gap(10),
        const SizedBox(
          width: 300,
          child: _BodyText(
            "We couldn't complete that request. This usually resolves on "
            'retry — your data is safe.',
          ),
        ),
        if (hasDetails) ...[
          _gap(14),
          SizedBox(
            width: 180,
            child: GhostButton(
              height: 34,
              onPressed: () => setState(() => _showDetails = !_showDetails),
              child: Text(
                _showDetails ? 'HIDE DETAILS' : 'VIEW DETAILS',
                style: const TextStyle(fontSize: 11),
              ),
            ),
          ),
        ],
        if (_showDetails && hasDetails) ...[
          _gap(12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0x99000000),
              border: Border.all(color: AppColors.borderSoft),
            ),
            child: Text(
              message,
              maxLines: 6,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: AppColors.textFaint,
                fontSize: 10.5,
                height: 1.5,
                fontFamily: 'monospace',
              ),
            ),
          ),
        ],
        _gap(22),
        _actionButton(
          label: 'TRY AGAIN',
          icon: Icons.refresh_rounded,
          onPressed: widget.onRetry,
        ),
        _gap(24),
      ],
    );
  }
}

/// Shown when the Supabase session can't be refreshed (401 after retry).
/// Signing out returns the user to the login screen.
class SessionExpiredView extends StatelessWidget {
  const SessionExpiredView({super.key});

  Future<void> _reauthenticate(BuildContext context) async {
    try {
      await AuthService.signOut();
    } catch (_) {
      // Local sign-out failure shouldn't block returning to login.
    }
    if (!context.mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return _ErrorPage(
      children: [
        _gap(24),
        const _ErrorIconTile(
          icon: Icons.lock_clock_rounded,
          color: AppColors.sky,
        ),
        _gap(18),
        const _Eyebrow('Security check'),
        _gap(8),
        const _Headline('Session expired'),
        _gap(10),
        const SizedBox(
          width: 300,
          child: _BodyText(
            'Your session has expired for security reasons. Sign in again '
            'to continue managing your business.',
          ),
        ),
        _gap(22),
        _actionButton(
          label: 'SIGN IN AGAIN',
          icon: Icons.login_rounded,
          onPressed: () => _reauthenticate(context),
        ),
        _gap(24),
      ],
    );
  }
}
