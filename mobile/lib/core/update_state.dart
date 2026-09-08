import 'dart:async';

import 'package:flutter/foundation.dart';

import 'app_version.dart';
import 'updater.dart';

/// Shared, observable state for the in-app updater.
///
/// Both the HomeShell banner and the Settings screen read/write this singleton
/// so update checks, download progress, and dismissals stay in sync across the
/// entire widget tree.
class UpdateState extends ChangeNotifier {
  UpdateState._();
  static final UpdateState instance = UpdateState._();

  AppUpdate? _update;
  double? _progress;
  String? _error;
  bool _checking = false;
  bool _dismissed = false;

  AppUpdate? get update => _update;
  double? get progress => _progress;
  String? get error => _error;
  bool get checking => _checking;
  bool get dismissed => _dismissed;
  bool get downloading => _progress != null;
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

  static int _parseLocalBuild() {
    final plus = AppVersion.version.split('+');
    return plus.length > 1 ? int.tryParse(plus[1]) ?? 0 : 0;
  }

  /// Checks for an update from the remote manifest. Called on app launch and
  /// can be triggered manually from Settings.
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

  /// Downloads the available update and installs it.
  Future<void> downloadAndInstall() async {
    if (_update == null || _progress != null) return;
    _progress = 0;
    _error = null;
    notifyListeners();

    try {
      final path = await Updater.download(
        _update!,
        onProgress: (p) {
          _progress = p;
          notifyListeners();
        },
      );
      await Updater.install(path);
      _progress = null;
      notifyListeners();
    } catch (err) {
      _progress = null;
      _error =
          'Install failed. Allow "Install unknown apps" for Meteoric '
          'Admin in Android settings, then retry.';
      notifyListeners();
    }
  }

  /// Dismisses the update banner (user chose not to update right now).
  /// Blocked when a forced upgrade is active — user must update.
  void dismiss() {
    if (forceUpgrade) return;
    _update = null;
    _progress = null;
    _error = null;
    _dismissed = true;
    notifyListeners();
  }
}
