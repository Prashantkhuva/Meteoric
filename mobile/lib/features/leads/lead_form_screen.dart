import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';

class LeadFormScreen extends StatefulWidget {
  const LeadFormScreen({super.key, this.lead});

  final Map<String, dynamic>? lead;

  @override
  State<LeadFormScreen> createState() => _LeadFormScreenState();
}

class _LeadFormScreenState extends State<LeadFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final _name = TextEditingController(text: widget.lead?['name'] ?? '');
  late final _email = TextEditingController(text: widget.lead?['email'] ?? '');
  late final _phone = TextEditingController(text: widget.lead?['phone'] ?? '');
  late final _company = TextEditingController(
    text: widget.lead?['company'] ?? '',
  );
  late final _services = TextEditingController(
    text: widget.lead?['services'] ?? '',
  );
  late final _budget = TextEditingController(
    text: widget.lead?['budget'] ?? '',
  );
  late final _details = TextEditingController(
    text: widget.lead?['details'] ?? '',
  );
  late String _source;
  late String _currency;
  bool _saving = false;
  bool _dirty = false;

  static const _currencies = ['USD', 'INR', 'EUR', 'GBP', 'AUD'];

  bool get _isEdit => widget.lead != null;

  @override
  void initState() {
    super.initState();
    _source = widget.lead?['source'] ?? 'manual';
    _currency = widget.lead?['currency'] ?? 'USD';
    for (final c in [
      _name,
      _email,
      _phone,
      _company,
      _services,
      _budget,
      _details,
    ]) {
      c.addListener(() {
        if (!_dirty) setState(() => _dirty = true);
      });
    }
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _phone.dispose();
    _company.dispose();
    _services.dispose();
    _budget.dispose();
    _details.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final payload = {
      if (_isEdit) 'id': (widget.lead!['id'] as num).toInt(),
      'name': _name.text.trim(),
      'email': _email.text.trim(),
      'phone': _phone.text.trim(),
      'company': _company.text.trim(),
      'services': _services.text.trim(),
      'budget': _budget.text.trim(),
      'currency': _currency,
      'details': _details.text.trim(),
      'source': _isEdit ? null : _source,
    }..removeWhere((k, v) => v == null);

    try {
      if (_isEdit) {
        await ApiClient.instance.leadUpdate(payload);
      } else {
        await ApiClient.instance.leadAdd(payload);
      }
      if (!mounted) return;
      _snack(_isEdit ? 'Lead updated' : 'Lead added');
      Navigator.of(context).pop(true);
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _snack(String msg, {bool isError = false}) =>
      isError ? Toast.error(context, msg) : Toast.success(context, msg);

  Future<bool> _onWillPop() async {
    if (!_dirty) return true;
    final discard = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.cardRaised,
        title: const Text('Discard changes?'),
        content: const Text('You have unsaved changes that will be lost.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text(
              'Discard',
              style: TextStyle(color: Color(0xFFEF4444)),
            ),
          ),
        ],
      ),
    );
    return discard == true;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldPop = await _onWillPop();
        if (shouldPop && context.mounted) Navigator.pop(context);
      },
      child: UnfocusOnTap(
        child: AppScaffold(
          title: _isEdit ? 'Edit lead' : 'Add lead',
          body: Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _field(_name, 'Name', required: true),
                const SizedBox(height: 12),
                _field(_email, 'Email', keyboard: TextInputType.emailAddress),
                const SizedBox(height: 12),
                _field(_phone, 'Phone', keyboard: TextInputType.phone),
                const SizedBox(height: 12),
                _field(_company, 'Company'),
                const SizedBox(height: 12),
                _field(_services, 'Services'),
                const SizedBox(height: 12),
                _field(_budget, 'Budget'),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _currency,
                  items: _currencies
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) => setState(() => _currency = v ?? 'USD'),
                  decoration: const InputDecoration(labelText: 'Currency'),
                ),
                const SizedBox(height: 12),
                _field(
                  _details,
                  'Details',
                  maxLines: 4,
                  textInputAction: TextInputAction.done,
                ),
                if (!_isEdit) ...[
                  const SizedBox(height: 16),
                  const Text(
                    'SOURCE',
                    style: TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 9,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.2,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final source in const [
                        'manual',
                        'website',
                        'cal.com',
                        'whatsapp',
                        'other',
                      ])
                        GestureDetector(
                          onTap: () => setState(() => _source = source),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: _source == source
                                  ? AppColors.accent
                                  : Colors.transparent,
                              border: Border.all(
                                color: _source == source
                                    ? AppColors.accent
                                    : AppColors.border,
                              ),
                            ),
                            child: Text(
                              source.toUpperCase(),
                              style: TextStyle(
                                color: _source == source
                                    ? AppColors.onAccent
                                    : AppColors.textMuted,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                fontFamily: 'Inter',
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
                const SizedBox(height: 24),
                AccentButton(
                  onPressed: _saving ? null : _save,
                  child: _saving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppColors.onAccent,
                          ),
                        )
                      : Text(_isEdit ? 'SAVE CHANGES' : 'ADD LEAD'),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _field(
    TextEditingController controller,
    String label, {
    bool required = false,
    int maxLines = 1,
    TextInputType? keyboard,
    TextInputAction textInputAction = TextInputAction.next,
  }) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      keyboardType: keyboard,
      textInputAction: textInputAction,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      validator: required
          ? (v) => (v == null || v.trim().isEmpty) ? '$label is required' : null
          : null,
      decoration: InputDecoration(labelText: label),
    );
  }
}
