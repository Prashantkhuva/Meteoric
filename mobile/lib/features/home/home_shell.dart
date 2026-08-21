import 'package:flutter/material.dart';

import '../../core/theme.dart';
import '../../core/updater.dart';
import '../dashboard/dashboard_screen.dart';
import '../leads/leads_screen.dart';
import '../clients/clients_screen.dart';
import '../more/more_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  AppUpdate? _update;
  double? _progress;
  String? _error;

  static const _tabs = [
    DashboardScreen(),
    LeadsScreen(),
    ClientsScreen(),
    MoreScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _checkForUpdate();
  }

  Future<void> _checkForUpdate() async {
    final update = await Updater.checkForUpdate();
    if (mounted && update != null) setState(() => _update = update);
  }

  Future<void> _downloadAndInstall() async {
    if (_update == null || _progress != null) return;
    setState(() {
      _progress = 0;
      _error = null;
    });
    try {
      final path = await Updater.download(
        _update!,
        onProgress: (p) {
          if (mounted) setState(() => _progress = p);
        },
      );
      await Updater.install(path);
      if (mounted) setState(() => _progress = null);
    } catch (err) {
      if (mounted) {
        setState(() {
          _progress = null;
          _error =
              'Install failed. Allow "Install unknown apps" for Meteoric '
              'Admin in Android settings, then retry.';
        });
      }
    }
  }

  void _dismiss() => setState(() {
    _update = null;
    _progress = null;
    _error = null;
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: IndexedStack(index: _index, children: _tabs),
          ),
          if (_update != null) _buildUpdateBanner(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
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
  }

  Widget _buildUpdateBanner() {
    final downloading = _progress != null;
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
                    onTap: _dismiss,
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
              'Version ${_update!.version} is ready to install.',
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 13,
                fontFamily: 'Inter',
              ),
            ),
            if (_error != null) ...[
              const SizedBox(height: 6),
              Text(
                _error!,
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
                  value: _progress!.clamp(0.0, 1.0),
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
                  onPressed: _downloadAndInstall,
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
