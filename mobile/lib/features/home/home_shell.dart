import 'package:flutter/material.dart';

import '../../core/notification_state.dart';
import '../../core/theme.dart';
import '../../core/update_state.dart';
import '../dashboard/dashboard_screen.dart';
import '../leads/leads_screen.dart';
import '../clients/clients_screen.dart';
import '../more/more_screen.dart';
import 'home_tab.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  final _updater = UpdateState.instance;
  final _notif = NotificationState.instance;

  static const _tabs = [
    DashboardScreen(),
    LeadsScreen(),
    ClientsScreen(),
    MoreScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _updater.addListener(_onUpdateState);
    _notif.addListener(_onUpdateState);
    // Start global notification polling (heads-up on every screen)
    _notif.startPolling();
    // Check for updates on launch (fire-and-forget)
    _updater.checkForUpdate();
  }

  @override
  void dispose() {
    _notif.stopPolling();
    _notif.removeListener(_onUpdateState);
    _updater.removeListener(_onUpdateState);
    super.dispose();
  }

  void _onUpdateState() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: homeTab,
      builder: (context, index, _) {
        return Scaffold(
          body: Column(
            children: [
              Expanded(
                child: IndexedStack(index: index, children: _tabs),
              ),
              if (_updater.hasUpdate) _buildUpdateBanner(),
            ],
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: index,
            onTap: (i) => homeTab.value = i,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined, size: 22),
                label: 'Dashboard',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_search_outlined, size: 22),
                label: 'Leads',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.people_outline, size: 22),
                label: 'Clients',
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

  Widget _buildUpdateBanner() {
    final update = _updater.update!;
    final downloading = _updater.downloading;
    final progress = _updater.progress;
    final error = _updater.error;

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.card,
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      padding: EdgeInsets.fromLTRB(
        16,
        14,
        16,
        14 + MediaQuery.of(context).padding.bottom,
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'UPDATE AVAILABLE',
                    style: TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.2,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
                if (!downloading)
                  GestureDetector(
                    onTap: _updater.dismiss,
                    child: const Icon(
                      Icons.close,
                      size: 16,
                      color: AppColors.textFaint,
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Version ${update.version} is ready to install.',
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 13,
                fontFamily: 'Inter',
              ),
            ),
            if (update.notes != null && update.notes!.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                update.notes!,
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontFamily: 'Inter',
                  height: 1.4,
                ),
              ),
            ],
            if (error != null) ...[
              const SizedBox(height: 6),
              Text(
                error,
                style: const TextStyle(
                  color: AppColors.red,
                  fontSize: 11,
                  fontFamily: 'Inter',
                ),
              ),
            ],
            const SizedBox(height: 10),
            if (downloading)
              ClipRRect(
                borderRadius: BorderRadius.circular(2),
                child: LinearProgressIndicator(
                  value: (progress ?? 0).clamp(0.0, 1.0),
                  minHeight: 3,
                  backgroundColor: AppColors.border,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    AppColors.accent,
                  ),
                ),
              )
            else
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: _updater.downloadAndInstall,
                  style: TextButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  child: const Text(
                    'DOWNLOAD & INSTALL',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.2,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
