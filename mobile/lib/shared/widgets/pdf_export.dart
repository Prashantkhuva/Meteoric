import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

/// Builds print-ready PDFs that mirror the web preview pages
/// (`app/preview/{invoice,proposal}/[id]/route.js`) — dark premium theme.
///
/// Uses only built-in Helvetica (WinAnsi); text is sanitized so exotic
/// glyphs never crash generation.
class PdfExport {
  PdfExport._();

  // ── Design tokens (mirror of web preview CSS) ───────────────────────────
  static const _bg = PdfColor.fromInt(0xFF070707);
  static const _card = PdfColor.fromInt(0xFF0A0A0A);
  static const _border = PdfColor.fromInt(0x14FFFFFF);
  static const _borderSoft = PdfColor.fromInt(0x0DFFFFFF);
  static const _text = PdfColor.fromInt(0xD9FFFFFF);
  static const _textMuted = PdfColor.fromInt(0x99FFFFFF);
  static const _textFaint = PdfColor.fromInt(0x40FFFFFF);
  static const _heading = PdfColor.fromInt(0xF2FFFFFF);

  static const Map<String, String> _currencySymbols = {
    'USD': '\$',
    'EUR': '€',
    'GBP': '£',
    'AUD': 'A\$',
  };

  static String currencySymbol(String? currency) {
    final code = (currency ?? '').trim().toUpperCase();
    return _currencySymbols[code] ?? '$code ';
  }

  /// Replaces characters outside WinAnsi so the default PDF fonts render.
  static String sanitize(Object? value) {
    final s = value?.toString() ?? '';
    return s
        .replaceAll('₹', 'Rs ')
        .replaceAll('•', '-')
        .replaceAll('–', '-')
        .replaceAll('—', '-')
        .replaceAll('\u2018', "'")
        .replaceAll('\u2019', "'")
        .replaceAll('\u201C', '"')
        .replaceAll('\u201D', '"')
        .replaceAll('…', '...')
        .replaceAllMapped(RegExp(r'[^\x00-\xFF]'), (_) => '');
  }

  static String _money(num value, String symbol) =>
      '$symbol${value.toStringAsFixed(2)}';

  // ── Shared building blocks ──────────────────────────────────────────────

  static pw.Widget _brand() => pw.Row(
    children: [
      pw.Text(
        'meteor',
        style: pw.TextStyle(
          fontSize: 24,
          fontWeight: pw.FontWeight.bold,
          color: _heading,
        ),
      ),
      pw.Text('ic', style: pw.TextStyle(fontSize: 24, color: _heading)),
    ],
  );

  static pw.Widget _label(String text) => pw.Text(
    sanitize(text).toUpperCase(),
    style: pw.TextStyle(
      fontSize: 7,
      fontWeight: pw.FontWeight.bold,
      letterSpacing: 1,
      color: _textFaint,
    ),
  );

  static pw.Widget _statusBadge(String status) {
    final meta = switch (status.toLowerCase()) {
      'paid' ||
      'accepted' => (color: PdfColor.fromInt(0xFF4ADE80), label: 'Paid'),
      'overdue' => (color: PdfColor.fromInt(0xFFF87171), label: 'Overdue'),
      'sent' => (color: PdfColor.fromInt(0xFFE8E4FF), label: 'Sent'),
      _ => (
        color: _textFaint,
        label: sanitize(status.isEmpty ? 'Draft' : status),
      ),
    };
    return pw.Container(
      padding: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: pw.BoxDecoration(
        border: pw.Border.all(color: meta.color.shade(.5)),
        color: meta.color.shade(.92),
      ),
      child: pw.Row(
        mainAxisSize: pw.MainAxisSize.min,
        children: [
          pw.Container(
            width: 4,
            height: 4,
            decoration: pw.BoxDecoration(
              color: meta.color,
              shape: pw.BoxShape.circle,
            ),
          ),
          pw.SizedBox(width: 4),
          pw.Text(
            meta.label.toUpperCase(),
            style: pw.TextStyle(
              fontSize: 7,
              fontWeight: pw.FontWeight.bold,
              letterSpacing: 1.2,
              color: meta.color,
            ),
          ),
        ],
      ),
    );
  }

  static List<pw.Widget> _footerSections(List<MapEntry<String, String?>> secs) {
    final out = <pw.Widget>[];
    var first = true;
    for (final sec in secs) {
      if (sec.value == null || sec.value!.trim().isEmpty) continue;
      out.add(
        pw.Container(
          margin: pw.EdgeInsets.only(top: first ? 0 : 16),
          child: pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              _label(sec.key),
              pw.SizedBox(height: 4),
              pw.Text(
                sanitize(sec.value),
                style: pw.TextStyle(
                  fontSize: 9,
                  height: 1.5,
                  color: _textMuted,
                ),
              ),
            ],
          ),
        ),
      );
      first = false;
    }
    return out;
  }

  static pw.PageTheme _theme() => pw.PageTheme(
    pageFormat: PdfPageFormat.a4,
    margin: const pw.EdgeInsets.fromLTRB(36, 32, 36, 32),
    buildBackground: (context) => pw.Container(color: _bg),
  );

  // ── Invoice ─────────────────────────────────────────────────────────────

  static pw.Document invoice(Map<String, dynamic> invoice) {
    final items = ((invoice['items'] as List?) ?? const [])
        .whereType<Map>()
        .map((e) => e.cast<String, dynamic>())
        .toList();
    final subtotal = items.fold<double>(
      0,
      (s, i) =>
          s +
          ((num.tryParse('${i['quantity']}') ?? i['quantity'] as num?) ?? 0)
                  .toDouble() *
              ((num.tryParse('${i['rate']}') ?? i['rate'] as num?) ?? 0)
                  .toDouble(),
    );
    final tax =
        ((invoice['tax'] as num?) ?? num.tryParse('${invoice['tax']}') ?? 0)
            .toDouble();
    final total =
        ((invoice['total'] as num?) ??
                num.tryParse('${invoice['total']}') ??
                subtotal + tax)
            .toDouble();
    final symbol = currencySymbol(invoice['currency'] as String?);
    final client = invoice['client'] is Map
        ? (invoice['client'] as Map).cast<String, dynamic>()
        : null;
    final bank = invoice['bank_account'] is Map
        ? (invoice['bank_account'] as Map).cast<String, dynamic>()
        : null;
    final status = '${invoice['status'] ?? 'draft'}';
    final number = sanitize(invoice['invoice_number'] ?? '');

    pw.Widget dateLine(String label, dynamic iso, {PdfColor? color}) => pw.Text(
      '$label ${_fmtDate(iso)}',
      style: pw.TextStyle(fontSize: 8, color: color ?? _textFaint),
    );

    return pw.Document()..addPage(
      pw.MultiPage(
        pageTheme: _theme(),
        build: (context) => [
          pw.Container(
            padding: const pw.EdgeInsets.all(24),
            decoration: pw.BoxDecoration(
              color: _card,
              border: pw.Border.all(color: _border),
            ),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                // Header
                pw.Container(
                  padding: const pw.EdgeInsets.only(bottom: 16),
                  decoration: const pw.BoxDecoration(
                    border: pw.Border(bottom: pw.BorderSide(color: _border)),
                  ),
                  child: pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      _brand(),
                      pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.end,
                        children: [
                          pw.Text(
                            number,
                            style: pw.TextStyle(
                              fontSize: 16,
                              fontWeight: pw.FontWeight.bold,
                              color: _heading,
                            ),
                          ),
                          pw.SizedBox(height: 6),
                          _statusBadge(status),
                          pw.SizedBox(height: 6),
                          if (invoice['created_at'] != null)
                            dateLine('Issued:', invoice['created_at']),
                          if (invoice['due_date'] != null)
                            dateLine('Due:', invoice['due_date']),
                          if (invoice['paid_at'] != null)
                            dateLine(
                              'Paid:',
                              invoice['paid_at'],
                              color: PdfColor.fromInt(0xFF34D399),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                pw.SizedBox(height: 20),
                // Parties
                pw.Row(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Expanded(
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          _label('From'),
                          pw.SizedBox(height: 4),
                          pw.Text(
                            'Meteoric',
                            style: pw.TextStyle(
                              fontSize: 9,
                              fontWeight: pw.FontWeight.bold,
                              color: _text,
                            ),
                          ),
                          pw.Text(
                            'contact@withmeteoric.com',
                            style: pw.TextStyle(fontSize: 9, color: _textMuted),
                          ),
                        ],
                      ),
                    ),
                    pw.Expanded(
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          _label('To'),
                          pw.SizedBox(height: 4),
                          pw.Text(
                            client == null ? '-' : sanitize(client['name']),
                            style: pw.TextStyle(
                              fontSize: 9,
                              fontWeight: pw.FontWeight.bold,
                              color: _text,
                            ),
                          ),
                          if (client?['company'] != null)
                            pw.Text(
                              sanitize(client!['company']),
                              style: pw.TextStyle(
                                fontSize: 9,
                                color: _textMuted,
                              ),
                            ),
                          if (client?['email'] != null)
                            pw.Text(
                              sanitize(client!['email']),
                              style: pw.TextStyle(
                                fontSize: 9,
                                color: _textMuted,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
                pw.SizedBox(height: 20),
                // Items table
                if (items.isNotEmpty) ...[
                  pw.Table(
                    columnWidths: const {
                      0: pw.FlexColumnWidth(),
                      1: pw.FixedColumnWidth(44),
                      2: pw.FixedColumnWidth(64),
                      3: pw.FixedColumnWidth(76),
                    },
                    children: [
                      pw.TableRow(
                        decoration: const pw.BoxDecoration(
                          border: pw.Border(
                            bottom: pw.BorderSide(color: _border),
                          ),
                        ),
                        children: [
                          _th('Description'),
                          _th('Qty', alignRight: true),
                          _th('Rate', alignRight: true),
                          _th('Amount', alignRight: true),
                        ],
                      ),
                      for (final item in items)
                        pw.TableRow(
                          decoration: const pw.BoxDecoration(
                            border: pw.Border(
                              bottom: pw.BorderSide(color: _borderSoft),
                            ),
                          ),
                          children: [
                            _td(item['description'], emphasize: true),
                            _td(item['quantity'], alignRight: true),
                            _td(
                              _money(
                                ((num.tryParse('${item['rate']}') ??
                                            item['rate'] as num?) ??
                                        0)
                                    .toDouble(),
                                symbol,
                              ),
                              alignRight: true,
                            ),
                            _td(
                              _money(
                                (((num.tryParse('${item['quantity']}') ??
                                                item['quantity'] as num?) ??
                                            0)
                                        .toDouble()) *
                                    (((num.tryParse('${item['rate']}') ??
                                                item['rate'] as num?) ??
                                            0)
                                        .toDouble()),
                                symbol,
                              ),
                              alignRight: true,
                            ),
                          ],
                        ),
                    ],
                  ),
                  pw.SizedBox(height: 14),
                ],
                // Totals
                pw.Align(
                  alignment: pw.Alignment.centerRight,
                  child: pw.Container(
                    width: 180,
                    child: pw.Column(
                      children: [
                        _totalRow('Subtotal', _money(subtotal, symbol)),
                        if (tax > 0) _totalRow('Tax', _money(tax, symbol)),
                        pw.Container(
                          margin: const pw.EdgeInsets.only(top: 3),
                          padding: const pw.EdgeInsets.only(top: 6),
                          decoration: const pw.BoxDecoration(
                            border: pw.Border(
                              top: pw.BorderSide(
                                color: PdfColor.fromInt(0x33FFFFFF),
                              ),
                            ),
                          ),
                          child: pw.Row(
                            mainAxisAlignment:
                                pw.MainAxisAlignment.spaceBetween,
                            children: [
                              pw.Text(
                                'Total',
                                style: pw.TextStyle(
                                  fontSize: 11,
                                  fontWeight: pw.FontWeight.bold,
                                  color: _heading,
                                ),
                              ),
                              pw.Text(
                                _money(total, symbol),
                                style: pw.TextStyle(
                                  fontSize: 11,
                                  fontWeight: pw.FontWeight.bold,
                                  color: _heading,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Bank details
                if (status.toLowerCase() != 'paid' && bank != null) ...[
                  pw.SizedBox(height: 16),
                  pw.Container(
                    width: double.infinity,
                    padding: const pw.EdgeInsets.all(12),
                    color: PdfColor.fromInt(0xFF111111),
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text(
                          'BANK TRANSFER DETAILS',
                          style: pw.TextStyle(
                            fontSize: 7,
                            fontWeight: pw.FontWeight.bold,
                            letterSpacing: 1.2,
                            color: PdfColor.fromInt(0xFFEAEFFF),
                          ),
                        ),
                        pw.SizedBox(height: 6),
                        for (final pair in const [
                          ('bank_name', 'Bank'),
                          ('account_holder', 'Name'),
                          ('account_number', 'Account No'),
                          ('iban', 'IBAN'),
                          ('swift_bic', 'SWIFT/BIC'),
                          ('routing_number', 'Routing'),
                          ('ifsc', 'IFSC'),
                          ('currency', 'Currency'),
                          ('country', 'Country'),
                        ])
                          if (bank[pair.$1] != null &&
                              '${bank[pair.$1]}'.isNotEmpty)
                            pw.Padding(
                              padding: const pw.EdgeInsets.only(bottom: 2),
                              child: pw.RichText(
                                text: pw.TextSpan(
                                  children: [
                                    pw.TextSpan(
                                      text: '${pair.$2}: ',
                                      style: pw.TextStyle(
                                        fontSize: 8,
                                        color: PdfColor.fromInt(0xFFAAAAAA),
                                      ),
                                    ),
                                    pw.TextSpan(
                                      text: sanitize(bank[pair.$1]),
                                      style: pw.TextStyle(
                                        fontSize: 8,
                                        color: PdfColor.fromInt(0xFFE0E0E0),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                      ],
                    ),
                  ),
                ],
                // Notes / Terms
                if (invoice['notes'] != null || invoice['terms'] != null)
                  pw.Padding(
                    padding: const pw.EdgeInsets.only(top: 16),
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: _footerSections([
                        MapEntry('Notes', invoice['notes'] as String?),
                        MapEntry(
                          'Terms & Conditions',
                          invoice['terms'] as String?,
                        ),
                      ]),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static pw.Widget _th(String text, {bool alignRight = false}) => pw.Padding(
    padding: const pw.EdgeInsets.only(bottom: 6),
    child: pw.Text(
      text.toUpperCase(),
      textAlign: alignRight ? pw.TextAlign.right : pw.TextAlign.left,
      style: pw.TextStyle(
        fontSize: 7,
        fontWeight: pw.FontWeight.bold,
        letterSpacing: 1,
        color: _textFaint,
      ),
    ),
  );

  static pw.Widget _td(
    Object? value, {
    bool alignRight = false,
    bool emphasize = false,
  }) => pw.Padding(
    padding: const pw.EdgeInsets.symmetric(vertical: 5),
    child: pw.Text(
      sanitize(value),
      textAlign: alignRight ? pw.TextAlign.right : pw.TextAlign.left,
      style: pw.TextStyle(fontSize: 9, color: emphasize ? _text : _textMuted),
    ),
  );

  static pw.Widget _totalRow(String label, String amount) => pw.Padding(
    padding: const pw.EdgeInsets.symmetric(vertical: 3),
    child: pw.Row(
      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
      children: [
        pw.Text(label, style: pw.TextStyle(fontSize: 9, color: _textMuted)),
        pw.Text(amount, style: pw.TextStyle(fontSize: 9, color: _textMuted)),
      ],
    ),
  );

  // ── Proposal ────────────────────────────────────────────────────────────

  static pw.Document proposal(Map<String, dynamic> proposal) {
    final lead = proposal['lead'] is Map
        ? (proposal['lead'] as Map).cast<String, dynamic>()
        : null;
    final status = '${proposal['status'] ?? 'draft'}';

    return pw.Document()..addPage(
      pw.MultiPage(
        pageTheme: _theme(),
        build: (context) => [
          pw.Container(
            padding: const pw.EdgeInsets.all(24),
            decoration: pw.BoxDecoration(
              color: _card,
              border: pw.Border.all(color: _border),
            ),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Container(
                  padding: const pw.EdgeInsets.only(bottom: 16),
                  decoration: const pw.BoxDecoration(
                    border: pw.Border(bottom: pw.BorderSide(color: _border)),
                  ),
                  child: pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      _brand(),
                      pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.end,
                        children: [
                          pw.Container(
                            constraints: const pw.BoxConstraints(maxWidth: 220),
                            child: pw.Text(
                              sanitize(proposal['title']),
                              textAlign: pw.TextAlign.right,
                              style: pw.TextStyle(
                                fontSize: 15,
                                fontWeight: pw.FontWeight.bold,
                                color: _heading,
                              ),
                            ),
                          ),
                          pw.SizedBox(height: 4),
                          pw.Text(
                            status.toUpperCase(),
                            style: pw.TextStyle(
                              fontSize: 8,
                              fontWeight: pw.FontWeight.bold,
                              letterSpacing: 1,
                              color: status == 'sent'
                                  ? PdfColor.fromInt(0xFF34D399)
                                  : _textFaint,
                            ),
                          ),
                          if (proposal['sent_at'] != null) ...[
                            pw.SizedBox(height: 4),
                            pw.Text(
                              'Sent: ${_fmtDate(proposal['sent_at'])}',
                              style: pw.TextStyle(
                                fontSize: 8,
                                color: _textFaint,
                              ),
                            ),
                          ],
                          if (proposal['created_at'] != null)
                            pw.Text(
                              'Created: ${_fmtDate(proposal['created_at'])}',
                              style: pw.TextStyle(
                                fontSize: 8,
                                color: _textFaint,
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                pw.SizedBox(height: 20),
                _label('Prepared for'),
                pw.SizedBox(height: 4),
                pw.Text(
                  lead == null ? '-' : sanitize(lead['name']),
                  style: pw.TextStyle(
                    fontSize: 10,
                    fontWeight: pw.FontWeight.bold,
                    color: _text,
                  ),
                ),
                if (lead?['email'] != null && '${lead?['email']}'.isNotEmpty)
                  pw.Text(
                    sanitize(lead!['email']),
                    style: pw.TextStyle(fontSize: 9, color: _textMuted),
                  ),
                pw.SizedBox(height: 20),
                ..._contentBlocks(proposal['content']),
                ..._footerSections([
                  MapEntry('Timeline', proposal['timeline'] as String?),
                  MapEntry('Terms & Conditions', proposal['terms'] as String?),
                ]),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static String _fmtDate(dynamic iso) {
    if (iso == null || iso.toString().isEmpty) return '-';
    try {
      final dt = DateTime.parse(iso.toString()).toLocal();
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
    } catch (_) {
      return iso.toString();
    }
  }

  /// Renders TipTap JSON into PDF blocks (paragraphs, headings, lists,
  /// quotes, rules) mirroring the web `renderContent`.
  static List<pw.Widget> _contentBlocks(dynamic content) {
    if (content == null) return [];
    if (content is String) {
      return [
        pw.Text(
          sanitize(content),
          style: pw.TextStyle(fontSize: 10, height: 1.6, color: _textMuted),
        ),
      ];
    }
    if (content is! Map || content['type'] != 'doc') return [];
    final nodes = ((content['content'] as List?) ?? const []).whereType<Map>();
    return [
      for (final node in nodes) ..._nodeBlock(node.cast<String, dynamic>()),
    ];
  }

  static List<pw.Widget> _nodeBlock(Map node) {
    final type = node['type'];
    final children = ((node['content'] as List?) ?? const [])
        .whereType<Map>()
        .toList();

    switch (type) {
      case 'heading':
        final level =
            ((node['attrs'] is Map ? node['attrs']['level'] : null) as num?)
                ?.toInt() ??
            2;
        final size = level <= 1 ? 15.0 : (level == 2 ? 13.0 : 11.5);
        return [
          pw.Padding(
            padding: const pw.EdgeInsets.only(top: 8, bottom: 4),
            child: pw.Text(
              _inlineText(children),
              style: pw.TextStyle(
                fontSize: size,
                fontWeight: pw.FontWeight.bold,
                color: _heading,
              ),
            ),
          ),
        ];
      case 'bulletList':
        return [
          pw.Padding(
            padding: const pw.EdgeInsets.only(bottom: 6),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [for (final c in children) ..._listBlock(c, '-')],
            ),
          ),
        ];
      case 'orderedList':
        return [
          pw.Padding(
            padding: const pw.EdgeInsets.only(bottom: 6),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                for (var i = 0; i < children.length; i++)
                  ..._listBlock(children[i], '${i + 1}.'),
              ],
            ),
          ),
        ];
      case 'blockquote':
        return [
          pw.Container(
            margin: const pw.EdgeInsets.only(left: 8, bottom: 6),
            padding: const pw.EdgeInsets.only(left: 8),
            decoration: const pw.BoxDecoration(
              border: pw.Border(
                left: pw.BorderSide(
                  color: PdfColor.fromInt(0xFFEAEFFF),
                  width: 2,
                ),
              ),
            ),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [for (final c in children) ..._nodeBlock(c)],
            ),
          ),
        ];
      case 'horizontalRule':
        return [
          pw.Padding(
            padding: const pw.EdgeInsets.symmetric(vertical: 6),
            child: pw.Container(
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: _border),
              ),
              height: 0.5,
            ),
          ),
        ];
      default:
        return [
          pw.Padding(
            padding: const pw.EdgeInsets.only(bottom: 6),
            child: pw.Text(
              _inlineText(children),
              style: pw.TextStyle(fontSize: 10, height: 1.6, color: _textMuted),
            ),
          ),
        ];
    }
  }

  static List<pw.Widget> _listBlock(Map item, String marker) {
    final children = ((item['content'] as List?) ?? const [])
        .whereType<Map>()
        .toList();
    final out = <pw.Widget>[];
    for (final c in children) {
      if (c['type'] == 'bulletList' || c['type'] == 'orderedList') {
        out.addAll(_nodeBlock(c));
      } else {
        out.add(
          pw.Padding(
            padding: const pw.EdgeInsets.only(bottom: 2),
            child: pw.Row(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.SizedBox(
                  width: 18,
                  child: pw.Text(
                    marker,
                    style: pw.TextStyle(
                      fontSize: 10,
                      color: PdfColor.fromInt(0xFFEAEFFF),
                    ),
                  ),
                ),
                pw.Expanded(
                  child: pw.Text(
                    _inlineText(
                      ((c['content'] as List?) ?? const [])
                          .whereType<Map>()
                          .toList(),
                    ),
                    style: pw.TextStyle(
                      fontSize: 10,
                      height: 1.5,
                      color: _textMuted,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      }
    }
    return out;
  }

  /// Flattens inline nodes (bold/italic/underline/link marks preserved where
  /// cheaply possible; links become plain colored text in the flat span).
  static String _inlineText(List<Map> nodes) {
    final buf = StringBuffer();
    for (final node in nodes) {
      if (node['type'] == 'hardBreak') {
        buf.write('\n');
      } else if (node['type'] == 'text') {
        buf.write(sanitize(node['text']));
      }
    }
    return buf.toString();
  }
}
