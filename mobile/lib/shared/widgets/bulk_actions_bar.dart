import 'package:flutter/material.dart';

import '../../core/theme.dart';

/// Fixed bottom bar shown while rows are selected — mirrors the web
/// admin's BulkActionBar: "N selected · Clear" + optional Delete and
/// Status buttons.
class BulkActionBar extends StatelessWidget {
  const BulkActionBar({
    super.key,
    required this.count,
    required this.onClear,
    this.onDelete,
    this.statusOptions,
    this.onStatus,
    this.busy = false,
  });

  final int count;
  final VoidCallback onClear;
  final VoidCallback? onDelete;

  /// When set, shows a status picker button with these options.
  final List<MapEntry<String, String>>? statusOptions;
  final ValueChanged<String>? onStatus;
  final bool busy;

  Future<void> _pickStatus(BuildContext context) async {
    final options = statusOptions!;
    final selected = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: AppColors.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
      ),
      builder: (sheetContext) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 14, 16, 6),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'SET STATUS',
                  style: TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.2,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
            ),
            for (final opt in options)
              ListTile(
                dense: true,
                title: Text(
                  opt.value,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 13,
                    fontFamily: 'Inter',
                  ),
                ),
                onTap: () => Navigator.pop(sheetContext, opt.key),
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
    if (selected != null) onStatus!(selected);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.cardRaised,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      padding: EdgeInsets.fromLTRB(
        16,
        10,
        16,
        10 + MediaQuery.of(context).padding.bottom,
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: busy ? null : onClear,
              child: Text(
                '$count selected · CLEAR',
                style: TextStyle(
                  color: busy ? AppColors.textFaint : AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.8,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ),
          if (statusOptions != null && onStatus != null) ...[
            _BulkButton(
              label: 'STATUS',
              color: AppColors.accent,
              onPressed: busy ? null : () => _pickStatus(context),
            ),
            const SizedBox(width: 8),
          ],
          if (onDelete != null)
            _BulkButton(
              label: 'DELETE',
              color: AppColors.red,
              onPressed: busy ? null : onDelete,
            ),
        ],
      ),
    );
  }
}

class _BulkButton extends StatelessWidget {
  const _BulkButton({required this.label, required this.color, this.onPressed});

  final String label;
  final Color color;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(color: color.withValues(alpha: 0.4)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: onPressed == null ? AppColors.textFaint : color,
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 1,
            fontFamily: 'Inter',
          ),
        ),
      ),
    );
  }
}

/// Confirmation dialog used by every bulk delete.
Future<bool> confirmBulkDelete(
  BuildContext context, {
  required int count,
  String label = 'items',
}) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (dialogContext) => AlertDialog(
      backgroundColor: AppColors.cardRaised,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
      title: Text(
        'Delete $count $label?',
        style: const TextStyle(
          color: AppColors.text,
          fontSize: 15,
          fontWeight: FontWeight.w600,
          fontFamily: 'Inter',
        ),
      ),
      content: Text(
        'This permanently deletes the selected $label. This cannot be undone.',
        style: const TextStyle(
          color: AppColors.textMuted,
          fontSize: 13,
          height: 1.5,
          fontFamily: 'Inter',
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(dialogContext, false),
          child: const Text(
            'CANCEL',
            style: TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              fontFamily: 'Inter',
            ),
          ),
        ),
        TextButton(
          onPressed: () => Navigator.pop(dialogContext, true),
          child: const Text(
            'DELETE',
            style: TextStyle(
              color: AppColors.red,
              fontSize: 12,
              fontWeight: FontWeight.w700,
              fontFamily: 'Inter',
            ),
          ),
        ),
      ],
    ),
  );
  return result == true;
}
