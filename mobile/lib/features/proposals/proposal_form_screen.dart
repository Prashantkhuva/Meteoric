import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/rich_text_editor_screen.dart';

class ProposalFormScreen extends StatefulWidget {
  const ProposalFormScreen({super.key, this.proposal});

  final Map<String, dynamic>? proposal;

  @override
  State<ProposalFormScreen> createState() => _ProposalFormScreenState();
}

class _ProposalFormScreenState extends State<ProposalFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final _title = TextEditingController(
    text: widget.proposal?['title'] ?? '',
  );
  late final _timeline = TextEditingController(
    text: widget.proposal?['timeline'] ?? '',
  );
  late final _terms = TextEditingController(
    text: widget.proposal?['terms'] ?? '',
  );

  String? _leadId;
  dynamic _content;
  List<Map<String, dynamic>> _pricing = [];
  bool _saving = false;
  bool _generating = false;
  bool _leadsLoaded = false;
  List<Map<String, dynamic>> _leads = [];
  String? _leadsError;

  bool get _isEdit => widget.proposal != null;

  @override
  void initState() {
    super.initState();
    _leadId = widget.proposal?['lead_id'];
    _content = widget.proposal?['content'];
    final pricing = widget.proposal?['pricing'];
    if (pricing is List) {
      _pricing = pricing
          .map((e) => (e as Map).cast<String, dynamic>())
          .toList();
    }
    _loadLeads();
  }

  @override
  void dispose() {
    _title.dispose();
    _timeline.dispose();
    _terms.dispose();
    super.dispose();
  }

  Future<void> _loadLeads() async {
    setState(() {
      _leadsLoaded = true;
      _leadsError = null;
    });
    try {
      final res = await ApiClient.instance.leadsSimple();
      if (mounted) {
        setState(() {
          _leads = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
        });
      }
    } catch (err) {
      if (mounted) setState(() => _leadsError = err.toString());
    }
  }

  Future<void> _generate() async {
    if (_leadId == null) {
      _snack('Select a lead first', isError: true);
      return;
    }
    setState(() => _generating = true);
    try {
      final res = await ApiClient.instance.proposalDraft(int.parse(_leadId!));
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        final draft = res['data'] as Map<String, dynamic>? ?? const {};
        setState(() {
          if (draft['title'] != null) _title.text = draft['title'] as String;
          if (draft['timeline'] != null) {
            _timeline.text = draft['timeline'] as String;
          }
          if (draft['terms'] != null) _terms.text = draft['terms'] as String;
          if (draft['content'] != null) _content = draft['content'];
          if (draft['pricing'] is List) {
            _pricing = (draft['pricing'] as List)
                .map((e) => (e as Map).cast<String, dynamic>())
                .toList();
          }
        });
        _snack('Draft generated');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _generating = false);
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final payload = {
      if (_isEdit) 'id': (widget.proposal!['id'] as num).toInt(),
      'lead_id': _leadId,
      'title': _title.text.trim(),
      if (_content != null) 'content': _content,
      'pricing': _pricing,
      'timeline': _timeline.text.trim(),
      'terms': _terms.text.trim(),
    };

    try {
      final res = _isEdit
          ? await ApiClient.instance.proposalUpdate(payload)
          : await ApiClient.instance.proposalCreate(payload);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(_isEdit ? 'Proposal updated' : 'Proposal created');
        Navigator.of(context).pop(true);
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _snack(String msg, {bool isError = false}) =>
      isError ? Toast.error(context, msg) : Toast.success(context, msg);

  void _addPricingRow() {
    setState(() => _pricing.add({'description': '', 'quantity': 1, 'rate': 0}));
  }

  void _removePricingRow(int i) {
    setState(() => _pricing.removeAt(i));
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: _isEdit ? 'Edit proposal' : 'New proposal',
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _title,
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Title is required' : null,
              decoration: const InputDecoration(labelText: 'Title'),
            ),
            const SizedBox(height: 12),
            _leadField(),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: GhostButton(
                    onPressed: _generating ? null : _generate,
                    child: _generating
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('AI GENERATE'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _contentSection(),
            const SizedBox(height: 20),
            _pricingSection(),
            const SizedBox(height: 20),
            TextFormField(
              controller: _timeline,
              decoration: const InputDecoration(labelText: 'Timeline'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _terms,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Terms'),
            ),
            const SizedBox(height: 24),
            AccentButton(
              onPressed: _saving ? null : _save,
              child: _saving
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Color(0xFF121212),
                      ),
                    )
                  : Text(_isEdit ? 'SAVE CHANGES' : 'CREATE PROPOSAL'),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _leadField() {
    if (_leadsError != null) {
      return Row(
        children: [
          Expanded(
            child: Text(
              'Could not load leads: $_leadsError',
              style: const TextStyle(
                color: AppColors.red,
                fontSize: 11,
                fontFamily: 'Inter',
              ),
            ),
          ),
          TextButton(onPressed: _loadLeads, child: const Text('Retry')),
        ],
      );
    }
    if (!_leadsLoaded) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 8),
        child: SizedBox(
          width: 18,
          height: 18,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      );
    }

    return DropdownButtonFormField<String>(
      initialValue: _leadId,
      decoration: const InputDecoration(labelText: 'Lead'),
      items: [
        const DropdownMenuItem(value: '', child: Text('No lead linked')),
        for (final lead in _leads)
          DropdownMenuItem(
            value: '${lead['id']}',
            child: Text(
              '${lead['name']}${lead['company'] != null ? ' (${lead['company']})' : ''}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
      ],
      onChanged: (v) => setState(() => _leadId = v == '' ? null : v),
    );
  }

  Widget _contentSection() {
    final hasContent = _content != null;
    return SectionCard(
      title: 'Proposal content',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (hasContent)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Text(
                _contentPreview(),
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 12,
                  fontFamily: 'Inter',
                ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          AccentButton(
            height: 40,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            onPressed: () => _openEditor(),
            child: Text(hasContent ? 'EDIT CONTENT' : 'ADD CONTENT'),
          ),
        ],
      ),
    );
  }

  String _contentPreview() {
    if (_content is String) return _content as String;
    if (_content is Map && (_content as Map)['content'] is List) {
      final parts = <String>[];
      for (final node in ((_content as Map)['content'] as List).cast<Map>()) {
        if (node['content'] is List) {
          for (final leaf in (node['content'] as List).cast<Map>()) {
            if (leaf['text'] is String) parts.add(leaf['text'] as String);
          }
        }
      }
      return parts.join(' ');
    }
    return 'Content added';
  }

  Future<void> _openEditor() async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => RichTextEditorScreen(
          initialContent: _content,
          title: 'Proposal content',
          onSave: (content) => setState(() => _content = content),
        ),
      ),
    );
  }

  Widget _pricingSection() {
    return SectionCard(
      title: 'Pricing',
      child: Column(
        children: [
          if (_pricing.isEmpty)
            const Padding(
              padding: EdgeInsets.only(bottom: 12),
              child: Text(
                'No line items yet.',
                style: TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 12,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          for (var i = 0; i < _pricing.length; i++)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _pricingRow(i),
            ),
          GhostButton(
            height: 40,
            onPressed: _addPricingRow,
            child: const Text('ADD LINE ITEM'),
          ),
        ],
      ),
    );
  }

  Widget _pricingRow(int i) {
    final item = _pricing[i];
    final desc = TextEditingController(text: item['description'] ?? '');
    final qty = TextEditingController(text: '${item['quantity'] ?? 1}');
    final rate = TextEditingController(text: '${item['rate'] ?? 0}');

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        color: AppColors.card,
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: desc,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    isDense: true,
                  ),
                  onChanged: (v) => item['description'] = v,
                ),
              ),
              IconButton(
                icon: const Icon(
                  Icons.close,
                  size: 16,
                  color: AppColors.textFaint,
                ),
                onPressed: () => _removePricingRow(i),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: qty,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Qty',
                    isDense: true,
                  ),
                  onChanged: (v) => item['quantity'] = num.tryParse(v) ?? 1,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: rate,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Rate',
                    isDense: true,
                  ),
                  onChanged: (v) => item['rate'] = num.tryParse(v) ?? 0,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
