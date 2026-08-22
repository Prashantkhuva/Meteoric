import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/config.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/bulk_actions_bar.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/csv_export.dart';
import '../../shared/widgets/filter_bar.dart';
import '../../shared/widgets/share_sheet.dart';
import 'invoice_detail_screen.dart';
import 'invoice_form_screen.dart';

class InvoicesScreen extends StatefulWidget {
  const InvoicesScreen({super.key});

  @override
  State<InvoicesScreen> createState() => _InvoicesScreenState();
}

class _InvoicesScreenState extends State<InvoicesScreen> {
  static const _pageSize = 15;

  static const _statusOptions = [
    MapEntry('draft', 'Draft'),
    MapEntry('sent', 'Sent'),
    MapEntry('paid', 'Paid'),
    MapEntry('overdue', 'Overdue'),
    MapEntry('cancelled', 'Cancelled'),
  ];

  final _search = TextEditingController();
  Timer? _debounce;

  List<Map<String, dynamic>> _invoices = [];
  int _total = 0;
  int _page = 1;
  String _status = 'all';
  String _sort = 'newest';
  bool _loading = true;
  String? _error;

  final Set<int> _selected = {};
  bool _busy = false;

  bool get _selecting => _selected.isNotEmpty;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _search.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await ApiClient.instance.invoicesList({
        'page': _page,
        'pageSize': _pageSize,
        'search': _search.text.trim(),
        'status': _status,
        'sort': _sort,
      });
      if (mounted) {
        setState(() {
          _invoices = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _total = (res['total'] as num?)?.toInt() ?? 0;
          _selected.clear();
          _loading = false;
        });
      }
    } catch (err) {
      if (mounted) {
        setState(() {
          _error = err.toString();
          _loading = false;
        });
      }
    }
  }

  void _onSearchChanged(String _) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _page = 1;
      _load();
    });
  }

  void _clearSearch() {
    _search.clear();
    _page = 1;
    _load();
  }

  int _id(Map<String, dynamic> row) => (row['id'] as num).toInt();

  Future<void> _runBulk(
    Future<Map<String, dynamic>> Function(int id) action,
  ) async {
    setState(() => _busy = true);
    var failed = 0;
    for (final id in _selected.toList()) {
      try {
        final res = await action(id);
        if (res.containsKey('error')) failed++;
      } catch (_) {
        failed++;
      }
    }
    if (!mounted) return;
    setState(() {
      _busy = false;
      _selected.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(failed == 0 ? 'Done' : 'Completed with $failed failures'),
        backgroundColor: failed == 0
            ? AppColors.cardRaised
            : AppColors.red.withValues(alpha: 0.9),
      ),
    );
    _load();
  }

  Future<void> _bulkDelete() async {
    final ok = await confirmBulkDelete(
      context,
      count: _selected.length,
      label: 'invoices',
    );
    if (!ok) return;
    await _runBulk((id) => ApiClient.instance.invoiceDelete(id));
  }

  double totalOf(Map<String, dynamic> invoice) {
    final items = invoice['items'];
    final tax = (invoice['tax'] as num?)?.toDouble() ?? 0;
    if (items is! List) return 0;
    final subtotal = items.fold<double>(0, (sum, item) {
      final qty =
          (item is Map ? (item['quantity'] as num?) : null)?.toDouble() ?? 1;
      final rate =
          (item is Map ? (item['rate'] as num?) : null)?.toDouble() ?? 0;
      return sum + qty * rate;
    });
    return subtotal + tax;
  }

  Future<void> _exportCsv() async {
    try {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Exporting...')));
      final all = <Map<String, dynamic>>[];
      for (var p = 1; p <= 100; p++) {
        final res = await ApiClient.instance.invoicesList({
          'page': p,
          'pageSize': 200,
          'search': _search.text.trim(),
          'status': _status,
          'sort': _sort,
        });
        all.addAll(
          ((res['data'] as List?) ?? const []).map(
            (e) => (e as Map).cast<String, dynamic>(),
          ),
        );
        if (all.length >= ((res['total'] as num?)?.toInt() ?? 0)) break;
      }
      await CsvExport.share(
        filename: CsvExport.datedName('invoices'),
        rows: [
          ['Number', 'Client', 'Total', 'Currency', 'Status', 'Due', 'Created'],
          ...all.map(
            (inv) => [
              '${inv['invoice_number'] ?? ''}',
              inv['client'] is Map ? '${inv['client']['name'] ?? ''}' : '',
              totalOf(inv).toStringAsFixed(2),
              '${inv['currency'] ?? ''}',
              '${inv['status'] ?? ''}',
              csvDate(inv['due_date']),
              csvDate(inv['created_at']),
            ],
          ),
        ],
      );
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(err.toString())));
      }
    }
  }

  Future<void> _shareCard(Map<String, dynamic> invoice) async {
    try {
      final res = await ApiClient.instance.invoiceShareToken(_id(invoice));
      if (!mounted) return;
      if (res.containsKey('error')) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${res['error']}'),
            backgroundColor: AppColors.red.withValues(alpha: 0.9),
          ),
        );
        return;
      }
      await showShareSheet(
        context,
        title: invoice['invoice_number'] ?? 'Invoice',
        url: '${AppConfig.siteUrl}/share/invoice/${res['token']}',
      );
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(err.toString())));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _selecting
            ? Text('${_selected.length} selected')
            : const Text('Invoices'),
        automaticallyImplyLeading: false,
        leading: _selecting
            ? IconButton(
                icon: const Icon(
                  Icons.close,
                  size: 20,
                  color: AppColors.textMuted,
                ),
                onPressed: () => setState(() => _selected.clear()),
              )
            : null,
        actions: _selecting
            ? [
                IconButton(
                  icon: Icon(
                    _selected.length == _invoices.length
                        ? Icons.check_box_outlined
                        : Icons.check_box_outline_blank,
                    size: 19,
                    color: AppColors.accent,
                  ),
                  onPressed: () => setState(() {
                    if (_selected.length == _invoices.length) {
                      _selected.clear();
                    } else {
                      _selected
                        ..clear()
                        ..addAll(_invoices.map(_id));
                    }
                  }),
                  tooltip: 'Select all',
                ),
              ]
            : [
                IconButton(
                  icon: const Icon(
                    Icons.download_outlined,
                    size: 19,
                    color: AppColors.textMuted,
                  ),
                  onPressed: _exportCsv,
                  tooltip: 'Export CSV',
                ),
                IconButton(
                  icon: const Icon(
                    Icons.add,
                    size: 20,
                    color: AppColors.accent,
                  ),
                  onPressed: () => _openForm(),
                  tooltip: 'New invoice',
                ),
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
            child: TextField(
              controller: _search,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Search invoices...',
                prefixIcon: const Icon(
                  Icons.search,
                  size: 18,
                  color: AppColors.textFaint,
                ),
                suffixIcon: _search.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(
                          Icons.close,
                          size: 16,
                          color: AppColors.textMuted,
                        ),
                        onPressed: _clearSearch,
                      )
                    : null,
              ),
            ),
          ),
          FilterBar(
            groups: [
              FilterGroup(
                key: 'status',
                label: 'Status',
                options: _statusOptions,
              ),
              FilterGroup(
                key: 'sort',
                label: 'Sort',
                options: const [
                  MapEntry('newest', 'Newest'),
                  MapEntry('oldest', 'Oldest'),
                  MapEntry('number', 'Number'),
                  MapEntry('amount', 'Amount high–low'),
                  MapEntry('deadline', 'Due date'),
                ],
              ),
            ],
            values: {'status': _status, 'sort': _sort},
            onChanged: (v) {
              setState(() {
                _status = v['status'] ?? 'all';
                _sort = v['sort'] ?? 'newest';
              });
              _page = 1;
              _load();
            },
          ),
          const SizedBox(height: 4),
          Expanded(child: _buildList()),
        ],
      ),
      bottomNavigationBar: _selecting
          ? BulkActionBar(
              count: _selected.length,
              busy: _busy,
              onClear: () => setState(() => _selected.clear()),
              onDelete: _bulkDelete,
              statusOptions: _statusOptions,
              onStatus: (s) =>
                  _runBulk((id) => ApiClient.instance.invoiceStatus(id, s)),
            )
          : (_total > _pageSize
                ? PaginationBar(
                    page: _page,
                    total: _total,
                    pageSize: _pageSize,
                    onPageChanged: (p) {
                      setState(() => _page = p);
                      _load();
                    },
                  )
                : null),
      floatingActionButton: _selecting
          ? null
          : FloatingActionButton(
              onPressed: () => _openForm(),
              backgroundColor: AppColors.accent,
              foregroundColor: const Color(0xFF121212),
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              child: const Icon(Icons.add),
            ),
    );
  }

  Widget _buildList() {
    if (_loading) return const LoadingView();
    if (_error != null) return ErrorBox(message: _error!, onRetry: _load);
    if (_invoices.isEmpty) {
      return const EmptyState(
        message: 'No invoices found.',
        icon: Icons.receipt_long_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        itemCount: _invoices.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) {
          final invoice = _invoices[i];
          final id = _id(invoice);
          final isSelected = _selected.contains(id);
          return _InvoiceCard(
            invoice: invoice,
            selected: isSelected,
            selecting: _selecting,
            onTap: () {
              if (_selecting) {
                setState(
                  () => isSelected ? _selected.remove(id) : _selected.add(id),
                );
              } else {
                _openDetail(invoice);
              }
            },
            onLongPress: () => setState(() => _selected.add(id)),
            onShare: _selecting ? null : () => _shareCard(invoice),
          );
        },
      ),
    );
  }

  Future<void> _openDetail(Map<String, dynamic> invoice) async {
    await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => InvoiceDetailScreen(invoice: invoice)),
    );
    _load();
  }

  Future<void> _openForm({Map<String, dynamic>? invoice}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => InvoiceFormScreen(invoice: invoice)),
    );
    if (changed == true) _load();
  }
}

class _InvoiceCard extends StatelessWidget {
  const _InvoiceCard({
    required this.invoice,
    required this.onTap,
    required this.onLongPress,
    required this.onShare,
    this.selected = false,
    this.selecting = false,
  });

  final Map<String, dynamic> invoice;
  final VoidCallback onTap;
  final VoidCallback onLongPress;
  final VoidCallback? onShare;
  final bool selected;
  final bool selecting;

  double get _total {
    final items = invoice['items'];
    final tax = (invoice['tax'] as num?)?.toDouble() ?? 0;
    if (items is! List) return 0;
    final subtotal = items.fold<double>(0, (sum, item) {
      final qty =
          (item is Map ? (item['quantity'] as num?) : null)?.toDouble() ?? 1;
      final rate =
          (item is Map ? (item['rate'] as num?) : null)?.toDouble() ?? 0;
      return sum + qty * rate;
    });
    return subtotal + tax;
  }

  @override
  Widget build(BuildContext context) {
    final client = invoice['client'];
    final clientName = client is Map ? (client['name'] ?? '—') : '—';

    return Material(
      color: selected ? AppColors.cardRaised : AppColors.card,
      child: InkWell(
        onTap: onTap,
        onLongPress: onLongPress,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            border: Border.all(
              color: selected
                  ? AppColors.accent.withValues(alpha: 0.5)
                  : AppColors.border,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            invoice['invoice_number'] ??
                                'Invoice #${invoice['id']}',
                            style: const TextStyle(
                              color: AppColors.text,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              fontFamily: 'Inter',
                            ),
                          ),
                        ),
                        StatusBadge(
                          meta: Status.get(Status.invoices, invoice['status']),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(
                          Icons.person_outline,
                          size: 13,
                          color: AppColors.textFaint,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            clientName,
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 12,
                              fontFamily: 'Inter',
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Text(
                          Fmt.money(
                            _total,
                            currency: invoice['currency'] as String?,
                          ),
                          style: const TextStyle(
                            color: AppColors.accent,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'Inter',
                          ),
                        ),
                        const Spacer(),
                        if (onShare != null)
                          GestureDetector(
                            onTap: onShare,
                            child: const Icon(
                              Icons.share_outlined,
                              size: 15,
                              color: AppColors.textFaint,
                            ),
                          ),
                        if (onShare != null) const SizedBox(width: 10),
                        Text(
                          Fmt.timeAgo(invoice['created_at'] as String?),
                          style: const TextStyle(
                            color: AppColors.textFaint,
                            fontSize: 10,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (selecting) ...[
                const SizedBox(width: 10),
                Icon(
                  selected ? Icons.check_box : Icons.check_box_outline_blank,
                  size: 20,
                  color: selected ? AppColors.accent : AppColors.textFaint,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
