import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../core/api_client.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/error_views.dart';
import '../../shared/widgets/csv_export.dart';
import 'booking_detail_screen.dart';

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

DateTime? _startOf(Map<String, dynamic> booking) {
  final s = booking['start'] ?? booking['startTime'];
  if (s == null) return null;
  return DateTime.tryParse('$s')?.toLocal();
}

bool _sameDay(DateTime a, DateTime b) =>
    a.year == b.year && a.month == b.month && a.day == b.day;

class _BookingsScreenState extends State<BookingsScreen> {
  List<Map<String, dynamic>> _bookings = [];
  bool _loading = true;
  Object? _error;

  final _search = TextEditingController();
  String _status = 'all';
  bool _calendarMode = false;
  DateTime _selectedDay = DateTime.now();

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

  /// [silent] keeps current content on screen while refreshing.
  Future<void> _load({bool silent = false}) async {
    if (!silent) {
      setState(() {
        _loading = true;
        _error = null;
      });
    }
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
          _error = err;
          _loading = false;
        });
      }
    }
  }

  /// Opens the detail screen; refreshes silently when it reports changes.
  Future<void> _openDetail(Map<String, dynamic> booking) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => BookingDetailScreen(booking: booking)),
    );
    if (changed == true) _load(silent: true);
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

  /// Bookings falling on the selected calendar day, chronological order.
  List<Map<String, dynamic>> get _selectedDayBookings {
    final rows =
        _bookings.where((b) {
          final start = _startOf(b);
          return start != null && _sameDay(start, _selectedDay);
        }).toList()..sort((a, b) {
          final sa = _startOf(a)!;
          final sb = _startOf(b)!;
          return sa.compareTo(sb);
        });
    return rows;
  }

  Future<void> _exportCsv() async {
    try {
      Toast.info(context, 'Exporting...');
      final rows = _calendarMode ? _selectedDayBookings : _filtered;
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
      if (mounted) Toast.error(context, err.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bookings'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: Icon(
              _calendarMode
                  ? Icons.list_alt_outlined
                  : Icons.calendar_month_outlined,
              size: 20,
              color: AppColors.textMuted,
            ),
            onPressed: () => setState(() => _calendarMode = !_calendarMode),
            tooltip: _calendarMode ? 'List view' : 'Calendar view',
          ),
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
            onPressed: () => _load(),
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _loading
          ? const LoadingView()
          : _error != null
          ? ErrorStateView(error: _error, onRetry: () => _load())
          : _calendarMode
          ? _buildCalendarBody()
          : _buildListBody(),
    );
  }

  // ── Calendar mode ───────────────────────────────────────────────────────

  Widget _buildCalendarBody() {
    final dayRows = _selectedDayBookings;
    return Column(
      children: [
        _MonthCalendar(
          bookings: _bookings,
          selected: _selectedDay,
          onSelect: (d) => setState(() => _selectedDay = d),
        ),
        Container(height: 1, color: AppColors.border),
        Expanded(
          child: dayRows.isEmpty
              ? EmptyState(
                  message:
                      'No bookings on ${DateFormat('MMM d').format(_selectedDay)}.',
                  icon: Icons.event_outlined,
                )
              : RefreshIndicator(
                  onRefresh: () => _load(silent: true),
                  color: AppColors.accent,
                  backgroundColor: AppColors.card,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: dayRows.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, i) => _BookingCard(
                      booking: dayRows[i],
                      onTap: () => _openDetail(dayRows[i]),
                    ),
                  ),
                ),
        ),
      ],
    );
  }

  // ── List mode ───────────────────────────────────────────────────────────

  Widget _buildListBody() {
    return Column(
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
                            ? Colors.white.withValues(alpha: 0.06)
                            : Colors.transparent,
                        border: Border.all(
                          color: _status == entry.key
                              ? Colors.white.withValues(alpha: 0.3)
                              : AppColors.border,
                        ),
                      ),
                      child: Text(
                        entry.value.toUpperCase(),
                        style: TextStyle(
                          color: _status == entry.key
                              ? AppColors.text
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
        Expanded(child: _buildList()),
      ],
    );
  }

  Widget _buildList() {
    final rows = _filtered;
    if (rows.isEmpty) {
      return const EmptyState(
        message: 'No bookings found.',
        icon: Icons.event_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: () => _load(silent: true),
      color: AppColors.accent,
      backgroundColor: AppColors.card,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: rows.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, i) =>
            _BookingCard(booking: rows[i], onTap: () => _openDetail(rows[i])),
      ),
    );
  }
}

// ── Month calendar ────────────────────────────────────────────────────────

/// Minimal monochrome month grid — days with bookings carry a dot under the
/// number; today gets an outline; the selected day fills with accent.
class _MonthCalendar extends StatefulWidget {
  const _MonthCalendar({
    required this.bookings,
    required this.selected,
    required this.onSelect,
  });

  final List<Map<String, dynamic>> bookings;
  final DateTime selected;
  final ValueChanged<DateTime> onSelect;

  @override
  State<_MonthCalendar> createState() => _MonthCalendarState();
}

class _MonthCalendarState extends State<_MonthCalendar> {
  late DateTime _month = DateTime(widget.selected.year, widget.selected.month);

  static const _weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  @override
  void didUpdateWidget(covariant _MonthCalendar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_sameDay(widget.selected, oldWidget.selected) ||
        widget.selected.month != _month.month ||
        widget.selected.year != _month.year) {
      _month = DateTime(widget.selected.year, widget.selected.month);
    }
  }

  void _shift(int months) {
    setState(() {
      _month = DateTime(_month.year, _month.month + months);
    });
  }

  @override
  Widget build(BuildContext context) {
    // Days of this month that contain at least one booking.
    final markedDays = <int>{};
    for (final b in widget.bookings) {
      final start = _startOf(b);
      if (start != null &&
          start.year == _month.year &&
          start.month == _month.month) {
        markedDays.add(start.day);
      }
    }

    final firstOffset = (_month.weekday + 6) % 7; // Monday-first grid
    final daysInMonth = DateUtils.getDaysInMonth(_month.year, _month.month);
    final totalCells = ((firstOffset + daysInMonth) / 7).ceil() * 7;
    final now = DateTime.now();

    return Container(
      color: AppColors.card,
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              IconButton(
                visualDensity: VisualDensity.compact,
                icon: const Icon(
                  Icons.chevron_left,
                  size: 18,
                  color: AppColors.textMuted,
                ),
                onPressed: () => _shift(-1),
              ),
              Expanded(
                child: Text(
                  DateFormat('MMMM yyyy').format(_month),
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
              IconButton(
                visualDensity: VisualDensity.compact,
                icon: const Icon(
                  Icons.chevron_right,
                  size: 18,
                  color: AppColors.textMuted,
                ),
                onPressed: () => _shift(1),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              for (final w in _weekdays)
                Expanded(
                  child: Center(
                    child: Text(
                      w.toUpperCase(),
                      style: const TextStyle(
                        color: AppColors.textFaint,
                        fontSize: 9,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 6),
          for (var row = 0; row < totalCells ~/ 7; row++)
            Row(
              children: [
                for (var col = 0; col < 7; col++)
                  _cell(
                    row * 7 + col,
                    firstOffset,
                    daysInMonth,
                    now,
                    markedDays,
                  ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _cell(
    int index,
    int firstOffset,
    int daysInMonth,
    DateTime now,
    Set<int> markedDays,
  ) {
    final dayNum = index - firstOffset + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      return const Expanded(child: SizedBox(height: 44));
    }
    final date = DateTime(_month.year, _month.month, dayNum);
    final isToday = _sameDay(date, now);
    final isSelected = _sameDay(date, widget.selected);
    final hasBookings = markedDays.contains(dayNum);

    return Expanded(
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => widget.onSelect(date),
        child: SizedBox(
          height: 44,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 28,
                height: 28,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.accent
                      : isToday
                      ? Colors.white.withValues(alpha: 0.06)
                      : Colors.transparent,
                  border: isSelected || isToday
                      ? Border.all(
                          color: isSelected
                              ? AppColors.accent
                              : Colors.white.withValues(alpha: 0.22),
                        )
                      : null,
                ),
                child: Text(
                  '$dayNum',
                  style: TextStyle(
                    color: isSelected
                        ? const Color(0xFF070707)
                        : AppColors.text,
                    fontSize: 11.5,
                    fontWeight: isSelected || isToday
                        ? FontWeight.w700
                        : FontWeight.w500,
                    fontFeatures: const [FontFeature.tabularFigures()],
                    fontFamily: 'Inter',
                  ),
                ),
              ),
              const SizedBox(height: 3),
              Container(
                width: 4,
                height: 4,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: hasBookings
                      ? AppColors.accent.withValues(alpha: 0.85)
                      : Colors.transparent,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Booking card ──────────────────────────────────────────────────────────

class _BookingCard extends StatelessWidget {
  const _BookingCard({required this.booking, required this.onTap});

  final Map<String, dynamic> booking;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final attendee = _attendeeOf(booking);
    final name = attendee['name'] ?? '—';
    final email = attendee['email'] ?? '—';
    final start = booking['start'] ?? booking['startTime'];
    final status = '${booking['status'] ?? 'pending'}'.toLowerCase();
    final title = _shortTitle(booking['title'] as String?);
    final duration = (booking['duration'] as num?)?.toInt();

    return Material(
      color: AppColors.card,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      '$name',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  _statusPill(status),
                  const SizedBox(width: 2),
                  const Icon(
                    Icons.chevron_right,
                    size: 15,
                    color: AppColors.textFaint,
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                '$email',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 12,
                  fontFamily: 'Inter',
                ),
              ),
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
                      title.isEmpty
                          ? (start != null ? Fmt.dateTime('$start') : '—')
                          : duration != null
                          ? '$title · $duration min · ${Fmt.dateTime('$start')}'
                          : '$title · ${Fmt.dateTime('$start')}',
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
          ),
        ),
      ),
    );
  }

  Widget _statusPill(String status) {
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
