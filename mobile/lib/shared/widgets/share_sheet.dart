import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/native.dart';
import '../../core/theme.dart';

/// Bottom sheet mirroring the web admin's share actions:
/// copy link, open preview, WhatsApp, system share.
Future<void> showShareSheet(
  BuildContext context, {
  required String title,
  required String url,
}) {
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: AppColors.card,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
    builder: (ctx) => SafeArea(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                title.toUpperCase(),
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 10,
                  letterSpacing: 1.2,
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SelectableText(
              url,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                fontFamily: 'Inter',
              ),
            ),
          ),
          const SizedBox(height: 12),
          _ShareAction(
            icon: Icons.copy_outlined,
            label: 'Copy link',
            onTap: () {
              Clipboard.setData(ClipboardData(text: url));
              Navigator.pop(ctx);
              ScaffoldMessenger.of(ctx)
                  .showSnackBar(const SnackBar(content: Text('Link copied')));
            },
          ),
          _ShareAction(
            icon: Icons.open_in_new_outlined,
            label: 'Open preview',
            onTap: () {
              Navigator.pop(ctx);
              Native.openUrl(url);
            },
          ),
          _ShareAction(
            icon: Icons.chat_outlined,
            label: 'WhatsApp',
            onTap: () {
              Navigator.pop(ctx);
              Native.openUrl('https://wa.me/?text=${Uri.encodeComponent(url)}');
            },
          ),
          _ShareAction(
            icon: Icons.share_outlined,
            label: 'Share...',
            onTap: () {
              Navigator.pop(ctx);
              Native.shareText('$title\n$url');
            },
          ),
          const SizedBox(height: 8),
        ],
      ),
    ),
  );
}

class _ShareAction extends StatelessWidget {
  const _ShareAction({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: Row(
          children: [
            Icon(icon, size: 17, color: AppColors.accent),
            const SizedBox(width: 12),
            Text(
              label,
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 13,
                fontFamily: 'Inter',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
