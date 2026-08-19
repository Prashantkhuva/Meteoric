import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/config.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import 'invoice_form_screen.dart';

class InvoiceDetailScreen extends StatefulWidget {
  const InvoiceDetailScreen({super.key, required this.invoice});

  final Map<String, dynamic> invoice;

  @override
  State<InvoiceDetailScreen> createState() => _InvoiceDetailScreenState();
}

class _InvoiceDetailScreenState extends State<InvoiceDetailScreen> {
  late Map<String, dynamic> _invoice;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _invoice = widget.invoice;
  }

  Map<String, dynamic>? get _client {
    final client = _invoice['client'];
    return client is Map ? client.cast<String, dynamic>() : null;
  }

  double get _subtotal {
    final items = _invoice['items'];
    if (items is! List) return 0;
    return items.fold<double>(0, (sum, item) {
      final qty = (item is Map ? (item['quantity'] as num?) : null)?.toDouble() ?? 1;
      final rate = (item is Map ? (item['rate'] as num?) : null)?.toDouble() ?? 0;
      return sum + qty * rate;
    });
  }

  double get _total => _subtotal + ((_invoice['tax'] as num?)?.toDouble() ?? 0);

  Future<void> _send() async {
    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.invoiceSend((_invoice['id'] as num).toInt());
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        setState(() => _invoice = {..._invoice, 'status': 'sent'});
        _snack('Invoice sent by email');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _markPaid() async {
    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance
          .invoiceMarkPaid((_invoice['id'] as num).toInt(), DateTime.now().toIso8601String());
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        setState(() => _invoice = {..._invoice, 'status': 'paid'});
        _snack('Invoice marked as paid');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _cancel() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Cancel invoice'),
        content: const Text('Cancel this invoice? This cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('No')),
          AccentButton(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            backgroundColor: AppColors.red,
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('CANCEL'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.invoiceCancel((_invoice['id'] as num).toInt());
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        setState(() => _invoice = {..._invoice, 'status': 'cancelled'});
        _snack('Invoice cancelled');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _share() async {
    try {
      final res = await ApiClient.instance
          .invoiceShareToken((_invoice['id'] as num).toInt());
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
        return;
      }
      final token = res['token'];
      final url = '${AppConfig.siteUrl}/share/invoice/$token';
      await showDialog<void>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Share invoice'),
          content: SelectableText(
            url,
            style: const TextStyle(color: AppColors.textMuted, fontSize: 13, fontFamily: 'Inter'),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
          ],
        ),
      );
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    }
  }

  Future<void> _delete() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete invoice'),
        content: const Text('Delete this invoice? This cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          AccentButton(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            backgroundColor: AppColors.red,
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('DELETE'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.invoiceDelete((_invoice['id'] as num).toInt());
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        Navigator.of(context).pop(true);
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _snack(String msg, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isError ? AppColors.red.withValues(alpha: 0.9) : AppColors.cardRaised,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final client = _client;
    final status = _invoice['status'];

    return AppScaffold(
      title: _invoice['number'] ?? 'Invoice #${_invoice['id']}',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              StatusBadge(meta: Status.get(Status.invoices, status)),
              const Spacer(),
              Text(
                Fmt.date(_invoice['created_at'] as String?),
                style: const TextStyle(color: AppColors.textFaint, fontSize: 10, fontFamily: 'Inter'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (client != null)
            SectionCard(
              title: 'Client',
              child: Column(
                children: [
                  DetailRow(label: 'Name', value: client['name'] ?? '—'),
                  DetailRow(label: 'Email', value: client['email'] ?? '—'),
                  DetailRow(label: 'Phone', value: client['phone'] ?? '—'),
                ],
              ),
            ),
          const SizedBox(height: 16),
          SectionCard(
            title: 'Items',
            child: Column(
              children: [
                for (final item in (_invoice['items'] as List?)?.cast<Map>() ?? const <Map>[])
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            '${item['description'] ?? '—'} × ${item['quantity'] ?? 1}',
                            style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Inter'),
                          ),
                        ),
                        Text(
                          Fmt.money(((item['rate'] as num?)?.toDouble() ?? 0) *
                              ((item['quantity'] as num?)?.toDouble() ?? 1)),
                          style: const TextStyle(
                            color: AppColors.text,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                  ),
                const Divider(color: AppColors.border),
                DetailRow(label: 'Subtotal', value: Fmt.money(_subtotal)),
                if (((_invoice['tax'] as num?) ?? 0) > 0)
                  DetailRow(label: 'Tax', value: Fmt.money((_invoice['tax'] as num?)?.toDouble() ?? 0)),
                DetailRow(
                  label: 'Total',
                  value: Fmt.money(_total),
                  strong: true,
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SectionCard(
            title: 'Details',
            child: Column(
              children: [
                DetailRow(label: 'Currency', value: _invoice['currency'] ?? 'USD'),
                DetailRow(label: 'Due date', value: _invoice['due_date'] ?? '—'),
                DetailRow(label: 'Notes', value: _invoice['notes'] ?? '—'),
                DetailRow(label: 'Terms', value: _invoice['terms'] ?? '—'),
              ],
            ),
          ),
          const SizedBox(height: 20),
          if (status == 'draft')
            AccentButton(
              onPressed: _busy ? null : _send,
              child: const Text('SEND TO CLIENT'),
            ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              Expanded(
                child: GhostButton(
                  onPressed: _busy
                      ? null
                      : () async {
                          final changed = await Navigator.of(context).push<bool>(
                            MaterialPageRoute(
                              builder: (_) => InvoiceFormScreen(invoice: _invoice),
                            ),
                          );
                          if (changed == true && mounted) setState(() {});
                        },
                  child: const Text('EDIT'),
                ),
              ),
              Expanded(
                child: GhostButton(onPressed: _busy ? null : _share, child: const Text('SHARE')),
              ),
            ],
          ),
          const SizedBox(height: 10),
          if (status == 'sent' || status == 'overdue')
            GhostButton(
              onPressed: _busy ? null : _markPaid,
              child: const Text('MARK PAID'),
            ),
          if (status == 'draft' || status == 'sent' || status == 'overdue') ...[
            const SizedBox(height: 10),
            GhostButton(
              borderColor: AppColors.red.withValues(alpha: 0.4),
              textColor: AppColors.red,
              onPressed: _busy ? null : _cancel,
              child: const Text('CANCEL INVOICE'),
            ),
          ],
          const SizedBox(height: 10),
          GhostButton(
            borderColor: AppColors.red.withValues(alpha: 0.4),
            textColor: AppColors.red,
            onPressed: _busy ? null : _delete,
            child: const Text('DELETE'),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}