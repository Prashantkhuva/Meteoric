import 'dart:async';
import 'dart:convert';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/bulk_actions_bar.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/csv_export.dart';
import '../../shared/widgets/filter_bar.dart';
import 'lead_detail_screen.dart';
import 'lead_form_screen.dart';

class LeadsScreen extends StatefulWidget {
  const LeadsScreen({super.key});

  @override
  State<LeadsScreen> createState() => _LeadsScreenState();
}

class _LeadsScreenState extends State<LeadsScreen> {
  static const _pageSize = 15;

  static const _statusOptions = [
    MapEntry('inquiry', 'Inquiry'),
    MapEntry('discovery', 'Discovery'),
    MapEntry('proposal', 'Proposal'),
    MapEntry('in_progress', 'In Progress'),
    MapEntry('completed', 'Completed'),
    MapEntry('lost', 'Lost'),
  ];

  final _search = TextEditingController();
  final _searchFocus = FocusNode();

  List<Map<String, dynamic>> _leads = [];
  int _total = 0;
  int _page = 1;
  String _status = 'all';
  String _source = 'all';
  String _score = 'all';
  String _sort = 'newest';
  bool _loading = true;
  String? _error;
  Timer? _debounce;

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
    _searchFocus.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await ApiClient.instance.leadsList({
        'page': _page,
        'pageSize': _pageSize,
        'search': _search.text.trim(),
        'status': _status,
        'score': _score,
        'source': _source,
        'sort': _sort,
      });
      if (mounted) {
        setState(() {
          _leads = ((res['data'] as List?) ?? const [])
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

  Future<void> _refresh() async => _load();

  int _id(Map<String, dynamic> row) => (row['id'] as num).toInt();

  Future<void> _bulkDelete() async {
    final ok = await confirmBulkDelete(context, count: _selected.length);
    if (!ok) return;
    setState(() => _busy = true);
    var failed = 0;
    for (final id in _selected.toList()) {
      try {
        final res = await ApiClient.instance.leadDelete(id);
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
        content: Text(
          failed == 0
              ? 'Deleted successfully'
              : 'Deleted with $failed failures',
        ),
        backgroundColor: failed == 0
            ? AppColors.cardRaised
            : AppColors.red.withValues(alpha: 0.9),
      ),
    );
    _load();
  }

  Future<void> _bulkStatus(String status) async {
    setState(() => _busy = true);
    var failed = 0;
    for (final id in _selected.toList()) {
      try {
        final res = await ApiClient.instance.leadStatus(id, status);
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
        content: Text(failed == 0 ? 'Status updated' : '$failed failed'),
      ),
    );
    _load();
  }

  Future<List<Map<String, dynamic>>> _fetchAll() async {
    final all = <Map<String, dynamic>>[];
    const pageCap = 100;
    for (var p = 1; p <= pageCap; p++) {
      final res = await ApiClient.instance.leadsList({
        'page': p,
        'pageSize': 200,
        'search': _search.text.trim(),
        'status': _status,
        'score': _score,
        'source': _source,
        'sort': _sort,
      });
      all.addAll(
        ((res['data'] as List?) ?? const []).map(
          (e) => (e as Map).cast<String, dynamic>(),
        ),
      );
      final total = (res['total'] as num?)?.toInt() ?? 0;
      if (all.length >= total) break;
    }
    return all;
  }

  Future<void> _exportCsv() async {
    try {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Exporting...')));
      final rows = await _fetchAll();
      final csv = [
        [
          'Name',
          'Email',
          'Phone',
          'Company',
          'Services',
          'Budget',
          'Source',
          'Score',
          'Status',
          'Created',
        ],
        ...rows.map(
          (l) => [
            '${l['name'] ?? ''}',
            '${l['email'] ?? ''}',
            '${l['phone'] ?? ''}',
            '${l['company'] ?? ''}',
            '${l['services'] ?? ''}',
            '${l['budget'] ?? ''}',
            '${l['source'] ?? ''}',
            '${l['ai_score'] ?? ''}',
            '${l['status'] ?? ''}',
            csvDate(l['created_at']),
          ],
        ),
      ];
      await CsvExport.share(filename: CsvExport.datedName('leads'), rows: csv);
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(err.toString())));
      }
    }
  }

  Future<void> _importCsv() async {
    try {
      final picked = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv'],
        withData: true,
      );
      final file = picked?.files.singleOrNull;
      if (file == null || file.bytes == null) return;
      final text = utf8.decode(file.bytes!, allowMalformed: true);
      final table = parseCsv(text);
      if (table.length < 2) {
        throw Exception('CSV has no data rows');
      }
      final headers = table.first.map((h) => h.trim().toLowerCase()).toList();
      final rows = <Map<String, dynamic>>[];
      for (final cells in table.skip(1)) {
        final row = <String, dynamic>{};
        for (var i = 0; i < headers.length && i < cells.length; i++) {
          row[headers[i]] = cells[i].trim();
        }
        rows.add(row);
      }
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Importing ${rows.length} rows...')),
      );
      final res = await ApiClient.instance.leadsImport(rows);
      if (!mounted) return;
      final errors = (res['errors'] as List?) ?? const [];
      final imported = (res['imported'] as num?)?.toInt() ?? 0;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            errors.isEmpty
                ? 'Imported $imported leads'
                : 'Imported $imported · ${errors.length} skipped',
          ),
        ),
      );
      _load();
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(err.toString()),
            backgroundColor: AppColors.red.withValues(alpha: 0.9),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _selecting
            ? Text('${_selected.length} selected')
            : const Text('Leads'),
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
                    _selected.length == _leads.length
                        ? Icons.check_box_outlined
                        : Icons.check_box_outline_blank,
                    size: 19,
                    color: AppColors.accent,
                  ),
                  onPressed: () => setState(() {
                    if (_selected.length == _leads.length) {
                      _selected.clear();
                    } else {
                      _selected
                        ..clear()
                        ..addAll(_leads.map(_id));
                    }
                  }),
                  tooltip: 'Select all',
                ),
              ]
            : [
                IconButton(
                  icon: const Icon(
                    Icons.upload_file_outlined,
                    size: 18,
                    color: AppColors.textMuted,
                  ),
                  onPressed: _importCsv,
                  tooltip: 'Import CSV',
                ),
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
                  tooltip: 'Add lead',
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
              focusNode: _searchFocus,
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
                key: 'score',
                label: 'Score',
                options: const [
                  MapEntry('hot', 'Hot'),
                  MapEntry('warm', 'Warm'),
                  MapEntry('cold', 'Cold'),
                  MapEntry('scored', 'Scored'),
                  MapEntry('unscored', 'Unscored'),
                ],
              ),
              FilterGroup(
                key: 'source',
                label: 'Source',
                options: const [
                  MapEntry('website', 'Website'),
                  MapEntry('cal.com', 'Cal.com'),
                  MapEntry('manual', 'Manual'),
                  MapEntry('csv_import', 'CSV'),
                  MapEntry('whatsapp', 'WhatsApp'),
                  MapEntry('other', 'Other'),
                ],
              ),
              FilterGroup(
                key: 'sort',
                label: 'Sort',
                options: const [
                  MapEntry('newest', 'Newest'),
                  MapEntry('oldest', 'Oldest'),
                  MapEntry('name', 'Name A–Z'),
                ],
              ),
            ],
            values: {
              'status': _status,
              'score': _score,
              'source': _source,
              'sort': _sort,
            },
            onChanged: (v) {
              setState(() {
                _status = v['status'] ?? 'all';
                _score = v['score'] ?? 'all';
                _source = v['source'] ?? 'all';
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
              onStatus: _bulkStatus,
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
    if (_leads.isEmpty) {
      return const EmptyState(
        message: 'No leads found. Adjust filters or add a new lead.',
        icon: Icons.person_search_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _refresh,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        itemCount: _leads.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) {
          final lead = _leads[i];
          final id = _id(lead);
          final isSelected = _selected.contains(id);
          return _LeadCard(
            lead: lead,
            selected: isSelected,
            selecting: _selecting,
            onTap: () {
              if (_selecting) {
                setState(
                  () => isSelected ? _selected.remove(id) : _selected.add(id),
                );
              } else {
                _openDetail(lead);
              }
            },
            onLongPress: () => setState(() => _selected.add(id)),
            onEdit: _selecting ? null : () => _openForm(lead: lead),
          );
        },
      ),
    );
  }

  Future<void> _openDetail(Map<String, dynamic> lead) async {
    await Navigator.of(context)
        .push(MaterialPageRoute(builder: (_) => LeadDetailScreen(lead: lead)));
    _load();
  }

  Future<void> _openForm({Map<String, dynamic>? lead}) async {
    final changed = await Navigator.of(
      context,
    ).push<bool>(MaterialPageRoute(builder: (_) => LeadFormScreen(lead: lead)));
    if (changed == true) _load();
  }
}

class _LeadCard extends StatelessWidget {
  const _LeadCard({
    required this.lead,
    required this.onTap,
    required this.onLongPress,
    required this.onEdit,
    this.selected = false,
    this.selecting = false,
  });

  final Map<String, dynamic> lead;
  final VoidCallback onTap;
  final VoidCallback onLongPress;
  final VoidCallback? onEdit;
  final bool selected;
  final bool selecting;

  @override
  Widget build(BuildContext context) {
    final name = lead['name'] ?? '—';
    final company = lead['company'];
    final email = lead['email'];
    final score = lead['ai_score'];
    final category = lead['ai_category'];

    final Color scoreColor = switch (category) {
      'hot' => AppColors.emerald,
      'warm' => AppColors.amber,
      'cold' => AppColors.sky,
      _ => AppColors.textFaint,
    };

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
                            name,
                            style: const TextStyle(
                              color: AppColors.text,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              fontFamily: 'Inter',
                            ),
                          ),
                        ),
                        StatusBadge(
                          meta: Status.get(Status.leads, lead['status']),
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
                      [
                        if (company != null && '$company'.isNotEmpty)
                          '$company',
                        if (email != null && '$email'.isNotEmpty) '$email',
                      ].join(' • '),
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
                        if (score != null)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 7,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: scoreColor.withValues(alpha: 0.08),
                              border: Border.all(
                                color: scoreColor.withValues(alpha: 0.35),
                              ),
                            ),
                            child: Text(
                              '${score.toStringAsFixed(0)} ${category ?? ''}',
                              style: TextStyle(
                                color: scoreColor,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                fontFamily: 'Inter',
                              ),
                            ),
                          ),
                        if (score != null) const SizedBox(width: 8),
                        StatusBadge(
                          meta: Status.get(Status.leadSources, lead['source']),
                        ),
                        const Spacer(),
                        Text(
                          Fmt.timeAgo(lead['created_at'] as String?),
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
