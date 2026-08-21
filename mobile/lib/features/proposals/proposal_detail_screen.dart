import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/config.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/status_flow.dart';
import '../../shared/widgets/tiptap_view.dart';
import 'proposal_form_screen.dart';

class ProposalDetailScreen extends StatefulWidget {
  const ProposalDetailScreen({super.key, required this.proposal});

  final Map<String, dynamic> proposal;

  @override
  State<ProposalDetailScreen> createState() => _ProposalDetailScreenState();
}

class _ProposalDetailScreenState extends State<ProposalDetailScreen> {
  late Map<String, dynamic> _proposal;
  bool _busy = false;
  bool _sending = false;
  bool _changed = false;

  @override
  void initState() {
    super.initState();
    _proposal = widget.proposal;
  }

  Map<String, dynamic>? get _lead {
    final lead = _proposal['lead'];
    return lead is Map ? lead.cast<String, dynamic>() : null;
  }

  Future<void> _changeStatus(String status) async {
    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.proposalStatus(
        (_proposal['id'] as num).toInt(),
        status,
      );
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        setState(() {
          _proposal = {..._proposal, 'status': status};
          _changed = true;
        });
        _snack('Status updated');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _send() async {
    setState(() => _sending = true);
    try {
      final res = await ApiClient.instance.proposalSend(
        (_proposal['id'] as num).toInt(),
      );
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        setState(() {
          _proposal = {..._proposal, 'status': 'sent'};
          _changed = true;
        });
        _snack('Proposal sent by email');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  Future<void> _share() async {
    try {
      final res = await ApiClient.instance.proposalShareToken(
        (_proposal['id'] as num).toInt(),
      );
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
        return;
      }
      final token = res['token'];
      final url = '${AppConfig.siteUrl}/share/proposal/$token';
      await showDialog<void>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Share proposal'),
          content: SelectableText(
            url,
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 13,
              fontFamily: 'Inter',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Close'),
            ),
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
        title: const Text('Delete proposal'),
        content: const Text('Delete this proposal? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
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
      final res = await ApiClient.instance.proposalDelete(
        (_proposal['id'] as num).toInt(),
      );
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
        backgroundColor: isError
            ? AppColors.red.withValues(alpha: 0.9)
            : AppColors.cardRaised,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lead = _lead;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        Navigator.of(context).pop(_changed);
      },
      child: AppScaffold(
        title: _proposal['title'] ?? 'Proposal',
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              children: [
                StatusBadge(
                  meta: Status.get(Status.proposals, _proposal['status']),
                ),
                const Spacer(),
                Text(
                  Fmt.date(_proposal['created_at'] as String?),
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 10,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (lead != null)
              SectionCard(
                title: 'Lead',
                child: Column(
                  children: [
                    DetailRow(label: 'Name', value: lead['name'] ?? '—'),
                    DetailRow(label: 'Email', value: lead['email'] ?? '—'),
                    DetailRow(label: 'Phone', value: lead['phone'] ?? '—'),
                    DetailRow(label: 'Company', value: lead['company'] ?? '—'),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            if (_proposal['content'] != null)
              SectionCard(
                title: 'Content',
                child: TipTapView(content: _proposal['content']),
              ),
            const SizedBox(height: 16),
            if (_proposal['pricing'] is List &&
                (_proposal['pricing'] as List).isNotEmpty)
              SectionCard(
                title: 'Pricing',
                child: Column(
                  children: [
                    for (final item
                        in (_proposal['pricing'] as List).cast<Map>())
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                '${item['description'] ?? '—'} × ${item['quantity'] ?? 1}',
                                style: const TextStyle(
                                  color: AppColors.textMuted,
                                  fontSize: 12,
                                  fontFamily: 'Inter',
                                ),
                              ),
                            ),
                            Text(
                              Fmt.money(
                                ((item['rate'] as num?)?.toDouble() ?? 0) *
                                    ((item['quantity'] as num?)?.toDouble() ??
                                        1),
                              ),
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
                  ],
                ),
              ),
            const SizedBox(height: 16),
            SectionCard(
              title: 'Terms',
              child: Column(
                children: [
                  DetailRow(
                    label: 'Timeline',
                    value: _proposal['timeline'] ?? '—',
                  ),
                  DetailRow(label: 'Terms', value: _proposal['terms'] ?? '—'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            if (_proposal['status'] == 'draft')
              AccentButton(
                onPressed: _sending ? null : _send,
                child: _sending
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Color(0xFF121212),
                        ),
                      )
                    : const Text('SEND TO LEAD'),
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
                            final changed = await Navigator.of(context)
                                .push<bool>(
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        ProposalFormScreen(proposal: _proposal),
                                  ),
                                );
                            if (changed == true && mounted) setState(() {});
                          },
                    child: const Text('EDIT'),
                  ),
                ),
                Expanded(
                  child: GhostButton(
                    onPressed: _busy ? null : _share,
                    child: const Text('SHARE'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            GhostButton(
              borderColor: AppColors.red.withValues(alpha: 0.4),
              textColor: AppColors.red,
              onPressed: _busy ? null : _delete,
              child: const Text('DELETE'),
            ),
            const SizedBox(height: 16),
            StatusFlowSection(
              metaMap: Status.proposals,
              transitions: StatusFlow.proposals,
              current: _proposal['status'] is String
                  ? _proposal['status'] as String
                  : null,
              busy: _busy,
              flowKey: 'proposals',
              onSelect: _changeStatus,
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
