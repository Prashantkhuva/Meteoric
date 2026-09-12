import 'package:flutter/material.dart';

import '../../core/theme.dart';

/// Shimmer skeleton placeholder for loading states.
class SkeletonLoader extends StatefulWidget {
  const SkeletonLoader({super.key, required this.child});

  final Widget child;

  @override
  State<SkeletonLoader> createState() => _SkeletonLoaderState();
}

class _SkeletonLoaderState extends State<SkeletonLoader>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.3, end: 0.7).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Opacity(
          opacity: _animation.value,
          child: child,
        );
      },
      child: widget.child,
    );
  }
}

/// A single skeleton line.
class SkeletonLine extends StatelessWidget {
  const SkeletonLine({
    super.key,
    this.width,
    this.height = 12,
    this.borderRadius,
  });

  final double? width;
  final double height;
  final BorderRadius? borderRadius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.cardRaised,
        borderRadius: borderRadius ?? AppRadius.smAll,
      ),
    );
  }
}

/// Skeleton placeholder matching a standard list card layout.
class SkeletonListCard extends StatelessWidget {
  const SkeletonListCard({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonLoader(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: AppRadius.mdAll,
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            // Avatar placeholder
            SkeletonLine(width: 40, height: 40, borderRadius: AppRadius.mdAll),
            const SizedBox(width: 12),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SkeletonLine(width: double.infinity, height: 14),
                  const SizedBox(height: 8),
                  SkeletonLine(width: 160, height: 10),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      SkeletonLine(width: 60, height: 10),
                      const SizedBox(width: 8),
                      SkeletonLine(width: 40, height: 10),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            // Trailing
            SkeletonLine(width: 24, height: 24, borderRadius: AppRadius.smAll),
          ],
        ),
      ),
    );
  }
}

/// A column of skeleton list cards.
class SkeletonList extends StatelessWidget {
  const SkeletonList({super.key, this.count = 6});

  final int count;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      itemCount: count,
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemBuilder: (_, _) => const SkeletonListCard(),
    );
  }
}

/// Skeleton placeholder for a detail screen header.
class SkeletonDetail extends StatelessWidget {
  const SkeletonDetail({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonLoader(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header row
            Row(
              children: [
                SkeletonLine(width: 120, height: 18),
                const Spacer(),
                SkeletonLine(width: 60, height: 24, borderRadius: AppRadius.smAll),
              ],
            ),
            const SizedBox(height: 16),
            // Subtitle
            SkeletonLine(width: 180, height: 12),
            const SizedBox(height: 24),
            // Content blocks
            ...List.generate(4, (_) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SkeletonLine(width: 80, height: 10),
                  const SizedBox(height: 8),
                  SkeletonLine(width: double.infinity, height: 14),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}
