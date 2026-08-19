import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';

class SentEmailsScreen extends StatefulWidget {
  const SentEmailsScreen({super.key});

  @override
  State<SentEmailsScreen> createState() => _SentEmailsScreenState();
}

class _SentEmailsScreenState extends State<SentEmailsScreen> {
  static const _pageSize = 15;

  List<Map<String, dynamic>> _emails = [];
  int _total = 0;
  int _page = 1;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await ApiClient.instance.emailSent(_page, _pageSize);
      if (mounted) {
        setState(() {
          _emails = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _total = (res['total'] as num?)?.toInt() ?? 0;
          _loading = false;
        });
      }
    } catch (err) {
      if (mounted) {
        setState(() {
          _error = err.toString();
          _loading = false;
        });
      }
    }
  }

  Future<void> _delete(int id) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete email'),
        content: const Text('Delete this sent email record?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
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
      final res = await ApiClient.instance.emailDelete(id);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack('Email record deleted');
        _load();
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    }
  }

  void _snack(String msg, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isError ? AppColors.red.withValues(alpha: 0.9) : AppColors.cardRaised,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sent emails')),
      body: _buildBody(),
      bottomNavigationBar: _total > _pageSize
          ? PaginationBar(
              page: _page,
              total: _total,
              pageSize: _pageSize,
              onPageChanged: (p) {
                setState(() => _page = p);
                _load();
              },
            )
          : null,
    );
  }

  Widget _buildBody() {
    if (_loading) return const LoadingView();
    if (_error != null) return ErrorBox(message: _error!, onRetry: _load);
    if (_emails.isEmpty) {
      return const EmptyState(
        message: 'No sent emails yet.',
        icon: Icons.outbox_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _emails.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) {
          final email = _emails[i];
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
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
                        email['subject'] ?? '—',
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => _delete((email['id'] as num).toInt()),
                      child: const Icon(Icons.delete_outline, size: 15, color: AppColors.textFaint),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'To: ${email['recipients'] ?? '—'}',
                  style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Inter'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  Fmt.dateTime(email['created_at'] as String?),
                  style: const TextStyle(color: AppColors.textFaint, fontSize: 10, fontFamily: 'Inter'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}