import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../../core/theme.dart';

/// Minimal sparkline — no axes, no grid, no touch. Soft gradient below the
/// line, rounded stroke caps. For stat cards and compact trend hints.
class Sparkline extends StatelessWidget {
  const Sparkline({
    super.key,
    required this.values,
    this.height = 26,
    this.strokeWidth = 1.5,
  });

  final List<double> values;
  final double height;
  final double strokeWidth;

  @override
  Widget build(BuildContext context) {
    if (values.length < 2) return SizedBox(height: height);

    var minV = values.first;
    var maxV = values.first;
    for (final v in values) {
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
    final span = (maxV - minV).abs();
    final pad = span == 0 ? 1.0 : span * 0.15;
    final spots = [
      for (var i = 0; i < values.length; i++) FlSpot(i.toDouble(), values[i]),
    ];

    return SizedBox(
      height: height,
      child: LineChart(
        LineChartData(
          minX: 0,
          maxX: (values.length - 1).toDouble(),
          minY: minV - pad,
          maxY: maxV + pad,
          gridData: const FlGridData(show: false),
          borderData: FlBorderData(show: false),
          lineTouchData: const LineTouchData(enabled: false),
          titlesData: const FlTitlesData(show: false),
          lineBarsData: [
            LineChartBarData(
              spots: spots,
              isCurved: true,
              curveSmoothness: 0.3,
              preventCurveOverShooting: true,
              barWidth: strokeWidth,
              color: AppColors.accent,
              isStrokeCapRound: true,
              dotData: const FlDotData(show: false),
              belowBarData: BarAreaData(
                show: true,
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.accent.withValues(alpha: 0.12),
                    AppColors.accent.withValues(alpha: 0),
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
