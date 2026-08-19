import 'package:flutter/material.dart';
import '../../core/theme.dart';
import 'compose_email_screen.dart';
import 'sent_emails_screen.dart';

class EmailScreen extends StatefulWidget {
  const EmailScreen({super.key});

  @override
  State<EmailScreen> createState() => _EmailScreenState();
}

class _EmailScreenState extends State<EmailScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Email'),
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Material(
              color: AppColors.card,
              child: InkWell(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const ComposeEmailScreen()),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(border: Border.all(color: AppColors.border)),
                  child: const Row(
                    children: [
                      Icon(Icons.edit_outlined, size: 18, color: AppColors.accent),
                      SizedBox(width: 14),
                      Expanded(
                        child: Text(
                          'Compose email',
                          style: TextStyle(
                            color: AppColors.text,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                      Icon(Icons.chevron_right, size: 18, color: AppColors.textFaint),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Material(
              color: AppColors.card,
              child: InkWell(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const SentEmailsScreen()),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(border: Border.all(color: AppColors.border)),
                  child: const Row(
                    children: [
                      Icon(Icons.outbox_outlined, size: 18, color: AppColors.accent),
                      SizedBox(width: 14),
                      Expanded(
                        child: Text(
                          'Sent emails',
                          style: TextStyle(
                            color: AppColors.text,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                      Icon(Icons.chevron_right, size: 18, color: AppColors.textFaint),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}