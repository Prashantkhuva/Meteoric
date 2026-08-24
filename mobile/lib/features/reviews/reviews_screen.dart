import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/error_views.dart';
import '../../shared/widgets/filter_bar.dart';

class ReviewsScreen extends StatefulWidget {
  const ReviewsScreen({super.key});

  @override
  State<ReviewsScreen> createState() => _ReviewsScreenState();
}

class _ReviewsScreenState extends State<ReviewsScreen> {
  static const _pageSize = 15;

  List<Map<String, dynamic>> _reviews = [];
  int _total = 0;
  int _page = 1;
  String _status = 'all';
  String _sort = 'newest';
  bool _loading = true;
  Object? _error;

  final _search = TextEditingController();
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _search.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      // Server expects col/dir ordering params (see resolveOrder in
      // app/admin/actions.js) — map our sort presets onto them.
      final (col, dir) = switch (_sort) {
        'oldest' => ('created_at', 'asc'),
        'rating' => ('rating', 'desc'),
        _ => ('created_at', 'desc'),
      };
      final res = await ApiClient.instance.reviewsList({
        'page': _page,
        'pageSize': _pageSize,
        'search': _search.text.trim(),
        'status': _status,
        'col': col,
        'dir': dir,
      });
      if (mounted) {
        setState(() {
          _reviews = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _total = (res['total'] as num?)?.toInt() ?? 0;
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

  void _onSearchChanged(String _) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _page = 1;
      _load();
    });
  }

  Future<void> _action(int id, String action, {bool? verified}) async {
    try {
      final res = action == 'verified'
          ? await ApiClient.instance.reviewVerified(id, verified ?? true)
          : await ApiClient.instance.reviewStatus(id, action);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(
          action == 'verified'
              ? (verified == true ? 'Marked verified' : 'Marked unverified')
              : switch (action) {
                  'approved' => 'Review approved',
                  'rejected' => 'Review rejected',
                  _ => 'Review set to pending',
                },
        );
        _load();
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    }
  }

  Future<void> _delete(int id) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete review'),
        content: const Text('Delete this review? This cannot be undone.'),
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
      final res = await ApiClient.instance.reviewDelete(id);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack('Review deleted');
        _load();
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    }
  }

  void _snack(String msg, {bool isError = false}) =>
      isError ? Toast.error(context, msg) : Toast.success(context, msg);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reviews'),
        automaticallyImplyLeading: false,
        actions: [
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
            child: TextField(
              controller: _search,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Search name, email, company...',
                prefixIcon: const Icon(
                  Icons.search,
                  size: 18,
                  color: AppColors.textFaint,
                ),
                suffixIcon: _search.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(
                          Icons.close,
                          size: 16,
                          color: AppColors.textMuted,
                        ),
                        onPressed: () {
                          _search.clear();
                          _page = 1;
                          _load();
                        },
                      )
                    : null,
              ),
            ),
          ),
          FilterBar(
            groups: [
              FilterGroup(
                key: 'status',
                label: 'Status',
                options: const [
                  MapEntry('pending', 'Pending'),
                  MapEntry('approved', 'Approved'),
                  MapEntry('rejected', 'Rejected'),
                ],
              ),
              FilterGroup(
                key: 'sort',
                label: 'Sort',
                options: const [
                  MapEntry('newest', 'Newest'),
                  MapEntry('oldest', 'Oldest'),
                  MapEntry('rating', 'Rating high–low'),
                ],
              ),
            ],
            values: {'status': _status, 'sort': _sort},
            onChanged: (v) {
              setState(() {
                _status = v['status'] ?? 'all';
                _sort = v['sort'] ?? 'newest';
              });
              _page = 1;
              _load();
            },
          ),
          const SizedBox(height: 4),
          Expanded(child: _buildList()),
        ],
      ),
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

  Widget _buildList() {
    if (_loading) return const LoadingView();
    if (_error != null) return ErrorStateView(error: _error, onRetry: _load);
    if (_reviews.isEmpty) {
      return const EmptyState(
        message: 'No reviews found.',
        icon: Icons.star_outline,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        itemCount: _reviews.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) => _ReviewCard(
          review: _reviews[i],
          onVerified: (v) => _action(
            (_reviews[i]['id'] as num).toInt(),
            'verified',
            verified: v,
          ),
          onStatus: (s) => _action((_reviews[i]['id'] as num).toInt(), s),
          onDelete: () => _delete((_reviews[i]['id'] as num).toInt()),
        ),
      ),
    );
  }
}

class _ReviewCard extends StatelessWidget {
  const _ReviewCard({
    required this.review,
    required this.onVerified,
    required this.onStatus,
    required this.onDelete,
  });

  final Map<String, dynamic> review;
  final ValueChanged<bool> onVerified;
  final ValueChanged<String> onStatus;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final name = review['name'] ?? '—';
    final rating = (review['rating'] as num?)?.toInt() ?? 0;
    final isVerified = review['is_verified'] == true;
    final status = review['status'] ?? 'pending';

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
                  name,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
              StatusBadge(meta: Status.get(Status.reviews, status)),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              for (var s = 1; s <= 5; s++)
                Icon(
                  s <= rating ? Icons.star : Icons.star_border,
                  size: 15,
                  color: s <= rating
                      ? const Color(0xFFF5C451)
                      : AppColors.textFaint,
                ),
              const Spacer(),
              if (isVerified)
                const Row(
                  children: [
                    Icon(Icons.verified, size: 13, color: AppColors.accent),
                    SizedBox(width: 3),
                    Text(
                      'VERIFIED',
                      style: TextStyle(
                        color: AppColors.accent,
                        fontSize: 9,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            review['content'] ?? '',
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              height: 1.5,
              fontFamily: 'Inter',
            ),
            maxLines: 5,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 10),
          Text(
            Fmt.date(review['created_at'] as String?),
            style: const TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _chip(
                isVerified ? 'UNVERIFY' : 'VERIFY',
                isVerified ? AppColors.textMuted : AppColors.accent,
                () => onVerified(!isVerified),
              ),
              if (status != 'approved')
                _chip(
                  'APPROVE',
                  const Color(0xFF4CAF50),
                  () => onStatus('approved'),
                ),
              if (status != 'rejected')
                _chip('REJECT', AppColors.red, () => onStatus('rejected')),
              if (status != 'pending')
                _chip(
                  'SET PENDING',
                  AppColors.textMuted,
                  () => onStatus('pending'),
                ),
              _chip('DELETE', AppColors.red, onDelete),
            ],
          ),
        ],
      ),
    );
  }

  Widget _chip(String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          border: Border.all(color: color.withValues(alpha: 0.4)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: color,
            fontSize: 10,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
        ),
      ),
    );
  }
}
