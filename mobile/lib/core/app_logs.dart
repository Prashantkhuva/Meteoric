import 'dart:collection';

/// Rolling in-memory log buffer covering the last [window].
///
/// ErrorReporter attaches [dump] to Linear issues so reports show what the
/// app was doing right before the failure (navigation + API traffic).
/// Kept small on purpose: 2-minute window, hard cap on entries and chars.
class AppLogs {
  AppLogs._();

  static const Duration window = Duration(minutes: 2);
  static const int maxEntries = 500;
  static const int maxChars = 6000;

  static final Queue<_Entry> _entries = Queue<_Entry>();

  static void log(String tag, String message) {
    final now = DateTime.now();
    _entries.addLast(_Entry(now, tag, message));
    _prune(now);
  }

  static void _prune(DateTime now) {
    final cutoff = now.subtract(window);
    while (_entries.isNotEmpty &&
        (_entries.first.time.isBefore(cutoff) ||
            _entries.length > maxEntries)) {
      _entries.removeFirst();
    }
  }

  /// Buffered log lines as text, oldest first. Tail is kept when over
  /// [maxChars] — the moments just before the error matter most.
  static String dump() {
    _prune(DateTime.now());
    if (_entries.isEmpty) return '(no logs)';
    final lines = _entries.map((e) => e.format()).toList();
    var out = lines.join('\n');
    if (out.length > maxChars) {
      out = '(truncated)\n${out.substring(out.length - maxChars)}';
    }
    return out;
  }
}

class _Entry {
  _Entry(this.time, this.tag, this.message);

  final DateTime time;
  final String tag;
  final String message;

  String format() {
    final t = time;
    String two(int v) => v.toString().padLeft(2, '0');
    final ms = t.millisecond.toString().padLeft(3, '0');
    return '${two(t.hour)}:${two(t.minute)}:${two(t.second)}.$ms '
        '[$tag] $message';
  }
}
