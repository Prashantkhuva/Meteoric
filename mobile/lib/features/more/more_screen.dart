import 'package:flutter/material.dart';

import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../proposals/proposals_screen.dart';
import '../invoices/invoices_screen.dart';
import '../projects/projects_screen.dart';
import '../reviews/reviews_screen.dart';
import '../bookings/bookings_screen.dart';
import '../bank_accounts/bank_accounts_screen.dart';
import '../email/email_screen.dart';
import '../users/users_screen.dart';
import '../settings/settings_screen.dart';

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

  static const _baseItems = [
    _Item('Proposals', Icons.description_outlined, ProposalsScreen()),
    _Item('Invoices', Icons.receipt_long_outlined, InvoicesScreen()),
    _Item('Projects', Icons.folder_outlined, ProjectsScreen()),
    _Item('Reviews', Icons.star_outline, ReviewsScreen()),
    _Item('Bookings', Icons.event_outlined, BookingsScreen()),
    _Item('Bank Accounts', Icons.account_balance_outlined, BankAccountsScreen()),
    _Item('Email', Icons.mail_outline, EmailScreen()),
  ];

  @override
  Widget build(BuildContext context) {
    final items = [
      ..._baseItems,
      if (_canManageUsers)
        const _Item('Team', Icons.group_outlined, UsersScreen()),
      const _Item('Settings', Icons.settings_outlined, SettingsScreen()),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('More'),
        automaticallyImplyLeading: false,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (context, i) {
          final item = items[i];
          return Material(
            color: AppColors.card,
            child: InkWell(
              onTap: () {
                Navigator.of(context)
                    .push(MaterialPageRoute(builder: (_) => item.screen));
              },
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Icon(item.icon, size: 18, color: AppColors.textMuted),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        item.label,
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ),
                    const Icon(
                      Icons.chevron_right,
                      size: 18,
                      color: AppColors.textFaint,
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _Item {
  const _Item(this.label, this.icon, this.screen);
  final String label;
  final IconData icon;
  final Widget screen;
}
