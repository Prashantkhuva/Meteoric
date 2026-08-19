import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../proposals/proposals_screen.dart';
import '../invoices/invoices_screen.dart';
import '../projects/projects_screen.dart';
import '../reviews/reviews_screen.dart';
import '../bookings/bookings_screen.dart';
import '../bank_accounts/bank_accounts_screen.dart';
import '../email/email_screen.dart';
import '../settings/settings_screen.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  static const _items = [
    _Item('Proposals', Icons.description_outlined, ProposalsScreen()),
    _Item('Invoices', Icons.receipt_long_outlined, InvoicesScreen()),
    _Item('Projects', Icons.folder_outlined, ProjectsScreen()),
    _Item('Reviews', Icons.star_outline, ReviewsScreen()),
    _Item('Bookings', Icons.event_outlined, BookingsScreen()),
    _Item('Bank Accounts', Icons.account_balance_outlined, BankAccountsScreen()),
    _Item('Email', Icons.mail_outline, EmailScreen()),
    _Item('Settings', Icons.settings_outlined, SettingsScreen()),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('More'),
        automaticallyImplyLeading: false,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _items.length,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (context, i) {
          final item = _items[i];
          return Material(
            color: AppColors.card,
            child: InkWell(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => item.screen),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(border: Border.all(color: AppColors.border)),
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
                    const Icon(Icons.chevron_right, size: 18, color: AppColors.textFaint),
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