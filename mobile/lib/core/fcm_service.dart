import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'api_client.dart';
import 'notification_service.dart';
import 'notification_state.dart';

/// Handles Firebase Cloud Messaging setup:
/// - Requests FCM permission
/// - Stores the FCM token in Supabase `fcm_tokens` table
/// - Listens for foreground messages and shows local notifications
/// - Refreshes token on auth state changes
class FcmService {
  FcmService._();
  static final instance = FcmService._();

  final _messaging = FirebaseMessaging.instance;
  String? _currentToken;

  /// Initialize FCM. Call after Supabase is initialized and user is signed in.
  Future<void> init() async {
    try {
      // Request permission (Android 13+ requires this)
      final settings = await _messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      if (settings.authorizationStatus != AuthorizationStatus.authorized) {
        debugPrint('FCM: permission denied');
        return;
      }

      // Get and store token
      await _refreshToken();

      // Listen for token refresh
      _messaging.onTokenRefresh.listen((token) {
        _currentToken = token;
        _storeToken(token);
      });

      // Handle foreground messages
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

      // Handle notification tap when app is in background
      FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpenedApp);

      // Check if app was opened from a notification (cold start)
      final initialMessage = await _messaging.getInitialMessage();
      if (initialMessage != null) {
        _handleMessageOpenedApp(initialMessage);
      }

      debugPrint('FCM: initialized');
    } catch (err) {
      debugPrint('FCM init failed: $err');
    }
  }

  /// Store the FCM token in Supabase for server-side push.
  Future<void> _storeToken(String token) async {
    try {
      final user = Supabase.instance.client.auth.currentUser;
      if (user == null) return;

      final supabase = Supabase.instance.client;

      // Upsert: insert or update if token already exists for this user
      await supabase.from('fcm_tokens').upsert(
        {
          'user_id': user.id,
          'token': token,
          'platform': defaultTargetPlatform == TargetPlatform.android
              ? 'android'
              : 'ios',
          'updated_at': DateTime.now().toIso8601String(),
        },
        onConflict: 'token',
      );

      debugPrint('FCM: token stored');
    } catch (err) {
      debugPrint('FCM token store failed: $err');
    }
  }

  Future<void> _refreshToken() async {
    try {
      _currentToken = await _messaging.getToken();
      if (_currentToken != null) {
        await _storeToken(_currentToken!);
      }
    } catch (err) {
      debugPrint('FCM getToken failed: $err');
    }
  }

  void _handleForegroundMessage(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    NotificationService.instance.show(
      title: notification.title ?? 'Alert',
      body: notification.body,
    );

    // Also update unread count
    _pollUnreadCount();
  }

  void _handleMessageOpenedApp(RemoteMessage message) {
    // Could navigate to a specific screen based on message data
    // For now, just log it
    debugPrint('FCM: notification tapped: ${message.data}');
  }

  /// Quick poll to sync unread count after receiving a push.
  Future<void> _pollUnreadCount() async {
    try {
      final res = await ApiClient.instance.notificationsList();
      final unread = (res['unreadCount'] as num?)?.toInt() ?? 0;
      // Notify listeners via NotificationState
      NotificationState.instance.setUnread(unread);
    } catch (_) {
      // Silent
    }
  }

  /// Remove FCM token on sign out.
  Future<void> removeToken() async {
    try {
      if (_currentToken != null) {
        final supabase = Supabase.instance.client;
        await supabase
            .from('fcm_tokens')
            .delete()
            .eq('token', _currentToken!);
      }
      _currentToken = null;
    } catch (err) {
      debugPrint('FCM token remove failed: $err');
    }
  }
}
