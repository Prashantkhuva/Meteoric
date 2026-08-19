import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import 'invoice_detail_screen.dart';
import 'invoice_form_screen.dart';

class InvoicesScreen extends StatefulWidget {
  const InvoicesScreen({super.key});

  @override
  State<InvoicesScreen> createState() => _InvoicesScreenState();
}

class _InvoicesScreenState extends State<InvoicesScreen> {
  static const _pageSize = 15;

  final _search = TextEditingController();
  Timer? _debounce;

  List<Map<String, dynamic>> _invoices = [];
  int _total = 0;
  int _page = 1;
  String _status = 'all';
  bool _loading = true;
  String? _error;

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
        'sort': 'newest',
      });
      if (mounted) {
        setState(() {
          _invoices = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _total = (res['total'] as num?)?.toInt() ?? 0;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Invoices'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, size: 20, color: AppColors.accent),
            onPressed: () => _openForm(),
            tooltip: 'New invoice',
          ),
          IconButton(
            icon: const Icon(Icons.refresh, size: 18, color: AppColors.textMuted),
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
                prefixIcon: const Icon(Icons.search, size: 18, color: AppColors.textFaint),
                suffixIcon: _search.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.close, size: 16, color: AppColors.textMuted),
                        onPressed: _clearSearch,
                      )
                    : null,
              ),
            ),
          ),
          FilterChips(
            options: const [
              MapEntry('all', 'ALL'),
              MapEntry('draft', 'Draft'),
              MapEntry('sent', 'Sent'),
              MapEntry('paid', 'Paid'),
              MapEntry('overdue', 'Overdue'),
              MapEntry('cancelled', 'Cancelled'),
            ],
            selected: _status,
            onSelected: (v) {
              setState(() => _status = v);
              _page = 1;
              _load();
            },
          ),
          const SizedBox(height: 4),
          Expanded(child: _buildList()),
        ],
      ),
      bottomNavigationBar: _total > _pageSize
          ? PaginationBar(
              page: _page,
              total: _total,
              pageSize: _pageSize,
              onPageChanged: (p) {
                setState(() => _page = p);
                _load();
              },
            )
          : null,
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openForm(),
        backgroundColor: AppColors.accent,
        foregroundColor: const Color(0xFF121212),
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
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
        itemBuilder: (context, i) => _InvoiceCard(
          invoice: _invoices[i],
          onTap: () => _openDetail(_invoices[i]),
        ),
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
  const _InvoiceCard({required this.invoice, required this.onTap});

  final Map<String, dynamic> invoice;
  final VoidCallback onTap;

  double get _total {
    final items = invoice['items'];
    final tax = (invoice['tax'] as num?)?.toDouble() ?? 0;
    if (items is! List) return 0;
    final subtotal = items.fold<double>(0, (sum, item) {
      final qty = (item is Map ? (item['quantity'] as num?) : null)?.toDouble() ?? 1;
      final rate = (item is Map ? (item['rate'] as num?) : null)?.toDouble() ?? 0;
      return sum + qty * rate;
    });
    return subtotal + tax;
  }

  @override
  Widget build(BuildContext context) {
    final client = invoice['client'];
    final clientName = client is Map ? (client['name'] ?? '—') : '—';

    return Material(
      color: AppColors.card,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(border: Border.all(color: AppColors.border)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      invoice['number'] ?? 'Invoice #${invoice['id']}',
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  StatusBadge(meta: Status.get(Status.invoices, invoice['status'])),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.person_outline, size: 13, color: AppColors.textFaint),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      clientName,
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Inter'),
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
                    Fmt.money(_total),
                    style: const TextStyle(
                      color: AppColors.accent,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const Spacer(),
                  Text(
                    Fmt.timeAgo(invoice['created_at'] as String?),
                    style: const TextStyle(color: AppColors.textFaint, fontSize: 10, fontFamily: 'Inter'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}