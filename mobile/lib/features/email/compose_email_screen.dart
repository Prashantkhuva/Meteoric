import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/rich_text_editor.dart';

class ComposeEmailScreen extends StatefulWidget {
  const ComposeEmailScreen({super.key});

  @override
  State<ComposeEmailScreen> createState() => _ComposeEmailScreenState();
}

class _ComposeEmailScreenState extends State<ComposeEmailScreen> {
  static const _senders = [
    ('contact', 'Contact', 'contact@withmeteoric.com'),
    ('admin', 'Admin', 'admin@withmeteoric.com'),
    ('billing', 'Billing', 'billing@withmeteoric.com'),
    ('support', 'Support', 'support@withmeteoric.com'),
  ];

  String _from = 'contact';
  final _subject = TextEditingController();
  final _search = TextEditingController();
  dynamic _body;

  final List<String> _to = [];
  String _searchFilter = 'all';
  bool _sending = false;

  bool _recipientsLoaded = false;
  List<Map<String, dynamic>> _recipients = [];
  String? _recipientsError;

  @override
  void initState() {
    super.initState();
    _loadRecipients();
  }

  @override
  void dispose() {
    _subject.dispose();
    _search.dispose();
    super.dispose();
  }

  Future<void> _loadRecipients() async {
    setState(() {
      _recipientsLoaded = true;
      _recipientsError = null;
    });
    try {
      final res = await ApiClient.instance.emailRecipients();
      if (mounted) {
        setState(() {
          _recipients = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
        });
      }
    } catch (err) {
      if (mounted) setState(() => _recipientsError = err.toString());
    }
  }

  List<Map<String, dynamic>> get _filteredRecipients {
    final q = _search.text.trim().toLowerCase();
    return _recipients.where((r) {
      if (_to.contains(r['email'])) return false;
      final email = (r['email'] ?? '').toLowerCase();
      final name = (r['name'] ?? '').toLowerCase();
      final matchesSearch = q.isEmpty || name.contains(q) || email.contains(q);
      final matchesType = _searchFilter == 'all' || r['type'] == _searchFilter;
      return matchesSearch && matchesType;
    }).toList();
  }

  void _addRecipient(String email) {
    setState(() {
      if (!_to.contains(email)) _to.add(email);
      _search.clear();
    });
  }

  void _addCustomEmail() {
    final trimmed = _search.text.trim();
    if (trimmed.isNotEmpty && trimmed.contains('@')) {
      _addRecipient(trimmed);
    }
  }

  Future<void> _send() async {
    if (_to.isEmpty || _subject.text.trim().isEmpty || _body == null) {
      _snack('Add recipients, subject and body', isError: true);
      return;
    }
    setState(() => _sending = true);
    try {
      final res = await ApiClient.instance.emailSend({
        'from': _from,
        'to': _to,
        'subject': _subject.text.trim(),
        'body': _body,
        'files': const [],
      });
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack('Email sent');
        Navigator.of(context).pop(true);
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  void _snack(String msg, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isError
            ? AppColors.red.withValues(alpha: 0.9)
            : AppColors.cardRaised,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Compose email',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            initialValue: _from,
            decoration: const InputDecoration(labelText: 'From'),
            items: [
              for (final (value, label, email) in _senders)
                DropdownMenuItem(value: value, child: Text('$label ($email)')),
            ],
            onChanged: (v) => setState(() => _from = v ?? 'contact'),
          ),
          const SizedBox(height: 12),
          if (_recipientsError != null)
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Could not load recipients: $_recipientsError',
                    style: const TextStyle(
                      color: AppColors.red,
                      fontSize: 11,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
                TextButton(
                  onPressed: _loadRecipients,
                  child: const Text('Retry'),
                ),
              ],
            )
          else if (!_recipientsLoaded)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            )
          else
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_to.isNotEmpty)
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      for (final email in _to)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: AppColors.accent.withValues(alpha: 0.4),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                email,
                                style: const TextStyle(
                                  color: AppColors.accent,
                                  fontSize: 11,
                                  fontFamily: 'Inter',
                                ),
                              ),
                              const SizedBox(width: 6),
                              GestureDetector(
                                onTap: () => setState(() => _to.remove(email)),
                                child: const Icon(
                                  Icons.close,
                                  size: 12,
                                  color: AppColors.accent,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: _searchFilter,
                  decoration: const InputDecoration(
                    labelText: 'Recipient type',
                    isDense: true,
                  ),
                  items: const [
                    DropdownMenuItem(value: 'all', child: Text('All')),
                    DropdownMenuItem(value: 'client', child: Text('Clients')),
                    DropdownMenuItem(value: 'lead', child: Text('Leads')),
                    DropdownMenuItem(
                      value: 'prospect',
                      child: Text('Prospects'),
                    ),
                  ],
                  onChanged: (v) => setState(() => _searchFilter = v ?? 'all'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _search,
                  onSubmitted: (_) => _addCustomEmail(),
                  decoration: InputDecoration(
                    labelText: 'Search or type email, press enter to add',
                    isDense: true,
                    prefixIcon: const Icon(
                      Icons.search,
                      size: 16,
                      color: AppColors.textFaint,
                    ),
                  ),
                ),
                if (_filteredRecipients.isNotEmpty)
                  Container(
                    margin: const EdgeInsets.only(top: 6),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      color: AppColors.card,
                    ),
                    child: Column(
                      children: [
                        for (final r in _filteredRecipients.take(8))
                          InkWell(
                            onTap: () =>
                                _addRecipient((r['email'] ?? '') as String),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 10,
                              ),
                              decoration: const BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(color: AppColors.border),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      r['name'] ?? (r['email'] ?? ''),
                                      style: const TextStyle(
                                        color: AppColors.text,
                                        fontSize: 13,
                                        fontFamily: 'Inter',
                                      ),
                                    ),
                                  ),
                                  Text(
                                    '${r['email']}',
                                    style: const TextStyle(
                                      color: AppColors.textFaint,
                                      fontSize: 11,
                                      fontFamily: 'Inter',
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
              ],
            ),
          const SizedBox(height: 16),
          TextField(
            controller: _subject,
            decoration: const InputDecoration(labelText: 'Subject'),
          ),
          const SizedBox(height: 16),
          const Padding(
            padding: EdgeInsets.only(bottom: 8),
            child: Text(
              'BODY',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
          ),
          InlineRichEditor(
            initialContent: _body,
            onChanged: (value) => _body = value,
            outputFormat: 'html',
            placeholder: 'Write your email...',
            autoGrow: true,
          ),
          const SizedBox(height: 24),
          AccentButton(
            onPressed: _sending ? null : _send,
            child: _sending
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Color(0xFF121212),
                    ),
                  )
                : const Text('SEND EMAIL'),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
