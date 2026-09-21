import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../core/biometric_service.dart';
import '../../core/pin_lock_service.dart';
import '../../core/theme.dart';

/// Full-screen premium app lock. Covers the shell when the user must
/// authenticate: PIN keypad, biometric fallback, or both.
///
/// Behaviors:
///  - Auto-fires biometric prompt on mount if available + enabled.
///  - Wrong PIN shakes the dots, clears, and counts a failed attempt.
///  - 5 failed attempts → 30s lockout countdown (no unlock possible).
class AppLockView extends StatefulWidget {
  const AppLockView({super.key, this.autoBiometric = false, this.onUnlocked});

  /// Fire the native biometric prompt once on mount (when available).
  ///
  /// Keep `false` when the host (e.g. home_shell on resume) already fires
  /// biometrics — stacking two prompts can leave the scanner UI stuck.
  final bool autoBiometric;

  /// Called when any unlock method succeeds.
  final VoidCallback? onUnlocked;

  @override
  State<AppLockView> createState() => _AppLockViewState();
}

class _AppLockViewState extends State<AppLockView>
    with SingleTickerProviderStateMixin {
  String _pin = '';
  bool _error = false;
  bool _busy = false;
  int _failures = 0;
  int? _lockoutUntil;
  Timer? _lockoutTimer;

  late final AnimationController _shakeCtl;
  late final Animation<double> _shakeOffset;

  bool _biometricAvailable = false;
  bool _biometricEnabled = false;

  @override
  void initState() {
    super.initState();
    _shakeCtl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 340),
    );
    _shakeOffset = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0, end: -10), weight: 1),
      TweenSequenceItem(tween: Tween(begin: -10, end: 10), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 10, end: -6), weight: 2),
      TweenSequenceItem(tween: Tween(begin: -6, end: 6), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 6, end: 0), weight: 1),
    ]).animate(_shakeCtl);
    _loadState();
    if (widget.autoBiometric) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _tryBiometric());
    }
  }

  @override
  void dispose() {
    _shakeCtl.dispose();
    _lockoutTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadState() async {
    final available = await BiometricService.isAvailable;
    final enabled = await BiometricService.isEnabled;
    if (!mounted) return;
    setState(() {
      _biometricAvailable = available;
      _biometricEnabled = enabled;
    });
  }

  bool get _isLockedOut =>
      _lockoutUntil != null &&
      DateTime.now().millisecondsSinceEpoch < _lockoutUntil!;

  int get _lockoutRemaining {
    if (_lockoutUntil == null) return 0;
    final ms = _lockoutUntil! - DateTime.now().millisecondsSinceEpoch;
    return ms > 0 ? (ms / 1000).ceil() : 0;
  }

  Future<void> _tryBiometric() async {
    if (_busy || _isLockedOut || !_biometricAvailable || !_biometricEnabled) {
      return;
    }
    setState(() => _busy = true);
    try {
      final ok = await BiometricService.authenticate(
        reason: 'Unlock Meteoric Admin',
      );
      if (ok && mounted) {
        Haptic.success();
        widget.onUnlocked?.call();
      }
    } catch (e) {
      // Biometric failed or cancelled — leave locked, user can use PIN.
    } finally {
      // Guaranteed dismiss: the native dialog must never linger over the
      // keypad after a cancel/failure.
      await BiometricService.stopPrompt();
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _onDigit(String d) async {
    if (_busy || _isLockedOut) return;
    Haptic.tap();
    if (_pin.length >= 4) return;
    setState(() {
      _pin += d;
      _error = false;
    });
    if (_pin.length == 4) {
      await _verify();
    }
  }

  Future<void> _verify() async {
    setState(() => _busy = true);
    final ok = await PinLockService.verify(_pin);
    if (!mounted) return;
    if (ok) {
      setState(() => _busy = false);
      Haptic.success();
      widget.onUnlocked?.call();
      return;
    }
    _failures += 1;
    final lockout = _failures >= 5;
    setState(() {
      _busy = false;
      _error = true;
      _pin = '';
      if (lockout) {
        _lockoutUntil = DateTime.now().millisecondsSinceEpoch + 30 * 1000;
      }
    });
    if (lockout) {
      Haptic.medium();
      _startLockoutCountdown();
    } else {
      _shakeCtl.forward(from: 0);
    }
  }

  void _startLockoutCountdown() {
    _lockoutTimer?.cancel();
    _lockoutTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) {
        _lockoutTimer?.cancel();
        return;
      }
      if (_isLockedOut) {
        setState(() {});
      } else {
        _lockoutTimer?.cancel();
        if (mounted) setState(() => _lockoutUntil = null);
      }
    });
  }

  void _backspace() {
    if (_busy || _isLockedOut || _pin.isEmpty) return;
    Haptic.tap();
    setState(() => _pin = _pin.substring(0, _pin.length - 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF070707), Color(0xFF0A0A0A), Color(0xFF100F12)],
            stops: [0, 0.55, 1],
          ),
        ),
        child: SafeArea(
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _isLockedOut ? null : () => FocusScope.of(context).unfocus(),
            child: Center(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(height: 24),
                    _buildLogoArea(),
                    const SizedBox(height: 36),
                    AnimatedBuilder(
                      animation: _shakeCtl,
                      builder: (context, child) => Transform.translate(
                        offset: Offset(_shakeOffset.value, 0),
                        child: child,
                      ),
                      child: _buildDots(),
                    ),
                    const SizedBox(height: 22),
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 200),
                      transitionBuilder: (child, anim) =>
                          FadeTransition(opacity: anim, child: child),
                      child: _isLockedOut
                          ? Text(
                              'Too many attempts — retry in $_lockoutRemaining s',
                              key: const ValueKey('lockout'),
                              style: const TextStyle(
                                color: AppColors.red,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                fontFamily: 'Inter',
                              ),
                            )
                          : _error
                          ? const Text(
                              'Incorrect PIN',
                              key: ValueKey('error'),
                              style: TextStyle(
                                color: AppColors.red,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                fontFamily: 'Inter',
                              ),
                            )
                          : const Text(
                              'Enter 4-digit PIN',
                              key: ValueKey('hint'),
                              style: TextStyle(
                                color: AppColors.textFaint,
                                fontSize: 13,
                                fontFamily: 'Inter',
                              ),
                            ),
                    ),
                    const SizedBox(height: 24),
                    _buildKeypad(),
                    const SizedBox(height: 18),
                    _buildBiometricButton(),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogoArea() {
    final lock = Icon(
      _isLockedOut ? Icons.lock_clock_outlined : Icons.lock_outline_rounded,
      size: 40,
      color: AppColors.accent,
    );
    return Column(
          children: [
            Container(
              width: 84,
              height: 84,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF181820), Color(0xFF0E0E12)],
                ),
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.accent.withValues(alpha: 0.06),
                    blurRadius: 40,
                    spreadRadius: 8,
                  ),
                ],
              ),
              child: Center(child: lock),
            ).animate().scale(
              duration: 400.ms,
              curve: Curves.easeOutBack,
              begin: Offset(0.6, 0.6),
              end: const Offset(1, 1),
            ),
            const SizedBox(height: 16),
            const Text(
              'Meteoric Admin',
              style: TextStyle(
                color: AppColors.text,
                fontSize: 20,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.2,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'App Locked',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 13,
                fontFamily: 'Inter',
              ),
            ),
          ],
        )
        .animate()
        .fadeIn(duration: 300.ms)
        .slideY(begin: -8, end: 0, duration: 400.ms, curve: Curves.easeOut);
  }

  Widget _buildDots() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        4,
        (i) => AnimatedScale(
          scale: i < _pin.length ? 1.2 : 1,
          duration: const Duration(milliseconds: 120),
          curve: Curves.easeOut,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 120),
            width: 14,
            height: 14,
            margin: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: i < _pin.length ? AppColors.accent : Colors.transparent,
              border: Border.all(
                color: i < _pin.length
                    ? AppColors.accent
                    : AppColors.borderSoft,
                width: 1.4,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildKeypad() {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'back'],
    ];
    return Column(
      children: [
        for (final row in rows)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 5),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [for (final label in row) _buildKey(label)],
            ),
          ),
      ],
    );
  }

  Widget _buildKey(String label) {
    final child = label == 'back'
        ? const Icon(
            Icons.backspace_outlined,
            size: 22,
            color: AppColors.textMuted,
          )
        : Text(
            label,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 22,
              fontWeight: FontWeight.w500,
              fontFamily: 'Inter',
            ),
          );
    return SizedBox(
      width: 74,
      height: 60,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: _isLockedOut
              ? null
              : () {
                  if (label == 'back') {
                    _backspace();
                  } else if (label.isNotEmpty) {
                    _onDigit(label);
                  }
                },
          borderRadius: AppRadius.mdAll,
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 6),
            decoration: BoxDecoration(
              color: AppColors.cardRaised.withValues(alpha: 0.6),
              borderRadius: AppRadius.mdAll,
              border: Border.all(color: AppColors.border),
            ),
            child: Center(child: child),
          ),
        ),
      ),
    );
  }

  Widget _buildBiometricButton() {
    if (!_biometricAvailable || !_biometricEnabled) {
      return const SizedBox.shrink();
    }
    return TextButton.icon(
      onPressed: _busy || _isLockedOut ? null : _tryBiometric,
      icon: const Icon(
        Icons.fingerprint_rounded,
        size: 20,
        color: AppColors.accent,
      ),
      label: const Text(
        'USE BIOMETRICS',
        style: TextStyle(
          color: AppColors.textMuted,
          fontSize: 12,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.8,
          fontFamily: 'Inter',
        ),
      ),
    ).animate().fadeIn(duration: 400.ms, delay: 200.ms);
  }
}
