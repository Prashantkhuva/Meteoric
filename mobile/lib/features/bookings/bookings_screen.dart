import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/csv_export.dart';

class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

/// Normalizes a raw Cal.com v2 booking row:
/// - attendee lives in the `attendees` array (first entry)
/// - `id` is numeric, `uid` is the string key
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

class _BookingsScreenState extends State<BookingsScreen> {
  List<Map<String, dynamic>> _bookings = [];
  bool _loading = true;
  String? _error;
  bool _busy = false;

  final _search = TextEditingController();
  String _status = 'all';

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
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

  List<Map<String, dynamic>> get _filtered {
    final q = _search.text.trim().toLowerCase();
    return _bookings.where((b) {
      final status = '${b['status'] ?? 'pending'}'.toLowerCase();
      if (_status != 'all' && status != _status) {
        return false;
      }
      if (q.isEmpty) return true;
      final attendee = _attendeeOf(b);
      final haystack = [
        attendee['name'],
        attendee['email'],
        b['title'],
        b['description'],
        b['location'],
        b['eventTypeId'],
      ].where((v) => v != null).map((v) => '$v'.toLowerCase()).join(' ');
      return haystack.contains(q);
    }).toList()..sort((a, b) {
      final sa = '${a['start'] ?? a['startTime'] ?? ''}';
      final sb = '${b['start'] ?? b['startTime'] ?? ''}';
      return sb.compareTo(sa);
    });
  }

  /// Numeric Cal.com booking id — required by the status / create-lead APIs.
  int? _bookingId(Map<String, dynamic> booking) =>
      booking['id'] is num ? (booking['id'] as num).toInt() : null;

  Future<void> _setStatus(Map<String, dynamic> booking, String status) async {
    final id = _bookingId(booking);
    if (id == null) {
      _snack('Booking id missing — cannot update', isError: true);
      return;
    }
    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.bookingStatus('$id', status);
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
    final id = _bookingId(booking);
    if (id == null) {
      _snack('Booking id missing — cannot create lead', isError: true);
      return;
    }
    setState(() => _busy = true);
    try {
      final attendee = _attendeeOf(booking);
      final res = await ApiClient.instance.bookingCreateLead({
        'name': attendee['name'] ?? 'Booking guest',
        'email': attendee['email'] ?? '',
        'phone': attendee['phoneNumber'] ?? attendee['phone'] ?? '',
        'bookingId': id,
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

  Future<void> _exportCsv() async {
    try {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Exporting...')));
      final rows = _filtered;
      await CsvExport.share(
        filename: CsvExport.datedName('bookings'),
        rows: [
          ['Attendee', 'Email', 'Phone', 'Event', 'Start', 'Status'],
          ...rows.map((b) {
            final attendee = _attendeeOf(b);
            return [
              '${attendee['name'] ?? ''}',
              '${attendee['email'] ?? ''}',
              '${attendee['phoneNumber'] ?? attendee['phone'] ?? ''}',
              _shortTitle(b['title'] as String?),
              csvDate(b['start'] ?? b['startTime']),
              '${b['status'] ?? 'pending'}',
            ];
          }),
        ],
      );
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(err.toString())));
      }
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
              Icons.download_outlined,
              size: 19,
              color: AppColors.textMuted,
            ),
            onPressed: _exportCsv,
            tooltip: 'Export CSV',
          ),
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
            child: TextField(
              controller: _search,
              onChanged: (_) => setState(() {}),
              decoration: InputDecoration(
                hintText: 'Search name, email...',
                prefixIcon: const Icon(
                  Icons.search,
                  size: 18,
                  color: AppColors.textFaint,
                ),
                suffixIcon: _search.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(
                          Icons.close,
                          size: 16,
                          color: AppColors.textMuted,
                        ),
                        onPressed: () {
                          _search.clear();
                          setState(() {});
                        },
                      )
                    : null,
              ),
            ),
          ),
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                for (final entry in const [
                  MapEntry('all', 'All'),
                  MapEntry('pending', 'Pending'),
                  MapEntry('accepted', 'Accepted'),
                  MapEntry('rejected', 'Rejected'),
                  MapEntry('cancelled', 'Cancelled'),
                ])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => setState(() => _status = entry.key),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: _status == entry.key
                              ? AppColors.accent.withValues(alpha: 0.1)
                              : Colors.transparent,
                          border: Border.all(
                            color: _status == entry.key
                                ? AppColors.accent.withValues(alpha: 0.5)
                                : AppColors.border,
                          ),
                        ),
                        child: Text(
                          entry.value.toUpperCase(),
                          style: TextStyle(
                            color: _status == entry.key
                                ? AppColors.accent
                                : AppColors.textMuted,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 0.8,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (_loading) return const LoadingView();
    if (_error != null) return ErrorBox(message: _error!, onRetry: _load);
    final rows = _filtered;
    if (rows.isEmpty) {
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
        itemCount: rows.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) => _BookingCard(
          booking: rows[i],
          busy: _busy,
          onAccept: () => _setStatus(rows[i], 'accepted'),
          onReject: () => _setStatus(rows[i], 'rejected'),
          onCreateLead: () => _createLead(rows[i]),
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
    final attendee = _attendeeOf(booking);
    final name = attendee['name'] ?? '—';
    final email = attendee['email'] ?? '—';
    final start = booking['start'] ?? booking['startTime'];
    final status = '${booking['status'] ?? 'pending'}'.toLowerCase();
    final title = _shortTitle(booking['title'] as String?);
    final duration = (booking['duration'] as num?)?.toInt();
    final description = booking['description'];
    final location = booking['location'];

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
          if (title.isNotEmpty) ...[
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(
                  Icons.label_outline,
                  size: 13,
                  color: AppColors.textFaint,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    duration != null ? '$title · $duration min' : title,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 12,
                      fontFamily: 'Inter',
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(
                Icons.event_outlined,
                size: 13,
                color: AppColors.textFaint,
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  start != null ? Fmt.dateTime('$start') : '—',
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 12,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
            ],
          ),
          if (location is String && location.isNotEmpty) ...[
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(
                  Icons.location_on_outlined,
                  size: 13,
                  color: AppColors.textFaint,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    location,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 12,
                      fontFamily: 'Inter',
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
          if (description is String && description.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              description,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                height: 1.5,
                fontFamily: 'Inter',
              ),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          ],
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
