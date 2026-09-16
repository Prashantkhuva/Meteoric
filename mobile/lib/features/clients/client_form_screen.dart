import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
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
  late final _email = TextEditingController(
    text: widget.client?['email'] ?? '',
  );
  late final _phone = TextEditingController(
    text: widget.client?['phone'] ?? '',
  );
  late final _company = TextEditingController(
    text: widget.client?['company'] ?? '',
  );
  bool _saving = false;
  bool _dirty = false;

  bool get _isEdit => widget.client != null;

  @override
  void initState() {
    super.initState();
    for (final c in [_name, _email, _phone, _company]) {
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
      if (_isEdit) {
        await ApiClient.instance.clientUpdate(payload);
      } else {
        await ApiClient.instance.clientAdd(payload);
      }
      if (!mounted) return;
      _snack(_isEdit ? 'Client updated' : 'Client added');
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
            child: const Text('Discard',
                style: TextStyle(color: Color(0xFFEF4444))),
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
          title: _isEdit ? 'Edit client' : 'Add client',
          body: Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                TextFormField(
                  controller: _name,
                  textInputAction: TextInputAction.next,
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Name is required' : null,
                  decoration: const InputDecoration(labelText: 'Name'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(labelText: 'Phone'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _company,
                  textInputAction: TextInputAction.done,
                  decoration: const InputDecoration(labelText: 'Company'),
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
                            color: AppColors.onAccent,
                          ),
                        )
                      : Text(_isEdit ? 'SAVE CHANGES' : 'ADD CLIENT'),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
