import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/theme.dart';
import '../bookings/booking_detail_screen.dart';
import '../clients/client_detail_screen.dart';
import '../email/sent_emails_screen.dart';
import '../invoices/invoice_detail_screen.dart';
import '../leads/lead_detail_screen.dart';
import '../projects/project_detail_screen.dart';
import '../proposals/proposal_detail_screen.dart';
import '../../shared/widgets/error_views.dart';

/// Global search across leads, clients, invoices, proposals, projects,
/// bookings and sent emails. Debounced server search (300ms, min 2 chars) via
/// `/api/admin/search`; tapping a row opens the entity's detail screen.
class GlobalSearchScreen extends StatefulWidget {
  const GlobalSearchScreen({super.key});

  @override
  State<GlobalSearchScreen> createState() => _GlobalSearchScreenState();
}

class _GlobalSearchScreenState extends State<GlobalSearchScreen> {
  static const _recentsKey = 'global_search_recents';
  static const _recentsMax = 5;

  final _search = TextEditingController();
  Timer? _debounce;
  int _seq = 0;
  List<Map<String, dynamic>> _groups = [];
  List<String> _recents = [];
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadRecents();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _search.dispose();
    super.dispose();
  }

  Future<void> _loadRecents() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_recentsKey);
      final parsed = raw == null ? null : jsonDecode(raw);
      if (!mounted) return;
      setState(() {
        _recents = parsed is List
            ? parsed.whereType<String>().take(_recentsMax).toList()
            : <String>[];
      });
    } catch (_) {
      // recents unavailable — skip
    }
  }

  Future<void> _saveRecent(String q) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final next = [
        q,
        ..._recents.where((r) => r != q),
      ].take(_recentsMax).toList();
      await prefs.setString(_recentsKey, jsonEncode(next));
      if (mounted) setState(() => _recents = next);
    } catch (_) {
      // recents unavailable — skip
    }
  }

  Future<void> _clearRecents() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_recentsKey);
    } catch (_) {
      // ignore
    }
    if (mounted) setState(() => _recents = []);
  }

  void _onChanged(String value) {
    _debounce?.cancel();
    final q = value.trim();
    if (q.length < 2) {
      _seq++;
      if (mounted) {
        setState(() {
          _groups = [];
          _loading = false;
          _error = null;
        });
      }
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    _debounce = Timer(const Duration(milliseconds: 300), () async {
      final seq = ++_seq;
      try {
        final res = await ApiClient.instance.globalSearch(q);
        if (!mounted || seq != _seq) return;
        final err = res['error'];
        if (err is String && err.isNotEmpty && res['groups'] == null) {
          setState(() {
            _error = err;
            _groups = [];
            _loading = false;
          });
          return;
        }
        final raw = res['groups'];
        final groups = raw is List
            ? raw.whereType<Map<String, dynamic>>().toList()
            : <Map<String, dynamic>>[];
        setState(() {
          _groups = groups;
          _loading = false;
        });
        if (groups.isNotEmpty) unawaited(_saveRecent(q));
      } catch (e) {
        if (!mounted || seq != _seq) return;
        setState(() {
          _error = e.toString();
          _loading = false;
        });
      }
    });
  }

  void _clear() {
    _search.clear();
    _onChanged('');
    setState(() {});
  }

  void _open(String groupKey, Map<String, dynamic> item) {
    final data = item['data'];
    final row = data is Map<String, dynamic> ? data : <String, dynamic>{};
    Haptic.tap();
    final navigator = Navigator.of(context);
    switch (groupKey) {
      case 'leads':
        navigator.push(
          MaterialPageRoute(builder: (_) => LeadDetailScreen(lead: row)),
        );
      case 'clients':
        navigator.push(
          MaterialPageRoute(builder: (_) => ClientDetailScreen(client: row)),
        );
      case 'invoices':
        navigator.push(
          MaterialPageRoute(builder: (_) => InvoiceDetailScreen(invoice: row)),
        );
      case 'proposals':
        navigator.push(
          MaterialPageRoute(
            builder: (_) => ProposalDetailScreen(proposal: row),
          ),
        );
      case 'projects':
        navigator.push(
          MaterialPageRoute(builder: (_) => ProjectDetailScreen(project: row)),
        );
      case 'bookings':
        navigator.push(
          MaterialPageRoute(builder: (_) => BookingDetailScreen(booking: row)),
        );
      case 'sent_emails':
        navigator.push(
          MaterialPageRoute(builder: (_) => const SentEmailsScreen()),
        );
    }
  }

  StatusMeta? _statusMeta(String groupKey, String? status) {
    if (status == null || status.isEmpty) return null;
    switch (groupKey) {
      case 'leads':
        return Status.get(Status.leads, status);
      case 'clients':
        return Status.get(Status.clients, status);
      case 'invoices':
        return Status.get(Status.invoices, status);
      case 'proposals':
        return Status.get(Status.proposals, status);
      case 'projects':
        return Status.get(Status.projects, status);
      case 'sent_emails':
        return status == 'sent'
            ? StatusMeta('Sent', AppColors.emerald)
            : StatusMeta(status, AppColors.textMuted);
      case 'bookings':
        return StatusMeta(status, AppColors.textMuted);
      default:
        return null;
    }
  }

  IconData _groupIcon(String groupKey) {
    switch (groupKey) {
      case 'leads':
        return LucideIcons.user_round;
      case 'clients':
        return LucideIcons.building;
      case 'invoices':
        return LucideIcons.receipt;
      case 'proposals':
        return LucideIcons.file_text;
      case 'projects':
        return LucideIcons.folder_kanban;
      case 'bookings':
        return LucideIcons.calendar;
      case 'sent_emails':
        return LucideIcons.mail;
      default:
        return LucideIcons.search;
    }
  }

  @override
  Widget build(BuildContext context) {
    final q = _search.text.trim();
    return Scaffold(
      appBar: AppBar(title: const Text('Search')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
            child: TextField(
              controller: _search,
              autofocus: true,
              onChanged: _onChanged,
              textInputAction: TextInputAction.search,
              decoration: InputDecoration(
                hintText: 'Search name, company, invoice no...',
                prefixIcon: Icon(
                  Icons.search,
                  size: 18,
                  color: AppColors.textFaint,
                ),
                suffixIcon: _search.text.isNotEmpty
                    ? IconButton(
                        icon: Icon(
                          Icons.close,
                          size: 16,
                          color: AppColors.textMuted,
                        ),
                        onPressed: _clear,
                      )
                    : null,
              ),
            ),
          ),
          Expanded(child: _buildResults(q)),
        ],
      ),
    );
  }

  Widget _buildResults(String q) {
    if (q.length < 2) {
      if (_recents.isEmpty) {
        return _hint('Type at least 2 characters to search everything.');
      }
      return ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'RECENT SEARCHES',
                  style: TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                    fontFamily: 'Satoshi',
                  ),
                ),
                GestureDetector(
                  onTap: _clearRecents,
                  child: Text(
                    'Clear',
                    style: TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 11,
                      fontFamily: 'Satoshi',
                    ),
                  ),
                ),
              ],
            ),
          ),
          for (final r in _recents)
            ListTile(
              dense: true,
              leading: Icon(
                LucideIcons.clock,
                size: 15,
                color: AppColors.textFaint,
              ),
              title: Text(
                r,
                style: TextStyle(
                  color: AppColors.text,
                  fontSize: 14,
                  fontFamily: 'Satoshi',
                ),
              ),
              onTap: () {
                _search.text = r;
                _onChanged(r);
                setState(() {});
              },
            ),
        ],
      );
    }
    if (_error != null) {
      return ErrorStateView(
        error: _error,
        onRetry: () => _onChanged(_search.text),
      );
    }
    if (_loading) {
      return const Center(
        child: SizedBox(
          width: 22,
          height: 22,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      );
    }
    if (_groups.isEmpty) {
      return _hint('No results for "$q".');
    }
    return ListView.builder(
      padding: const EdgeInsets.only(bottom: 24),
      itemCount: _groups.length * 2,
      itemBuilder: (context, index) {
        if (index.isOdd) {
          final group = _groups[index ~/ 2];
          return _GroupHeader(
            label: (group['label'] as String?) ?? '',
            count: group['count'] is int ? group['count'] as int : null,
          );
        }
        final group = _groups[index ~/ 2];
        final groupKey = (group['key'] as String?) ?? '';
        final items = group['items'];
        final rows = items is List
            ? items.whereType<Map<String, dynamic>>().toList()
            : <Map<String, dynamic>>[];
        return Column(
          children: [
            for (final item in rows)
              _ResultTile(
                icon: _groupIcon(groupKey),
                title: (item['title'] as String?) ?? '',
                subtitle: _combinedSubtitle(item),
                statusMeta: _statusMeta(groupKey, item['meta'] as String?),
                onTap: () => _open(groupKey, item),
              ),
          ],
        );
      },
    );
  }

  String? _combinedSubtitle(Map<String, dynamic> item) {
    final sub = (item['subtitle'] as String?) ?? '';
    final matched = item['matched'];
    final matchedFields = matched is List
        ? matched
              .whereType<String>()
              .map((f) => f.replaceAll(RegExp(r'[._]'), ' '))
              .toList()
        : <String>[];
    final parts = [
      if (sub.isNotEmpty) sub,
      if (matchedFields.isNotEmpty) 'in ${matchedFields.join(', ')}',
    ];
    return parts.isEmpty ? null : parts.join(' · ');
  }

  Widget _hint(String text) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: AppColors.textFaint,
            fontSize: 13,
            fontFamily: 'Satoshi',
          ),
        ),
      ),
    );
  }
}

class _GroupHeader extends StatelessWidget {
  const _GroupHeader({required this.label, this.count});

  final String label;
  final int? count;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 14),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      color: AppColors.card,
      child: Text(
        count != null ? '${label.toUpperCase()} ($count)' : label.toUpperCase(),
        style: TextStyle(
          color: AppColors.textFaint,
          fontSize: 10,
          fontWeight: FontWeight.w600,
          letterSpacing: 1,
          fontFamily: 'Satoshi',
        ),
      ),
    );
  }
}

class _ResultTile extends StatelessWidget {
  const _ResultTile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.subtitle,
    this.statusMeta,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final StatusMeta? statusMeta;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
        child: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: AppRadius.smAll,
                border: Border.all(color: AppColors.border),
              ),
              child: Icon(icon, size: 15, color: AppColors.textMuted),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: AppColors.text,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Satoshi',
                    ),
                  ),
                  if (subtitle != null && subtitle!.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        subtitle!,
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
            if (statusMeta != null) ...[
              const SizedBox(width: 8),
              StatusBadge(meta: statusMeta!),
            ],
          ],
        ),
      ),
    );
  }
}
