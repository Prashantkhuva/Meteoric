import 'dart:async';

import 'package:flutter/foundation.dart';

import 'api_client.dart';
import 'notification_service.dart';

/// Shared, observable state for notification polling.
///
/// The HomeShell starts polling on launch so heads-up notifications fire on
/// every screen — not just the dashboard. The bell badge reads [unread] from
/// anywhere in the widget tree.
class NotificationState extends ChangeNotifier {
  NotificationState._();
  static final NotificationState instance = NotificationState._();

  int _unread = 0;
  Timer? _timer;
  DateTime? _watermark;
  bool _started = false;

  int get unread => _unread;

  /// Starts the 60-second polling loop. Safe to call multiple times —
  /// subsequent calls are no-ops.
  void startPolling() {
    if (_started) return;
    _started = true;
    _poll();
    _timer = Timer.periodic(const Duration(seconds: 60), (_) => _poll());
  }

  void stopPolling() {
    _timer?.cancel();
    _timer = null;
  }

  /// Manual refresh (e.g. after returning from NotificationsScreen).
  Future<void> refresh() => _poll();

  Future<void> _poll() async {
    try {
      final res = await ApiClient.instance.notificationsList();
      final items = ((res['data'] as List?) ?? const [])
          .map((e) => (e as Map).cast<String, dynamic>())
          .toList();
      final unread = (res['unreadCount'] as num?)?.toInt() ?? _unread;

      DateTime? latest;
      final fresh = <Map<String, dynamic>>[];
      for (final item in items) {
        final at = DateTime.tryParse('${item['created_at']}')?.toLocal();
        if (at == null) continue;
        if (latest == null || at.isAfter(latest)) latest = at;
        if (_watermark != null && at.isAfter(_watermark!)) {
          fresh.add(item);
        }
      }

      // First run: set watermark, show heads-up for anything already unread
      // so the user sees notifications that arrived before polling started.
      if (_watermark == null) {
        if (latest != null) _watermark = latest;
        // On first poll, surface unread items as heads-up (up to 3)
        final unreadItems =
            items.where((e) => e['is_read'] == false).take(3).toList();
        for (final item in unreadItems) {
          await NotificationService.instance.show(
            title: '${item['title'] ?? 'Alert'}',
            body: '${item['body'] ?? ''}'.isEmpty
                ? null
                : '${item['body']}',
          );
        }
      } else if (latest != null && latest.isAfter(_watermark!)) {
        _watermark = latest;
        // Subsequent polls: only surface genuinely new notifications
        for (final item in fresh.take(3)) {
          await NotificationService.instance.show(
            title: '${item['title'] ?? 'Alert'}',
            body: '${item['body'] ?? ''}'.isEmpty
                ? null
                : '${item['body']}',
          );
        }
      }

      if (_unread != unread) {
        _unread = unread;
        notifyListeners();
      }
    } catch (_) {
      // Silent — bell stays stale until next tick.
    }
  }
}
