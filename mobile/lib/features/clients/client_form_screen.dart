import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';

class ClientFormScreen extends StatefulWidget {
  const ClientFormScreen({super.key, this.client});

  final Map<String, dynamic>? client;

  @override
  State<ClientFormScreen> createState() => _ClientFormScreenState();
}

class _ClientFormScreenState extends State<ClientFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final _name = TextEditingController(text: widget.client?['name'] ?? '');
  late final _email = TextEditingController(text: widget.client?['email'] ?? '');
  late final _phone = TextEditingController(text: widget.client?['phone'] ?? '');
  late final _company = TextEditingController(text: widget.client?['company'] ?? '');
  bool _saving = false;

  bool get _isEdit => widget.client != null;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _phone.dispose();
    _company.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final payload = {
      if (_isEdit) 'id': (widget.client!['id'] as num).toInt(),
      'name': _name.text.trim(),
      'email': _email.text.trim(),
      'phone': _phone.text.trim(),
      'company': _company.text.trim(),
    };

    try {
      final res = _isEdit
          ? await ApiClient.instance.clientUpdate(payload)
          : await ApiClient.instance.clientAdd(payload);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(_isEdit ? 'Client updated' : 'Client added');
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
      title: _isEdit ? 'Edit client' : 'Add client',
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _name,
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Name is required' : null,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _phone,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(labelText: 'Phone'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _company,
              decoration: const InputDecoration(labelText: 'Company'),
            ),
            const SizedBox(height: 24),
            AccentButton(
              onPressed: _saving ? null : _save,
              child: _saving
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF121212)),
                    )
                  : Text(_isEdit ? 'SAVE CHANGES' : 'ADD CLIENT'),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}