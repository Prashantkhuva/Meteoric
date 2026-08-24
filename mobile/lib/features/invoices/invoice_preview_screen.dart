import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/formatters.dart';
import '../../core/native.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/pdf_export.dart';

/// Full-page invoice preview mirroring the web `/preview/invoice/[id]` page —
/// dark premium document with brand header, parties, items table, totals,
/// bank transfer details and notes/terms, plus one-tap PDF export.
class InvoicePreviewScreen extends StatelessWidget {
  const InvoicePreviewScreen({super.key, required this.invoice});

  final Map<String, dynamic> invoice;

  @override
  Widget build(BuildContext context) {
    final status = '${invoice['status'] ?? 'draft'}';
    final items = ((invoice['items'] as List?) ?? const [])
        .whereType<Map>()
        .map((e) => e.cast<String, dynamic>())
        .toList();
    final subtotal = items.fold<double>(
      0,
      (s, i) =>
          s +
          (((num.tryParse('${i['quantity']}') ?? i['quantity'] as num?) ?? 0)
                  .toDouble()) *
              (((num.tryParse('${i['rate']}') ?? i['rate'] as num?) ?? 0)
                  .toDouble()),
    );
    final tax =
        (invoice['tax'] as num? ?? num.tryParse('${invoice['tax']}') ?? 0)
            .toDouble();
    final total =
        (invoice['total'] as num? ??
                num.tryParse('${invoice['total']}') ??
                subtotal + tax)
            .toDouble();
    final symbol = PdfExport.currencySymbol(invoice['currency'] as String?);
    final client = invoice['client'] is Map
        ? (invoice['client'] as Map).cast<String, dynamic>()
        : null;
    final bank = invoice['bank_account'] is Map
        ? (invoice['bank_account'] as Map).cast<String, dynamic>()
        : null;

    String money(num v) => '$symbol${v.toStringAsFixed(2)}';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: Text('Invoice ${invoice['invoice_number'] ?? ''}')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.card,
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header ────────────────────────────────────────────────
              Container(
                padding: const EdgeInsets.only(bottom: 20),
                decoration: const BoxDecoration(
                  border: Border(bottom: BorderSide(color: AppColors.border)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const _Brand(),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [StatusDot(status: status)],
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      '${invoice['invoice_number'] ?? '-'}',
                      style: const TextStyle(
                        color: Color(0xF2FFFFFF),
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        fontFamily: 'Inter',
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (invoice['created_at'] != null)
                      _dateLine(
                        'Issued:',
                        Fmt.date(invoice['created_at'] as String?),
                      ),
                    if (invoice['due_date'] != null)
                      _dateLine(
                        'Due:',
                        Fmt.date(invoice['due_date'] as String?),
                      ),
                    if (invoice['paid_at'] != null)
                      _dateLine(
                        'Paid:',
                        Fmt.date(invoice['paid_at'] as String?),
                        highlight: true,
                      ),
                  ],
                ),
              ),
              // ── Parties ────────────────────────────────────────────────
              const SizedBox(height: 20),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const _SectionLabel('From'),
                        const SizedBox(height: 6),
                        const Text(
                          'Meteoric',
                          style: TextStyle(
                            color: AppColors.text,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'Inter',
                          ),
                        ),
                        const Text(
                          'contact@withmeteoric.com',
                          style: TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 11,
                            height: 1.5,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 24),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const _SectionLabel('To'),
                        const SizedBox(height: 6),
                        Text(
                          '${client?['name'] ?? '-'}',
                          style: const TextStyle(
                            color: AppColors.text,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            fontFamily: 'Inter',
                          ),
                        ),
                        if (client?['company'] != null &&
                            '${client?['company']}'.isNotEmpty)
                          Text(
                            '${client!['company']}',
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 11,
                              height: 1.5,
                              fontFamily: 'Inter',
                            ),
                          ),
                        if (client?['email'] != null &&
                            '${client?['email']}'.isNotEmpty)
                          Text(
                            '${client!['email']}',
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 11,
                              height: 1.5,
                              fontFamily: 'Inter',
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
              // ── Items table ────────────────────────────────────────────
              if (items.isNotEmpty) ...[
                const SizedBox(height: 24),
                Table(
                  columnWidths: const {
                    0: FlexColumnWidth(),
                    1: FixedColumnWidth(40),
                    2: FixedColumnWidth(62),
                    3: FixedColumnWidth(74),
                  },
                  border: TableBorder(
                    horizontalInside: BorderSide(color: AppColors.borderSoft),
                  ),
                  children: [
                    TableRow(
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(color: AppColors.borderSoft),
                        ),
                      ),
                      children: [
                        _th('Description'),
                        _th('Qty', right: true),
                        _th('Rate', right: true),
                        _th('Amount', right: true),
                      ],
                    ),
                    for (final item in items)
                      TableRow(
                        children: [
                          _td(item['description'], emphasize: true),
                          _td(item['quantity'], right: true),
                          _td(
                            money(
                              ((num.tryParse('${item['rate']}') ??
                                          item['rate'] as num?) ??
                                      0)
                                  .toDouble(),
                            ),
                            right: true,
                          ),
                          _td(
                            money(
                              (((num.tryParse('${item['quantity']}') ??
                                              item['quantity'] as num?) ??
                                          0)
                                      .toDouble()) *
                                  (((num.tryParse('${item['rate']}') ??
                                              item['rate'] as num?) ??
                                          0)
                                      .toDouble()),
                            ),
                            right: true,
                          ),
                        ],
                      ),
                  ],
                ),
              ],
              // ── Totals ────────────────────────────────────────────────
              const SizedBox(height: 18),
              Align(
                alignment: Alignment.centerRight,
                child: SizedBox(
                  width: 200,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _totalRow('Subtotal', money(subtotal)),
                      if (tax > 0) _totalRow('Tax', money(tax)),
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        padding: const EdgeInsets.only(top: 8),
                        decoration: BoxDecoration(
                          border: Border(
                            top: BorderSide(
                              color: Colors.white.withValues(alpha: 0.15),
                            ),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Total',
                              style: TextStyle(
                                color: Color(0xF2FFFFFF),
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                fontFamily: 'Inter',
                              ),
                            ),
                            Text(
                              money(total),
                              style: const TextStyle(
                                color: Color(0xF2FFFFFF),
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                fontFamily: 'Inter',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // ── Bank details ──────────────────────────────────────────
              if (status != 'paid' && bank != null) ...[
                const SizedBox(height: 20),
                _BankSection(bank: bank),
              ],
              // ── Notes / Terms ─────────────────────────────────────────
              if (invoice['notes'] != null || invoice['terms'] != null) ...[
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.only(top: 18),
                  decoration: const BoxDecoration(
                    border: Border(top: BorderSide(color: AppColors.border)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (invoice['notes'] != null &&
                          '${invoice['notes']}'.isNotEmpty) ...[
                        const _SectionLabel('Notes'),
                        const SizedBox(height: 4),
                        _preWrapText('${invoice['notes']}'),
                        const SizedBox(height: 10),
                      ],
                      if (invoice['terms'] != null &&
                          '${invoice['terms']}'.isNotEmpty) ...[
                        const _SectionLabel('Terms & Conditions'),
                        const SizedBox(height: 4),
                        _preWrapText('${invoice['terms']}'),
                      ],
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
          child: AccentButton(
            onPressed: () => _exportPdf(context),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.picture_as_pdf_outlined,
                  size: 16,
                  color: Color(0xFF121212),
                ),
                SizedBox(width: 8),
                Text('Export PDF'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _exportPdf(BuildContext context) async {
    Toast.info(context, 'Generating PDF...');
    try {
      final doc = PdfExport.invoice(invoice);
      final bytes = await doc.save();
      await Native.shareFileBytes(
        name:
            'meteoric-invoice-${invoice['invoice_number'] ?? invoice['id']}.pdf'
                .replaceAll(RegExp(r'[^\w.\-]'), '_'),
        mime: 'application/pdf',
        bytes: bytes,
      );
    } on PlatformException catch (err) {
      if (context.mounted) {
        Toast.error(context, err.message ?? 'Could not share PDF');
      }
    } catch (err) {
      if (context.mounted) {
        Toast.error(context, '$err');
      }
    }
  }

  Widget _dateLine(String label, String value, {bool highlight = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Text.rich(
        TextSpan(
          text: label,
          style: const TextStyle(
            color: AppColors.textFaint,
            fontSize: 11,
            fontFamily: 'Inter',
          ),
          children: [
            TextSpan(
              text: ' $value',
              style: TextStyle(
                color: highlight ? AppColors.emerald : AppColors.textFaint,
                fontSize: 11,
                fontWeight: highlight ? FontWeight.w600 : FontWeight.w400,
                fontFamily: 'Inter',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand();

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Colors.white, Color(0xFFA0A0A0)],
      ).createShader(bounds),
      child: const Text.rich(
        TextSpan(
          children: [
            TextSpan(
              text: 'meteor',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w500,
                fontFamily: 'Inter',
              ),
            ),
            TextSpan(
              text: 'ic',
              style: TextStyle(fontSize: 22, fontFamily: 'Inter'),
            ),
          ],
        ),
        style: TextStyle(color: Colors.white),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: const TextStyle(
        color: AppColors.textFaint,
        fontSize: 9,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.2,
        fontFamily: 'Inter',
      ),
    );
  }
}

/// Colored pill with dot — mirrors `.status-badge` in the web preview.
class StatusDot extends StatelessWidget {
  const StatusDot({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    final (color, label) = switch (status.toLowerCase()) {
      'paid' || 'accepted' => (AppColors.emerald, 'Paid'),
      'overdue' || 'rejected' => (
        AppColors.red,
        status == 'overdue' ? 'Overdue' : 'Rejected',
      ),
      'sent' => (const Color(0xFFE8E4FF), 'Sent'),
      'cancelled' => (AppColors.textMuted, 'Cancelled'),
      _ => (AppColors.textFaint, 'Draft'),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        border: Border.all(color: color.withValues(alpha: 0.3)),
        borderRadius: BorderRadius.circular(3),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 4,
            height: 4,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 5),
          Text(
            label.toUpperCase(),
            style: TextStyle(
              color: color,
              fontSize: 9,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
        ],
      ),
    );
  }
}

Widget _th(String text, {bool right = false}) => Padding(
  padding: const EdgeInsets.only(bottom: 10),
  child: Text(
    text.toUpperCase(),
    textAlign: right ? TextAlign.right : TextAlign.left,
    style: const TextStyle(
      color: AppColors.textFaint,
      fontSize: 9,
      fontWeight: FontWeight.w700,
      letterSpacing: 1.2,
      fontFamily: 'Inter',
    ),
  ),
);

Widget _td(Object? value, {bool right = false, bool emphasize = false}) =>
    Padding(
      padding: const EdgeInsets.symmetric(vertical: 9),
      child: Text(
        '$value',
        textAlign: right ? TextAlign.right : TextAlign.left,
        style: TextStyle(
          color: emphasize ? AppColors.text : AppColors.textMuted,
          fontSize: 11.5,
          fontFamily: 'Inter',
        ),
      ),
    );

Widget _totalRow(String label, String amount) => Padding(
  padding: const EdgeInsets.only(bottom: 5),
  child: Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Text(
        label,
        style: const TextStyle(
          color: AppColors.textMuted,
          fontSize: 11.5,
          fontFamily: 'Inter',
        ),
      ),
      Text(
        amount,
        style: const TextStyle(
          color: AppColors.textMuted,
          fontSize: 11.5,
          fontFamily: 'Inter',
        ),
      ),
    ],
  ),
);

Widget _preWrapText(String text) => Text(
  text,
  style: const TextStyle(
    color: AppColors.textMuted,
    fontSize: 11.5,
    height: 1.55,
    fontFamily: 'Inter',
  ),
);

class _BankSection extends StatelessWidget {
  const _BankSection({required this.bank});

  final Map<String, dynamic> bank;

  static const _fields = [
    ('bank_name', 'Bank'),
    ('account_holder', 'Name'),
    ('account_number', 'Account No'),
    ('iban', 'IBAN'),
    ('swift_bic', 'SWIFT/BIC'),
    ('routing_number', 'Routing'),
    ('ifsc', 'IFSC'),
    ('currency', 'Currency'),
    ('country', 'Country'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF111111),
        border: Border.all(color: const Color(0xFF222222)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'BANK TRANSFER DETAILS',
            style: TextStyle(
              color: AppColors.accent,
              fontSize: 9,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          for (final (key, label) in _fields)
            if (bank[key] != null && '${bank[key]}'.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 2),
                child: Text.rich(
                  TextSpan(
                    text: '$label  ',
                    style: const TextStyle(
                      color: Color(0xFFAAAAAA),
                      fontSize: 10.5,
                      fontFamily: 'Inter',
                    ),
                    children: [
                      TextSpan(
                        text: '${bank[key]}',
                        style: const TextStyle(
                          color: Color(0xFFE0E0E0),
                          fontSize: 10.5,
                          fontFamily: 'Inter',
                        ),
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
