import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Local heads-up notifications for admin alerts (new lead, new booking,
/// payment received, invoice overdue). Shown while the app process is alive
/// — polling in the dashboard decides when to surface them.
class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  final _plugin = FlutterLocalNotificationsPlugin();
  bool _ready = false;
  int _idSeq = 1;

  Future<void> init() async {
    if (_ready) return;
    try {
      const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
      const iosInit = DarwinInitializationSettings();
      await _plugin.initialize(
        const InitializationSettings(android: androidInit, iOS: iosInit),
      );

      final android = _plugin
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >();
      if (android != null) {
        await android.requestNotificationsPermission();
        await android.createNotificationChannel(
          const AndroidNotificationChannel(
            'alerts',
            'Admin alerts',
            description: 'New leads, bookings, payments and overdue invoices',
            importance: Importance.high,
          ),
        );
      }
      _ready = true;
    } catch (err) {
      debugPrint('NotificationService.init failed: $err');
    }
  }

  /// Fire-and-forget heads-up notification. No-op if init failed or
  /// permission was denied.
  Future<void> show({required String title, String? body}) async {
    if (!_ready) return;
    try {
      await _plugin.show(
        _idSeq++,
        title,
        body,
        const NotificationDetails(
          android: AndroidNotificationDetails(
            'alerts',
            'Admin alerts',
            channelDescription:
                'New leads, bookings, payments and overdue invoices',
            importance: Importance.high,
            priority: Priority.high,
            category: AndroidNotificationCategory.message,
          ),
          iOS: DarwinNotificationDetails(),
        ),
      );
    } catch (err) {
      debugPrint('NotificationService.show failed: $err');
    }
  }
}
