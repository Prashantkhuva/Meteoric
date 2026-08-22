import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _data;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await ApiClient.instance.overview();
      if (mounted) setState(() => _data = res);
    } catch (err) {
      if (mounted) setState(() => _error = err.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(
              Icons.refresh,
              size: 18,
              color: AppColors.textMuted,
            ),
            onPressed: _load,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _loading
          ? const LoadingView()
          : _error != null
          ? ErrorBox(message: _error!, onRetry: _load)
          : _buildContent(),
    );
  }

  Widget _buildContent() {
    final stats = _data!['stats'] as Map<String, dynamic>? ?? const {};
    final conversionRate = (_data!['conversionRate'] ?? '0') as String;
    final userName = (_data!['userName'] ?? 'Admin') as String;

    final leadsMom = stats['leadsMomChange'];
    final revenueMom = stats['revenueMomChange'];
    final clientsMom = (stats['clientsMom'] as num?)?.toInt() ?? 0;
    final totalOutstanding =
        (stats['totalOutstanding'] as num?)?.toDouble() ?? 0;
    final totalRevenue = (stats['totalRevenue'] as num?)?.toDouble() ?? 0;
    final overdueCount = (stats['overdueCount'] as num?)?.toInt() ?? 0;

    final monthlyLeads = ((stats['monthlyLeadData'] as List?) ?? const [])
        .map((e) => (e as Map).cast<String, dynamic>())
        .toList();
    final monthlyRevenue = ((stats['monthlyRevenue'] as List?) ?? const [])
        .map((e) => (e as Map).cast<String, dynamic>())
        .toList();

    return RefreshIndicator(
      onRefresh: _load,
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
          const SizedBox(height: 6),
          const Text(
            'Here\'s what\'s happening at Meteoric.',
            style: TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: KpiCard(
                  label: 'Total Leads',
                  value: '${stats['totalLeads'] ?? 0}',
                  sub: '${stats['inquiryLeads'] ?? 0} new inquiries',
                  subColor: AppColors.sky,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: KpiCard(
                  label: 'Conversion',
                  value: '$conversionRate%',
                  sub: _mom(leadsMom, 'leads'),
                  subColor: leadsMom == null
                      ? null
                      : (leadsMom >= 0 ? AppColors.emerald : AppColors.red),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: KpiCard(
                  label: 'Clients',
                  value: '${stats['totalClients'] ?? 0}',
                  sub: _mom(clientsMom.toDouble(), 'clients'),
                  subColor: clientsMom >= 0 ? AppColors.emerald : AppColors.red,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: KpiCard(
                  label: 'Projects',
                  value: '${stats['totalProjects'] ?? 0}',
                  sub: '${stats['activeProjects'] ?? 0} active',
                  subColor: AppColors.accent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: KpiCard(
                  label: 'Revenue',
                  value: Fmt.money(totalRevenue),
                  sub: _mom(revenueMom, 'rev'),
                  subColor: revenueMom == null
                      ? null
                      : (revenueMom >= 0 ? AppColors.emerald : AppColors.red),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: KpiCard(
                  label: 'Outstanding',
                  value: Fmt.money(totalOutstanding),
                  sub: '$overdueCount overdue',
                  subColor: overdueCount > 0
                      ? AppColors.red
                      : AppColors.textMuted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          if (monthlyLeads.isNotEmpty) _LeadsTrendCard(data: monthlyLeads),
          const SizedBox(height: 12),
          if (monthlyRevenue.isNotEmpty)
            _RevenueTrendCard(data: monthlyRevenue),
          const SizedBox(height: 12),
          _LeadFunnelCard(stats: stats),
          const SizedBox(height: 20),
          _RecentSection(
            title: 'Recent Leads',
            items: (stats['recentLeads'] as List?) ?? const [],
            type: 'lead',
          ),
          const SizedBox(height: 16),
          _RecentSection(
            title: 'Recent Clients',
            items: (stats['recentClients'] as List?) ?? const [],
            type: 'client',
          ),
          const SizedBox(height: 16),
          _RecentSection(
            title: 'Recent Invoices',
            items: (stats['recentInvoices'] as List?) ?? const [],
            type: 'invoice',
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  String _mom(dynamic value, String kind) {
    if (value == null) return '—';
    final n = (value as num).toDouble();
    final arrow = n >= 0 ? '↑' : '↓';
    final label = kind == 'leads'
        ? 'this month'
        : kind == 'clients'
        ? 'vs last month'
        : 'this month';
    return '$arrow ${n.abs().toStringAsFixed(0)}% $label';
  }
}

class _ChartLegendDot extends StatelessWidget {
  const _ChartLegendDot({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 5),
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

class _LeadsTrendCard extends StatelessWidget {
  const _LeadsTrendCard({required this.data});

  final List<Map<String, dynamic>> data;

  @override
  Widget build(BuildContext context) {
    final maxY = data
        .fold<num>(
          1,
          (m, d) =>
              m > (d['leads'] as num? ?? 0) ? m : (d['leads'] as num? ?? 0),
        )
        .toDouble();
    return SectionCard(
      title: 'LEADS — LAST 6 MONTHS',
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              const _ChartLegendDot(color: AppColors.accent, label: 'Leads'),
              const SizedBox(width: 12),
              const _ChartLegendDot(color: AppColors.emerald, label: 'Won'),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            height: 150,
            child: LineChart(
              LineChartData(
                minY: 0,
                maxY: maxY < 4 ? 4 : maxY + 1,
                gridData: const FlGridData(show: false),
                titlesData: FlTitlesData(
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  leftTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 22,
                      getTitlesWidget: (v, meta) => Padding(
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
                      ),
                    ),
                  ),
                ),
                borderData: FlBorderData(
                  show: true,
                  border: const Border(
                    bottom: BorderSide(color: AppColors.border),
                  ),
                ),
                lineTouchData: LineTouchData(
                  touchTooltipData: LineTouchTooltipData(
                    getTooltipColor: (_) => AppColors.cardRaised,
                    getTooltipItems: (spots) => [
                      for (final s in spots)
                        LineTooltipItem(
                          '${data[s.x.toInt()]['month']} • ${s.y.toStringAsFixed(0)}',
                          TextStyle(
                            color: s.bar.color ?? AppColors.text,
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
                    spots: [
                      for (var i = 0; i < data.length; i++)
                        FlSpot(
                          i.toDouble(),
                          (data[i]['leads'] as num? ?? 0).toDouble(),
                        ),
                    ],
                    isCurved: true,
                    barWidth: 2,
                    color: AppColors.accent,
                    dotData: const FlDotData(show: true),
                  ),
                  LineChartBarData(
                    spots: [
                      for (var i = 0; i < data.length; i++)
                        FlSpot(
                          i.toDouble(),
                          (data[i]['won'] as num? ?? 0).toDouble(),
                        ),
                    ],
                    isCurved: true,
                    barWidth: 2,
                    color: AppColors.emerald,
                    dotData: const FlDotData(show: false),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _RevenueTrendCard extends StatelessWidget {
  const _RevenueTrendCard({required this.data});

  final List<Map<String, dynamic>> data;

  @override
  Widget build(BuildContext context) {
    final maxPaid = data
        .fold<num>(
          1,
          (m, d) => (d['paid'] as num? ?? 0) > m ? (d['paid'] as num? ?? 0) : m,
        )
        .toDouble();
    return SectionCard(
      title: 'REVENUE — LAST 6 MONTHS',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  _ChartLegendDot(color: AppColors.accent, label: 'Paid'),
                  SizedBox(width: 12),
                  _ChartLegendDot(
                    color: AppColors.textMuted,
                    label: 'Outstanding',
                  ),
                ],
              ),
              Text(
                _compact(maxPaid),
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 9,
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            height: 140,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: maxPaid * 1.15,
                gridData: const FlGridData(show: false),
                titlesData: FlTitlesData(
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  leftTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 22,
                      getTitlesWidget: (v, meta) => Padding(
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
                      ),
                    ),
                  ),
                ),
                borderData: FlBorderData(
                  show: true,
                  border: const Border(
                    bottom: BorderSide(color: AppColors.border),
                  ),
                ),
                barTouchData: BarTouchData(
                  touchTooltipData: BarTouchTooltipData(
                    getTooltipColor: (_) => AppColors.cardRaised,
                    getTooltipItem: (group, groupIndex, rod, rodIndex) =>
                        BarTooltipItem(
                          _compact(rod.toY),
                          const TextStyle(
                            color: AppColors.accent,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'Inter',
                          ),
                        ),
                  ),
                ),
                barGroups: [
                  for (var i = 0; i < data.length; i++)
                    BarChartGroupData(
                      x: i,
                      barRods: [
                        BarChartRodData(
                          toY: (data[i]['paid'] as num? ?? 0).toDouble(),
                          width: 14,
                          borderRadius: BorderRadius.zero,
                          color: AppColors.accent.withValues(alpha: 0.9),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  static String _compact(num v) {
    if (v >= 1000000) {
      final m = v / 1000000;
      return '${m.toStringAsFixed(m % 1 == 0 ? 0 : 1)}M';
    }
    if (v >= 1000) {
      final k = v / 1000;
      return '${k.toStringAsFixed(k % 1 == 0 ? 0 : 1)}k';
    }
    return v.toStringAsFixed(0);
  }
}

class _LeadFunnelCard extends StatelessWidget {
  const _LeadFunnelCard({required this.stats});

  final Map<String, dynamic> stats;

  static const _stages = [
    ('Inquiry', 'inquiryLeads', AppColors.sky),
    ('Discovery', 'discoveryLeads', AppColors.violet),
    ('Proposal', 'proposalLeads', AppColors.amber),
    ('In Progress', 'inProgressLeads', AppColors.accent),
    ('Completed', 'completedLeads', AppColors.emerald),
  ];

  @override
  Widget build(BuildContext context) {
    final entries = [
      for (final (label, key, color) in _stages)
        (label, (stats[key] as num?)?.toInt() ?? 0, color),
    ];
    final maxVal = entries.fold<int>(1, (m, e) => e.$2 > m ? e.$2 : m);
    final lost = (stats['lostLeads'] as num?)?.toInt() ?? 0;
    return SectionCard(
      title: 'LEAD PIPELINE',
      child: Column(
        children: [
          for (final (label, value, color) in entries)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        label,
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 11,
                          fontFamily: 'Inter',
                        ),
                      ),
                      Text(
                        '$value',
                        style: TextStyle(
                          color: color,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRect(
                    child: Container(
                      height: 6,
                      width: double.infinity,
                      color: AppColors.cardRaised,
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: value / maxVal,
                        child: Container(color: color.withValues(alpha: 0.85)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              '$lost lost',
              style: const TextStyle(
                color: AppColors.red,
                fontSize: 10,
                fontFamily: 'Inter',
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _RecentSection extends StatelessWidget {
  const _RecentSection({
    required this.title,
    required this.items,
    required this.type,
  });

  final String title;
  final List<dynamic> items;
  final String type;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: title,
      child: items.isEmpty
          ? const EmptyState(message: 'Nothing yet')
          : Column(children: [for (final item in items) _row(context, item)]),
    );
  }

  Widget _row(BuildContext context, dynamic item) {
    final map = (item as Map).cast<String, dynamic>();
    final String titleText;
    final String sub;
    if (type == 'lead') {
      titleText = map['name'] ?? '—';
      sub = '${map['company'] ?? '—'} • ${map['email'] ?? '—'}';
    } else if (type == 'client') {
      titleText = map['name'] ?? '—';
      sub = '${map['company'] ?? '—'} • ${map['email'] ?? '—'}';
    } else {
      titleText = map['invoice_number'] ?? '—';
      final client = map['client'];
      sub =
          '${(client is Map ? client['name'] : '—')} • ${Fmt.moneyWithCurrency((map['total'] as num?)?.toDouble(), map['currency'] as String?)}';
    }
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.borderSoft)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titleText,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 13,
                    fontFamily: 'Inter',
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  sub,
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 11,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
          ),
          Text(
            Fmt.timeAgo(map['created_at'] as String?),
            style: const TextStyle(
              color: AppColors.textFaint,
              fontSize: 11,
              fontFamily: 'Inter',
            ),
          ),
        ],
      ),
    );
  }
}
