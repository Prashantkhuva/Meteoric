import 'dart:async';

import 'package:flutter/material.dart';

import 'theme.dart';

/// Premium monochrome toast — tinted surface, colored left rail, status
/// icon tile, countdown progress bar. Slides in from below (180ms),
/// exits with fade + rise. Replaces raw SnackBars app-wide.
class Toast {
  Toast._();

  static OverlayEntry? _entry;
  static Timer? _timer;
  static final GlobalKey<_ToastHostState> _key = GlobalKey<_ToastHostState>();

  static void success(BuildContext context, String message) =>
      _show(context, message, ToastType.success);

  static void error(BuildContext context, String message) =>
      _show(context, message, ToastType.error);

  static void info(BuildContext context, String message) =>
      _show(context, message, ToastType.info);

  static void _show(BuildContext context, String message, ToastType type) {
    final overlay = Overlay.of(context, rootOverlay: true);

    _timer?.cancel();
    _removeNow();

    // Sit above bottom nav (72px) when present, else above safe area.
    final mediaPadding = MediaQuery.paddingOf(context);
    final hasNavBar =
        Scaffold.maybeOf(context)?.widget.bottomNavigationBar != null;
    final bottom = mediaPadding.bottom + (hasNavBar ? 84 : 16);

    final duration = Duration(seconds: type == ToastType.error ? 4 : 2);
    final entry = OverlayEntry(
      builder: (_) => _ToastHost(
        key: _key,
        message: message,
        type: type,
        bottomOffset: bottom,
        duration: duration,
      ),
    );
    _entry = entry;
    overlay.insert(entry);

    _timer = Timer(duration, () async {
      await _key.currentState?.playOut();
      _removeNow();
    });
  }

  static void _removeNow() {
    final entry = _entry;
    _entry = null;
    if (entry != null && entry.mounted) {
      entry.remove();
    }
  }
}

enum ToastType { success, error, info }

class _ToastHost extends StatefulWidget {
  const _ToastHost({
    super.key,
    required this.message,
    required this.type,
    required this.bottomOffset,
    required this.duration,
  });

  final String message;
  final ToastType type;
  final double bottomOffset;
  final Duration duration;

  @override
  State<_ToastHost> createState() => _ToastHostState();
}

class _ToastHostState extends State<_ToastHost>
    with SingleTickerProviderStateMixin {
  late final AnimationController _enter = AnimationController(
    vsync: this,
    duration: AppMotion.slow,
  );
  late final AnimationController _progress = AnimationController(
    vsync: this,
    duration: widget.duration,
  );

  @override
  void initState() {
    super.initState();
    _enter.forward();
    _progress.forward();
  }

  @override
  void dispose() {
    _enter.dispose();
    _progress.dispose();
    super.dispose();
  }

  /// Reverse-enter animation; resolves when safe to unmount.
  Future<void> playOut() async {
    if (!mounted) return;
    try {
      await _enter.reverse();
    } catch (_) {}
  }

  Color get _tone => switch (widget.type) {
    ToastType.success => AppColors.emerald,
    ToastType.error => AppColors.red,
    ToastType.info => AppColors.accent,
  };

  IconData get _icon => switch (widget.type) {
    ToastType.success => Icons.check_rounded,
    ToastType.error => Icons.close_rounded,
    ToastType.info => Icons.info_outline_rounded,
  };

  @override
  Widget build(BuildContext context) {
    final curved = CurvedAnimation(parent: _enter, curve: AppMotion.enter);
    final progress = Tween<double>(begin: 1, end: 0).animate(_progress);

    return Positioned(
      left: 16,
      right: 16,
      bottom: widget.bottomOffset,
      child: FadeTransition(
        opacity: curved,
        child: SlideTransition(
          position: Tween(
            begin: const Offset(0, 0.35),
            end: Offset.zero,
          ).animate(curved),
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.96, end: 1).animate(curved),
            alignment: Alignment.bottomCenter,
            child: _ToastCard(
              message: widget.message,
              tone: _tone,
              icon: _icon,
              progress: progress,
            ),
          ),
        ),
      ),
    );
  }
}

class _ToastCard extends StatelessWidget {
  const _ToastCard({
    required this.message,
    required this.tone,
    required this.icon,
    required this.progress,
  });

  final String message;
  final Color tone;
  final IconData icon;
  final Animation<double> progress;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardRaised,
        borderRadius: AppRadius.lgAll,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, 8),
            spreadRadius: 0,
          ),
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 6,
            offset: const Offset(0, 2),
            spreadRadius: 0,
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 12, 16, 13),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 18, color: tone),
                const SizedBox(width: 10),
                Flexible(
                  child: Text(
                    message,
                    style: TextStyle(
                      color: AppColors.text,
                      fontSize: 13.5,
                      fontWeight: FontWeight.w500,
                      fontFamily: 'Satoshi',
                      height: 1.3,
                      letterSpacing: -0.1,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            child: AnimatedBuilder(
              animation: progress,
              builder: (context, _) => FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: progress.value.clamp(0.0, 1.0),
                child: Container(color: tone.withValues(alpha: 0.45)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
