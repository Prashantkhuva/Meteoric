import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/theme.dart';
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
  late final _company = TextEditingController(text: widget.lead?['company'] ?? '');
  late final _services = TextEditingController(text: widget.lead?['services'] ?? '');
  late final _budget = TextEditingController(text: widget.lead?['budget'] ?? '');
  late final _details = TextEditingController(text: widget.lead?['details'] ?? '');
  late String _source;
  bool _saving = false;

  bool get _isEdit => widget.lead != null;

  @override
  void initState() {
    super.initState();
    _source = widget.lead?['source'] ?? 'manual';
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
      'details': _details.text.trim(),
      'source': _isEdit ? null : _source,
    }..removeWhere((k, v) => v == null);

    try {
      final res = _isEdit
          ? await ApiClient.instance.leadUpdate(payload)
          : await ApiClient.instance.leadAdd(payload);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(_isEdit ? 'Lead updated' : 'Lead added');
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
        backgroundColor: isError ? AppColors.red.withValues(alpha: 0.9) : AppColors.cardRaised,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
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
            _field(_details, 'Details', maxLines: 4),
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
                    'manual', 'website', 'cal.com', 'whatsapp', 'other',
                  ])
                    GestureDetector(
                      onTap: () => setState(() => _source = source),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: _source == source ? AppColors.accent : Colors.transparent,
                          border: Border.all(color: _source == source ? AppColors.accent : AppColors.border),
                        ),
                        child: Text(
                          source.toUpperCase(),
                          style: TextStyle(
                            color: _source == source ? const Color(0xFF121212) : AppColors.textMuted,
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
                      child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF121212)),
                    )
                  : Text(_isEdit ? 'SAVE CHANGES' : 'ADD LEAD'),
            ),
            const SizedBox(height: 16),
          ],
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
  }) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      keyboardType: keyboard,
      validator: required
          ? (v) => (v == null || v.trim().isEmpty) ? '$label is required' : null
          : null,
      decoration: InputDecoration(labelText: label),
    );
  }
}