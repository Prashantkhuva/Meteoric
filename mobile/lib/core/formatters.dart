import 'package:intl/intl.dart';

class Fmt {
  static final DateFormat _date = DateFormat('MMM d, yyyy');
  static final DateFormat _short = DateFormat('MMM d');
  static final DateFormat _time = DateFormat('hh:mm a');
  static final NumberFormat _currency = NumberFormat.currency(symbol: '\$', decimalDigits: 0);

  static String date(String? iso) {
    if (iso == null || iso.isEmpty) return '—';
    try {
      return _date.format(DateTime.parse(iso).toLocal());
    } catch (_) {
      return iso;
    }
  }

  static String shortDate(String? iso) {
    if (iso == null || iso.isEmpty) return '—';
    try {
      return _short.format(DateTime.parse(iso).toLocal());
    } catch (_) {
      return iso;
    }
  }

  static String time(String? iso) {
    if (iso == null || iso.isEmpty) return '—';
    try {
      return _time.format(DateTime.parse(iso).toLocal());
    } catch (_) {
      return iso;
    }
  }

  static String dateTime(String? iso) {
    if (iso == null || iso.isEmpty) return '—';
    try {
      final dt = DateTime.parse(iso).toLocal();
      return '${_date.format(dt)} • ${_time.format(dt)}';
    } catch (_) {
      return iso;
    }
  }

  static String money(num? value) {
    if (value == null) return '—';
    return _currency.format(value);
  }

  static String moneyWithCurrency(num? value, String? currency) {
    if (value == null) return '—';
    final symbol = currency == 'USD' ? '\$' : (currency ?? '\$');
    return '$symbol${_formatAmount(value)}';
  }

  static String _formatAmount(num value) {
    if (value == value.roundToDouble()) {
      return value.toStringAsFixed(0);
    }
    return value.toStringAsFixed(2);
  }

  static String timeAgo(String? iso) {
    if (iso == null || iso.isEmpty) return '—';
    try {
      final diff = DateTime.now().difference(DateTime.parse(iso).toLocal());
      if (diff.inMinutes < 1) return 'just now';
      if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
      if (diff.inHours < 24) return '${diff.inHours}h ago';
      if (diff.inDays < 30) return '${diff.inDays}d ago';
      return date(iso);
    } catch (_) {
      return iso;
    }
  }

  static String percent(num? value, {String suffix = '%'}) {
    if (value == null) return '—';
    return '${value.toStringAsFixed(0)}$suffix';
  }
}