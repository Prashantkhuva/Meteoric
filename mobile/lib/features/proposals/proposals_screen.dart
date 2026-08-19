import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import 'proposal_detail_screen.dart';
import 'proposal_form_screen.dart';

class ProposalsScreen extends StatefulWidget {
  const ProposalsScreen({super.key});

  @override
  State<ProposalsScreen> createState() => _ProposalsScreenState();
}

class _ProposalsScreenState extends State<ProposalsScreen> {
  static const _pageSize = 15;

  final _search = TextEditingController();
  Timer? _debounce;

  List<Map<String, dynamic>> _proposals = [];
  int _total = 0;
  int _page = 1;
  String _status = 'all';
  bool _loading = true;
  String? _error;

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
      final res = await ApiClient.instance.proposalsList({
        'page': _page,
        'pageSize': _pageSize,
        'search': _search.text.trim(),
        'status': _status,
        'sort': 'newest',
      });
      if (mounted) {
        setState(() {
          _proposals = ((res['data'] as List?) ?? const [])
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Proposals'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, size: 20, color: AppColors.accent),
            onPressed: () => _openForm(),
            tooltip: 'New proposal',
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
                hintText: 'Search proposals...',
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
              MapEntry('draft', 'Draft'),
              MapEntry('sent', 'Sent'),
              MapEntry('accepted', 'Accepted'),
              MapEntry('declined', 'Declined'),
            ],
            selected: _status,
            onSelected: (v) {
              setState(() => _status = v);
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
    if (_proposals.isEmpty) {
      return const EmptyState(
        message: 'No proposals found.',
        icon: Icons.description_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        itemCount: _proposals.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) => _ProposalCard(
          proposal: _proposals[i],
          onTap: () => _openDetail(_proposals[i]),
        ),
      ),
    );
  }

  Future<void> _openDetail(Map<String, dynamic> proposal) async {
    await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => ProposalDetailScreen(proposal: proposal)),
    );
    _load();
  }

  Future<void> _openForm({Map<String, dynamic>? proposal}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => ProposalFormScreen(proposal: proposal)),
    );
    if (changed == true) _load();
  }
}

class _ProposalCard extends StatelessWidget {
  const _ProposalCard({required this.proposal, required this.onTap});

  final Map<String, dynamic> proposal;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final lead = proposal['lead'];
    final leadName = lead is Map ? (lead['name'] ?? '—') : '—';
    final total = Fmt.money(_proposalTotal());

    return Material(
      color: AppColors.card,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(border: Border.all(color: AppColors.border)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      proposal['title'] ?? 'Untitled',
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  StatusBadge(meta: Status.get(Status.proposals, proposal['status'])),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.person_outline, size: 13, color: AppColors.textFaint),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      leadName,
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Inter'),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Text(
                    total,
                    style: const TextStyle(
                      color: AppColors.accent,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const Spacer(),
                  Text(
                    Fmt.timeAgo(proposal['created_at'] as String?),
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

  double _proposalTotal() {
    final pricing = proposal['pricing'];
    if (pricing is! List) return 0;
    return pricing.fold<double>(0, (sum, item) {
      final qty = (item is Map ? (item['quantity'] as num?) : null)?.toDouble() ?? 1;
      final rate = (item is Map ? (item['rate'] as num?) : null)?.toDouble() ?? 0;
      return sum + qty * rate;
    });
  }
}