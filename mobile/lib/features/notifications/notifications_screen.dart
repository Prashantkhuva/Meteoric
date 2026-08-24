import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../features/bookings/bookings_screen.dart';
import '../../features/invoices/invoice_detail_screen.dart';
import '../../features/home/home_tab.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/error_views.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;
  Object? _error;
  bool _markingAll = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load({bool silent = false}) async {
    if (!silent) {
      setState(() {
        _loading = true;
        _error = null;
      });
    }
    try {
      final res = await ApiClient.instance.notificationsList();
      if (mounted) {
        setState(() {
          _items = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _loading = false;
        });
      }
    } catch (err) {
      if (mounted) {
        setState(() {
          _error = err;
          _loading = false;
        });
      }
    }
  }

  Future<void> _markAllRead() async {
    if (_markingAll) return;
    setState(() => _markingAll = true);
    try {
      await ApiClient.instance.notificationsMarkAllRead();
      await _load(silent: true);
    } finally {
      if (mounted) setState(() => _markingAll = false);
    }
  }

  void _open(Map<String, dynamic> item) {
    final id = item['id'] is num ? (item['id'] as num).toInt() : null;
    final entityId = item['entity_id'] is num
        ? (item['entity_id'] as num).toInt()
        : null;
    final type = '${item['type'] ?? ''}';

    if (id != null && item['is_read'] == false) {
      ApiClient.instance
          .notificationsMarkRead([id])
          .catchError((_) => <String, dynamic>{});
      setState(() => item['is_read'] = true);
    }

    switch (type) {
      case 'new_lead':
        homeTab.value = 1;
        Navigator.of(context).popUntil((r) => r.isFirst);
      case 'new_booking':
        Navigator.of(context)
            .push(MaterialPageRoute(builder: (_) => const BookingsScreen()));
      case 'payment_received' || 'invoice_overdue':
        _openInvoice(entityId);
    }
  }

  Future<void> _openInvoice(int? invoiceId) async {
    if (invoiceId == null) return;
    try {
      final res = await ApiClient.instance.invoiceGet(invoiceId);
      final invoice = res['data'];
      if (invoice is Map && mounted) {
        await Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) =>
                InvoiceDetailScreen(invoice: invoice.cast<String, dynamic>()),
          ),
        );
      }
    } catch (_) {}
  }

  // ── Grouping ─────────────────────────────────────────────────────────────

  static String _groupOf(String? iso) {
    final d = DateTime.tryParse(iso ?? '')?.toLocal();
    if (d == null) return 'EARLIER';
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final day = DateTime(d.year, d.month, d.day);
    final diff = today.difference(day).inDays;
    if (diff <= 0) return 'TODAY';
    if (diff == 1) return 'YESTERDAY';
    return 'EARLIER';
  }

  Map<String, List<Map<String, dynamic>>> get _grouped {
    final map = <String, List<Map<String, dynamic>>>{};
    for (final item in _items) {
      map.putIfAbsent(_groupOf('${item['created_at']}'), () => []).add(item);
    }
    return map;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(
              Icons.done_all,
              size: 18,
              color: AppColors.textMuted,
            ),
            onPressed: _markAllRead,
            tooltip: 'Mark all read',
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
          : RefreshIndicator(
              onRefresh: () => _load(silent: true),
              color: AppColors.accent,
              backgroundColor: AppColors.card,
              child: _buildList(),
            ),
    );
  }

  Widget _buildList() {
    if (_items.isEmpty) {
      return ListView(
        children: const [
          SizedBox(height: 120),
          EmptyState(
            message: 'No notifications yet.',
            icon: Icons.notifications_none,
          ),
        ],
      );
    }

    final groups = _grouped;
    final order = ['TODAY', 'YESTERDAY', 'EARLIER'];
    final rows = <Widget>[];
    for (final g in order) {
      final items = groups[g];
      if (items == null || items.isEmpty) continue;
      rows.add(_Eyebrow(g));
      for (final item in items) {
        rows.add(_NotificationRow(item: item, onTap: () => _open(item)));
      }
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      children: rows,
    );
  }
}

// ── Pieces ────────────────────────────────────────────────────────────────

class _Eyebrow extends StatelessWidget {
  const _Eyebrow(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 14, bottom: 6),
      child: Text(
        text,
        style: const TextStyle(
          color: AppColors.textFaint,
          fontSize: 9.5,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.2,
          fontFamily: 'Inter',
        ),
      ),
    );
  }
}

class _NotificationRow extends StatelessWidget {
  const _NotificationRow({required this.item, required this.onTap});

  final Map<String, dynamic> item;
  final VoidCallback onTap;

  IconData get _icon {
    switch ('${item['type']}') {
      case 'new_lead':
        return Icons.person_add_alt_outlined;
      case 'new_booking':
        return Icons.event_outlined;
      case 'payment_received':
        return Icons.payments_outlined;
      default:
        return Icons.schedule_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final unread = item['is_read'] == false;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border(bottom: BorderSide(color: AppColors.border)),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 34,
                height: 34,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppColors.cardRaised,
                  border: Border.all(color: AppColors.borderSoft),
                ),
                child: Icon(_icon, size: 16, color: AppColors.textMuted),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        if (unread) ...[
                          Container(
                            width: 5,
                            height: 5,
                            margin: const EdgeInsets.only(right: 6),
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.accent,
                            ),
                          ),
                        ],
                        Expanded(
                          child: Text(
                            '${item['title'] ?? '—'}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: unread
                                  ? AppColors.text
                                  : AppColors.textMuted,
                              fontSize: 13.5,
                              fontWeight: unread
                                  ? FontWeight.w600
                                  : FontWeight.w500,
                              fontFamily: 'Inter',
                            ),
                          ),
                        ),
                      ],
                    ),
                    if ('${item['body'] ?? ''}'.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: Text(
                          '${item['body']}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 12,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              Text(
                Fmt.timeAgo('${item['created_at']}'),
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 10.5,
                  fontFeatures: [FontFeature.tabularFigures()],
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
