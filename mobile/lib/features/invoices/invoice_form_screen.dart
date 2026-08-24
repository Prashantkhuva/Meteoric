import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';

class InvoiceFormScreen extends StatefulWidget {
  const InvoiceFormScreen({super.key, this.invoice});

  final Map<String, dynamic>? invoice;

  @override
  State<InvoiceFormScreen> createState() => _InvoiceFormScreenState();
}

class _InvoiceFormScreenState extends State<InvoiceFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final _notes = TextEditingController(
    text: widget.invoice?['notes'] ?? '',
  );
  late final _terms = TextEditingController(
    text: widget.invoice?['terms'] ?? '',
  );

  String? _clientId;
  String? _proposalId;
  String? _bankAccountId;
  String _currency = 'USD';
  String _tax = '0';
  String? _dueDate;
  List<Map<String, dynamic>> _items = [];
  bool _saving = false;

  bool _clientsLoaded = false;
  List<Map<String, dynamic>> _clients = [];
  String? _clientsError;

  List<Map<String, dynamic>> _proposals = [];

  List<Map<String, dynamic>> _banks = [];

  bool get _isEdit => widget.invoice != null;

  @override
  void initState() {
    super.initState();
    _clientId = widget.invoice?['client_id'];
    _proposalId = widget.invoice?['proposal_id'];
    _bankAccountId = widget.invoice?['bank_account_id'];
    _currency = widget.invoice?['currency'] ?? 'USD';
    _tax = '${widget.invoice?['tax'] ?? 0}';
    _dueDate = widget.invoice?['due_date'];
    final items = widget.invoice?['items'];
    if (items is List) {
      _items = items.map((e) => (e as Map).cast<String, dynamic>()).toList();
    }
    _loadRefs();
  }

  @override
  void dispose() {
    _notes.dispose();
    _terms.dispose();
    super.dispose();
  }

  Future<void> _loadRefs() async {
    setState(() {
      _clientsLoaded = true;
      _clientsError = null;
    });
    try {
      final clients = await ApiClient.instance.clientsSimple();
      final banks = await ApiClient.instance.bankAccountsList();
      final proposals = await ApiClient.instance.proposalsList({
        'page': 1,
        'pageSize': 100,
      });
      if (mounted) {
        setState(() {
          _clients = ((clients['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _banks = ((banks['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _proposals = ((proposals['data'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
        });
      }
    } catch (err) {
      if (mounted) setState(() => _clientsError = err.toString());
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final payload = {
      if (_isEdit) 'id': (widget.invoice!['id'] as num).toInt(),
      'client_id': _clientId,
      'proposal_id': _proposalId,
      'bank_account_id': _bankAccountId,
      'items': _items,
      'tax': num.tryParse(_tax) ?? 0,
      'currency': _currency,
      'notes': _notes.text.trim(),
      'terms': _terms.text.trim(),
      'due_date': _dueDate,
    };

    try {
      final res = _isEdit
          ? await ApiClient.instance.invoiceUpdate(payload)
          : await ApiClient.instance.invoiceCreate(payload);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(_isEdit ? 'Invoice updated' : 'Invoice created');
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

  Future<void> _pickDueDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _dueDate != null ? DateTime.tryParse(_dueDate!) ?? now : now,
      firstDate: now.subtract(const Duration(days: 365)),
      lastDate: now.add(const Duration(days: 3650)),
    );
    if (picked != null && mounted) {
      setState(() => _dueDate = picked.toIso8601String().split('T').first);
    }
  }

  void _addItem() {
    setState(() => _items.add({'description': '', 'quantity': 1, 'rate': 0}));
  }

  void _removeItem(int i) {
    setState(() => _items.removeAt(i));
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: _isEdit ? 'Edit invoice' : 'New invoice',
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _refsField(),
            const SizedBox(height: 16),
            SectionCard(
              title: 'Line items',
              child: Column(
                children: [
                  if (_items.isEmpty)
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
                  for (var i = 0; i < _items.length; i++)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: _itemRow(i),
                    ),
                  GhostButton(
                    height: 40,
                    onPressed: _addItem,
                    child: const Text('ADD LINE ITEM'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    initialValue: _tax,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Tax'),
                    onChanged: (v) => _tax = v,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    initialValue: _currency,
                    decoration: const InputDecoration(labelText: 'Currency'),
                    items: const [
                      DropdownMenuItem(value: 'USD', child: Text('USD')),
                      DropdownMenuItem(value: 'EUR', child: Text('EUR')),
                      DropdownMenuItem(value: 'GBP', child: Text('GBP')),
                      DropdownMenuItem(value: 'INR', child: Text('INR')),
                      DropdownMenuItem(value: 'AED', child: Text('AED')),
                    ],
                    onChanged: (v) => setState(() => _currency = v ?? 'USD'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: _pickDueDate,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 16,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  color: AppColors.card,
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.calendar_today_outlined,
                      size: 15,
                      color: AppColors.textFaint,
                    ),
                    const SizedBox(width: 10),
                    Text(
                      _dueDate == null ? 'Set due date' : 'Due: $_dueDate',
                      style: TextStyle(
                        color: _dueDate == null
                            ? AppColors.textFaint
                            : AppColors.text,
                        fontSize: 13,
                        fontFamily: 'Inter',
                      ),
                    ),
                    const Spacer(),
                    if (_dueDate != null)
                      GestureDetector(
                        onTap: () => setState(() => _dueDate = null),
                        child: const Icon(
                          Icons.close,
                          size: 15,
                          color: AppColors.textFaint,
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _notes,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Notes'),
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
                  : Text(_isEdit ? 'SAVE CHANGES' : 'CREATE INVOICE'),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _refsField() {
    if (_clientsError != null) {
      return Row(
        children: [
          Expanded(
            child: Text(
              'Could not load references: $_clientsError',
              style: const TextStyle(
                color: AppColors.red,
                fontSize: 11,
                fontFamily: 'Inter',
              ),
            ),
          ),
          TextButton(onPressed: _loadRefs, child: const Text('Retry')),
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

    return Column(
      children: [
        DropdownButtonFormField<String>(
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
        ),
        const SizedBox(height: 12),
        DropdownButtonFormField<String>(
          initialValue: _proposalId,
          decoration: const InputDecoration(labelText: 'Proposal (optional)'),
          items: [
            const DropdownMenuItem(
              value: '',
              child: Text('No proposal linked'),
            ),
            for (final p in _proposals)
              DropdownMenuItem(
                value: '${p['id']}',
                child: Text(
                  p['title'] ?? 'Proposal #${p['id']}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
          ],
          onChanged: (v) => setState(() => _proposalId = v == '' ? null : v),
        ),
        const SizedBox(height: 12),
        DropdownButtonFormField<String>(
          initialValue: _bankAccountId,
          decoration: const InputDecoration(
            labelText: 'Bank account (optional)',
          ),
          items: [
            const DropdownMenuItem(value: '', child: Text('No bank account')),
            for (final b in _banks)
              DropdownMenuItem(
                value: '${b['id']}',
                child: Text(
                  b['label'] ?? 'Account #${b['id']}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
          ],
          onChanged: (v) => setState(() => _bankAccountId = v == '' ? null : v),
        ),
      ],
    );
  }

  Widget _itemRow(int i) {
    final item = _items[i];
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
                onPressed: () => _removeItem(i),
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
