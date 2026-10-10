import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Dual palette — dark (default) + monochrome light.
/// [AppPalette.current] resolves per active theme mode; [AppColors] reads it.
class AppPalette {
  const AppPalette({
    required this.background,
    required this.card,
    required this.cardRaised,
    required this.overlay,
    required this.border,
    required this.borderSoft,
    required this.borderFaint,
    required this.highlight,
    required this.text,
    required this.textMuted,
    required this.textFaint,
    required this.accent,
    required this.emerald,
    required this.amber,
    required this.red,
    required this.sky,
    required this.violet,
    required this.starGold,
    required this.onAccent,
    required this.inputFill,
    required this.inputFillDark,
    required this.pressedFill,
    required this.overlayScrim,
    required this.shimmerBase,
    required this.shimmerHighlight,
    required this.successTint,
    required this.errorTint,
    required this.infoTint,
  });

  final Color background;
  final Color card;
  final Color cardRaised;
  final Color overlay;
  final Color border;
  final Color borderSoft;
  final Color borderFaint;
  final Color highlight;
  final Color text;
  final Color textMuted;
  final Color textFaint;
  final Color accent;
  final Color emerald;
  final Color amber;
  final Color red;
  final Color sky;
  final Color violet;
  final Color starGold;
  final Color onAccent;
  final Color inputFill;
  final Color inputFillDark;
  final Color pressedFill;
  final Color overlayScrim;
  final Color shimmerBase;
  final Color shimmerHighlight;
  final Color successTint;
  final Color errorTint;
  final Color infoTint;

  static const AppPalette dark = AppPalette(
    background: Color(0xFF070707),
    card: Color(0xFF0E0E10),
    cardRaised: Color(0xFF141416),
    overlay: Color(0xFF1A1A1A),
    border: Color(0x14FFFFFF), // white @ 8%
    borderSoft: Color(0x0DFFFFFF), // white @ 5%
    borderFaint: Color(0x08FFFFFF), // white @ 3%
    highlight: Color(0x0FFFFFFF), // white @ 6% — top edge
    text: Color(0xD9FFFFFF), // white @ 85%
    textMuted: Color(0x80FFFFFF), // white @ 50%
    textFaint: Color(0x4DFFFFFF), // white @ 30%
    accent: Color(0xFFEAEFFF),
    emerald: Color(0xFF34D399),
    amber: Color(0xFFFBBF24),
    red: Color(0xFFF87171),
    sky: Color(0xFF38BDF8),
    violet: Color(0xFFA78BFA),
    starGold: Color(0xFFF5C451),
    onAccent: Color(0xFF121212),
    inputFill: Color(0x99000000),
    inputFillDark: Color(0x08FFFFFF),
    pressedFill: Color(0x0FFFFFFF),
    overlayScrim: Color(0x99000000),
    shimmerBase: Color(0xFF1A1A1A),
    shimmerHighlight: Color(0xFF2A2A2A),
    successTint: Color(0x1A34D399), // emerald @ 10%
    errorTint: Color(0x1AF87171), // red @ 10%
    infoTint: Color(0x1AFFFFFF), // white @ 10%
  );

  /// Monochrome light — black/white grayscale only, plus semantic status hues.
  static const AppPalette light = AppPalette(
    background: Color(0xFFF4F4F5),
    card: Color(0xFFFFFFFF),
    cardRaised: Color(0xFFFFFFFF),
    overlay: Color(0xFFE9E9EB),
    border: Color(0x14000000), // black @ 8%
    borderSoft: Color(0x0D000000), // black @ 5%
    borderFaint: Color(0x08000000), // black @ 3%
    highlight: Color(0x0FFFFFFF), // white @ 6% — top edge lift
    text: Color(0xE6000000), // black @ 90%
    textMuted: Color(0x8C000000), // black @ 55%
    textFaint: Color(0x59000000), // black @ 35%
    accent: Color(0xFF0A0A0A), // pure black primary
    emerald: Color(0xFF059669),
    amber: Color(0xFFD97706),
    red: Color(0xFFDC2626),
    sky: Color(0xFF0284C7),
    violet: Color(0xFF7C3AED),
    starGold: Color(0xFFB45309),
    onAccent: Color(0xFFFFFFFF),
    inputFill: Color(0x0A000000), // black @ 4%
    inputFillDark: Color(0x05000000),
    pressedFill: Color(0x0A000000),
    overlayScrim: Color(0x66000000),
    shimmerBase: Color(0xFFEDEDEF),
    shimmerHighlight: Color(0xFFF8F8F9),
    successTint: Color(0x1A059669),
    errorTint: Color(0x1ADC2626),
    infoTint: Color(0x1A000000),
  );

  static AppPalette current = dark;
}

/// Design tokens — mirror of the web admin, premium-tuned.
/// Static getters resolve against [AppPalette.current]; light/dark aware.
class AppColors {
  static Color get background => AppPalette.current.background;
  static Color get card => AppPalette.current.card;
  static Color get cardRaised => AppPalette.current.cardRaised;
  static Color get overlay => AppPalette.current.overlay;
  static Color get border => AppPalette.current.border;
  static Color get borderSoft => AppPalette.current.borderSoft;
  static Color get borderFaint => AppPalette.current.borderFaint;
  static Color get highlight => AppPalette.current.highlight;
  static Color get text => AppPalette.current.text;
  static Color get textMuted => AppPalette.current.textMuted;
  static Color get textFaint => AppPalette.current.textFaint;
  static Color get accent => AppPalette.current.accent;

  static Color get emerald => AppPalette.current.emerald;
  static Color get amber => AppPalette.current.amber;
  static Color get red => AppPalette.current.red;
  static Color get sky => AppPalette.current.sky;
  static Color get violet => AppPalette.current.violet;
  static Color get starGold => AppPalette.current.starGold;

  // Derived tokens
  static Color get onAccent => AppPalette.current.onAccent;
  static Color get inputFill => AppPalette.current.inputFill;
  static Color get inputFillDark => AppPalette.current.inputFillDark;
  static Color get pressedFill => AppPalette.current.pressedFill;
  static Color get overlayScrim => AppPalette.current.overlayScrim;

  // Skeleton shimmer
  static Color get shimmerBase => AppPalette.current.shimmerBase;
  static Color get shimmerHighlight => AppPalette.current.shimmerHighlight;

  // Toast tints
  static Color get successTint => AppPalette.current.successTint;
  static Color get errorTint => AppPalette.current.errorTint;
  static Color get infoTint => AppPalette.current.infoTint;
}

/// Theme mode controller — system/dark/light, persisted to shared_preferences.
class ThemeController {
  ThemeController._();

  static const String _key = 'theme_mode';
  static final ValueNotifier<ThemeMode> mode = ValueNotifier(ThemeMode.system);

  static Future<void> load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_key);
      mode.value = switch (raw) {
        'dark' => ThemeMode.dark,
        'light' => ThemeMode.light,
        _ => ThemeMode.system,
      };
    } catch (_) {
      mode.value = ThemeMode.system;
    }
    _resolvePalette();
  }

  static Future<void> set(ThemeMode value) async {
    mode.value = value;
    _resolvePalette();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_key, value.name);
    } catch (_) {}
  }

  static bool isDark(BuildContext context) {
    final m = mode.value;
    return m == ThemeMode.dark ||
        (m == ThemeMode.system &&
            MediaQuery.platformBrightnessOf(context) == Brightness.dark);
  }

  static void _resolvePalette() {
    final m = mode.value;
    final platformDark =
        WidgetsBinding.instance.platformDispatcher.platformBrightness ==
        Brightness.dark;
    final dark = m == ThemeMode.dark || (m == ThemeMode.system && platformDark);
    AppPalette.current = dark ? AppPalette.dark : AppPalette.light;
  }
}

/// Shared design constants.
class AppRadius {
  static const double xxs = 2;
  static const double sm = 6;
  static const double md = 10;
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
  /// Flat card: fill + hairline + 1px top highlight (depth via luminance).
  static BoxDecoration get card => BoxDecoration(
    color: AppColors.card,
    borderRadius: AppRadius.mdAll,
    border: Border(
      top: BorderSide(color: AppColors.highlight),
      left: BorderSide(color: AppColors.borderSoft),
      right: BorderSide(color: AppColors.borderSoft),
      bottom: BorderSide(color: AppColors.border),
    ),
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
  static BoxDecoration get highlighted => card;
}

/// Typography helpers.
class AppText {
  /// Tabular figures — money, KPIs, dates, counters. Stops width jitter.
  static TextStyle tabular(TextStyle style) =>
      style.copyWith(fontFeatures: [FontFeature.tabularFigures()]);

  /// Space Grotesk display — headings, KPI values, money, nav labels.
  static TextStyle display(TextStyle style, {bool tabular = true}) =>
      style.copyWith(
        fontFamily: 'Space Grotesk',
        fontFeatures: tabular ? [FontFeature.tabularFigures()] : null,
      );

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
  static ThemeData get dark => _build(isDark: true);
  static ThemeData get light => _build(isDark: false);

  static ThemeData _build({required bool isDark}) {
    final base = isDark
        ? ThemeData.dark(useMaterial3: true)
        : ThemeData.light(useMaterial3: true);
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

    TextStyle display(
      double size, {
      Color? color,
      FontWeight? weight,
      double? height,
      double? spacing,
    }) => TextStyle(
      fontFamily: 'Space Grotesk',
      fontSize: size,
      color: color ?? AppColors.text,
      fontWeight: weight,
      height: height,
      letterSpacing: spacing,
      fontFeatures: [FontFeature.tabularFigures()],
    );

    return base.copyWith(
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: isDark
          ? ColorScheme.dark(
              primary: AppColors.accent,
              onPrimary: AppColors.onAccent,
              surface: AppColors.card,
              onSurface: AppColors.text,
              error: AppColors.red,
            )
          : ColorScheme.light(
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
        displayLarge: display(56, weight: FontWeight.w700, spacing: -1.5),
        displayMedium: display(44, weight: FontWeight.w700, spacing: -1.2),
        displaySmall: display(34, weight: FontWeight.w700, spacing: -0.8),
        headlineLarge: display(30, weight: FontWeight.w700, spacing: -0.6),
        headlineMedium: display(26, weight: FontWeight.w700, spacing: -0.5),
        headlineSmall: display(22, weight: FontWeight.w600, spacing: -0.3),
        titleLarge: display(24, weight: FontWeight.w700, spacing: -0.5),
        titleMedium: display(16, weight: FontWeight.w600),
        titleSmall: display(14, weight: FontWeight.w600),
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
        titleTextStyle: display(18, weight: FontWeight.w600, spacing: -0.2),
      ),
      cardTheme: CardThemeData(
        color: AppColors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.mdAll,
          side: BorderSide(color: AppColors.border),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.inputFillDark,
        hintStyle: inter(14, color: AppColors.textMuted),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md2,
          vertical: AppSpacing.md2,
        ),
        border: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: BorderSide(color: AppColors.accent, width: 1),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: AppRadius.mdAll,
          borderSide: BorderSide(color: AppColors.red),
        ),
      ),
      dividerTheme: DividerThemeData(color: AppColors.borderSoft),
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: AppColors.accent,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.overlay,
        contentTextStyle: inter(13),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: AppRadius.lgAll),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: AppColors.card,
        indicatorColor: isDark
            ? AppColors.accent.withValues(alpha: 0.14)
            : AppColors.accent.withValues(alpha: 0.08),
        height: 72,
        elevation: 0,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(
            size: 22,
            color: selected ? AppColors.accent : AppColors.textMuted,
          );
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return TextStyle(
            fontFamily: 'Space Grotesk',
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: selected ? AppColors.accent : AppColors.textMuted,
          );
        }),
      ),
      listTileTheme: ListTileThemeData(
        textColor: AppColors.text,
        iconColor: AppColors.textMuted,
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.cardRaised,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.xlAll,
          side: BorderSide(color: AppColors.border),
        ),
        titleTextStyle: display(16, weight: FontWeight.w600),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: Colors.transparent,
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
            style: TextStyle(
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
