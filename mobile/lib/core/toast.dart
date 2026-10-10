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

  Color get _tint => switch (widget.type) {
    ToastType.success => AppColors.successTint,
    ToastType.error => AppColors.errorTint,
    ToastType.info => AppColors.infoTint,
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
              tint: _tint,
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
    required this.tint,
    required this.icon,
    required this.progress,
  });

  final String message;
  final Color tone;
  final Color tint;
  final IconData icon;
  final Animation<double> progress;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: tint, // tinted surface — palette already at ~10% alpha
        borderRadius: AppRadius.mdAll,
        border: Border.all(color: tone.withValues(alpha: 0.28)),
        boxShadow: [
          BoxShadow(
            color: AppColors.overlayScrim,
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(width: 3, color: tone), // colored left rail
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(13, 10, 14, 12),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 26,
                  height: 26,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: tone.withValues(alpha: 0.14),
                    borderRadius: BorderRadius.circular(7),
                    border: Border.all(color: tone.withValues(alpha: 0.3)),
                  ),
                  child: Icon(icon, size: 15, color: tone),
                ),
                const SizedBox(width: 11),
                Flexible(
                  child: Text(
                    message,
                    style: TextStyle(
                      color: AppColors.text,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      fontFamily: 'Inter',
                      height: 1.35,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            left: 3,
            right: 0,
            bottom: 0,
            height: 2,
            child: AnimatedBuilder(
              animation: progress,
              builder: (context, _) => FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: progress.value.clamp(0.0, 1.0),
                child: Container(color: tone.withValues(alpha: 0.55)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
