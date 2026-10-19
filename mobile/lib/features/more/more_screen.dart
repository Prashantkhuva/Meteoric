import 'package:flutter/material.dart';

import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../clients/clients_screen.dart';
import '../projects/projects_screen.dart';
import '../reviews/reviews_screen.dart';
import '../bookings/bookings_screen.dart';
import '../bank_accounts/bank_accounts_screen.dart';
import '../email/email_screen.dart';
import '../users/users_screen.dart';
import '../settings/settings_screen.dart';
import '../linear/linear_issues_screen.dart';
import '../search/global_search_screen.dart';
import 'report_issue_screen.dart';

class MoreScreen extends StatefulWidget {
  const MoreScreen({super.key});

  @override
  State<MoreScreen> createState() => _MoreScreenState();
}

class _MoreScreenState extends State<MoreScreen> {
  bool _canManageUsers = false;

  @override
  void initState() {
    super.initState();
    _loadRole();
  }

  Future<void> _loadRole() async {
    final roleRow = await AuthService.myRole;
    if (mounted) {
      setState(() => _canManageUsers = roleRow?['can_manage_users'] ?? false);
    }
  }

  void _open(Widget screen) {
    Haptic.tap();
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => screen));
  }

  @override
  Widget build(BuildContext context) {
    final groups = [
      _Group('WORK', [
        _Item('Clients', Icons.people_outline, () => const ClientsScreen()),
        _Item('Projects', Icons.folder_outlined, () => const ProjectsScreen()),
        _Item('Bookings', Icons.event_outlined, () => const BookingsScreen()),
        _Item('Reviews', Icons.star_outline, () => const ReviewsScreen()),
      ]),
      _Group('COMMS & DOCS', [
        _Item('Email', Icons.mail_outline, () => const EmailScreen()),
        _Item(
          'Bank Accounts',
          Icons.account_balance_outlined,
          () => const BankAccountsScreen(),
        ),
      ]),
      _Group('BUILD', [
        _Item(
          'Issues',
          Icons.code_outlined,
          () => const LinearIssuesScreen(),
        ),
        _Item(
          'Report Issue',
          Icons.bug_report_outlined,
          () => const ReportIssueScreen(),
        ),
      ]),
      _Group('SYSTEM', [
        if (_canManageUsers)
          _Item('Team', Icons.group_outlined, () => const UsersScreen()),
        _Item('Settings', Icons.settings_outlined, () => const SettingsScreen()),
      ]),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('More'),
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          // Search — most frequent action first (Fitts), opens global search.
          Semantics(
            button: true,
            label: 'Search everything',
            child: Material(
              color: AppColors.card,
              borderRadius: AppRadius.pillAll,
              child: InkWell(
                borderRadius: AppRadius.pillAll,
                onTap: () => _open(const GlobalSearchScreen()),
                child: Container(
                  height: 44,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.border),
                    borderRadius: AppRadius.pillAll,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.search_outlined,
                        size: 17,
                        color: AppColors.textFaint,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Search everything',
                          style: TextStyle(
                            color: AppColors.textFaint,
                            fontSize: 14,
                            fontFamily: 'Satoshi',
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          for (final group in groups) ...[
            const SizedBox(height: 24),
            _SectionLabel(group.label),
            const SizedBox(height: 8),
            _GroupCard(
              items: group.items,
              onTap: _open,
            ),
          ],
        ],
      ),
    );
  }
}

class _Group {
  const _Group(this.label, this.items);
  final String label;
  final List<_Item> items;
}

class _Item {
  const _Item(this.label, this.icon, this.screen);
  final String label;
  final IconData icon;
  final Widget Function() screen;
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(
        color: AppColors.textFaint,
        fontSize: 10,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.4,
        fontFamily: 'Satoshi',
      ),
    );
  }
}

class _GroupCard extends StatelessWidget {
  const _GroupCard({required this.items, required this.onTap});

  final List<_Item> items;
  final void Function(Widget screen) onTap;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: AppRadius.lgAll,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          for (var i = 0; i < items.length; i++) ...[
            if (i > 0)
              Padding(
                padding: const EdgeInsets.only(left: 66),
                child: Divider(height: 1, color: AppColors.borderSoft),
              ),
            _Row(item: items[i], onTap: onTap),
          ],
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.item, required this.onTap});

  final _Item item;
  final void Function(Widget screen) onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: item.label,
      child: InkWell(
        onTap: () {
          Haptic.tap();
          onTap(item.screen());
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppColors.textFaint.withValues(alpha: 0.06),
                  borderRadius: AppRadius.smAll,
                  border: Border.all(
                    color: AppColors.textFaint.withValues(alpha: 0.12),
                  ),
                ),
                child: Icon(item.icon, size: 16, color: AppColors.textMuted),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  item.label,
                  style: TextStyle(
                    color: AppColors.text,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    fontFamily: 'Satoshi',
                  ),
                ),
              ),
              Icon(
                Icons.chevron_right,
                size: 18,
                color: AppColors.textFaint,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
