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
            icon: const Icon(Icons.refresh, size: 18, color: AppColors.textMuted),
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
    final totalOutstanding = (stats['totalOutstanding'] as num?)?.toDouble() ?? 0;
    final totalRevenue = (stats['totalRevenue'] as num?)?.toDouble() ?? 0;
    final overdueCount = (stats['overdueCount'] as num?)?.toInt() ?? 0;

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
            style: TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Inter'),
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
                  subColor: leadsMom == null ? null : (leadsMom >= 0 ? AppColors.emerald : AppColors.red),
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
                  subColor: revenueMom == null ? null : (revenueMom >= 0 ? AppColors.emerald : AppColors.red),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: KpiCard(
                  label: 'Outstanding',
                  value: Fmt.money(totalOutstanding),
                  sub: '$overdueCount overdue',
                  subColor: overdueCount > 0 ? AppColors.red : AppColors.textMuted,
                ),
              ),
            ],
          ),
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

class _RecentSection extends StatelessWidget {
  const _RecentSection({required this.title, required this.items, required this.type});

  final String title;
  final List<dynamic> items;
  final String type;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: title,
      child: items.isEmpty
          ? const EmptyState(message: 'Nothing yet')
          : Column(
              children: [
                for (final item in items) _row(context, item),
              ],
            ),
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
      sub = '${(client is Map ? client['name'] : '—')} • ${Fmt.moneyWithCurrency((map['total'] as num?)?.toDouble(), map['currency'] as String?)}';
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
                  style: const TextStyle(color: AppColors.text, fontSize: 13, fontFamily: 'Inter'),
                ),
                const SizedBox(height: 3),
                Text(
                  sub,
                  style: const TextStyle(color: AppColors.textFaint, fontSize: 11, fontFamily: 'Inter'),
                ),
              ],
            ),
          ),
          Text(
            Fmt.timeAgo(map['created_at'] as String?),
            style: const TextStyle(color: AppColors.textFaint, fontSize: 11, fontFamily: 'Inter'),
          ),
        ],
      ),
    );
  }
}