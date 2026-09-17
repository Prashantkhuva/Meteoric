import 'dart:async';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/error_views.dart';
import '../../shared/widgets/skeleton.dart';

class LinearIssuesScreen extends StatefulWidget {
  const LinearIssuesScreen({super.key});

  @override
  State<LinearIssuesScreen> createState() => _LinearIssuesScreenState();
}

class _LinearIssuesScreenState extends State<LinearIssuesScreen> {
  final _search = TextEditingController();
  Timer? _debounce;

  List<Map<String, dynamic>> _issues = [];
  List<Map<String, dynamic>> _states = [];
  String _status = 'all';
  bool _loading = true;
  Object? _error;
  bool _hasMore = false;
  String? _cursor;

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

  Future<void> _load({bool append = false}) async {
    setState(() {
      if (!append) {
        _loading = true;
        _error = null;
      }
    });
    try {
      final res = await ApiClient.instance.linearIssues(
        status: _status,
        search: _search.text.trim(),
        after: append ? _cursor : null,
      );
      if (mounted) {
        final newIssues = ((res['issues'] as List?) ?? const [])
            .map((e) => (e as Map).cast<String, dynamic>())
            .toList();
        setState(() {
          _issues = append ? [..._issues, ...newIssues] : newIssues;
          _states = ((res['states'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _hasMore = res['hasNextPage'] == true;
          _cursor = res['endCursor'];
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
      _load();
    });
  }

  void _clearSearch() {
    _search.clear();
    _load();
  }

  Future<void> _updateIssue(Map<String, dynamic> issue) async {
    final result = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => _IssueDetailScreen(issue: issue, states: _states)),
    );
    if (result == true && mounted) _load();
  }

  @override
  Widget build(BuildContext context) {
    return UnfocusOnTap(
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Issues'),
          actions: [
            IconButton(
              icon: const Icon(Icons.open_in_new, size: 18, color: AppColors.textMuted),
              onPressed: () => launchUrl(
                Uri.parse('https://linear.app/withmeteoric'),
                mode: LaunchMode.externalApplication,
              ),
              tooltip: 'Open Linear',
            ),
            IconButton(
              icon: const Icon(Icons.refresh, size: 18, color: AppColors.textMuted),
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
                  hintText: 'Search issues...',
                  prefixIcon: const Icon(Icons.search, size: 18, color: AppColors.textFaint),
                  suffixIcon: _search.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close, size: 16, color: AppColors.textMuted),
                          onPressed: _clearSearch,
                        )
                      : null,
                ),
              ),
            ),
            // Status filter chips
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _filterChip('All', 'all'),
                  _filterChip('Backlog', 'Backlog'),
                  _filterChip('Todo', 'Todo'),
                  _filterChip('In Progress', 'In Progress'),
                  _filterChip('Done', 'Done'),
                  _filterChip('Canceled', 'Canceled'),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Expanded(child: _buildList()),
          ],
        ),
      ),
    );
  }

  Widget _filterChip(String label, String value) {
    final selected = _status == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: () {
          Haptic.tap();
          setState(() => _status = value);
          _load();
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: selected
                ? AppColors.accent.withValues(alpha: 0.12)
                : AppColors.card,
            border: Border.all(
              color: selected
                  ? AppColors.accent.withValues(alpha: 0.3)
                  : AppColors.border,
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: selected ? AppColors.accent : AppColors.textMuted,
              fontSize: 12,
              fontWeight: FontWeight.w500,
              fontFamily: 'Inter',
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildList() {
    if (_loading && _issues.isEmpty) return const SkeletonList();
    if (_error != null) return ErrorStateView(error: _error, onRetry: _load);
    if (_issues.isEmpty) {
      return const EmptyState(
        message: 'No issues found.',
        icon: Icons.bug_report_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        itemCount: _issues.length + (_hasMore ? 1 : 0),
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) {
          if (i == _issues.length) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: GestureDetector(
                  onTap: () => _load(append: true),
                  child: Text(
                    'Load more',
                    style: TextStyle(
                      color: AppColors.accent,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
            );
          }
          return _IssueCard(
            issue: _issues[i],
            onTap: () => _updateIssue(_issues[i]),
          );
        },
      ),
    );
  }
}

// ── Issue Card ────────────────────────────────────────────────────────

class _IssueCard extends StatelessWidget {
  const _IssueCard({required this.issue, required this.onTap});

  final Map<String, dynamic> issue;
  final VoidCallback onTap;

  Color get _priorityColor {
    final p = issue['priority'] as int? ?? 0;
    switch (p) {
      case 1:
        return const Color(0xFFEF4444); // Urgent — red
      case 2:
        return const Color(0xFFF59E0B); // High — amber
      case 3:
        return const Color(0xFF3B82F6); // Medium — blue
      case 4:
        return AppColors.textFaint; // Low
      default:
        return AppColors.textFaint; // None
    }
  }

  String get _priorityLabel {
    final p = issue['priority'] as int? ?? 0;
    switch (p) {
      case 1:
        return 'Urgent';
      case 2:
        return 'High';
      case 3:
        return 'Medium';
      case 4:
        return 'Low';
      default:
        return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    final labels = (issue['labels'] as List?)?.cast<String>() ?? [];
    final stateColor = Color(
      int.parse((issue['stateColor'] as String? ?? '#6B7280').replaceFirst('#', '0xFF')),
    );

    return Material(
      borderRadius: AppRadius.mdAll,
      color: AppColors.card,
      child: InkWell(
        borderRadius: AppRadius.mdAll,
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: AppRadius.mdAll,
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    issue['identifier'] ?? '',
                    style: const TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: stateColor.withValues(alpha: 0.12),
                      border: Border.all(color: stateColor.withValues(alpha: 0.25)),
                    ),
                    child: Text(
                      issue['state'] ?? '',
                      style: TextStyle(
                        color: stateColor,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  const Spacer(),
                  if (_priorityLabel.isNotEmpty)
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: _priorityColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _priorityLabel,
                          style: TextStyle(
                            color: _priorityColor,
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                issue['title'] ?? '',
                style: const TextStyle(
                  color: AppColors.text,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  fontFamily: 'Inter',
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  if (issue['assignee'] != null) ...[
                    Icon(Icons.person_outline, size: 12, color: AppColors.textFaint),
                    const SizedBox(width: 4),
                    Text(
                      issue['assignee'],
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 11,
                        fontFamily: 'Inter',
                      ),
                    ),
                    const SizedBox(width: 12),
                  ],
                  if (labels.isNotEmpty) ...[
                    Icon(Icons.label_outline, size: 12, color: AppColors.textFaint),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        labels.join(', '),
                        style: const TextStyle(
                          color: AppColors.textFaint,
                          fontSize: 11,
                          fontFamily: 'Inter',
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ] else
                    const Spacer(),
                  Text(
                    _timeAgo(issue['updatedAt'] as String?),
                    style: const TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 10,
                      fontFamily: 'Inter',
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _timeAgo(String? dateStr) {
    if (dateStr == null) return '';
    final date = DateTime.tryParse(dateStr);
    if (date == null) return '';
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 30) return '${diff.inDays}d ago';
    return '${(diff.inDays / 30).floor()}mo ago';
  }
}

// ── Issue Detail / Update Screen ──────────────────────────────────────

class _IssueDetailScreen extends StatefulWidget {
  const _IssueDetailScreen({required this.issue, required this.states});

  final Map<String, dynamic> issue;
  final List<Map<String, dynamic>> states;

  @override
  State<_IssueDetailScreen> createState() => _IssueDetailScreenState();
}

class _IssueDetailScreenState extends State<_IssueDetailScreen> {
  late String _selectedState;
  int? _selectedPriority;
  final _commentController = TextEditingController();
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _selectedState = widget.issue['state'] ?? '';
    _selectedPriority = widget.issue['priority'] as int?;
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      final stateMatch = widget.states.firstWhere(
        (s) => s['name'] == _selectedState,
        orElse: () => {},
      );
      await ApiClient.instance.linearIssueUpdate({
        'action': 'update',
        'issueId': widget.issue['id'],
        'stateId': stateMatch['id'],
        'priority': _selectedPriority,
        'comment': _commentController.text.trim().isEmpty
            ? null
            : _commentController.text.trim(),
      });
      if (mounted) {
        Toast.success(context, 'Issue updated');
        Navigator.of(context).pop(true);
      }
    } catch (err) {
      if (mounted) Toast.error(context, err.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final issue = widget.issue;

    return Scaffold(
      appBar: AppBar(
        title: Text(issue['identifier'] ?? ''),
        actions: [
          IconButton(
            icon: const Icon(Icons.open_in_new, size: 18, color: AppColors.textMuted),
            onPressed: () => launchUrl(
              Uri.parse(issue['url'] ?? ''),
              mode: LaunchMode.externalApplication,
            ),
            tooltip: 'Open in Linear',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Title
          Text(
            issue['title'] ?? '',
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 18,
              fontWeight: FontWeight.w600,
              fontFamily: 'Inter',
              height: 1.3,
            ),
          ),
          const SizedBox(height: 16),

          // State picker
          const Text(
            'STATE',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: AppColors.card,
              border: Border.all(color: AppColors.border),
            ),
            child: DropdownButton<String>(
              value: _selectedState,
              isExpanded: true,
              dropdownColor: AppColors.card,
              underline: const SizedBox.shrink(),
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 14,
                fontFamily: 'Inter',
              ),
              items: widget.states
                  .map((s) => DropdownMenuItem(
                        value: s['name'] as String,
                        child: Row(
                          children: [
                            Container(
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                color: Color(int.parse(
                                    (s['color'] as String? ?? '#6B7280')
                                        .replaceFirst('#', '0xFF'))),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(s['name'] as String),
                          ],
                        ),
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _selectedState = v ?? _selectedState),
            ),
          ),
          const SizedBox(height: 16),

          // Priority picker
          const Text(
            'PRIORITY',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              _priorityButton(1, 'Urgent', const Color(0xFFEF4444)),
              const SizedBox(width: 8),
              _priorityButton(2, 'High', const Color(0xFFF59E0B)),
              const SizedBox(width: 8),
              _priorityButton(3, 'Medium', const Color(0xFF3B82F6)),
              const SizedBox(width: 8),
              _priorityButton(4, 'Low', AppColors.textFaint),
            ],
          ),
          const SizedBox(height: 16),

          // Assignee
          if (issue['assignee'] != null) ...[
            const Text(
              'ASSIGNEE',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 8),
            Text(
              issue['assignee'],
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 14,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Labels
          if ((issue['labels'] as List?)?.isNotEmpty == true) ...[
            const Text(
              'LABELS',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: (issue['labels'] as List)
                  .map((l) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.textFaint.withValues(alpha: 0.06),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          l.toString(),
                          style: const TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 11,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 16),
          ],

          // Add comment
          const Text(
            'ADD COMMENT',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _commentController,
            maxLines: 4,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 14,
              fontFamily: 'Inter',
            ),
            decoration: InputDecoration(
              hintText: 'Optional comment...',
              hintStyle: const TextStyle(
                color: AppColors.textFaint,
                fontFamily: 'Inter',
              ),
              border: OutlineInputBorder(
                borderSide: BorderSide(color: AppColors.border),
              ),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(color: AppColors.border),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                  color: AppColors.accent.withValues(alpha: 0.3),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Save button
          AccentButton(
            height: 44,
            onPressed: _saving ? null : _save,
            child: Text(_saving ? 'SAVING...' : 'UPDATE ISSUE'),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _priorityButton(int value, String label, Color color) {
    final selected = _selectedPriority == value;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          Haptic.tap();
          setState(() => _selectedPriority = selected ? null : value);
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: selected ? color.withValues(alpha: 0.12) : AppColors.card,
            border: Border.all(
              color: selected ? color.withValues(alpha: 0.3) : AppColors.border,
            ),
          ),
          child: Column(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  color: selected ? color : AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
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
