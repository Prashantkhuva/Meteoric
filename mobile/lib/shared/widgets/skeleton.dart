import 'package:flutter/material.dart';

import '../../core/theme.dart';

// ── Shimmer base ─────────────────────────────────────────────────────────

/// Shimmer skeleton placeholder — left-to-right gradient sweep.
class SkeletonLoader extends StatefulWidget {
  const SkeletonLoader({super.key, required this.child});

  final Widget child;

  @override
  State<SkeletonLoader> createState() => _SkeletonLoaderState();
}

class _SkeletonLoaderState extends State<SkeletonLoader>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            final t = _controller.value;
            return LinearGradient(
              begin: Alignment(-1.0 + 2.0 * t, 0),
              end: Alignment(-0.4 + 2.0 * t, 0),
              colors: const [
                AppColors.shimmerBase,
                AppColors.shimmerHighlight,
                AppColors.shimmerBase,
              ],
              stops: const [0.0, 0.5, 1.0],
            ).createShader(bounds);
          },
          blendMode: BlendMode.srcATop,
          child: child,
        );
      },
      child: widget.child,
    ),
    );
  }
}

// ── Primitives ───────────────────────────────────────────────────────────

/// A single skeleton block.
class SkeletonBlock extends StatelessWidget {
  const SkeletonBlock({
    super.key,
    this.width,
    this.height = 12,
    this.borderRadius,
    this.color,
  });

  final double? width;
  final double height;
  final BorderRadius? borderRadius;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: color ?? AppColors.cardRaised,
        borderRadius: borderRadius ?? AppRadius.smAll,
      ),
    );
  }
}

/// Circle skeleton (avatar, icon placeholder).
class SkeletonCircle extends StatelessWidget {
  const SkeletonCircle({super.key, this.size = 40});

  final double size;

  @override
  Widget build(BuildContext context) {
    return SkeletonBlock(
      width: size,
      height: size,
      borderRadius: BorderRadius.circular(size / 2),
    );
  }
}

// ── List card skeleton ───────────────────────────────────────────────────

/// Skeleton matching the standard list card (name + subtitle + status badge).
class SkeletonListCard extends StatelessWidget {
  const SkeletonListCard({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonLoader(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 5),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: AppRadius.mdAll,
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title row: name + status badge
                  Row(
                    children: [
                      Expanded(
                        child: SkeletonBlock(
                          width: double.infinity,
                          height: 14,
                          borderRadius: AppRadius.smAll,
                        ),
                      ),
                      const SizedBox(width: 8),
                      SkeletonBlock(
                        width: 52,
                        height: 20,
                        borderRadius: AppRadius.smAll,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Subtitle
                  SkeletonBlock(width: 180, height: 11),
                  const SizedBox(height: 8),
                  // Bottom row: tags / meta
                  Row(
                    children: [
                      SkeletonBlock(width: 60, height: 10),
                      const SizedBox(width: 8),
                      SkeletonBlock(width: 40, height: 10),
                      const Spacer(),
                      SkeletonBlock(width: 48, height: 10),
                    ],
                  ),
                ],
              ),
            ),
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

// ── Detail header skeleton ───────────────────────────────────────────────

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
                SkeletonBlock(width: 140, height: 20),
                const Spacer(),
                SkeletonBlock(
                  width: 64,
                  height: 28,
                  borderRadius: AppRadius.smAll,
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Subtitle
            SkeletonBlock(width: 200, height: 12),
            const SizedBox(height: 24),
            // Content blocks
            ...List.generate(
              5,
              (_) => Padding(
                padding: const EdgeInsets.only(bottom: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SkeletonBlock(width: 90, height: 10),
                    const SizedBox(height: 10),
                    SkeletonBlock(width: double.infinity, height: 14),
                    const SizedBox(height: 6),
                    SkeletonBlock(
                      width: MediaQuery.of(context).size.width * 0.65,
                      height: 14,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Dashboard skeleton ───────────────────────────────────────────────────

/// Full dashboard skeleton matching the actual layout.
class SkeletonDashboard extends StatelessWidget {
  const SkeletonDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonLoader(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Welcome text
          SkeletonBlock(width: 180, height: 17),
          const SizedBox(height: 6),
          SkeletonBlock(width: 120, height: 12),
          const SizedBox(height: 24),

          // Analytics hero card
          _buildHeroCard(context),
          const SizedBox(height: 16),

          // Stat strip (3 columns)
          _buildStatStrip(),
          const SizedBox(height: 16),

          // Pipeline card
          _buildPipelineCard(),
          const SizedBox(height: 24),

          // Recent section 1
          _buildRecentSection(),
          const SizedBox(height: 16),

          // Recent section 2
          _buildRecentSection(),
          const SizedBox(height: 16),

          // Recent section 3
          _buildRecentSection(),
        ],
      ),
    );
  }

  Widget _buildHeroCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Eyebrow + toggle
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SkeletonBlock(width: 70, height: 10),
              SkeletonBlock(
                width: 90,
                height: 24,
                borderRadius: AppRadius.smAll,
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Big number
          SkeletonBlock(width: 140, height: 32),
          const SizedBox(height: 8),
          // Trend badge + subtitle
          Row(
            children: [
              SkeletonBlock(
                width: 80,
                height: 20,
                borderRadius: AppRadius.smAll,
              ),
              const SizedBox(width: 8),
              Expanded(child: SkeletonBlock(width: double.infinity, height: 11)),
            ],
          ),
          const SizedBox(height: 20),
          // Chart area
          SkeletonBlock(
            width: double.infinity,
            height: 170,
            borderRadius: AppRadius.smAll,
          ),
          const SizedBox(height: 12),
          // Legend
          Row(
            children: [
              SkeletonCircle(size: 8),
              const SizedBox(width: 6),
              SkeletonBlock(width: 50, height: 10),
              const SizedBox(width: 14),
              SkeletonCircle(size: 8),
              const SizedBox(width: 6),
              SkeletonBlock(width: 70, height: 10),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatStrip() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: AppRadius.mdAll,
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          for (var i = 0; i < 3; i++) ...[
            if (i > 0)
              Container(width: 1, height: 52, color: AppColors.borderSoft),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  vertical: 14,
                  horizontal: 12,
                ),
                child: Column(
                  children: [
                    SkeletonBlock(width: 40, height: 9),
                    const SizedBox(height: 8),
                    SkeletonBlock(width: 32, height: 20),
                    const SizedBox(height: 6),
                    SkeletonBlock(width: 60, height: 10),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPipelineCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SkeletonBlock(width: 90, height: 14),
              SkeletonBlock(width: 120, height: 10),
            ],
          ),
          const SizedBox(height: 18),
          // 5 pipeline rows
          ...List.generate(5, (i) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SkeletonBlock(width: 70 + i * 5.0, height: 11),
                      SkeletonBlock(width: 20, height: 12),
                    ],
                  ),
                  const SizedBox(height: 6),
                  SkeletonBlock(width: double.infinity, height: 4),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildRecentSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SkeletonBlock(width: 100, height: 14),
              SkeletonBlock(width: 55, height: 10),
            ],
          ),
          const SizedBox(height: 14),
          // 4 recent rows
          ...List.generate(4, (_) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Row(
                children: [
                  SkeletonCircle(size: 34),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SkeletonBlock(width: double.infinity, height: 13),
                        const SizedBox(height: 5),
                        SkeletonBlock(width: 140, height: 10),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      SkeletonBlock(width: 50, height: 12),
                      const SizedBox(height: 4),
                      SkeletonBlock(width: 40, height: 10),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
