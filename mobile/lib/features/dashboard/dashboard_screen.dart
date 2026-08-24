import 'dart:async';
import 'dart:math' as math;

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/notification_service.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/error_views.dart';
import '../clients/client_detail_screen.dart';
import '../home/home_tab.dart';
import '../invoices/invoice_detail_screen.dart';
import '../leads/lead_detail_screen.dart';
import '../notifications/notifications_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _data;
  Object? _error;
  bool _loading = true;
  int _unread = 0;
  Timer? _notifTimer;
  DateTime? _notifWatermark;

  @override
  void initState() {
    super.initState();
    _load();
    _pollNotifications();
    // Keep the bell fresh while the dashboard is visible.
    _notifTimer = Timer.periodic(
      const Duration(seconds: 60),
      (_) => _pollNotifications(),
    );
  }

  @override
  void dispose() {
    _notifTimer?.cancel();
    super.dispose();
  }

  /// Fetches notifications: updates the bell badge and surfaces brand-new
  /// alerts as heads-up notifications. First run only sets the watermark so
  /// existing history isn't replayed.
  Future<void> _pollNotifications() async {
    try {
      final res = await ApiClient.instance.notificationsList();
      final items = ((res['data'] as List?) ?? const [])
          .map((e) => (e as Map).cast<String, dynamic>())
          .toList();
      final unread = (res['unreadCount'] as num?)?.toInt() ?? _unread;

      DateTime? latest;
      final fresh = <Map<String, dynamic>>[];
      for (final item in items) {
        final at = DateTime.tryParse('${item['created_at']}')?.toLocal();
        if (at == null) continue;
        if (latest == null || at.isAfter(latest)) latest = at;
        if (_notifWatermark != null && at.isAfter(_notifWatermark!)) {
          fresh.add(item);
        }
      }

      if (_notifWatermark == null && latest != null) {
        _notifWatermark = latest;
      } else if (latest != null && latest.isAfter(_notifWatermark!)) {
        _notifWatermark = latest;
      }

      // Surface at most 3 new alerts per poll as heads-up notifications.
      for (final item in fresh.take(3)) {
        await NotificationService.instance.show(
          title: '${item['title'] ?? 'Alert'}',
          body: '${item['body'] ?? ''}'.isEmpty ? null : '${item['body']}',
        );
      }

      if (mounted) setState(() => _unread = unread);
    } catch (_) {
      // Silent — the bell just stays stale until the next tick.
    }
  }

  /// [silent] keeps the current content on screen while refreshing — used
  /// for pull-to-refresh and after returning from a detail screen.
  Future<void> _load({bool silent = false}) async {
    if (!silent) {
      setState(() {
        _loading = true;
        _error = null;
      });
    }
    try {
      final res = await ApiClient.instance.overview();
      if (mounted) {
        setState(() {
          _data = res;
          _error = null;
        });
      }
    } catch (err) {
      if (mounted) setState(() => _error = err);
    } finally {
      if (mounted && !silent) setState(() => _loading = false);
    }
  }

  Future<void> _open(WidgetBuilder builder) async {
    await Navigator.of(context).push(MaterialPageRoute(builder: builder));
    _load(silent: true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: _BellIcon(unread: _unread),
            onPressed: () async {
              await Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              );
              _pollNotifications();
            },
            tooltip: 'Notifications',
          ),
          IconButton(
            icon: const Icon(
              Icons.refresh,
              size: 18,
              color: AppColors.textMuted,
            ),
            onPressed: () => _load(),
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _loading
          ? const LoadingView()
          : _error != null
          ? ErrorStateView(error: _error, onRetry: () => _load())
          : _buildContent(),
    );
  }

  Widget _buildContent() {
    final stats = _data!['stats'] as Map<String, dynamic>? ?? const {};
    final conversionRate = (_data!['conversionRate'] ?? '0') as String;
    final userName = (_data!['userName'] ?? 'Admin') as String;

    final totalRevenue = (stats['totalRevenue'] as num?)?.toDouble() ?? 0;
    final totalOutstanding =
        (stats['totalOutstanding'] as num?)?.toDouble() ?? 0;

    final monthlyRevenue = ((stats['monthlyRevenue'] as List?) ?? const [])
        .map((e) => (e as Map).cast<String, dynamic>())
        .toList();
    final monthlyLeads = ((stats['monthlyLeadData'] as List?) ?? const [])
        .map((e) => (e as Map).cast<String, dynamic>())
        .toList();
    final overdueInvoices = ((stats['overdueInvoices'] as List?) ?? const [])
        .map((e) => (e as Map).cast<String, dynamic>())
        .toList();

    return RefreshIndicator(
      onRefresh: () => _load(silent: true),
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Welcome back, $userName',
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 17,
              fontWeight: FontWeight.w600,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 5),
          Text(
            DateFormat('EEEE, MMM d').format(DateTime.now()),
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 20),
          if (monthlyRevenue.isNotEmpty || monthlyLeads.isNotEmpty)
            _RevenueHeroCard(
              revenue: monthlyRevenue,
              leads: monthlyLeads,
              totalRevenue: totalRevenue,
              totalOutstanding: totalOutstanding,
              totalLeads: (stats['totalLeads'] as num?)?.toInt() ?? 0,
              conversionRate: conversionRate,
              revMom: stats['revenueMomChange'],
              leadsMom: stats['leadsMomChange'],
            ),
          const SizedBox(height: 16),
          _StatStrip(stats: stats),
          if (overdueInvoices.isNotEmpty) ...[
            const SizedBox(height: 10),
            _OverdueBanner(
              invoices: overdueInvoices,
              onTap: () => _open(
                (_) => InvoiceDetailScreen(invoice: overdueInvoices.first),
              ),
            ),
          ],
          const SizedBox(height: 16),
          _PipelineCard(stats: stats, conversionRate: conversionRate),
          const SizedBox(height: 24),
          _RecentSection(
            title: 'RECENT LEADS',
            kind: 'lead',
            items: (stats['recentLeads'] as List?) ?? const [],
            onViewAll: () => homeTab.value = 1,
            onOpen: (item) => _open((_) => LeadDetailScreen(lead: item)),
          ),
          const SizedBox(height: 16),
          _RecentSection(
            title: 'RECENT CLIENTS',
            kind: 'client',
            items: (stats['recentClients'] as List?) ?? const [],
            onViewAll: () => homeTab.value = 2,
            onOpen: (item) => _open((_) => ClientDetailScreen(client: item)),
          ),
          const SizedBox(height: 16),
          _RecentSection(
            title: 'RECENT INVOICES',
            kind: 'invoice',
            items: (stats['recentInvoices'] as List?) ?? const [],
            onViewAll: () => homeTab.value = 3,
            onOpen: (item) => _open((_) => InvoiceDetailScreen(invoice: item)),
          ),
          const SizedBox(height: 28),
        ],
      ),
    );
  }
}

// ── Chart helpers ─────────────────────────────────────────────────────────

/// Rounds an axis step up to a human-friendly interval (1 / 2 / 2.5 / 5 × 10ⁿ).
double _niceStep(double raw) {
  if (raw <= 0) return 1;
  final mag = math.pow(10, (math.log(raw) / math.ln10).floor()).toDouble();
  for (final m in const [1.0, 2.0, 2.5, 5.0]) {
    if (mag * m >= raw) return mag * m;
  }
  return mag * 10;
}

String _axisMoney(double v) {
  if (v >= 1000000) {
    final m = v / 1000000;
    return '\$${m.toStringAsFixed(m % 1 == 0 ? 0 : 1)}M';
  }
  if (v >= 1000) {
    final k = v / 1000;
    return '\$${k.toStringAsFixed(k % 1 == 0 ? 0 : 1)}k';
  }
  return v == 0 ? '0' : '\$${v.toStringAsFixed(0)}';
}

FlLine _gridLine() =>
    const FlLine(color: AppColors.borderSoft, strokeWidth: 1, dashArray: [4]);

Widget _monthLabel(double v, List<Map<String, dynamic>> data) => Padding(
  padding: const EdgeInsets.only(top: 6),
  child: Text(
    v.toInt() >= 0 && v.toInt() < data.length
        ? '${data[v.toInt()]['month']}'
        : '',
    style: const TextStyle(
      color: AppColors.textFaint,
      fontSize: 9,
      fontFamily: 'Inter',
    ),
  ),
);

class _ChartLegendDot extends StatelessWidget {
  const _ChartLegendDot({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 8, height: 8, color: color),
        const SizedBox(width: 6),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textFaint,
            fontSize: 10,
            fontFamily: 'Inter',
          ),
        ),
      ],
    );
  }
}

class _Eyebrow extends StatelessWidget {
  const _Eyebrow(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: AppColors.textFaint,
        fontSize: 9,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.2,
        fontFamily: 'Inter',
      ),
    );
  }
}

class _TrendBadge extends StatelessWidget {
  const _TrendBadge({this.mom});

  final dynamic mom;

  @override
  Widget build(BuildContext context) {
    if (mom is! num) return const SizedBox.shrink();
    final up = mom >= 0;
    const fg = AppColors.accent;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        border: Border.all(color: AppColors.borderSoft),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            up ? Icons.arrow_drop_up_rounded : Icons.arrow_drop_down_rounded,
            size: 14,
            color: fg,
          ),
          Transform.translate(
            offset: const Offset(-3, 0),
            child: Text(
              '${mom.abs().toStringAsFixed(0)}% MoM',
              style: const TextStyle(
                color: fg,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                fontFamily: 'Inter',
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Analytics hero ────────────────────────────────────────────────────────

/// Premium analytics module — smooth gradient area chart with a dashed
/// comparison line and crosshair tooltip, switchable between Revenue and
/// Leads series (Vercel/shadcn-style chart treatment).
class _RevenueHeroCard extends StatefulWidget {
  const _RevenueHeroCard({
    required this.revenue,
    required this.leads,
    required this.totalRevenue,
    required this.totalOutstanding,
    required this.totalLeads,
    required this.conversionRate,
    this.revMom,
    this.leadsMom,
  });

  final List<Map<String, dynamic>> revenue;
  final List<Map<String, dynamic>> leads;
  final double totalRevenue;
  final double totalOutstanding;
  final int totalLeads;
  final String conversionRate;
  final dynamic revMom;
  final dynamic leadsMom;

  @override
  State<_RevenueHeroCard> createState() => _RevenueHeroCardState();
}

class _RevenueHeroCardState extends State<_RevenueHeroCard> {
  bool _leadsMode = false;

  List<Map<String, dynamic>> get _series =>
      _leadsMode ? widget.leads : widget.revenue;

  String _month(FlSpot spot) {
    final data = _series;
    final i = spot.x.toInt();
    return i >= 0 && i < data.length ? '${data[i]['month']}' : '';
  }

  @override
  Widget build(BuildContext context) {
    final data = _series;
    final primarySpots = <FlSpot>[
      for (var i = 0; i < data.length; i++)
        FlSpot(
          i.toDouble(),
          _leadsMode
              ? (data[i]['leads'] as num? ?? 0).toDouble()
              : (data[i]['paid'] as num? ?? 0).toDouble(),
        ),
    ];
    final secondarySpots = <FlSpot>[
      for (var i = 0; i < data.length; i++)
        FlSpot(
          i.toDouble(),
          _leadsMode
              ? (data[i]['won'] as num? ?? 0).toDouble()
              : (data[i]['outstanding'] as num? ?? 0).toDouble(),
        ),
    ];

    var maxVal = 1.0;
    for (final d in data) {
      if (_leadsMode) {
        maxVal = math.max(maxVal, (d['leads'] as num? ?? 0).toDouble());
        maxVal = math.max(maxVal, (d['won'] as num? ?? 0).toDouble());
      } else {
        maxVal = math.max(maxVal, (d['paid'] as num? ?? 0).toDouble());
        maxVal = math.max(maxVal, (d['outstanding'] as num? ?? 0).toDouble());
      }
    }
    final step = _niceStep(maxVal / 3);
    final maxY = step * 3 * 1.05;

    String axisLabel(double v) =>
        _leadsMode ? v.toStringAsFixed(v % 1 == 0 ? 0 : 1) : _axisMoney(v);

    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const _Eyebrow('ANALYTICS'),
              _ModeSwitch(
                value: _leadsMode ? 'leads' : 'revenue',
                onChanged: (v) => setState(() => _leadsMode = v == 'leads'),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            _leadsMode
                ? '${widget.totalLeads}'
                : Fmt.money(widget.totalRevenue),
            style: const TextStyle(
              color: AppColors.accent,
              fontSize: 30,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.8,
              height: 1.05,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 5),
          Row(
            children: [
              _TrendBadge(mom: _leadsMode ? widget.leadsMom : widget.revMom),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  _leadsMode
                      ? 'total leads · ${widget.conversionRate}% won'
                      : 'collected all-time · ${Fmt.money(widget.totalOutstanding)} outstanding',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 10.5,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          SizedBox(
            height: 170,
            child: LineChart(
              LineChartData(
                minX: 0,
                maxX: math.max(0, data.length - 1).toDouble(),
                minY: 0,
                maxY: maxY,
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: step,
                  getDrawingHorizontalLine: (_) => _gridLine(),
                ),
                titlesData: FlTitlesData(
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 40,
                      interval: step,
                      getTitlesWidget: (v, meta) => Text(
                        axisLabel(v),
                        style: const TextStyle(
                          color: AppColors.textFaint,
                          fontSize: 8.5,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 22,
                      getTitlesWidget: (v, meta) => _monthLabel(v, data),
                    ),
                  ),
                ),
                borderData: FlBorderData(show: false),
                lineTouchData: LineTouchData(
                  handleBuiltInTouches: true,
                  getTouchedSpotIndicator: (barData, spotIndexes) => [
                    for (final _ in spotIndexes)
                      TouchedSpotIndicatorData(
                        const FlLine(
                          color: Color(0x33FFFFFF),
                          strokeWidth: 1,
                          dashArray: [3, 3],
                        ),
                        FlDotData(
                          show: true,
                          getDotPainter: (spot, _, _, _) => FlDotCirclePainter(
                            radius: 3.5,
                            color: barData.color ?? AppColors.accent,
                            strokeWidth: 2,
                            strokeColor: AppColors.card,
                          ),
                        ),
                      ),
                  ],
                  touchTooltipData: LineTouchTooltipData(
                    getTooltipColor: (_) => AppColors.cardRaised,
                    getTooltipItems: (touchedSpots) => [
                      for (final s in touchedSpots)
                        LineTooltipItem(
                          _leadsMode
                              ? '${_month(s)} · ${s.barIndex == 0 ? '${s.y.toInt()} leads' : '${s.y.toInt()} won'}'
                              : '${_month(s)} · ${s.barIndex == 0 ? 'Paid ${_axisMoney(s.y)}' : 'Due ${_axisMoney(s.y)}'}',
                          TextStyle(
                            color: s.barIndex == 0
                                ? AppColors.accent
                                : AppColors.textMuted,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'Inter',
                          ),
                        ),
                    ],
                  ),
                ),
                lineBarsData: [
                  LineChartBarData(
                    spots: primarySpots,
                    isCurved: true,
                    curveSmoothness: 0.32,
                    preventCurveOverShooting: true,
                    barWidth: 2,
                    color: AppColors.accent,
                    isStrokeCapRound: true,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: const LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0x2EEAEFFF), Color(0x00EAEFFF)],
                      ),
                    ),
                  ),
                  LineChartBarData(
                    spots: secondarySpots,
                    isCurved: true,
                    curveSmoothness: 0.32,
                    preventCurveOverShooting: true,
                    barWidth: 1.5,
                    color: const Color(0x61FFFFFF),
                    dashArray: const [5, 4],
                    isStrokeCapRound: true,
                    dotData: const FlDotData(show: false),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _ChartLegendDot(
                color: AppColors.accent,
                label: _leadsMode ? 'Leads' : 'Collected',
              ),
              const SizedBox(width: 14),
              _ChartLegendDot(
                color: const Color(0x61FFFFFF),
                label: _leadsMode ? 'Won' : 'Outstanding',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Pill-style segmented control used to toggle the hero chart's data mode.
class _ModeSwitch extends StatelessWidget {
  const _ModeSwitch({required this.value, required this.onChanged});

  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(border: Border.all(color: AppColors.border)),
      padding: const EdgeInsets.all(2),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final s in const ['Revenue', 'Leads'])
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => onChanged(s.toLowerCase()),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 160),
                curve: Curves.easeOut,
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                color: value == s.toLowerCase()
                    ? AppColors.accent
                    : Colors.transparent,
                child: Text(
                  s,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.3,
                    fontFamily: 'Inter',
                    color: value == s.toLowerCase()
                        ? const Color(0xFF070707)
                        : AppColors.textMuted,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ── Stat strip ────────────────────────────────────────────────────────────

/// One bordered container holding the three headline counts — replaces the
/// old grid of six KPI cards.
class _StatStrip extends StatelessWidget {
  const _StatStrip({required this.stats});

  final Map<String, dynamic> stats;

  @override
  Widget build(BuildContext context) {
    final leadsMom = stats['leadsMomChange'];
    final clientsMom = (stats['clientsMom'] as num?)?.toInt() ?? 0;

    final items = [
      (
        label: 'LEADS',
        value: '${stats['totalLeads'] ?? 0}',
        sub: _mom(leadsMom, 'leads'),
        onTap: () => homeTab.value = 1,
      ),
      (
        label: 'CLIENTS',
        value: '${stats['totalClients'] ?? 0}',
        sub: _mom(clientsMom.toDouble(), 'clients'),
        onTap: () => homeTab.value = 2,
      ),
      (
        label: 'PROJECTS',
        value: '${stats['totalProjects'] ?? 0}',
        sub: '${stats['activeProjects'] ?? 0} active',
        onTap: () => homeTab.value = 3,
      ),
    ];

    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          for (var i = 0; i < items.length; i++) ...[
            if (i > 0)
              Container(width: 1, height: 52, color: AppColors.borderSoft),
            Expanded(
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: items[i].onTap,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      vertical: 14,
                      horizontal: 12,
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          items[i].label,
                          style: const TextStyle(
                            color: AppColors.textFaint,
                            fontSize: 8.5,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1.2,
                            fontFamily: 'Inter',
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          items[i].value,
                          style: const TextStyle(
                            color: AppColors.text,
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            letterSpacing: -0.4,
                            fontFamily: 'Inter',
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          items[i].sub,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: AppColors.textFaint,
                            fontSize: 9.5,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _mom(dynamic value, String kind) {
    if (value == null) return '—';
    final n = (value as num).toDouble();
    final arrow = n >= 0 ? '↑' : '↓';
    final label = kind == 'clients' ? 'vs last month' : 'this month';
    return '$arrow ${n.abs().toStringAsFixed(0)}% $label';
  }
}

// ── Overdue banner ────────────────────────────────────────────────────────

class _OverdueBanner extends StatelessWidget {
  const _OverdueBanner({required this.invoices, required this.onTap});

  final List<Map<String, dynamic>> invoices;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final totalDue = invoices.fold<num>(
      0,
      (sum, inv) => sum + ((inv['total'] as num? ?? 0)),
    );
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.04),
            border: Border.all(color: Colors.white.withValues(alpha: 0.16)),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.error_outline_rounded,
                size: 14,
                color: AppColors.text,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  '${invoices.length} overdue invoice${invoices.length == 1 ? '' : 's'} · ${Fmt.money(totalDue.toDouble())}',
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
              const Icon(
                Icons.chevron_right,
                size: 16,
                color: AppColors.textFaint,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Lead pipeline ─────────────────────────────────────────────────────────

/// Funnel as metric-bar rows — label + count over a slim proportional bar,
/// monochrome intensity ramp, staggered grow-in animation.
class _PipelineCard extends StatelessWidget {
  const _PipelineCard({required this.stats, required this.conversionRate});

  final Map<String, dynamic> stats;
  final String conversionRate;

  /// Monochrome intensity ramp — one hue (accent white) at descending
  /// opacities so depth reads without color.
  static const _stageAlpha = [0.95, 0.68, 0.46, 0.28, 0.15];

  static const _stages = [
    ('Inquiry', 'inquiryLeads'),
    ('Discovery', 'discoveryLeads'),
    ('Proposal', 'proposalLeads'),
    ('In Progress', 'inProgressLeads'),
    ('Completed', 'completedLeads'),
  ];

  @override
  Widget build(BuildContext context) {
    final values = [
      for (var i = 0; i < _stages.length; i++)
        (stats[_stages[i].$2] as num?)?.toInt() ?? 0,
    ];
    final maxVal = values.fold<int>(1, math.max);
    final total = values.fold<int>(0, (sum, v) => sum + v);
    final lost = (stats['lostLeads'] as num?)?.toInt() ?? 0;

    return SectionCard(
      title: 'LEAD PIPELINE',
      trailing: Text(
        '$total leads · $conversionRate% won',
        style: const TextStyle(
          color: AppColors.textFaint,
          fontSize: 10,
          fontFamily: 'Inter',
        ),
      ),
      child: Column(
        children: [
          for (var i = 0; i < _stages.length; i++) ...[
            if (i > 0) const SizedBox(height: 13),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  _stages[i].$1,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 11,
                    fontFamily: 'Inter',
                  ),
                ),
                Text(
                  '${values[i]}',
                  style: TextStyle(
                    color: values[i] > 0 ? AppColors.text : AppColors.textFaint,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    fontFeatures: const [FontFeature.tabularFigures()],
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Container(
              height: 4,
              width: double.infinity,
              color: AppColors.cardRaised,
              alignment: Alignment.centerLeft,
              child: TweenAnimationBuilder<double>(
                tween: Tween(end: values[i] / maxVal),
                duration: Duration(milliseconds: 550 + i * 70),
                curve: Curves.easeOutCubic,
                builder: (_, t, _) => FractionallySizedBox(
                  alignment: Alignment.centerLeft,
                  widthFactor: t,
                  child: Container(
                    color: AppColors.accent.withValues(alpha: _stageAlpha[i]),
                  ),
                ),
              ),
            ),
          ],
          if (lost > 0) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: Text(
                '$lost lost',
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 10,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ── Activity feed ─────────────────────────────────────────────────────────

// ── Recent sections ───────────────────────────────────────────────────────

/// One dedicated list section per resource (leads / clients / invoices) —
/// capped at four rows with a quiet VIEW ALL link.
class _RecentSection extends StatelessWidget {
  const _RecentSection({
    required this.title,
    required this.kind,
    required this.items,
    required this.onViewAll,
    required this.onOpen,
  });

  final String title;
  final String kind;
  final List<dynamic> items;
  final VoidCallback onViewAll;
  final void Function(Map<String, dynamic>) onOpen;

  @override
  Widget build(BuildContext context) {
    final shown = items.take(4).toList();

    return SectionCard(
      title: title,
      trailing: shown.isEmpty ? null : _ViewAllButton(onTap: onViewAll),
      child: shown.isEmpty
          ? const EmptyState(message: 'Nothing yet')
          : Column(
              children: [
                for (final e in shown) _row((e as Map).cast<String, dynamic>()),
              ],
            ),
    );
  }

  Widget _row(Map<String, dynamic> map) {
    final String titleText;
    final String sub;
    String? amountText;

    switch (kind) {
      case 'invoice':
        titleText = map['invoice_number'] ?? '—';
        final client = map['client'];
        sub = client is Map ? '${client['name'] ?? '—'}' : '—';
        amountText = Fmt.moneyWithCurrency(
          (map['total'] as num?)?.toDouble(),
          map['currency'] as String?,
        );
      case 'client':
        titleText = map['name'] ?? '—';
        sub = '${map['company'] ?? map['email'] ?? '—'}';
      default:
        titleText = map['name'] ?? '—';
        sub = '${map['company'] ?? '—'} • ${map['email'] ?? '—'}';
    }

    final initial = titleText.isNotEmpty ? titleText[0].toUpperCase() : '?';

    Widget row = Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: AppColors.cardRaised,
              border: Border.all(color: AppColors.borderSoft),
            ),
            child: Text(
              initial,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 13,
                fontWeight: FontWeight.w600,
                fontFamily: 'Inter',
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titleText,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    fontFamily: 'Inter',
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  sub,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 11,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (kind == 'invoice')
                Text(
                  amountText ?? '',
                  style: const TextStyle(
                    color: AppColors.accent,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    fontFamily: 'Inter',
                  ),
                )
              else
                const SizedBox.shrink(),
              const SizedBox(height: 2),
              Text(
                Fmt.timeAgo(map['created_at'] as String?),
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 10.5,
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
          const SizedBox(width: 2),
          const Icon(Icons.chevron_right, size: 15, color: AppColors.textFaint),
        ],
      ),
    );

    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.borderSoft)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(onTap: () => onOpen(map), child: row),
      ),
    );
  }
}

class _ViewAllButton extends StatelessWidget {
  const _ViewAllButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: const Padding(
        padding: EdgeInsets.symmetric(horizontal: 4, vertical: 4),
        child: Text(
          'VIEW ALL',
          style: TextStyle(
            color: AppColors.textFaint,
            fontSize: 9,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.2,
            fontFamily: 'Inter',
          ),
        ),
      ),
    );
  }
}

// ── Bell with unread badge ────────────────────────────────────────────────

class _BellIcon extends StatelessWidget {
  const _BellIcon({required this.unread});

  final int unread;

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        const Icon(
          Icons.notifications_outlined,
          size: 20,
          color: AppColors.textMuted,
        ),
        if (unread > 0)
          Positioned(
            right: -4,
            top: -3,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
              constraints: const BoxConstraints(minWidth: 14),
              decoration: BoxDecoration(
                color: AppColors.accent,
                borderRadius: BorderRadius.circular(7),
              ),
              alignment: Alignment.center,
              child: Text(
                unread > 9 ? '9+' : '$unread',
                style: const TextStyle(
                  color: Color(0xFF070707),
                  fontSize: 8,
                  fontWeight: FontWeight.w700,
                  fontFeatures: [FontFeature.tabularFigures()],
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ),
      ],
    );
  }
}
