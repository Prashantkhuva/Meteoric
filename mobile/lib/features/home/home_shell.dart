import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/biometric_service.dart';
import '../../core/notification_state.dart';
import '../../core/pin_lock_service.dart';
import '../../core/theme.dart';
import '../../core/update_state.dart';
import '../../shared/widgets/update_dialog.dart';
import '../dashboard/dashboard_screen.dart';
import '../leads/leads_screen.dart';
import '../proposals/proposals_screen.dart';
import '../invoices/invoices_screen.dart';
import '../more/more_screen.dart';
import 'app_lock_view.dart';
import 'home_tab.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> with WidgetsBindingObserver {
  final _updater = UpdateState.instance;
  final _notif = NotificationState.instance;
  bool _apkDialogShown = false;
  bool _locked = false;
  DateTime? _lastBiometricAuth;

  static const _tabs = [
    DashboardScreen(),
    LeadsScreen(),
    ProposalsScreen(),
    InvoicesScreen(),
    MoreScreen(),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _updater.addListener(_onUpdateState);
    _notif.addListener(_onUpdateState);
    _notif.startPolling();
    _updater.checkAll();
    _updater.addListener(_onForceUpgrade);
    _checkBiometricOnResume();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _updater.removeListener(_onForceUpgrade);
    _notif.stopPolling();
    _notif.removeListener(_onUpdateState);
    _updater.removeListener(_onUpdateState);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _checkBiometricOnResume();
    }
  }

  Future<void> _checkBiometricOnResume() async {
    try {
      // App lock is active when biometric OR PIN is configured. If neither
      // exists, the app is never locked.
      final biometricEnabled = await BiometricService.isEnabled;
      final pinSet = await PinLockService.isSet();
      if (!biometricEnabled && !pinSet) return;

      bool ok = false;
      // Biometric unlocks on its own when available; otherwise fall to PIN
      // by locking the app. The lock view offers both routes when applicable.
      if (biometricEnabled && await BiometricService.isAvailable) {
        if (_lastBiometricAuth != null &&
            DateTime.now().difference(_lastBiometricAuth!) <
                const Duration(seconds: 3)) {
          return;
        }
        ok = await BiometricService.authenticate(
          reason: 'Unlock Meteoric Admin',
        );
        if (ok) {
          _lastBiometricAuth = DateTime.now();
        }
      }
      if (mounted) {
        setState(() => _locked = !ok);
      }
    } catch (e) {
      debugPrint('[HomeShell] _checkBiometricOnResume error: $e');
    }
  }

  void _onUpdateState() {
    if (mounted) setState(() {});
    // Auto-show APK update dialog once (not if user dismissed)
    if (_updater.hasUpdate && !_apkDialogShown && !_updater.dismissed) {
      _apkDialogShown = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && _updater.hasUpdate) {
          UpdateDialog.show(context);
        }
      });
    }
    // Auto-start force upgrade download
    if (_updater.forceUpgrade &&
        !_updater.downloading &&
        _updater.update != null) {
      _updater.downloadAndInstall();
    }
  }

  void _onForceUpgrade() {
    if (_updater.forceUpgrade &&
        !_updater.downloading &&
        _updater.update != null) {
      _updater.downloadAndInstall();
    }
  }

  void _showRestartOverlay() {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => _RestartCountdown(
        onComplete: () {
          Navigator.of(ctx).pop();
          SystemNavigator.pop();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: homeTab,
      builder: (context, index, _) {
        return Scaffold(
          body: Stack(
            children: [
              Column(
                children: [
                  Expanded(
                    child: IndexedStack(index: index, children: _tabs),
                  ),
                  if (_updater.showShorebirdBanner) _buildShorebirdBanner(),
                ],
              ),
              if (_locked)
                AppLockView(
                  autoBiometric: true,
                  onUnlocked: () {
                    _lastBiometricAuth = DateTime.now();
                    setState(() => _locked = false);
                  },
                ),
            ],
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: index,
            onTap: (i) {
              Haptic.tap();
              homeTab.value = i;
            },
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined, size: 22),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_search_outlined, size: 22),
                label: 'Leads',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.description_outlined, size: 22),
                label: 'Proposals',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.receipt_long_outlined, size: 22),
                label: 'Invoices',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.grid_view_outlined, size: 22),
                label: 'More',
              ),
            ],
          ),
        );
      },
    );
  }

  /// Compact Shorebird patch banner — sits above the bottom nav.
  Widget _buildShorebirdBanner() {
    final updating = _updater.shorebirdUpdating;
    final restartReady = _updater.shorebirdRestartReady;
    final error = _updater.shorebirdError;

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.card,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      padding: EdgeInsets.fromLTRB(
        16,
        12,
        16,
        12 + MediaQuery.of(context).padding.bottom,
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (restartReady) ...[
              Row(
                children: [
                  const Icon(
                    Icons.check_circle_outline,
                    size: 16,
                    color: AppColors.emerald,
                  ),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'Update ready — restart to apply',
                      style: TextStyle(
                        color: AppColors.text,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: _updater.dismissShorebird,
                    child: const Icon(
                      Icons.close,
                      size: 16,
                      color: AppColors.textFaint,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: AccentButton(
                  height: 38,
                  onPressed: () {
                    // Show restart confirmation dialog
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Restart App'),
                        content: const Text(
                          'The app will restart to apply the update.',
                          style: TextStyle(
                            color: AppColors.textMuted,
                            fontFamily: 'Inter',
                          ),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.of(ctx).pop(),
                            child: const Text('LATER'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.of(ctx).pop();
                              _showRestartOverlay();
                            },
                            child: const Text('RESTART'),
                          ),
                        ],
                      ),
                    );
                  },
                  child: const Text('APPLY & RESTART'),
                ),
              ),
            ] else if (updating) ...[
              Row(
                children: [
                  const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.accent,
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Applying update...',
                      style: TextStyle(
                        color: AppColors.text,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                ],
              ),
            ] else if (error != null) ...[
              Row(
                children: [
                  const Icon(
                    Icons.error_outline,
                    size: 16,
                    color: AppColors.red,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      error,
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 12,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: _updater.dismissShorebird,
                    child: const Icon(
                      Icons.close,
                      size: 16,
                      color: AppColors.textFaint,
                    ),
                  ),
                ],
              ),
            ] else ...[
              // Patch available — compact banner
              Row(
                children: [
                  const Icon(
                    Icons.system_update_outlined,
                    size: 16,
                    color: AppColors.accent,
                  ),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'Patch available',
                      style: TextStyle(
                        color: AppColors.text,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: _updater.dismissShorebird,
                    child: const Icon(
                      Icons.close,
                      size: 16,
                      color: AppColors.textFaint,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: GhostButton(
                      height: 36,
                      onPressed: _updater.dismissShorebird,
                      child: const Text('LATER'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AccentButton(
                      height: 36,
                      onPressed: () => _updater.applyShorebirdPatch(),
                      child: const Text('APPLY'),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _RestartCountdown extends StatefulWidget {
  final VoidCallback onComplete;
  const _RestartCountdown({required this.onComplete});

  @override
  State<_RestartCountdown> createState() => _RestartCountdownState();
}

class _RestartCountdownState extends State<_RestartCountdown> {
  int _seconds = 2;

  @override
  void initState() {
    super.initState();
    _tick();
  }

  void _tick() {
    if (_seconds <= 0) {
      widget.onComplete();
      return;
    }
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() => _seconds--);
        _tick();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Dialog(
        backgroundColor: AppColors.card,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.border),
        ),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  color: AppColors.accent,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Restarting...',
                style: TextStyle(
                  color: AppColors.text,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Inter',
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'App will restart in $_seconds...',
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 13,
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
