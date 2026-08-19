import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import 'client_detail_screen.dart';
import 'client_form_screen.dart';

class ClientsScreen extends StatefulWidget {
  const ClientsScreen({super.key});

  @override
  State<ClientsScreen> createState() => _ClientsScreenState();
}

class _ClientsScreenState extends State<ClientsScreen> {
  static const _pageSize = 15;

  final _search = TextEditingController();
  Timer? _debounce;

  List<Map<String, dynamic>> _clients = [];
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
      final res = await ApiClient.instance.clientsList({
        'page': _page,
        'pageSize': _pageSize,
        'search': _search.text.trim(),
        'status': _status,
        'sort': 'newest',
      });
      if (mounted) {
        setState(() {
          _clients = ((res['data'] as List?) ?? const [])
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
        title: const Text('Clients'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, size: 20, color: AppColors.accent),
            onPressed: () => _openForm(),
            tooltip: 'Add client',
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
              MapEntry('onboarding', 'Onboarding'),
              MapEntry('active', 'Active'),
              MapEntry('at_risk', 'At Risk'),
              MapEntry('inactive', 'Inactive'),
              MapEntry('churned', 'Churned'),
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
    if (_clients.isEmpty) {
      return const EmptyState(
        message: 'No clients found. Adjust filters or add a new client.',
        icon: Icons.people_outline,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        itemCount: _clients.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) => _ClientCard(
          client: _clients[i],
          onTap: () => _openDetail(_clients[i]),
          onEdit: () => _openForm(client: _clients[i]),
        ),
      ),
    );
  }

  Future<void> _openDetail(Map<String, dynamic> client) async {
    await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => ClientDetailScreen(client: client)),
    );
    _load();
  }

  Future<void> _openForm({Map<String, dynamic>? client}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => ClientFormScreen(client: client)),
    );
    if (changed == true) _load();
  }
}

class _ClientCard extends StatelessWidget {
  const _ClientCard({required this.client, required this.onTap, required this.onEdit});

  final Map<String, dynamic> client;
  final VoidCallback onTap;
  final VoidCallback onEdit;

  @override
  Widget build(BuildContext context) {
    final name = client['name'] ?? '—';
    final company = client['company'];
    final email = client['email'];

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
                      name,
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  StatusBadge(meta: Status.get(Status.clients, client['status'])),
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
                  Text(
                    'Added ${Fmt.date(client['created_at'] as String?)}',
                    style: const TextStyle(color: AppColors.textFaint, fontSize: 10, fontFamily: 'Inter'),
                  ),
                  const Spacer(),
                  Text(
                    Fmt.timeAgo(client['created_at'] as String?),
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