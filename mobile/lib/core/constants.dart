import 'package:flutter/material.dart';

import '../core/theme.dart';

class StatusMeta {
  const StatusMeta(this.label, this.color);
  final String label;
  final Color color;
}

/// Status maps mirroring `src/lib/admin-validation.js` on the web side.
class Status {
  static const Map<String, StatusMeta> leads = {
    'inquiry': StatusMeta('Inquiry', AppColors.sky),
    'discovery': StatusMeta('Discovery', AppColors.violet),
    'proposal': StatusMeta('Proposal', AppColors.amber),
    'in_progress': StatusMeta('In Progress', AppColors.accent),
    'completed': StatusMeta('Completed', AppColors.emerald),
    'lost': StatusMeta('Lost', AppColors.red),
  };

  static const Map<String, StatusMeta> clients = {
    'onboarding': StatusMeta('Onboarding', AppColors.sky),
    'active': StatusMeta('Active', AppColors.emerald),
    'at_risk': StatusMeta('At Risk', AppColors.amber),
    'inactive': StatusMeta('Inactive', AppColors.textMuted),
    'churned': StatusMeta('Churned', AppColors.red),
  };

  static const Map<String, StatusMeta> proposals = {
    'draft': StatusMeta('Draft', AppColors.textMuted),
    'sent': StatusMeta('Sent', AppColors.sky),
    'viewed': StatusMeta('Viewed', AppColors.violet),
    'accepted': StatusMeta('Accepted', AppColors.emerald),
    'rejected': StatusMeta('Rejected', AppColors.red),
  };

  static const Map<String, StatusMeta> invoices = {
    'draft': StatusMeta('Draft', AppColors.textMuted),
    'sent': StatusMeta('Sent', AppColors.sky),
    'paid': StatusMeta('Paid', AppColors.emerald),
    'overdue': StatusMeta('Overdue', AppColors.red),
    'cancelled': StatusMeta('Cancelled', AppColors.textFaint),
  };

  static const Map<String, StatusMeta> projects = {
    'planning': StatusMeta('Planning', AppColors.textMuted),
    'in_progress': StatusMeta('In Progress', AppColors.accent),
    'review': StatusMeta('Review', AppColors.violet),
    'completed': StatusMeta('Completed', AppColors.emerald),
    'on_hold': StatusMeta('On Hold', AppColors.amber),
    'cancelled': StatusMeta('Cancelled', AppColors.red),
  };

  static const Map<String, StatusMeta> reviews = {
    'pending': StatusMeta('Pending', AppColors.amber),
    'approved': StatusMeta('Approved', AppColors.emerald),
    'rejected': StatusMeta('Rejected', AppColors.red),
  };

  static const Map<String, StatusMeta> bookings = {
    'ACCEPTED': StatusMeta('Accepted', AppColors.emerald),
    'PENDING': StatusMeta('Pending', AppColors.amber),
    'CANCELLED': StatusMeta('Cancelled', AppColors.red),
  };

  static const Map<String, StatusMeta> leadSources = {
    'website': StatusMeta('Website', AppColors.sky),
    'cal.com': StatusMeta('Cal.com', AppColors.violet),
    'manual': StatusMeta('Manual', AppColors.textMuted),
    'csv_import': StatusMeta('CSV', AppColors.amber),
    'whatsapp': StatusMeta('WhatsApp', AppColors.emerald),
    'other': StatusMeta('Other', AppColors.textMuted),
  };

  static StatusMeta get(Map<String, StatusMeta> map, String? value) {
    return map[value] ?? const StatusMeta('Unknown', AppColors.textMuted);
  }
}

/// Small bordered status pill, matching the web `StatusBadge`.
class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.meta});

  final StatusMeta meta;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        border: Border.all(color: meta.color.withValues(alpha: 0.35)),
        color: meta.color.withValues(alpha: 0.08),
      ),
      child: Text(
        meta.label.toUpperCase(),
        style: TextStyle(
          color: meta.color,
          fontSize: 9,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.6,
          fontFamily: 'Inter',
        ),
      ),
    );
  }
}
