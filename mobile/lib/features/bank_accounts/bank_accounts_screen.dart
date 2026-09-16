import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/skeleton.dart';
import '../../shared/widgets/error_views.dart';
import 'bank_account_form_screen.dart';

class BankAccountsScreen extends StatefulWidget {
  const BankAccountsScreen({super.key});

  @override
  State<BankAccountsScreen> createState() => _BankAccountsScreenState();
}

class _BankAccountsScreenState extends State<BankAccountsScreen> {
  List<Map<String, dynamic>> _accounts = [];
  bool _loading = true;
  Object? _error;
  String _searchQuery = '';
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _filtered {
    if (_searchQuery.isEmpty) return _accounts;
    final q = _searchQuery.toLowerCase();
    return _accounts.where((a) {
      final label = (a['label'] ?? '').toString().toLowerCase();
      final bank = (a['bank_name'] ?? '').toString().toLowerCase();
      final holder = (a['account_holder'] ?? '').toString().toLowerCase();
      return label.contains(q) || bank.contains(q) || holder.contains(q);
    }).toList();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await ApiClient.instance.bankAccountsList();
      if (mounted) {
        setState(() {
          _accounts = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _loading = false;
        });
      }
    } catch (err) {
      if (mounted) {
        setState(() {
          _error = err;
          _loading = false;
        });
      }
    }
  }

  Future<void> _delete(Map<String, dynamic> account) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete bank account'),
        content: Text('Delete "${account['label']}"? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          AccentButton(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            backgroundColor: AppColors.red,
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('DELETE'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    try {
      await ApiClient.instance.bankAccountDelete(
        (account['id'] as num).toInt(),
      );
      if (!mounted) return;
      _snack('Bank account deleted');
      _load();
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    }
  }

  void _snack(String msg, {bool isError = false}) =>
      isError ? Toast.error(context, msg) : Toast.success(context, msg);

  Future<void> _openForm({Map<String, dynamic>? account}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => BankAccountFormScreen(account: account),
      ),
    );
    if (!mounted) return;
    if (changed == true) _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bank Accounts'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, size: 20, color: AppColors.accent),
            onPressed: () => _openForm(),
            tooltip: 'Add bank account',
          ),
          IconButton(
            icon: const Icon(
              Icons.refresh,
              size: 18,
              color: AppColors.textMuted,
            ),
            onPressed: _load,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _buildBody(),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openForm(),
        backgroundColor: AppColors.accent,
         foregroundColor: AppColors.onAccent,
        shape: RoundedRectangleBorder(borderRadius: AppRadius.mdAll),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading) return const SkeletonList();
    if (_error != null) return ErrorStateView(error: _error, onRetry: _load);
    if (_accounts.isEmpty) {
      return const EmptyState(
        message: 'No bank accounts yet. Add one to appear on invoices.',
        icon: Icons.account_balance_outlined,
      );
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: TextField(
            controller: _searchCtrl,
            onChanged: (v) => setState(() => _searchQuery = v),
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 13,
              fontFamily: 'Inter',
            ),
            decoration: InputDecoration(
              hintText: 'Search accounts...',
              hintStyle: TextStyle(
                color: AppColors.text.withValues(alpha: 0.4),
                fontFamily: 'Inter',
              ),
              prefixIcon: const Icon(Icons.search, size: 18),
              prefixIconColor: AppColors.textMuted,
              isDense: true,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 10,
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
                borderSide: const BorderSide(color: AppColors.accent),
              ),
              filled: true,
              fillColor: AppColors.card,
            ),
          ),
        ),
        Expanded(
          child: _filtered.isEmpty
              ? const EmptyState(
                  message: 'No matching accounts.',
                  icon: Icons.search_off,
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  color: AppColors.accent,
                  backgroundColor: AppColors.card,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filtered.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, i) {
                      final account = _filtered[i];
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: AppRadius.mdAll,
              border: Border.all(color: AppColors.border),
              color: AppColors.card,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        account['label'] ?? 'Bank account',
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ),
                    if (account['is_default'] == true)
                      Container(
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withValues(alpha: 0.1),
                          border: Border.all(
                            color: AppColors.accent.withValues(alpha: 0.4),
                          ),
                        ),
                        child: const Text(
                          'DEFAULT',
                          style: TextStyle(
                            color: AppColors.accent,
                            fontSize: 9,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                    GestureDetector(
                      onTap: () => _openForm(account: account),
                      child: const Icon(
                        Icons.edit_outlined,
                        size: 15,
                        color: AppColors.textFaint,
                      ),
                    ),
                    const SizedBox(width: 12),
                    GestureDetector(
                      onTap: () => _delete(account),
                      child: const Icon(
                        Icons.delete_outline,
                        size: 15,
                        color: AppColors.textFaint,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  [
                    account['bank_name'],
                    account['account_holder'],
                  ].where((v) => v != null && '$v'.isNotEmpty).join(' • '),
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 12,
                    fontFamily: 'Inter',
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  [
                    if (account['currency'] != null &&
                        '${account['currency']}'.isNotEmpty)
                      '${account['currency']}',
                    account['account_number'],
                    account['iban'],
                    account['swift'],
                    account['routing_number'],
                    if (account['upi_id'] != null &&
                        '${account['upi_id']}'.isNotEmpty)
                      'UPI ${account['upi_id']}',
                  ].where((v) => v != null && '$v'.isNotEmpty).join(' • '),
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 11,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
          );
        },
      ),
    ),
    ),
    ],
    );
  }
}
