import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';

class ProjectFormScreen extends StatefulWidget {
  const ProjectFormScreen({super.key, this.project});

  final Map<String, dynamic>? project;

  @override
  State<ProjectFormScreen> createState() => _ProjectFormScreenState();
}

class _ProjectFormScreenState extends State<ProjectFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final _name = TextEditingController(text: widget.project?['name'] ?? '');
  late final _description = TextEditingController(
    text: widget.project?['description'] ?? '',
  );
  late final _services = TextEditingController(
    text: widget.project?['services'] ?? '',
  );
  late final _budget = TextEditingController(
    text: (widget.project?['budget'] as num?)?.toString() ?? '',
  );
  late final _notes = TextEditingController(
    text: widget.project?['notes'] ?? '',
  );

  String? _clientId;
  String? _startDate;
  String? _deadline;
  bool _saving = false;

  bool _clientsLoaded = false;
  List<Map<String, dynamic>> _clients = [];
  String? _clientsError;

  bool get _isEdit => widget.project != null;

  @override
  void initState() {
    super.initState();
    _clientId = widget.project?['client_id'];
    _startDate = widget.project?['start_date'];
    _deadline = widget.project?['deadline'];
    _loadClients();
  }

  @override
  void dispose() {
    _name.dispose();
    _description.dispose();
    _services.dispose();
    _budget.dispose();
    _notes.dispose();
    super.dispose();
  }

  Future<void> _loadClients() async {
    setState(() {
      _clientsLoaded = true;
      _clientsError = null;
    });
    try {
      final res = await ApiClient.instance.clientsSimple();
      if (mounted) {
        setState(() {
          _clients = ((res['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
        });
      }
    } catch (err) {
      if (mounted) setState(() => _clientsError = err.toString());
    }
  }

  Future<void> _pickDate(String field) async {
    final current = field == 'start' ? _startDate : _deadline;
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: current != null ? DateTime.tryParse(current) ?? now : now,
      firstDate: now.subtract(const Duration(days: 365)),
      lastDate: now.add(const Duration(days: 3650)),
    );
    if (picked != null && mounted) {
      setState(() {
        final iso = picked.toIso8601String().split('T').first;
        if (field == 'start') {
          _startDate = iso;
        } else {
          _deadline = iso;
        }
      });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final payload = {
      if (_isEdit) 'id': (widget.project!['id'] as num).toInt(),
      'client_id': _clientId,
      'name': _name.text.trim(),
      'description': _description.text.trim(),
      'services': _services.text.trim(),
      'budget': num.tryParse(_budget.text.trim()),
      'start_date': _startDate,
      'deadline': _deadline,
      'notes': _notes.text.trim(),
    };

    try {
      final res = _isEdit
          ? await ApiClient.instance.projectUpdate(payload)
          : await ApiClient.instance.projectCreate(payload);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(_isEdit ? 'Project updated' : 'Project created');
        Navigator.of(context).pop(true);
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _saving = false);
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
      title: _isEdit ? 'Edit project' : 'New project',
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _name,
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Name is required' : null,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            const SizedBox(height: 12),
            _clientField(),
            const SizedBox(height: 12),
            TextFormField(
              controller: _description,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Description'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _services,
              decoration: const InputDecoration(labelText: 'Services'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _budget,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Budget'),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _dateTile(
                    'Start date',
                    _startDate,
                    () => _pickDate('start'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _dateTile(
                    'Deadline',
                    _deadline,
                    () => _pickDate('deadline'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _notes,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Notes'),
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
                  : Text(_isEdit ? 'SAVE CHANGES' : 'CREATE PROJECT'),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _clientField() {
    if (_clientsError != null) {
      return Row(
        children: [
          Expanded(
            child: Text(
              'Could not load clients: $_clientsError',
              style: const TextStyle(
                color: AppColors.red,
                fontSize: 11,
                fontFamily: 'Inter',
              ),
            ),
          ),
          TextButton(onPressed: _loadClients, child: const Text('Retry')),
        ],
      );
    }
    if (!_clientsLoaded) {
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
      initialValue: _clientId,
      decoration: const InputDecoration(labelText: 'Client'),
      items: [
        const DropdownMenuItem(value: '', child: Text('No client linked')),
        for (final client in _clients)
          DropdownMenuItem(
            value: '${client['id']}',
            child: Text(
              '${client['name']}${client['company'] != null ? ' (${client['company']})' : ''}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
      ],
      onChanged: (v) => setState(() => _clientId = v == '' ? null : v),
    );
  }

  Widget _dateTile(String label, String? value, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.border),
          color: AppColors.card,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label.toUpperCase(),
              style: const TextStyle(
                color: AppColors.textFaint,
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 6),
            Text(
              value ?? 'Not set',
              style: TextStyle(
                color: value == null ? AppColors.textFaint : AppColors.text,
                fontSize: 13,
                fontFamily: 'Inter',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
