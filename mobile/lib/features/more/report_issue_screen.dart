import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../core/app_version.dart';
import '../../core/config.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';

class ReportIssueScreen extends StatefulWidget {
  const ReportIssueScreen({super.key});

  @override
  State<ReportIssueScreen> createState() => _ReportIssueScreenState();
}

class _ReportIssueScreenState extends State<ReportIssueScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  String _type = 'bug';
  bool _submitting = false;

  static const _types = [
    ('bug', 'Bug Report', Icons.bug_report_outlined),
    ('suggestion', 'Suggestion', Icons.lightbulb_outline),
    ('feedback', 'Feedback', Icons.chat_bubble_outline),
  ];

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);

    try {
      final token = AuthService.accessToken;
      if (token == null) throw Exception('Not authenticated');

      final body = {
        'type': 'manual',
        'issueType': _type,
        'title': _titleCtrl.text.trim(),
        'description': _descCtrl.text.trim(),
        'version': AppVersion.version,
        'patch': AppVersion.patch,
        'platform': Theme.of(context).platform.toString().split('.').last,
        'osVersion': 'unknown',
      };

      final res = await http.post(
        Uri.parse('${AppConfig.apiBaseUrl}/api/admin/report-issue'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      final json = jsonDecode(res.body) as Map<String, dynamic>;
      if (res.statusCode == 200 && json['success'] == true) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Submitted! Thank you for your feedback.'),
              backgroundColor: AppColors.emerald,
            ),
          );
          Navigator.of(context).pop();
        }
      } else {
        throw Exception(json['error'] ?? 'Submission failed');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed: $e'),
            backgroundColor: AppColors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Report Issue')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Type selector
            const Text(
              'TYPE',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: _types.map((t) {
                final selected = _type == t.$1;
                return Expanded(
                  child: GestureDetector(
                    onTap: () {
                      Haptic.tap();
                      setState(() => _type = t.$1);
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: selected
                            ? AppColors.accent.withValues(alpha: 0.12)
                            : AppColors.card,
                        border: Border.all(
                          color: selected ? AppColors.accent : AppColors.border,
                        ),
                        borderRadius: AppRadius.mdAll,
                      ),
                      child: Column(
                        children: [
                          Icon(
                            t.$3,
                            size: 20,
                            color: selected
                                ? AppColors.accent
                                : AppColors.textMuted,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            t.$2,
                            style: TextStyle(
                              color: selected
                                  ? AppColors.accent
                                  : AppColors.textMuted,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              fontFamily: 'Inter',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Title
            const Text(
              'TITLE',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _titleCtrl,
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 14,
                fontFamily: 'Inter',
              ),
              decoration: const InputDecoration(
                hintText: 'Brief summary...',
                hintStyle: TextStyle(
                  color: AppColors.textFaint,
                  fontFamily: 'Inter',
                ),
              ),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 20),

            // Description
            const Text(
              'DESCRIPTION',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _descCtrl,
              maxLines: 6,
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 14,
                fontFamily: 'Inter',
                height: 1.5,
              ),
              decoration: const InputDecoration(
                hintText: 'What happened? What did you expect?',
                hintStyle: TextStyle(
                  color: AppColors.textFaint,
                  fontFamily: 'Inter',
                ),
              ),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 12),

            // Device info hint
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: AppRadius.smAll,
                border: Border.all(color: AppColors.border),
              ),
              child: Text(
                'v${AppVersion.version} (patch ${AppVersion.patch}) — device info is sent automatically',
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 11,
                  fontFamily: 'Inter',
                ),
              ),
            ),
            const SizedBox(height: 28),

            // Submit
            AccentButton(
              height: 48,
              onPressed: _submitting ? null : _submit,
              child: _submitting
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.background,
                      ),
                    )
                  : const Text('SUBMIT'),
            ),
          ],
        ),
      ),
    );
  }
}
