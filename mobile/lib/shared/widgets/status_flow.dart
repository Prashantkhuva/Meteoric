import 'package:flutter/material.dart';

import '../../core/constants.dart';
import '../../core/theme.dart';
import 'common.dart';

/// Guided status transitions per entity, mirroring the web admin flow.
/// Values list the statuses a record may legally move to from its key.
class StatusFlow {
  static const Map<String, List<String>> invoices = {
    'draft': ['sent', 'cancelled'],
    'sent': ['overdue', 'cancelled'],
    'overdue': ['cancelled'],
    'paid': [],
    'cancelled': [],
  };

  static const Map<String, List<String>> proposals = {
    'draft': ['sent'],
    'sent': ['viewed', 'accepted', 'rejected'],
    'viewed': ['accepted', 'rejected'],
    'accepted': [],
    'rejected': [],
  };

  static const Map<String, List<String>> leads = {
    'inquiry': ['discovery', 'lost'],
    'discovery': ['proposal', 'lost'],
    'proposal': ['in_progress', 'lost'],
    'in_progress': ['completed', 'lost'],
    'completed': [],
    'lost': [],
  };

  static const Map<String, List<String>> projects = {
    'planning': ['in_progress', 'cancelled'],
    'in_progress': ['review', 'on_hold', 'cancelled'],
    'review': ['completed', 'on_hold', 'cancelled'],
    'on_hold': ['in_progress', 'cancelled'],
    'completed': [],
    'cancelled': [],
  };

  static const Set<String> destructive = {'lost', 'cancelled', 'rejected'};

  static const Map<String, String> hints = {
    'invoices': 'Draft → Sent → Paid · Cancelled',
    'proposals': 'Draft → Sent → Accepted / Rejected',
    'leads': 'Inquiry → Discovery → Proposal → In Progress → Completed',
    'projects': 'Planning → In Progress → Review → Completed',
  };
}

/// "Update status" card showing only the valid next steps for [current].
/// Destructive targets (lost/cancelled/rejected) ask for confirmation.
class StatusFlowSection extends StatelessWidget {
  const StatusFlowSection({
    super.key,
    required this.metaMap,
    required this.transitions,
    required this.current,
    required this.onSelect,
    this.busy = false,
    this.flowKey,
  });

  final Map<String, StatusMeta> metaMap;
  final Map<String, List<String>> transitions;
  final String? current;
  final bool busy;
  final ValueChanged<String> onSelect;

  /// Key into [StatusFlow.hints] for the pipeline caption.
  final String? flowKey;

  Future<void> _pick(BuildContext context, String next) async {
    if (!StatusFlow.destructive.contains(next)) {
      onSelect(next);
      return;
    }
    final label = metaMap[next]?.label ?? next;
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Mark as $label?'),
        content: Text(
          'This will change the status to "$label".',
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
            child: const Text('CONFIRM'),
          ),
        ],
      ),
    );
    if (ok == true) onSelect(next);
  }

  @override
  Widget build(BuildContext context) {
    final next = transitions[current] ?? const <String>[];
    final hint = flowKey == null ? null : StatusFlow.hints[flowKey];

    return SectionCard(
      title: 'Update status',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (hint != null) ...[
            Text(
              hint,
              style: const TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                letterSpacing: 0.5,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 12),
          ],
          if (next.isEmpty)
            const Text(
              'No further actions — this record is closed.',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 12,
                fontFamily: 'Inter',
              ),
            )
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [for (final key in next) _chip(context, key)],
            ),
        ],
      ),
    );
  }

  Widget _chip(BuildContext context, String key) {
    final meta = metaMap[key];
    final destructive = StatusFlow.destructive.contains(key);
    final color = destructive
        ? AppColors.red
        : (meta?.color ?? AppColors.textMuted);
    return GestureDetector(
      onTap: busy ? null : () => _pick(context, key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(border: Border.all(color: AppColors.border)),
        child: Text(
          meta?.label ?? key,
          style: TextStyle(
            color: color,
            fontSize: 11,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
        ),
      ),
    );
  }
}
