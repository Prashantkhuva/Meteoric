import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import 'lead_detail_screen.dart';
import 'lead_form_screen.dart';

class LeadsScreen extends StatefulWidget {
  const LeadsScreen({super.key});

  @override
  State<LeadsScreen> createState() => _LeadsScreenState();
}

class _LeadsScreenState extends State<LeadsScreen> {
  static const _pageSize = 15;

  final _search = TextEditingController();
  final _searchFocus = FocusNode();

  List<Map<String, dynamic>> _leads = [];
  int _total = 0;
  int _page = 1;
  String _status = 'all';
  String _source = 'all';
  String _score = 'all';
  bool _loading = true;
  String? _error;
  Timer? _debounce;

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
        'sort': 'newest',
      });
      if (mounted) {
        setState(() {
          _leads = ((res['data'] as List?) ?? const [])
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

  Future<void> _refresh() async {
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Leads'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, size: 20, color: AppColors.accent),
            onPressed: () => _openForm(),
            tooltip: 'Add lead',
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
              focusNode: _searchFocus,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Search name, email, company...',
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
          FilterChips(
            options: const [
              MapEntry('all', 'ALL'),
              MapEntry('inquiry', 'Inquiry'),
              MapEntry('discovery', 'Discovery'),
              MapEntry('proposal', 'Proposal'),
              MapEntry('in_progress', 'In Progress'),
              MapEntry('completed', 'Completed'),
              MapEntry('lost', 'Lost'),
            ],
            selected: _status,
            onSelected: (v) {
              setState(() => _status = v);
              _page = 1;
              _load();
            },
          ),
          const SizedBox(height: 10),
          FilterChips(
            options: const [
              MapEntry('all', 'ALL SCORES'),
              MapEntry('hot', 'Hot'),
              MapEntry('warm', 'Warm'),
              MapEntry('cold', 'Cold'),
              MapEntry('scored', 'Scored'),
              MapEntry('unscored', 'Unscored'),
            ],
            selected: _score,
            onSelected: (v) {
              setState(() => _score = v);
              _page = 1;
              _load();
            },
          ),
          const SizedBox(height: 10),
          FilterChips(
            options: const [
              MapEntry('all', 'ALL SOURCES'),
              MapEntry('website', 'Website'),
              MapEntry('cal.com', 'Cal.com'),
              MapEntry('manual', 'Manual'),
              MapEntry('csv_import', 'CSV'),
              MapEntry('whatsapp', 'WhatsApp'),
              MapEntry('other', 'Other'),
            ],
            selected: _source,
            onSelected: (v) {
              setState(() => _source = v);
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
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openForm(),
        backgroundColor: AppColors.accent,
        foregroundColor: const Color(0xFF121212),
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
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
        itemBuilder: (context, i) => _LeadCard(
          lead: _leads[i],
          onTap: () => _openDetail(_leads[i]),
          onEdit: () => _openForm(lead: _leads[i]),
        ),
      ),
    );
  }

  Future<void> _openDetail(Map<String, dynamic> lead) async {
    await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => LeadDetailScreen(lead: lead)),
    );
    _load();
  }

  Future<void> _openForm({Map<String, dynamic>? lead}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => LeadFormScreen(lead: lead)),
    );
    if (changed == true) _load();
  }
}

class _LeadCard extends StatelessWidget {
  const _LeadCard({required this.lead, required this.onTap, required this.onEdit});

  final Map<String, dynamic> lead;
  final VoidCallback onTap;
  final VoidCallback onEdit;

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
      color: AppColors.card,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.border),
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
                  StatusBadge(meta: Status.get(Status.leads, lead['status'])),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: onEdit,
                    child: const Icon(Icons.edit_outlined, size: 15, color: AppColors.textFaint),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                [
                  if (company != null && '$company'.isNotEmpty) '$company',
                  if (email != null && '$email'.isNotEmpty) '$email',
                ].join(' • '),
                style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Inter'),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  if (score != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                      decoration: BoxDecoration(
                        color: scoreColor.withValues(alpha: 0.08),
                        border: Border.all(color: scoreColor.withValues(alpha: 0.35)),
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
                  StatusBadge(meta: Status.get(Status.leadSources, lead['source'])),
                  const Spacer(),
                  Text(
                    Fmt.timeAgo(lead['created_at'] as String?),
                    style: const TextStyle(color: AppColors.textFaint, fontSize: 10, fontFamily: 'Inter'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}