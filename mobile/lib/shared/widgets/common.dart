import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../core/theme.dart';

/// Standard screen scaffold: dark background, optional title, back button.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.title,
    this.actions,
    this.body,
    this.floating,
    this.bottomBar,
    this.automaticallyImplyLeading = true,
  });

  final String title;
  final List<Widget>? actions;
  final Widget? body;
  final Widget? floating;
  final Widget? bottomBar;
  final bool automaticallyImplyLeading;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: actions,
        automaticallyImplyLeading: automaticallyImplyLeading,
      ),
      body: body,
      bottomNavigationBar: bottomBar,
      floatingActionButton: floating,
    );
  }
}

/// KPI stat card used on the dashboard. Supports an icon chip, accent
/// coloring and tap navigation.
class KpiCard extends StatelessWidget {
  const KpiCard({
    super.key,
    required this.label,
    required this.value,
    this.sub,
    this.subColor,
    this.icon,
    this.accent,
    this.onTap,
  });

  final String label;
  final String value;
  final String? sub;
  final Color? subColor;
  final IconData? icon;
  final Color? accent;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final accentColor = accent ?? AppColors.textFaint;
    Widget card = Semantics(
      label: '$label: $value${sub != null ? ', $sub' : ''}',
      button: onTap != null,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: AppRadius.mdAll,
          border: Border.all(color: AppColors.border),
          boxShadow: AppShadows.subtle,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    label.toUpperCase(),
                    style: TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 9,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.2,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
                if (icon != null)
                  Container(
                    width: 26,
                    height: 26,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: accentColor.withValues(alpha: 0.07),
                      border: Border.all(
                        color: accentColor.withValues(alpha: 0.22),
                      ),
                      borderRadius: AppRadius.smAll,
                    ),
                    child: Icon(icon, size: 13, color: accentColor),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: AppText.tabular(
                TextStyle(
                  color: AppColors.text,
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.5,
                  fontFamily: 'Inter',
                  height: 1.1,
                ),
              ),
            ),
            if (sub != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Container(
                    width: 5,
                    height: 5,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: subColor ?? AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      sub!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: subColor ?? AppColors.textMuted,
                        fontSize: 11,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
    if (onTap != null) {
      card = Pressable(onPressed: onTap, child: card);
    }
    return card;
  }
}

/// Card container with optional header row.
class SectionCard extends StatelessWidget {
  const SectionCard({
    super.key,
    this.title,
    this.trailing,
    this.child,
    this.padding = const EdgeInsets.all(16),
  });

  final String? title;
  final Widget? trailing;
  final Widget? child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: AppElevation.card,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title!,
                    style: TextStyle(
                      color: AppColors.text,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                  ?trailing,
                ],
              ),
            ),
          Padding(padding: padding, child: child),
        ],
      ),
    );
  }
}

/// Empty state placeholder — centered in parent.
class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key,
    required this.message,
    this.title,
    this.icon,
    this.action,
    this.onAction,
  });

  final String message;
  final String? title;
  final IconData? icon;
  final String? action;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.accent.withValues(alpha: 0.08),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.accent.withValues(alpha: 0.15),
                  ),
                ),
                child: Icon(icon, color: AppColors.textMuted, size: 28),
              ),
              const SizedBox(height: 16),
            ],
            if (title != null) ...[
              Text(
                title!,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: AppColors.text,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Inter',
                ),
              ),
              const SizedBox(height: 8),
            ],
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 13,
                fontFamily: 'Inter',
              ),
            ),
            if (action != null && onAction != null) ...[
              const SizedBox(height: 20),
              AccentButton(
                onPressed: onAction,
                height: 40,
                child: Text(action!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Bottom pagination bar: Prev / "1 of N" / Next.
class PaginationBar extends StatelessWidget {
  const PaginationBar({
    super.key,
    required this.page,
    required this.total,
    required this.pageSize,
    required this.onPageChanged,
  });

  final int page;
  final int total;
  final int pageSize;
  final ValueChanged<int> onPageChanged;

  int get _pages => (total / pageSize).ceil().clamp(1, 1 << 31);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(
            width: 90,
            child: GhostButton(
              height: 36,
              onPressed: page > 1 ? () => onPageChanged(page - 1) : null,
              child: const Text('PREV'),
            ),
          ),
          Text(
            '$_pages pages',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 11,
              fontFamily: 'Inter',
            ),
          ),
          SizedBox(
            width: 90,
            child: GhostButton(
              height: 36,
              onPressed: page < _pages ? () => onPageChanged(page + 1) : null,
              child: const Text('NEXT'),
            ),
          ),
        ],
      ),
    );
  }
}

/// Label + value row inside detail views.
class DetailRow extends StatelessWidget {
  const DetailRow({
    super.key,
    required this.label,
    required this.value,
    this.valueColor,
    this.strong = false,
  });

  final String label;
  final String value;
  final Color? valueColor;
  final bool strong;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label.toUpperCase(),
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
                fontFamily: 'Inter',
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: valueColor ?? AppColors.text,
                fontSize: strong ? 14 : 13,
                fontWeight: strong ? FontWeight.w700 : FontWeight.w400,
                height: 1.4,
                fontFamily: 'Inter',
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Full-screen loading indicator matching the web admin's "Loading..." state.
class LoadingView extends StatelessWidget {
  const LoadingView({super.key, this.label = 'Loading...'});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(
            width: 22,
            height: 22,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          const SizedBox(height: 12),
          Text(
            label,
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 12,
              fontFamily: 'Inter',
            ),
          ),
        ],
      ),
    );
  }
}

/// Unified status chip: tinted pill + optional leading dot.
class StatusPill extends StatelessWidget {
  const StatusPill({
    super.key,
    required this.label,
    required this.color,
    this.dot = true,
    this.dense = false,
  });

  final String label;
  final Color color;
  final bool dot;
  final bool dense;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: dense ? 7 : 9,
        vertical: dense ? 3 : 4,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: AppRadius.pillAll,
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (dot) ...[
            Container(
              width: 5,
              height: 5,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            ),
            const SizedBox(width: 5),
          ],
          Text(
            label.toUpperCase(),
            style: TextStyle(
              color: color,
              fontSize: dense ? 9 : 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.4,
              fontFamily: 'Inter',
            ),
          ),
        ],
      ),
    );
  }
}

/// Staggered entrance for list items: fade + 4px rise, 30ms stagger, cap 8.
/// Wrap each item on first load only.
class EntranceFade extends StatelessWidget {
  const EntranceFade({super.key, required this.index, required this.child});

  final int index;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final delay = (index.clamp(0, 8) * 30);
    return child
        .animate(delay: Duration(milliseconds: delay))
        .fadeIn(duration: AppMotion.base, curve: AppMotion.enter)
        .slideY(
          begin: 0.04,
          end: 0,
          duration: AppMotion.base,
          curve: AppMotion.enter,
        );
  }
}

/// Accent FAB: glow, hairline border, scale-in entrance. Snappy, no bounce.
class AppFab extends StatelessWidget {
  const AppFab({
    super.key,
    required this.onPressed,
    this.icon = Icons.add,
    this.tooltip,
  });

  final VoidCallback onPressed;
  final IconData icon;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    final fab = FloatingActionButton(
      tooltip: tooltip,
      elevation: 0,
      highlightElevation: 0,
      onPressed: () {
        Haptic.tap();
        onPressed();
      },
      backgroundColor: AppColors.accent,
      foregroundColor: AppColors.onAccent,
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.lgAll,
        side: BorderSide(color: Colors.white.withValues(alpha: 0.25)),
      ),
      child: Icon(icon, size: 24),
    );
    return fab
        .animate()
        .scale(
          delay: AppMotion.slow,
          duration: AppMotion.base,
          curve: AppMotion.enter,
          begin: const Offset(0.85, 0.85),
          end: const Offset(1, 1),
        )
        .fadeIn(
          delay: AppMotion.slow,
          duration: AppMotion.base,
          curve: AppMotion.enter,
        );
  }
}

/// Premium dialog: 200ms scale-in (0.96→1) + fade. Drop-in for showDialog.
Future<T?> showAppDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool barrierDismissible = true,
}) {
  return showGeneralDialog<T>(
    context: context,
    barrierDismissible: barrierDismissible,
    barrierLabel: MaterialLocalizations.of(context).dialogLabel,
    barrierColor: AppColors.overlayScrim,
    transitionDuration: AppMotion.slow,
    pageBuilder: (ctx, _, _) => builder(ctx),
    transitionBuilder: (ctx, animation, _, child) {
      final curved = CurvedAnimation(
        parent: animation,
        curve: AppMotion.enter,
        reverseCurve: AppMotion.exit,
      );
      return FadeTransition(
        opacity: curved,
        child: ScaleTransition(
          scale: Tween<double>(begin: 0.96, end: 1).animate(curved),
          child: child,
        ),
      );
    },
  );
}

/// Bottom sheet with smooth 200ms slide (theme supplies raised surface).
Future<T?> showAppSheet<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool isScrollControlled = false,
}) {
  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: isScrollControlled,
    backgroundColor: Colors.transparent,
    builder: (ctx) => Container(
      decoration: BoxDecoration(
        color: AppColors.cardRaised,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
        border: Border(
          top: BorderSide(color: AppColors.highlight),
          left: BorderSide(color: AppColors.borderFaint),
          right: BorderSide(color: AppColors.borderFaint),
        ),
      ),
      child: builder(ctx),
    ),
  );
}
