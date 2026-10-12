import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../core/theme.dart';

/// HabitFlow-style half-round completion gauge — semicircle arc with
/// rounded stroke caps and a soft monochrome gradient. Pure CustomPainter,
/// no chart package.
class HalfGauge extends StatelessWidget {
  const HalfGauge({
    super.key,
    required this.value,
    this.size = 150,
    this.strokeWidth = 14,
  });

  /// 0.0 – 1.0
  final double value;
  final double size;
  final double strokeWidth;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size / 2 + strokeWidth),
      painter: _HalfGaugePainter(
        value: value.clamp(0.0, 1.0),
        strokeWidth: strokeWidth,
      ),
    );
  }
}

class _HalfGaugePainter extends CustomPainter {
  _HalfGaugePainter({required this.value, required this.strokeWidth});

  final double value;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final center = Offset(w / 2, h - strokeWidth / 2);
    final radius = (w - strokeWidth) / 2;
    const startAngle = math.pi;
    const sweep = math.pi;

    final track = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..color = AppColors.overlay;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweep,
      false,
      track,
    );

    if (value <= 0) return;
    final progress = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..shader = LinearGradient(
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
        colors: [AppColors.textMuted, AppColors.accent],
      ).createShader(Rect.fromCircle(center: center, radius: radius));
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweep * value,
      false,
      progress,
    );
  }

  @override
  bool shouldRepaint(_HalfGaugePainter old) =>
      old.value != value || old.strokeWidth != strokeWidth;
}
