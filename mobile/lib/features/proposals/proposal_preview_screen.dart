import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/formatters.dart';
import '../../core/native.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/pdf_export.dart';
import '../../shared/widgets/tiptap_view.dart';
import '../invoices/invoice_preview_screen.dart' show StatusDot;

/// Full-page proposal preview mirroring the web `/preview/proposal/[id]`
/// page — brand header with status, Prepared-for block, TipTap content,
/// timeline + terms footers, plus one-tap PDF export.
class ProposalPreviewScreen extends StatelessWidget {
  const ProposalPreviewScreen({super.key, required this.proposal});

  final Map<String, dynamic> proposal;

  @override
  Widget build(BuildContext context) {
    final status = '${proposal['status'] ?? 'draft'}';
    final lead = proposal['lead'] is Map
        ? (proposal['lead'] as Map).cast<String, dynamic>()
        : null;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Proposal preview')),
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
                        StatusDot(status: status),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      '${proposal['title'] ?? '-'}',
                      style: const TextStyle(
                        color: Color(0xF2FFFFFF),
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        fontFamily: 'Inter',
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (proposal['sent_at'] != null)
                      _dateLine(
                        'Sent:',
                        Fmt.date(proposal['sent_at'] as String?),
                      ),
                    if (proposal['created_at'] != null)
                      _dateLine(
                        'Created:',
                        Fmt.date(proposal['created_at'] as String?),
                      ),
                  ],
                ),
              ),
              // ── Prepared for ──────────────────────────────────────────
              const SizedBox(height: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'PREPARED FOR',
                    style: TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.2,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${lead?['name'] ?? '-'}',
                    style: const TextStyle(
                      color: AppColors.text,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                  if (lead?['company'] != null &&
                      '${lead?['company']}'.isNotEmpty)
                    Text(
                      '${lead!['company']}',
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 11.5,
                        height: 1.5,
                        fontFamily: 'Inter',
                      ),
                    ),
                  if (lead?['email'] != null && '${lead?['email']}'.isNotEmpty)
                    Text(
                      '${lead!['email']}',
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 11.5,
                        height: 1.5,
                        fontFamily: 'Inter',
                      ),
                    ),
                ],
              ),
              // ── Content ───────────────────────────────────────────────
              if (proposal['content'] != null) ...[
                const SizedBox(height: 24),
                Container(
                  padding: const EdgeInsets.only(top: 18),
                  decoration: const BoxDecoration(
                    border: Border(top: BorderSide(color: AppColors.border)),
                  ),
                  child: TipTapView(content: proposal['content']),
                ),
              ],
              // ── Timeline / Terms ──────────────────────────────────────
              if (proposal['timeline'] != null ||
                  proposal['terms'] != null) ...[
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.only(top: 18),
                  decoration: const BoxDecoration(
                    border: Border(top: BorderSide(color: AppColors.border)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (proposal['timeline'] != null &&
                          '${proposal['timeline']}'.isNotEmpty) ...[
                        const _SectionLabel('Timeline'),
                        const SizedBox(height: 4),
                        _wrapText('${proposal['timeline']}'),
                        const SizedBox(height: 10),
                      ],
                      if (proposal['terms'] != null &&
                          '${proposal['terms']}'.isNotEmpty) ...[
                        const _SectionLabel('Terms & Conditions'),
                        const SizedBox(height: 4),
                        _wrapText('${proposal['terms']}'),
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
      final doc = PdfExport.proposal(proposal);
      final bytes = await doc.save();
      await Native.shareFileBytes(
        name: 'meteoric-proposal-${proposal['id'] ?? 'draft'}.pdf',
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

Widget _dateLine(String label, String value) => Padding(
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
          style: const TextStyle(
            color: AppColors.textFaint,
            fontSize: 11,
            fontFamily: 'Inter',
          ),
        ),
      ],
    ),
  ),
);

Widget _wrapText(String text) => Text(
  text,
  style: const TextStyle(
    color: AppColors.textMuted,
    fontSize: 11.5,
    height: 1.55,
    fontFamily: 'Inter',
  ),
);
