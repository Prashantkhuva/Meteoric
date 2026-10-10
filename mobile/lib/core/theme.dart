import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Meteoric design tokens — mirror of the web admin, premium-tuned.
class AppColors {
  static const Color background = Color(0xFF070707);
  static const Color card = Color(0xFF0A0A0A);
  static const Color cardRaised = Color(0xFF121212);
  static const Color overlay = Color(0xFF1A1A1A); // top of surface ladder
  static const Color border = Color(0x14FFFFFF); // white @ 8%
  static const Color borderSoft = Color(0x0DFFFFFF); // white @ 5%
  static const Color borderFaint = Color(0x08FFFFFF); // white @ 3%
  static const Color highlight = Color(0x0FFFFFFF); // white @ 6% — top edge
  static const Color text = Color(0xD9FFFFFF); // white @ 85%
  static const Color textMuted = Color(0x80FFFFFF); // white @ 50%
  static const Color textFaint = Color(0x4DFFFFFF); // white @ 30%
  static const Color accent = Color(0xFFEAEFFF);

  static const Color emerald = Color(0xFF34D399);
  static const Color amber = Color(0xFFFBBF24);
  static const Color red = Color(0xFFF87171);
  static const Color sky = Color(0xFF38BDF8);
  static const Color violet = Color(0xFFA78BFA);
  static const Color starGold = Color(0xFFF5C451);

  // Derived tokens
  static const Color onAccent = Color(0xFF121212);
  static const Color inputFill = Color(0x99000000); // black @ 60%
  static const Color inputFillDark = Color(0x08FFFFFF); // white @ 3%
  static const Color pressedFill = Color(0x0FFFFFFF); // white @ 6% — press lift
  static const Color overlayScrim = Color(0x99000000); // black @ 60%

  // Skeleton shimmer
  static const Color shimmerBase = Color(0xFF1A1A1A);
  static const Color shimmerHighlight = Color(0xFF2A2A2A);
}

/// Shared design constants.
class AppRadius {
  static const double xxs = 2;
  static const double sm = 6;
  static const double md = 8;
  static const double lg = 12;
  static const double xl = 16;
  static const double pill = 999;

  static BorderRadius get xxsAll => BorderRadius.circular(xxs);
  static BorderRadius get smAll => BorderRadius.circular(sm);
  static BorderRadius get mdAll => BorderRadius.circular(md);
  static BorderRadius get lgAll => BorderRadius.circular(lg);
  static BorderRadius get xlAll => BorderRadius.circular(xl);
  static BorderRadius get pillAll => BorderRadius.circular(pill);
}

class AppSpacing {
  static const double xs = 4;
  static const double xs2 = 6;
  static const double sm = 8;
  static const double sm2 = 10;
  static const double md = 12;
  static const double md2 = 14;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
}

/// Motion tokens — snappy, 100–220ms, never bouncy.
class AppMotion {
  static const Duration instant = Duration(milliseconds: 100);
  static const Duration fast = Duration(milliseconds: 120);
  static const Duration base = Duration(milliseconds: 180);
  static const Duration slow = Duration(milliseconds: 220);

  static const Curve ease = Curves.easeOutCubic;
  static const Curve emphasized = Curves.easeOutQuint;
  static const Curve enter = Curves.easeOutCubic;
  static const Curve exit = Curves.easeInCubic;

  /// Standard page route: 180ms fade + 12px rise.
  static Route<T> page<T extends Object?>(Widget page) {
    return PageRouteBuilder<T>(
      transitionDuration: base,
      reverseTransitionDuration: fast,
      pageBuilder: (_, _, _) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final curved = CurvedAnimation(
          parent: animation,
          curve: enter,
          reverseCurve: exit,
        );
        return FadeTransition(
          opacity: curved,
          child: SlideTransition(
            position: Tween(
              begin: const Offset(0, 0.03),
              end: Offset.zero,
            ).animate(curved),
            child: child,
          ),
        );
      },
    );
  }
}

/// Luminance-stacked surfaces — brighter = higher. No dark shadows.
class AppElevation {
  /// Flat card: hairline border only.
  static BoxDecoration get card => BoxDecoration(
    color: AppColors.card,
    borderRadius: AppRadius.mdAll,
    border: Border.all(color: AppColors.border),
  );

  /// Raised surface: brighter fill + slightly stronger border.
  static BoxDecoration get raised => BoxDecoration(
    color: AppColors.cardRaised,
    borderRadius: AppRadius.mdAll,
    border: Border.all(color: AppColors.border),
  );

  /// Pressed: surface lifts one rung (brighter).
  static BoxDecoration get pressed => BoxDecoration(
    color: AppColors.overlay,
    borderRadius: AppRadius.mdAll,
    border: Border.all(color: AppColors.borderSoft),
  );

  /// Card with top-edge inset highlight (Linear technique).
  static BoxDecoration get highlighted => BoxDecoration(
    color: AppColors.card,
    borderRadius: AppRadius.mdAll,
    border: const Border(
      top: BorderSide(color: AppColors.highlight),
      left: BorderSide(color: AppColors.borderFaint),
      right: BorderSide(color: AppColors.borderFaint),
      bottom: BorderSide(color: AppColors.border),
    ),
  );
}

/// Typography helpers.
class AppText {
  /// Tabular figures — money, KPIs, dates, counters. Stops width jitter.
  static TextStyle tabular(TextStyle style) =>
      style.copyWith(fontFeatures: [FontFeature.tabularFigures()]);

  /// Weight 510 emphasis (between medium and semibold — Linear trick).
  static final TextStyle emphasis = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.text,
    fontWeight: FontWeight.w500,
    fontFeatures: [
      FontFeature.stylisticSet(3), // single-storey a
    ],
  );
}

class AppShadows {
  /// Deprecated black shadows — kept as no-ops for compile compatibility.
  /// Luminance stacking replaces shadows (see AppElevation).
  static List<BoxShadow> get card => const [];
  static List<BoxShadow> get subtle => const [];
}

class AppTheme {
  static ThemeData get dark {
    final base = ThemeData.dark(useMaterial3: true);
    final interFeatures = <FontFeature>[
      FontFeature.stylisticSet(3), // single-storey a — Linear look
    ];
    TextStyle inter(
      double size, {
      Color? color,
      FontWeight? weight,
      double? height,
      double? spacing,
      List<FontFeature>? features,
    }) => TextStyle(
      fontFamily: 'Inter',
      fontSize: size,
      color: color ?? AppColors.text,
      fontWeight: weight,
      height: height,
      letterSpacing: spacing,
      fontFeatures: features ?? interFeatures,
    );

    return base.copyWith(
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.accent,
        onPrimary: AppColors.onAccent,
        surface: AppColors.card,
        onSurface: AppColors.text,
        error: AppColors.red,
      ),
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: FadeUpwardsPageTransitionsBuilder(),
          TargetPlatform.windows: FadeUpwardsPageTransitionsBuilder(),
          TargetPlatform.macOS: FadeUpwardsPageTransitionsBuilder(),
          TargetPlatform.linux: FadeUpwardsPageTransitionsBuilder(),
        },
      ),
      textTheme: base.textTheme.copyWith(
        bodyLarge: inter(16, color: AppColors.text),
        bodyMedium: inter(14, color: AppColors.text),
        bodySmall: inter(12, color: AppColors.textMuted),
        titleLarge: inter(24, weight: FontWeight.w700, spacing: -0.5),
        titleMedium: inter(16, weight: FontWeight.w600),
        titleSmall: inter(14, weight: FontWeight.w600),
        labelLarge: inter(
          13,
          color: AppColors.textMuted,
          weight: FontWeight.w600,
        ),
        labelMedium: inter(
          11,
          color: AppColors.textMuted,
          weight: FontWeight.w500,
        ),
        labelSmall: inter(
          9,
          color: AppColors.textFaint,
          weight: FontWeight.w600,
          spacing: 1.2,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.text,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: inter(18, weight: FontWeight.w600, spacing: -0.2),
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
        fillColor: AppColors.inputFill,
        hintStyle: inter(14, color: AppColors.textMuted),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md2,
          vertical: AppSpacing.md2,
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
        backgroundColor: AppColors.overlay,
        contentTextStyle: inter(13),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: AppRadius.lgAll),
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
        backgroundColor: AppColors.cardRaised,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.xlAll,
          side: const BorderSide(color: AppColors.border),
        ),
        titleTextStyle: inter(16, weight: FontWeight.w600),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.cardRaised,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppRadius.xl),
          ),
        ),
      ),
      tabBarTheme: TabBarThemeData(
        labelColor: AppColors.accent,
        unselectedLabelColor: AppColors.textMuted,
        dividerColor: AppColors.border,
        indicatorColor: AppColors.accent,
      ),
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: AppColors.accent,
        selectionColor: AppColors.accent.withValues(alpha: 0.25),
        selectionHandleColor: AppColors.accent,
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
      child: Pressable(
        onPressed: onPressed,
        borderRadius: AppRadius.mdAll,
        child: Container(
          height: height,
          padding: padding,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: backgroundColor ?? AppColors.accent,
            borderRadius: AppRadius.mdAll,
          ),
          child: DefaultTextStyle.merge(
            style: const TextStyle(
              color: AppColors.onAccent,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              fontFamily: 'Inter',
            ),
            child: child,
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
      child: Pressable(
        onPressed: onPressed,
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
    );
  }
}

/// Press interaction: 0.98 scale + surface lift + haptic. Snappy 120ms.
class Pressable extends StatefulWidget {
  const Pressable({
    super.key,
    required this.child,
    this.onPressed,
    this.onLongPress,
    this.borderRadius,
    this.haptic = true,
    this.scale = 0.98,
  });

  final Widget child;
  final VoidCallback? onPressed;
  final VoidCallback? onLongPress;
  final BorderRadius? borderRadius;
  final bool haptic;
  final double scale;

  @override
  State<Pressable> createState() => _PressableState();
}

class _PressableState extends State<Pressable> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final content = AnimatedScale(
      scale: _pressed ? widget.scale : 1,
      duration: AppMotion.fast,
      curve: AppMotion.ease,
      child: widget.child,
    );
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: widget.onPressed == null
          ? null
          : () {
              if (widget.haptic) Haptic.tap();
              widget.onPressed?.call();
            },
      onLongPress: widget.onLongPress == null
          ? null
          : () {
              if (widget.haptic) Haptic.medium();
              widget.onLongPress?.call();
            },
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      child: content,
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

/// Wraps child to dismiss keyboard on tap outside text fields.
class UnfocusOnTap extends StatelessWidget {
  const UnfocusOnTap({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      behavior: HitTestBehavior.translucent,
      child: child,
    );
  }
}
