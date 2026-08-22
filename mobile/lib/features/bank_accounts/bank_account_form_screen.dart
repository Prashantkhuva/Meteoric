import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';

const _currencies = ['USD', 'INR', 'EUR', 'GBP', 'AUD'];

class BankAccountFormScreen extends StatefulWidget {
  const BankAccountFormScreen({super.key, this.account});

  final Map<String, dynamic>? account;

  @override
  State<BankAccountFormScreen> createState() => _BankAccountFormScreenState();
}

class _BankAccountFormScreenState extends State<BankAccountFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final _label = TextEditingController(
    text: widget.account?['label'] ?? '',
  );
  late final _bankName = TextEditingController(
    text: widget.account?['bank_name'] ?? '',
  );
  late final _accountHolder = TextEditingController(
    text: widget.account?['account_holder'] ?? '',
  );
  late final _accountNumber = TextEditingController(
    text: widget.account?['account_number'] ?? '',
  );
  late final _iban = TextEditingController(text: widget.account?['iban'] ?? '');
  late final _swift = TextEditingController(
    text: widget.account?['swift'] ?? '',
  );
  late final _routingNumber = TextEditingController(
    text: widget.account?['routing_number'] ?? '',
  );
  late final _country = TextEditingController(
    text: widget.account?['country'] ?? '',
  );
  late final _upiId = TextEditingController(
    text: widget.account?['upi_id'] ?? '',
  );
  late String _currency = (widget.account?['currency'] as String?) ?? 'USD';
  late bool _isDefault = widget.account?['is_default'] == true;
  bool _saving = false;

  bool get _isEdit => widget.account != null;

  @override
  void dispose() {
    _label.dispose();
    _bankName.dispose();
    _accountHolder.dispose();
    _accountNumber.dispose();
    _iban.dispose();
    _swift.dispose();
    _routingNumber.dispose();
    _country.dispose();
    _upiId.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final payload = {
      if (_isEdit) 'id': (widget.account!['id'] as num).toInt(),
      'label': _label.text.trim(),
      'bank_name': _bankName.text.trim(),
      'account_holder': _accountHolder.text.trim(),
      'account_number': _accountNumber.text.trim(),
      'iban': _iban.text.trim(),
      'swift': _swift.text.trim(),
      'routing_number': _routingNumber.text.trim(),
      'currency': _currency,
      'country': _country.text.trim(),
      if (_currency == 'INR') 'upi_id': _upiId.text.trim(),
      'is_default': _isDefault,
    };

    try {
      final res = _isEdit
          ? await ApiClient.instance.bankAccountUpdate(payload)
          : await ApiClient.instance.bankAccountCreate(payload);
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(_isEdit ? 'Bank account updated' : 'Bank account added');
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
      title: _isEdit ? 'Edit bank account' : 'Add bank account',
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _label,
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Label is required' : null,
              decoration: const InputDecoration(
                labelText: 'Label (e.g. Primary USD)',
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _accountHolder,
              validator: (v) => (v == null || v.trim().isEmpty)
                  ? 'Account holder is required'
                  : null,
              decoration: const InputDecoration(labelText: 'Account holder'),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _currency,
              decoration: const InputDecoration(labelText: 'Currency'),
              dropdownColor: AppColors.cardRaised,
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 14,
                fontFamily: 'Inter',
              ),
              items: [
                for (final c in _currencies)
                  DropdownMenuItem(value: c, child: Text(c)),
              ],
              onChanged: (v) => setState(() => _currency = v ?? 'USD'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _country,
              decoration: const InputDecoration(labelText: 'Country'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _bankName,
              decoration: const InputDecoration(labelText: 'Bank name'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _accountNumber,
              decoration: const InputDecoration(labelText: 'Account number'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _iban,
              decoration: const InputDecoration(labelText: 'IBAN'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _swift,
              decoration: const InputDecoration(labelText: 'SWIFT / BIC'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _routingNumber,
              decoration: const InputDecoration(labelText: 'Routing number'),
            ),
            if (_currency == 'INR') ...[
              const SizedBox(height: 12),
              TextFormField(
                controller: _upiId,
                decoration: const InputDecoration(labelText: 'UPI ID'),
              ),
            ],
            const SizedBox(height: 16),
            InkWell(
              onTap: () => setState(() => _isDefault = !_isDefault),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Icon(
                      _isDefault
                          ? Icons.check_box
                          : Icons.check_box_outline_blank,
                      size: 20,
                      color: _isDefault
                          ? AppColors.accent
                          : AppColors.textFaint,
                    ),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Text(
                        'Set as default account',
                        style: TextStyle(
                          color: AppColors.text,
                          fontSize: 13,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
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
                  : Text(_isEdit ? 'SAVE CHANGES' : 'ADD ACCOUNT'),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
