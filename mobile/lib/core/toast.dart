import 'package:flutter/material.dart';

import 'theme.dart';

/// Premium monochrome toast — floating dark card, hairline border,
/// status icon tile, Inter type. Replaces raw SnackBars app-wide.
class Toast {
  Toast._();

  static void success(BuildContext context, String message) =>
      _show(context, message, ToastType.success);

  static void error(BuildContext context, String message) =>
      _show(context, message, ToastType.error);

  static void info(BuildContext context, String message) =>
      _show(context, message, ToastType.info);

  static void _show(BuildContext context, String message, ToastType type) {
    ScaffoldMessenger.of(context)
      ..clearSnackBars()
      ..showSnackBar(
        SnackBar(
          content: _ToastView(message: message, type: type),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.transparent,
          elevation: 0,
          padding: EdgeInsets.zero,
          duration: Duration(seconds: type == ToastType.error ? 4 : 2),
        ),
      );
  }
}

enum ToastType { success, error, info }

class _ToastView extends StatelessWidget {
  const _ToastView({required this.message, required this.type});

  final String message;
  final ToastType type;

  IconData get _icon {
    switch (type) {
      case ToastType.success:
        return Icons.check_rounded;
      case ToastType.error:
        return Icons.close_rounded;
      case ToastType.info:
        return Icons.info_outline_rounded;
    }
  }

  Color get _iconColor {
    switch (type) {
      case ToastType.success:
        return AppColors.accent;
      case ToastType.error:
        return AppColors.red;
      case ToastType.info:
        return AppColors.textMuted;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(10, 10, 14, 10),
      decoration: BoxDecoration(
        color: AppColors.cardRaised,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF070707).withValues(alpha: 0.5),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 26,
            height: 26,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: _iconColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(7),
              border: Border.all(color: _iconColor.withValues(alpha: 0.18)),
            ),
            child: Icon(_icon, size: 15, color: _iconColor),
          ),
          const SizedBox(width: 11),
          Flexible(
            child: Text(
              message,
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 13,
                fontWeight: FontWeight.w500,
                fontFamily: 'Inter',
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
