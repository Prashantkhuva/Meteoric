import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/bulk_actions_bar.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/csv_export.dart';
import '../../shared/widgets/filter_bar.dart';
import 'project_detail_screen.dart';
import 'project_form_screen.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  static const _pageSize = 15;

  static const _statusOptions = [
    MapEntry('planning', 'Planning'),
    MapEntry('in_progress', 'In Progress'),
    MapEntry('review', 'Review'),
    MapEntry('completed', 'Completed'),
    MapEntry('on_hold', 'On Hold'),
    MapEntry('cancelled', 'Cancelled'),
  ];

  final _search = TextEditingController();
  Timer? _debounce;

  List<Map<String, dynamic>> _projects = [];
  int _total = 0;
  int _page = 1;
  String _status = 'all';
  String _sort = 'newest';
  bool _loading = true;
  String? _error;

  final Set<int> _selected = {};
  bool _busy = false;

  bool get _selecting => _selected.isNotEmpty;

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
      final res = await ApiClient.instance.projectsList({
        'page': _page,
        'pageSize': _pageSize,
        'search': _search.text.trim(),
        'status': _status,
        'sort': _sort,
      });
      if (mounted) {
        setState(() {
          _projects = ((res['data'] as List?) ?? const [])
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
          _error = err.toString();
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

  void _clearSearch() {
    _search.clear();
    _page = 1;
    _load();
  }

  int _id(Map<String, dynamic> row) => (row['id'] as num).toInt();

  Future<void> _runBulk(
    Future<Map<String, dynamic>> Function(int id) action,
  ) async {
    setState(() => _busy = true);
    var failed = 0;
    for (final id in _selected.toList()) {
      try {
        final res = await action(id);
        if (res.containsKey('error')) failed++;
      } catch (_) {
        failed++;
      }
    }
    if (!mounted) return;
    setState(() {
      _busy = false;
      _selected.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(failed == 0 ? 'Done' : 'Completed with $failed failures'),
        backgroundColor: failed == 0
            ? AppColors.cardRaised
            : AppColors.red.withValues(alpha: 0.9),
      ),
    );
    _load();
  }

  Future<void> _bulkDelete() async {
    final ok = await confirmBulkDelete(
      context,
      count: _selected.length,
      label: 'projects',
    );
    if (!ok) return;
    await _runBulk((id) => ApiClient.instance.projectDelete(id));
  }

  Future<void> _exportCsv() async {
    try {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Exporting...')));
      final all = <Map<String, dynamic>>[];
      for (var p = 1; p <= 100; p++) {
        final res = await ApiClient.instance.projectsList({
          'page': p,
          'pageSize': 200,
          'search': _search.text.trim(),
          'status': _status,
          'sort': _sort,
        });
        all.addAll(
          ((res['data'] as List?) ?? const []).map(
            (e) => (e as Map).cast<String, dynamic>(),
          ),
        );
        if (all.length >= ((res['total'] as num?)?.toInt() ?? 0)) break;
      }
      await CsvExport.share(
        filename: CsvExport.datedName('projects'),
        rows: [
          ['Name', 'Client', 'Budget', 'Status', 'Deadline', 'Created'],
          ...all.map(
            (p) => [
              '${p['name'] ?? ''}',
              p['client'] is Map ? '${p['client']['name'] ?? ''}' : '',
              '${p['budget'] ?? ''}',
              '${p['status'] ?? ''}',
              csvDate(p['deadline']),
              csvDate(p['created_at']),
            ],
          ),
        ],
      );
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(err.toString())));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _selecting
            ? Text('${_selected.length} selected')
            : const Text('Projects'),
        automaticallyImplyLeading: false,
        leading: _selecting
            ? IconButton(
                icon: const Icon(
                  Icons.close,
                  size: 20,
                  color: AppColors.textMuted,
                ),
                onPressed: () => setState(() => _selected.clear()),
              )
            : null,
        actions: _selecting
            ? [
                IconButton(
                  icon: Icon(
                    _selected.length == _projects.length
                        ? Icons.check_box_outlined
                        : Icons.check_box_outline_blank,
                    size: 19,
                    color: AppColors.accent,
                  ),
                  onPressed: () => setState(() {
                    if (_selected.length == _projects.length) {
                      _selected.clear();
                    } else {
                      _selected
                        ..clear()
                        ..addAll(_projects.map(_id));
                    }
                  }),
                  tooltip: 'Select all',
                ),
              ]
            : [
                IconButton(
                  icon: const Icon(
                    Icons.download_outlined,
                    size: 19,
                    color: AppColors.textMuted,
                  ),
                  onPressed: _exportCsv,
                  tooltip: 'Export CSV',
                ),
                IconButton(
                  icon: const Icon(
                    Icons.add,
                    size: 20,
                    color: AppColors.accent,
                  ),
                  onPressed: () => _openForm(),
                  tooltip: 'New project',
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
            child: TextField(
              controller: _search,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Search projects...',
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
                        onPressed: _clearSearch,
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
                options: _statusOptions,
              ),
              FilterGroup(
                key: 'sort',
                label: 'Sort',
                options: const [
                  MapEntry('newest', 'Newest'),
                  MapEntry('oldest', 'Oldest'),
                  MapEntry('title', 'Name A–Z'),
                  MapEntry('amount', 'Budget high–low'),
                  MapEntry('deadline', 'Deadline'),
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
      bottomNavigationBar: _selecting
          ? BulkActionBar(
              count: _selected.length,
              busy: _busy,
              onClear: () => setState(() => _selected.clear()),
              onDelete: _bulkDelete,
              statusOptions: _statusOptions,
              onStatus: (s) =>
                  _runBulk((id) => ApiClient.instance.projectStatus(id, s)),
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
      floatingActionButton: _selecting
          ? null
          : FloatingActionButton(
              onPressed: () => _openForm(),
              backgroundColor: AppColors.accent,
              foregroundColor: const Color(0xFF121212),
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              child: const Icon(Icons.add),
            ),
    );
  }

  Widget _buildList() {
    if (_loading) return const LoadingView();
    if (_error != null) return ErrorBox(message: _error!, onRetry: _load);
    if (_projects.isEmpty) {
      return const EmptyState(
        message: 'No projects found.',
        icon: Icons.folder_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        itemCount: _projects.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) {
          final project = _projects[i];
          final id = _id(project);
          final isSelected = _selected.contains(id);
          return _ProjectCard(
            project: project,
            selected: isSelected,
            selecting: _selecting,
            onTap: () {
              if (_selecting) {
                setState(
                  () => isSelected ? _selected.remove(id) : _selected.add(id),
                );
              } else {
                _openDetail(project);
              }
            },
            onLongPress: () => setState(() => _selected.add(id)),
            onEdit: _selecting ? null : () => _openForm(project: project),
          );
        },
      ),
    );
  }

  Future<void> _openDetail(Map<String, dynamic> project) async {
    await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => ProjectDetailScreen(project: project)),
    );
    _load();
  }

  Future<void> _openForm({Map<String, dynamic>? project}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => ProjectFormScreen(project: project)),
    );
    if (changed == true) _load();
  }
}

class _ProjectCard extends StatelessWidget {
  const _ProjectCard({
    required this.project,
    required this.onTap,
    required this.onLongPress,
    required this.onEdit,
    this.selected = false,
    this.selecting = false,
  });

  final Map<String, dynamic> project;
  final VoidCallback onTap;
  final VoidCallback onLongPress;
  final VoidCallback? onEdit;
  final bool selected;
  final bool selecting;

  @override
  Widget build(BuildContext context) {
    final client = project['client'];
    final clientName = client is Map ? (client['name'] ?? '—') : '—';
    final budget = (project['budget'] as num?)?.toDouble();

    return Material(
      color: selected ? AppColors.cardRaised : AppColors.card,
      child: InkWell(
        onTap: onTap,
        onLongPress: onLongPress,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            border: Border.all(
              color: selected
                  ? AppColors.accent.withValues(alpha: 0.5)
                  : AppColors.border,
            ),
          ),
          child: Row(
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
                            project['name'] ?? 'Untitled project',
                            style: const TextStyle(
                              color: AppColors.text,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              fontFamily: 'Inter',
                            ),
                          ),
                        ),
                        StatusBadge(
                          meta: Status.get(Status.projects, project['status']),
                        ),
                        const SizedBox(width: 8),
                        if (onEdit != null)
                          GestureDetector(
                            onTap: onEdit,
                            child: const Icon(
                              Icons.edit_outlined,
                              size: 15,
                              color: AppColors.textFaint,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      clientName,
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 12,
                        fontFamily: 'Inter',
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        if (budget != null && budget > 0)
                          Text(
                            Fmt.money(budget),
                            style: const TextStyle(
                              color: AppColors.accent,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              fontFamily: 'Inter',
                            ),
                          )
                        else
                          const Text(
                            'No budget set',
                            style: TextStyle(
                              color: AppColors.textFaint,
                              fontSize: 10,
                              fontFamily: 'Inter',
                            ),
                          ),
                        const Spacer(),
                        Text(
                          Fmt.timeAgo(project['created_at'] as String?),
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
              if (selecting) ...[
                const SizedBox(width: 10),
                Icon(
                  selected ? Icons.check_box : Icons.check_box_outline_blank,
                  size: 20,
                  color: selected ? AppColors.accent : AppColors.textFaint,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
