import 'package:flutter/material.dart';

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

/// KPI stat card used on the dashboard.
class KpiCard extends StatelessWidget {
  const KpiCard({
    super.key,
    required this.label,
    required this.value,
    this.sub,
    this.subColor,
  });

  final String label;
  final String value;
  final String? sub;
  final Color? subColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toUpperCase(),
            style: const TextStyle(
              color: AppColors.textFaint,
              fontSize: 9,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 26,
              fontWeight: FontWeight.w700,
              fontFamily: 'Inter',
              height: 1.1,
            ),
          ),
          if (sub != null) ...[
            const SizedBox(height: 8),
            Text(
              sub!,
              style: TextStyle(
                color: subColor ?? AppColors.textMuted,
                fontSize: 11,
                fontFamily: 'Inter',
              ),
            ),
          ],
        ],
      ),
    );
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
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
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
                    style: const TextStyle(
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

/// Empty state placeholder.
class EmptyState extends StatelessWidget {
  const EmptyState({super.key, required this.message, this.icon});

  final String message;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, color: AppColors.textFaint, size: 32),
            const SizedBox(height: 12),
          ],
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 13,
              fontFamily: 'Inter',
            ),
          ),
        ],
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
      decoration: const BoxDecoration(
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
            style: const TextStyle(
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
              style: const TextStyle(
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

/// Error message box.
class ErrorBox extends StatelessWidget {
  const ErrorBox({super.key, required this.message, this.onRetry});

  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.red.withValues(alpha: 0.06),
          border: Border.all(color: AppColors.red.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Text(
              message,
              style: const TextStyle(
                color: AppColors.red,
                fontSize: 13,
                fontFamily: 'Inter',
              ),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 12),
              GhostButton(
                height: 36,
                onPressed: onRetry,
                child: const Text('RETRY'),
              ),
            ],
          ],
        ),
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
    return const Center(
      child: SizedBox(
        width: 22,
        height: 22,
        child: CircularProgressIndicator(strokeWidth: 2),
      ),
    );
  }
}
