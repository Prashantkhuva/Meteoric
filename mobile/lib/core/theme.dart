import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Meteoric design tokens — mirror of the web admin.
class AppColors {
  static const Color background = Color(0xFF070707);
  static const Color card = Color(0xFF0A0A0A);
  static const Color cardRaised = Color(0xFF121212);
  static const Color border = Color(0x14FFFFFF); // white @ 8%
  static const Color borderSoft = Color(0x0DFFFFFF); // white @ 5%
  static const Color text = Color(0xD9FFFFFF); // white @ 85%
  static const Color textMuted = Color(0x66FFFFFF); // white @ 40%
  static const Color textFaint = Color(0x4DFFFFFF); // white @ 30%
  static const Color accent = Color(0xFFEAEFFF);

  static const Color emerald = Color(0xFF34D399);
  static const Color amber = Color(0xFFFBBF24);
  static const Color red = Color(0xFFF87171);
  static const Color sky = Color(0xFF38BDF8);
  static const Color violet = Color(0xFFA78BFA);
}

/// Shared design constants.
class AppRadius {
  static const double sm = 6;
  static const double md = 8;
  static const double lg = 12;
  static const double xl = 16;

  static BorderRadius get smAll => BorderRadius.circular(sm);
  static BorderRadius get mdAll => BorderRadius.circular(md);
  static BorderRadius get lgAll => BorderRadius.circular(lg);
  static BorderRadius get xlAll => BorderRadius.circular(xl);
}

class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
}

class AppShadows {
  static List<BoxShadow> get card => const [
    BoxShadow(color: Colors.black26, blurRadius: 8, offset: Offset(0, 2)),
  ];
  static List<BoxShadow> get subtle => const [
    BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
  ];
}

class AppTheme {
  static ThemeData get dark {
    final base = ThemeData.dark(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.accent,
        onPrimary: Color(0xFF121212),
        surface: AppColors.card,
        onSurface: AppColors.text,
        error: AppColors.red,
      ),
      textTheme: base.textTheme.copyWith(
        bodyLarge: const TextStyle(fontFamily: 'Inter', color: AppColors.text),
        bodyMedium: const TextStyle(fontFamily: 'Inter', color: AppColors.text),
        bodySmall: const TextStyle(fontFamily: 'Inter', color: AppColors.textMuted),
        titleLarge: const TextStyle(fontFamily: 'Inter', color: AppColors.text, fontWeight: FontWeight.w600),
        titleMedium: const TextStyle(fontFamily: 'Inter', color: AppColors.text, fontWeight: FontWeight.w600),
        titleSmall: const TextStyle(fontFamily: 'Inter', color: AppColors.text, fontWeight: FontWeight.w600),
        labelLarge: const TextStyle(fontFamily: 'Inter', color: AppColors.textMuted, fontWeight: FontWeight.w600),
        labelMedium: const TextStyle(fontFamily: 'Inter', color: AppColors.textMuted, fontWeight: FontWeight.w500),
        labelSmall: const TextStyle(fontFamily: 'Inter', color: AppColors.textFaint, fontWeight: FontWeight.w500, letterSpacing: 0.6),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.text,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: AppColors.text,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          fontFamily: 'Inter',
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.mdAll,
          side: const BorderSide(color: AppColors.border),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0x99000000),
        hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: const BorderSide(color: AppColors.accent, width: 1),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: const BorderSide(color: AppColors.red),
        ),
      ),
      dividerTheme: const DividerThemeData(color: AppColors.borderSoft),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.accent,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.cardRaised,
        contentTextStyle: const TextStyle(color: AppColors.text, fontSize: 13),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: AppRadius.mdAll),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.card,
        selectedItemColor: AppColors.accent,
        unselectedItemColor: AppColors.textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      listTileTheme: const ListTileThemeData(
        textColor: AppColors.text,
        iconColor: AppColors.textMuted,
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.card,
        shape: RoundedRectangleBorder(borderRadius: AppRadius.lgAll),
        titleTextStyle: const TextStyle(
          color: AppColors.text,
          fontSize: 16,
          fontWeight: FontWeight.w600,
          fontFamily: 'Inter',
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.card,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg)),
        ),
      ),
      tabBarTheme: TabBarThemeData(
        labelColor: AppColors.accent,
        unselectedLabelColor: AppColors.textMuted,
        dividerColor: AppColors.border,
      ),
    );
  }
}

/// Accent-filled primary button, matching the web admin's CTA style.
class AccentButton extends StatelessWidget {
  const AccentButton({
    super.key,
    required this.child,
    this.onPressed,
    this.height = 46,
    this.padding,
    this.backgroundColor,
  });

  final Widget child;
  final VoidCallback? onPressed;
  final double height;
  final EdgeInsetsGeometry? padding;
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    return Opacity(
      opacity: enabled ? 1 : 0.5,
      child: Material(
        color: backgroundColor ?? AppColors.accent,
        borderRadius: AppRadius.mdAll,
        child: InkWell(
          onTap: onPressed,
          borderRadius: AppRadius.mdAll,
          child: Container(
            height: height,
            padding: padding,
            alignment: Alignment.center,
            child: DefaultTextStyle.merge(
              style: const TextStyle(
                color: Color(0xFF121212),
                fontSize: 13,
                fontWeight: FontWeight.w600,
                fontFamily: 'Inter',
              ),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}

/// Outlined secondary button, matching the web admin's ghost style.
class GhostButton extends StatelessWidget {
  const GhostButton({
    super.key,
    required this.child,
    this.onPressed,
    this.height = 46,
    this.borderColor,
    this.textColor,
  });

  final Widget child;
  final VoidCallback? onPressed;
  final double height;
  final Color? borderColor;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    return Opacity(
      opacity: enabled ? 1 : 0.5,
      child: Material(
        color: Colors.transparent,
        borderRadius: AppRadius.mdAll,
        child: InkWell(
          onTap: onPressed,
          borderRadius: AppRadius.mdAll,
          child: Container(
            height: height,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              border: Border.all(color: borderColor ?? AppColors.border),
              borderRadius: AppRadius.mdAll,
            ),
            child: DefaultTextStyle.merge(
              style: TextStyle(
                color: textColor ?? AppColors.textMuted,
                fontSize: 13,
                fontWeight: FontWeight.w600,
                fontFamily: 'Inter',
              ),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}

/// Haptic feedback wrapper — call on taps, selections, and key interactions.
class Haptic {
  /// Light tap — tab switches, card taps, filter chips.
  static void tap() => HapticFeedback.lightImpact();

  /// Medium — long press, bulk select toggle.
  static void medium() => HapticFeedback.mediumImpact();

  /// Success — pull-to-refresh complete, action completed.
  static void success() => HapticFeedback.heavyImpact();
}
