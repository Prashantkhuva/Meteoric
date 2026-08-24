import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';

Map<String, dynamic> _attendeeOf(Map<String, dynamic> booking) {
  final list = booking['attendees'];
  if (list is List && list.isNotEmpty && list.first is Map) {
    return (list.first as Map).cast<String, dynamic>();
  }
  if (booking['attendee'] is Map) {
    return (booking['attendee'] as Map).cast<String, dynamic>();
  }
  return const <String, dynamic>{};
}

String _shortTitle(String? title) {
  if (title == null) return '';
  final idx = title.indexOf(' between ');
  return idx > -1 ? title.substring(0, idx) : title;
}

/// Full-screen booking detail — opened from the bookings list/calendar.
/// Returns `true` when the booking was mutated so the caller can refresh.
class BookingDetailScreen extends StatefulWidget {
  const BookingDetailScreen({super.key, required this.booking});

  final Map<String, dynamic> booking;

  @override
  State<BookingDetailScreen> createState() => _BookingDetailScreenState();
}

class _BookingDetailScreenState extends State<BookingDetailScreen> {
  bool _busy = false;

  int? get _bookingId => widget.booking['id'] is num
      ? (widget.booking['id'] as num).toInt()
      : null;

  String get _status =>
      '${widget.booking['status'] ?? 'pending'}'.toLowerCase();

  void _snack(String msg, {bool isError = false}) =>
      isError ? Toast.error(context, msg) : Toast.success(context, msg);

  Future<void> _run(Future<void> Function() action, String successMsg) async {
    if (_busy) return;
    if (_bookingId == null) {
      _snack('Booking id missing — cannot update', isError: true);
      return;
    }
    setState(() => _busy = true);
    try {
      await action();
      if (!mounted) return;
      _snack(successMsg);
      Navigator.of(context).pop(true);
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _setStatus(String status) => _run(
    () => ApiClient.instance.bookingStatus('$_bookingId', status),
    status == 'accepted' ? 'Booking accepted' : 'Booking rejected',
  );

  Future<void> _createLead() {
    final attendee = _attendeeOf(widget.booking);
    return _run(
      () => ApiClient.instance.bookingCreateLead({
        'name': attendee['name'] ?? 'Booking guest',
        'email': attendee['email'] ?? '',
        'phone': attendee['phoneNumber'] ?? attendee['phone'] ?? '',
        'bookingId': _bookingId,
      }),
      'Lead created from booking',
    );
  }

  @override
  Widget build(BuildContext context) {
    final booking = widget.booking;
    final attendee = _attendeeOf(booking);
    final name = '${attendee['name'] ?? '—'}';
    final email = '${attendee['email'] ?? ''}';
    final phone = '${attendee['phoneNumber'] ?? attendee['phone'] ?? ''}'
        .trim();
    final start = booking['start'] ?? booking['startTime'];
    final end = booking['end'] ?? booking['endTime'];
    final duration = (booking['duration'] as num?)?.toInt();
    final title = _shortTitle(booking['title'] as String?);
    final location = booking['location'];
    final description = booking['description'];
    final timezone = booking['timeZone'];
    final createdAt = booking['createdAt'];
    final initial = name.isNotEmpty ? name[0].toUpperCase() : '?';

    return Scaffold(
      appBar: AppBar(title: const Text('Booking')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.card,
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.cardRaised,
                    border: Border.all(color: AppColors.borderSoft),
                  ),
                  child: Text(
                    initial,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 17,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                      if (email.isNotEmpty) ...[
                        const SizedBox(height: 3),
                        Text(
                          email,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 12,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                _StatusTag(status: _status),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SectionCard(
            title: 'SCHEDULE',
            child: Column(
              children: [
                if (title.isNotEmpty)
                  _KvRow(
                    'Event',
                    duration != null ? '$title · $duration min' : title,
                  ),
                if (title.isNotEmpty) const _KvDivider(),
                _KvRow('Start', start != null ? Fmt.dateTime('$start') : '—'),
                const _KvDivider(),
                _KvRow('End', end != null ? Fmt.dateTime('$end') : '—'),
                if (timezone is String && timezone.isNotEmpty) ...[
                  const _KvDivider(),
                  _KvRow('Timezone', timezone),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),
          SectionCard(
            title: 'ATTENDEE',
            child: Column(
              children: [
                _KvRow('Email', email.isEmpty ? '—' : email),
                const _KvDivider(),
                _KvRow('Phone', phone.isEmpty ? '—' : phone),
              ],
            ),
          ),
          if (location is String && location.isNotEmpty) ...[
            const SizedBox(height: 16),
            SectionCard(
              title: 'LOCATION',
              child: SelectableText(
                location,
                style: const TextStyle(
                  color: AppColors.text,
                  fontSize: 12.5,
                  height: 1.55,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ],
          if (description is String && description.isNotEmpty) ...[
            const SizedBox(height: 16),
            SectionCard(
              title: 'NOTES',
              child: SelectableText(
                description,
                style: const TextStyle(
                  color: AppColors.text,
                  fontSize: 12.5,
                  height: 1.6,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),
          SectionCard(
            title: 'REFERENCE',
            child: Column(
              children: [
                _KvRow('UID', '${booking['uid'] ?? '—'}'),
                const _KvDivider(),
                _KvRow('ID', '${_bookingId ?? booking['id'] ?? '—'}'),
                if (createdAt != null) ...[
                  const _KvDivider(),
                  _KvRow('Created', Fmt.dateTime('$createdAt')),
                ],
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.card,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              if (_status != 'accepted')
                Expanded(
                  child: _ActionChip.filled(
                    label: 'ACCEPT',
                    onTap: _busy ? null : () => _setStatus('accepted'),
                  ),
                ),
              if (_status != 'accepted') const SizedBox(width: 8),
              if (_status != 'rejected')
                Expanded(
                  child: _ActionChip.outline(
                    label: 'REJECT',
                    onTap: _busy ? null : () => _setStatus('rejected'),
                  ),
                ),
              if (_status != 'rejected') const SizedBox(width: 8),
              Expanded(
                child: _ActionChip.outline(
                  label: 'CREATE LEAD',
                  onTap: _busy ? null : _createLead,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusTag extends StatelessWidget {
  const _StatusTag({required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        border: Border.all(color: AppColors.borderSoft),
      ),
      child: Text(
        status.toUpperCase(),
        style: const TextStyle(
          color: AppColors.textMuted,
          fontSize: 9,
          fontWeight: FontWeight.w600,
          letterSpacing: 1,
          fontFamily: 'Inter',
        ),
      ),
    );
  }
}

class _KvDivider extends StatelessWidget {
  const _KvDivider();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      height: 1,
      color: AppColors.borderSoft,
    );
  }
}

class _KvRow extends StatelessWidget {
  const _KvRow(this.label, this.value);

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 78,
          child: Text(
            label.toUpperCase(),
            style: const TextStyle(
              color: AppColors.textFaint,
              fontSize: 9,
              fontWeight: FontWeight.w600,
              letterSpacing: 1,
              fontFamily: 'Inter',
            ),
          ),
        ),
        Expanded(
          child: SelectableText(
            value,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 12.5,
              fontWeight: FontWeight.w500,
              fontFamily: 'Inter',
            ),
          ),
        ),
      ],
    );
  }
}

class _ActionChip extends StatelessWidget {
  const _ActionChip.filled({required this.label, this.onTap}) : _filled = true;

  const _ActionChip.outline({required this.label, this.onTap})
    : _filled = false;

  final String label;
  final VoidCallback? onTap;
  final bool _filled;

  @override
  Widget build(BuildContext context) {
    final enabled = onTap != null;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        height: 42,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: _filled ? AppColors.accent : Colors.transparent,
          border: _filled
              ? null
              : Border.all(
                  color: AppColors.accent.withValues(
                    alpha: enabled ? 0.45 : 0.15,
                  ),
                ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: _filled
                ? const Color(0xFF070707)
                : AppColors.accent.withValues(alpha: enabled ? 1 : 0.35),
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.6,
            fontFamily: 'Inter',
          ),
        ),
      ),
    );
  }
}
