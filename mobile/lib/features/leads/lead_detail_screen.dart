import 'package:flutter/material.dart';

import 'dart:async';

import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/status_flow.dart';
import 'lead_form_screen.dart';

class LeadDetailScreen extends StatefulWidget {
  const LeadDetailScreen({super.key, required this.lead});

  final Map<String, dynamic> lead;

  @override
  State<LeadDetailScreen> createState() => _LeadDetailScreenState();
}

class _LeadDetailScreenState extends State<LeadDetailScreen> {
  late Map<String, dynamic> _lead;
  bool _busy = false;
  bool _changed = false;

  @override
  void initState() {
    super.initState();
    _lead = widget.lead;
  }

  Future<void> _run(
    String label,
    Future<Map<String, dynamic>> Function() fn,
  ) async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      final res = await fn();
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack('$label done');
        setState(() {
          _changed = true;
          _lead = Map<String, dynamic>.from(_lead)
            ..addAll(res.cast<String, dynamic>());
        });
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _snack(String msg, {bool isError = false}) =>
      isError ? Toast.error(context, msg) : Toast.success(context, msg);

  Future<void> _changeStatus(String status) async {
    await _run('Status updated', () async {
      final res = await ApiClient.instance.leadStatus(
        (_lead['id'] as num).toInt(),
        status,
      );
      if (!res.containsKey('error')) {
        setState(() => _lead = {..._lead, 'status': status});
      }
      return res;
    });
  }

  Future<void> _convert() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Convert to client'),
        content: const Text(
          'This will create a client from this lead and mark the lead as completed. A welcome email is sent.',
          style: TextStyle(
            fontSize: 13,
            color: AppColors.textMuted,
            fontFamily: 'Inter',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          AccentButton(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('CONVERT'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    await _run('Lead converted', () async {
      final res = await ApiClient.instance.leadConvert(
        (_lead['id'] as num).toInt(),
      );
      if (!res.containsKey('error')) {
        setState(() => _lead = {..._lead, 'status': 'completed'});
      }
      return res;
    });
  }

  Future<void> _delete() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete lead'),
        content: Text(
          'Delete "${_lead['name']}"? This cannot be undone.',
          style: const TextStyle(
            fontSize: 13,
            color: AppColors.textMuted,
            fontFamily: 'Inter',
          ),
        ),
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

    await _run('Lead deleted', () async {
      final res = await ApiClient.instance.leadDelete(
        (_lead['id'] as num).toInt(),
      );
      if (!res.containsKey('error') && mounted) {
        Navigator.of(context).pop(true);
      }
      return res;
    });
  }

  @override
  Widget build(BuildContext context) {
    final name = _lead['name'] ?? '—';
    final score = _lead['ai_score'];
    final summary = _lead['ai_summary'];

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        Navigator.of(context).pop(_changed);
      },
      child: AppScaffold(
        title: name,
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              children: [
                StatusBadge(meta: Status.get(Status.leads, _lead['status'])),
                const SizedBox(width: 8),
                StatusBadge(
                  meta: Status.get(Status.leadSources, _lead['source']),
                ),
                const Spacer(),
                Text(
                  'Created ${Fmt.date(_lead['created_at'] as String?)}',
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 10,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            SectionCard(
              title: 'Details',
              child: Column(
                children: [
                  DetailRow(label: 'Email', value: _lead['email'] ?? '—'),
                  DetailRow(label: 'Phone', value: _lead['phone'] ?? '—'),
                  DetailRow(label: 'Company', value: _lead['company'] ?? '—'),
                  DetailRow(label: 'Services', value: _lead['services'] ?? '—'),
                  DetailRow(label: 'Budget', value: _lead['budget'] ?? '—'),
                  if (_lead['details'] != null &&
                      '${_lead['details']}'.isNotEmpty)
                    DetailRow(label: 'Details', value: '${_lead['details']}'),
                ],
              ),
            ),
            if (score != null) ...[
              const SizedBox(height: 16),
              SectionCard(
                title: 'AI Score',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          score.toStringAsFixed(0),
                          style: TextStyle(
                            color: switch (_lead['ai_category']) {
                              'hot' => AppColors.emerald,
                              'warm' => AppColors.amber,
                              'cold' => AppColors.sky,
                              _ => AppColors.text,
                            },
                            fontSize: 34,
                            fontWeight: FontWeight.w700,
                            fontFamily: 'Inter',
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          (_lead['ai_category'] ?? '').toString().toUpperCase(),
                          style: const TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 12,
                            letterSpacing: 1,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                    if (summary != null && '$summary'.isNotEmpty) ...[
                      const SizedBox(height: 10),
                      Text(
                        '$summary',
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 12,
                          height: 1.5,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),
            StatusFlowSection(
              metaMap: Status.leads,
              transitions: StatusFlow.leads,
              current: _lead['status'] is String
                  ? _lead['status'] as String
                  : null,
              busy: _busy,
              flowKey: 'leads',
              onSelect: _changeStatus,
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: GhostButton(
                    onPressed: _busy ? null : _convert,
                    child: const Text('CONVERT TO CLIENT'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: GhostButton(
                    onPressed: _busy
                        ? null
                        : () async {
                            final changed = await Navigator.of(context)
                                .push<bool>(
                                  MaterialPageRoute(
                                    builder: (_) => LeadFormScreen(lead: _lead),
                                  ),
                                );
                            if (changed == true && mounted) {
                              setState(() {});
                            }
                          },
                    child: const Text('EDIT'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: GhostButton(
                    borderColor: AppColors.red.withValues(alpha: 0.4),
                    textColor: AppColors.red,
                    onPressed: _busy ? null : _delete,
                    child: const Text('DELETE'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
