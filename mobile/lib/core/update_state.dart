import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:shorebird_code_push/shorebird_code_push.dart';

import 'app_version.dart';
import 'updater.dart';

/// Shared, observable state for the in-app updater.
///
/// Manages two update flows:
/// 1. **Shorebird OTA patches** — small (~3MB), applied silently, require restart
/// 2. **Full APK updates** — large (~56MB), downloaded with progress, installed inline
class UpdateState extends ChangeNotifier {
  UpdateState._();
  static final UpdateState instance = UpdateState._();

  // ── APK update state ──────────────────────────────────────────────────
  AppUpdate? _update;
  double? _progress;
  String? _error;
  bool _checking = false;
  bool _dismissed = false;
  bool _downloading = false;
  Completer<void>? _downloadCancel;

  AppUpdate? get update => _update;
  double? get progress => _progress;
  String? get error => _error;
  bool get checking => _checking;
  bool get dismissed => _dismissed;
  bool get downloading => _downloading;
  bool get hasUpdate => _update != null && !_dismissed;

  /// True when the remote manifest's `min_supported_build` exceeds the
  /// running build — the user MUST update and cannot dismiss the banner.
  bool get forceUpgrade {
    final u = _update;
    if (u?.minSupportedBuild == null) return false;
    final localBuild = _parseLocalBuild();
    return localBuild < u!.minSupportedBuild!;
  }

  /// Forced upgrades override dismissal — always show the banner.
  bool get showBanner => hasUpdate || (forceUpgrade && _update != null);

  // ── Shorebird patch state ─────────────────────────────────────────────
  bool _shorebirdChecking = false;
  bool _shorebirdUpdateAvailable = false;
  bool _shorebirdUpdating = false;
  bool _shorebirdRestartReady = false;
  String? _shorebirdError;

  bool get shorebirdChecking => _shorebirdChecking;
  bool get shorebirdUpdateAvailable => _shorebirdUpdateAvailable;
  bool get shorebirdUpdating => _shorebirdUpdating;
  bool get shorebirdRestartReady => _shorebirdRestartReady;
  String? get shorebirdError => _shorebirdError;
  bool get showShorebirdBanner => _shorebirdUpdateAvailable || _shorebirdRestartReady;

  static int _parseLocalBuild() {
    final plus = AppVersion.version.split('+');
    return plus.length > 1 ? int.tryParse(plus[1]) ?? 0 : 0;
  }

  // ── Combined update check ─────────────────────────────────────────────

  /// Checks for both Shorebird patches and APK updates. Called on app launch.
  Future<void> checkAll() async {
    await Future.wait([checkShorebirdPatch(), checkForUpdate()]);
  }

  /// Checks for a Shorebird OTA patch.
  Future<void> checkShorebirdPatch() async {
    final updater = ShorebirdUpdater();
    if (!updater.isAvailable) return;
    if (_shorebirdChecking) return;
    _shorebirdChecking = true;
    _shorebirdError = null;
    notifyListeners();

    try {
      final status = await updater.checkForUpdate();
      _shorebirdUpdateAvailable = status == UpdateStatus.outdated;
      _shorebirdRestartReady = status == UpdateStatus.restartRequired;
    } catch (_) {
      _shorebirdError = 'Could not check for patches';
    } finally {
      _shorebirdChecking = false;
      notifyListeners();
    }
  }

  /// Downloads and stages the Shorebird patch. User must restart after.
  Future<void> applyShorebirdPatch() async {
    final updater = ShorebirdUpdater();
    if (!updater.isAvailable) return;
    if (_shorebirdUpdating) return;
    _shorebirdUpdating = true;
    _shorebirdError = null;
    notifyListeners();

    try {
      await updater.update();
      _shorebirdUpdateAvailable = false;
      _shorebirdRestartReady = true;
    } on UpdateException catch (e) {
      _shorebirdError = e.message;
    } catch (_) {
      _shorebirdError = 'Patch failed. Try again later.';
    } finally {
      _shorebirdUpdating = false;
      notifyListeners();
    }
  }

  /// Checks for an APK update from the remote manifest.
  Future<void> checkForUpdate() async {
    if (_checking) return;
    _checking = true;
    _error = null;
    notifyListeners();

    try {
      final update = await Updater.checkForUpdate();
      _update = update;
      _dismissed = false;
    } catch (_) {
      _error = 'Could not check for updates';
    } finally {
      _checking = false;
      notifyListeners();
    }
  }

  // ── APK download + install ────────────────────────────────────────────

  /// Downloads the available APK update and installs it.
  Future<void> downloadAndInstall() async {
    if (_update == null || _downloading) return;
    _downloading = true;
    _progress = 0;
    _error = null;
    _downloadCancel = Completer<void>();
    notifyListeners();

    try {
      final path = await Updater.download(
        _update!,
        onProgress: (p) {
          _progress = p;
          notifyListeners();
        },
      );
      // Check install permission — if denied, open settings and pause
      if (!await Updater.canInstallPackages()) {
        _progress = null;
        _downloading = false;
        _needsInstallPermission = true;
        _pendingInstallPath = path;
        _error = 'Allow "Install unknown apps" for Meteoric Admin, then tap INSTALL.';
        notifyListeners();
        await Updater.requestInstallPermission();
        return;
      }
      _downloading = false;
      _progress = null;
      await Updater.install(path);
      notifyListeners();
    } catch (err) {
      _downloading = false;
      _progress = null;
      _error =
          'Install failed. Allow "Install unknown apps" for Meteoric '
          'Admin in Android settings, then retry.';
      notifyListeners();
    }
  }

  /// Cancels the current APK download.
  void cancelDownload() {
    _downloadCancel?.complete();
    _downloading = false;
    _progress = null;
    _error = 'Download cancelled.';
    notifyListeners();
  }

  /// Retries the install after the user has granted permission.
  Future<void> retryInstall() async {
    if (_pendingInstallPath == null) return;
    _error = null;
    _needsInstallPermission = false;
    notifyListeners();
    try {
      await Updater.install(_pendingInstallPath!);
      _pendingInstallPath = null;
      notifyListeners();
    } catch (err) {
      _progress = null;
      _error =
          'Install failed. Allow "Install unknown apps" for Meteoric '
          'Admin in Android settings, then retry.';
      notifyListeners();
    }
  }

  bool _needsInstallPermission = false;
  String? _pendingInstallPath;
  bool get needsInstallPermission => _needsInstallPermission;

  /// Dismisses the APK update banner.
  void dismiss() {
    if (forceUpgrade) return;
    _update = null;
    _progress = null;
    _error = null;
    _dismissed = true;
    notifyListeners();
  }

  /// Dismisses the Shorebird patch banner.
  void dismissShorebird() {
    _shorebirdUpdateAvailable = false;
    _shorebirdError = null;
    notifyListeners();
  }
}
