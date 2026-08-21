import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';

class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends State<BookingsScreen> {
  List<Map<String, dynamic>> _bookings = [];
  bool _loading = true;
  String? _error;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await ApiClient.instance.bookingsList();
      if (mounted) {
        setState(() {
          _bookings = ((res['bookings'] as List?) ?? const [])
              .map((e) => (e as Map).cast<String, dynamic>())
              .toList();
          _loading = false;
        });
      }
    } catch (err) {
      if (mounted) {
        setState(() {
          _error = err.toString();
          _loading = false;
        });
      }
    }
  }

  Future<void> _setStatus(Map<String, dynamic> booking, String status) async {
    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.bookingStatus(
        booking['id'] as String,
        status,
      );
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack(status == 'accepted' ? 'Booking accepted' : 'Booking rejected');
        _load();
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _createLead(Map<String, dynamic> booking) async {
    setState(() => _busy = true);
    try {
      final attendee = (booking['attendee'] is Map
          ? booking['attendee'].cast<String, dynamic>()
          : const <String, dynamic>{});
      final res = await ApiClient.instance.bookingCreateLead({
        'name': attendee['name'] ?? 'Booking guest',
        'email': attendee['email'] ?? '',
        'phone': attendee['phone'] ?? '',
        'bookingId': booking['id'],
      });
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        _snack('Lead created from booking');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bookings'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(
              Icons.refresh,
              size: 18,
              color: AppColors.textMuted,
            ),
            onPressed: _load,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) return const LoadingView();
    if (_error != null) return ErrorBox(message: _error!, onRetry: _load);
    if (_bookings.isEmpty) {
      return const EmptyState(
        message: 'No bookings found.',
        icon: Icons.event_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _bookings.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) => _BookingCard(
          booking: _bookings[i],
          busy: _busy,
          onAccept: () => _setStatus(_bookings[i], 'accepted'),
          onReject: () => _setStatus(_bookings[i], 'rejected'),
          onCreateLead: () => _createLead(_bookings[i]),
        ),
      ),
    );
  }
}

class _BookingCard extends StatelessWidget {
  const _BookingCard({
    required this.booking,
    required this.busy,
    required this.onAccept,
    required this.onReject,
    required this.onCreateLead,
  });

  final Map<String, dynamic> booking;
  final bool busy;
  final VoidCallback onAccept;
  final VoidCallback onReject;
  final VoidCallback onCreateLead;

  @override
  Widget build(BuildContext context) {
    final attendee = booking['attendee'] is Map
        ? booking['attendee'].cast<String, dynamic>()
        : const <String, dynamic>{};
    final name = attendee['name'] ?? '—';
    final email = attendee['email'] ?? '—';
    final start = booking['start'] ?? booking['startTime'];
    final status = booking['status'] ?? 'pending';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        color: AppColors.card,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  name,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
              _statusPill(status),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            email,
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          Text(
            start != null ? Fmt.dateTime('$start') : '—',
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              if (status != 'accepted')
                _chip('ACCEPT', AppColors.accent, busy ? null : onAccept),
              if (status != 'rejected')
                _chip('REJECT', AppColors.red, busy ? null : onReject),
              _chip(
                'CREATE LEAD',
                const Color(0xFF4CAF50),
                busy ? null : onCreateLead,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _statusPill(String status) {
    final color = switch (status) {
      'accepted' => const Color(0xFF4CAF50),
      'rejected' => AppColors.red,
      _ => AppColors.textMuted,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 9,
          fontWeight: FontWeight.w600,
          letterSpacing: 1,
          fontFamily: 'Inter',
        ),
      ),
    );
  }

  Widget _chip(String label, Color color, VoidCallback? onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          border: Border.all(
            color: color.withValues(alpha: onTap == null ? 0.15 : 0.4),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: color.withValues(alpha: onTap == null ? 0.4 : 1),
            fontSize: 10,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
        ),
      ),
    );
  }
}
