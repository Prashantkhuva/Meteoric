import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/bulk_actions_bar.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/skeleton.dart';
import '../../shared/widgets/error_views.dart';

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
  Object? _error;

  final Set<int> _selected = {};
  bool _busy = false;
  int? _expandedId;

  bool get _selecting => _selected.isNotEmpty;

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
          _selected.clear();
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

  int _id(Map<String, dynamic> row) => (row['id'] as num).toInt();

  Future<void> _delete(int id) async {
    final ok = await showAppDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete email'),
        content: const Text('Delete this sent email record?'),
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
      await ApiClient.instance.emailDelete(id);
      if (!mounted) return;
      _snack('Email record deleted');
      _load();
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    }
  }

  Future<void> _bulkDelete() async {
    final ok = await confirmBulkDelete(
      context,
      count: _selected.length,
      label: 'email records',
    );
    if (!ok || !mounted) return;
    setState(() => _busy = true);
    var failed = 0;
    for (final id in _selected.toList()) {
      try {
        await ApiClient.instance.emailDelete(id);
      } catch (_) {
        failed++;
      }
    }
    if (!mounted) return;
    setState(() {
      _busy = false;
      _selected.clear();
    });
    _snack(
      failed == 0 ? 'Deleted successfully' : 'Deleted with $failed failures',
      isError: failed > 0,
    );
    _load();
  }

  void _snack(String msg, {bool isError = false}) =>
      isError ? Toast.error(context, msg) : Toast.success(context, msg);

  String _toLine(Map<String, dynamic> email) {
    final to = email['to_addresses'];
    if (to is! List || to.isEmpty) return '—';
    return to.map((e) => e.toString()).join(', ');
  }

  List<Map<String, dynamic>> _attachments(Map<String, dynamic> email) {
    final raw = email['attachments'];
    if (raw is! List) return const [];
    return raw.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<void> _openAttachment(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return;
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && mounted) _snack('Could not open attachment', isError: true);
  }

  Widget _metaRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 56,
            child: Text(
              label,
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 11,
                fontFamily: 'Satoshi',
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                fontFamily: 'Satoshi',
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetail(Map<String, dynamic> email) {
    final body = (email['body'] as String?) ?? '';
    final attachments = _attachments(email);
    final status = (email['status'] as String?) ?? '—';
    return Container(
      margin: const EdgeInsets.only(top: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.cardRaised,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _metaRow('From', (email['from_address'] as String?) ?? '—'),
          _metaRow('To', _toLine(email)),
          _metaRow('Date', Fmt.dateTime(email['created_at'] as String?)),
          _metaRow('Status', status),
          const SizedBox(height: 4),
          Text(
            'BODY',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              letterSpacing: 1.1,
              fontFamily: 'Satoshi',
            ),
          ),
          const SizedBox(height: 8),
          if (body.isEmpty)
            Text(
              'No body',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 13,
                fontStyle: FontStyle.italic,
                fontFamily: 'Satoshi',
              ),
            )
          else
            DefaultTextStyle.merge(
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 13,
                height: 1.5,
                fontFamily: 'Satoshi',
              ),
              child: HtmlWidget(
                body,
                onTapUrl: (url) {
                  _openAttachment(url);
                  return true;
                },
              ),
            ),
          if (attachments.isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(
              'ATTACHMENTS',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                letterSpacing: 1.1,
                fontFamily: 'Satoshi',
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final att in attachments)
                  InkWell(
                    onTap: () {
                      final url = att['url'];
                      if (url is String && url.isNotEmpty) {
                        _openAttachment(url);
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.attach_file,
                            size: 13,
                            color: AppColors.textFaint,
                          ),
                          const SizedBox(width: 6),
                          ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 180),
                            child: Text(
                              (att['name'] as String?) ?? 'Attachment',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: AppColors.textMuted,
                                fontSize: 12,
                                fontFamily: 'Satoshi',
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _selecting
            ? Text('${_selected.length} selected')
            : const Text('Sent emails'),
        automaticallyImplyLeading: false,
        leading: _selecting
            ? IconButton(
                icon: Icon(Icons.close, size: 20, color: AppColors.textMuted),
                onPressed: () => setState(_selected.clear),
              )
            : null,
        actions: _selecting
            ? [
                IconButton(
                  icon: Icon(
                    _selected.length == _emails.length
                        ? Icons.check_box_outlined
                        : Icons.check_box_outline_blank,
                    size: 19,
                    color: AppColors.accent,
                  ),
                  onPressed: () => setState(() {
                    if (_selected.length == _emails.length) {
                      _selected.clear();
                    } else {
                      _selected
                        ..clear()
                        ..addAll(_emails.map(_id));
                    }
                  }),
                  tooltip: 'Select all',
                ),
              ]
            : null,
      ),
      body: _buildBody(),
      bottomNavigationBar: _selecting
          ? BulkActionBar(
              count: _selected.length,
              busy: _busy,
              onClear: () => setState(_selected.clear),
              onDelete: _bulkDelete,
            )
          : (_total > _pageSize
                ? PaginationBar(
                    page: _page,
                    total: _total,
                    pageSize: _pageSize,
                    onPageChanged: (p) {
                      setState(() => _page = p);
                      _load();
                    },
                  )
                : null),
    );
  }

  Widget _buildBody() {
    if (_loading) return const SkeletonList();
    if (_error != null) return ErrorStateView(error: _error, onRetry: _load);
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
          final id = _id(email);
          final isSelected = _selected.contains(id);
          return InkWell(
            onTap: () {
              if (_selecting) {
                setState(
                  () => isSelected ? _selected.remove(id) : _selected.add(id),
                );
              } else {
                setState(() => _expandedId = _expandedId == id ? null : id);
              }
            },
            onLongPress: () => setState(() => _selected.add(id)),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                border: Border.all(
                  color: isSelected
                      ? AppColors.accent.withValues(alpha: 0.5)
                      : AppColors.border,
                ),
                color: isSelected ? AppColors.cardRaised : AppColors.card,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    email['subject'] ?? '—',
                                    style: TextStyle(
                                      color: AppColors.text,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      fontFamily: 'Satoshi',
                                    ),
                                  ),
                                ),
                                if (!_selecting &&
                                    _attachments(email).isNotEmpty) ...[
                                  const SizedBox(width: 6),
                                  Icon(
                                    Icons.attach_file,
                                    size: 13,
                                    color: AppColors.textFaint,
                                  ),
                                ],
                                if (!_selecting)
                                  GestureDetector(
                                    onTap: () => _delete(id),
                                    child: Icon(
                                      Icons.delete_outline,
                                      size: 15,
                                      color: AppColors.textFaint,
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'To: ${_toLine(email)}',
                              style: TextStyle(
                                color: AppColors.textMuted,
                                fontSize: 12,
                                fontFamily: 'Satoshi',
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              Fmt.dateTime(email['created_at'] as String?),
                              style: TextStyle(
                                color: AppColors.textFaint,
                                fontSize: 10,
                                fontFamily: 'Satoshi',
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (_selecting) ...[
                        const SizedBox(width: 10),
                        Icon(
                          isSelected
                              ? Icons.check_box
                              : Icons.check_box_outline_blank,
                          size: 20,
                          color: isSelected
                              ? AppColors.accent
                              : AppColors.textFaint,
                        ),
                      ],
                    ],
                  ),
                  if (_expandedId == id) _buildDetail(email),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
