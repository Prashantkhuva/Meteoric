import 'package:flutter/material.dart';

import '../../core/app_version.dart';
import '../../core/theme.dart';
import '../../core/update_state.dart';

/// Full-screen modal dialog for the APK update flow.
///
/// Shows different states: checking, update available, downloading, install
/// permission needed, error. Driven by [UpdateState] singleton.
class UpdateDialog extends StatefulWidget {
  const UpdateDialog({super.key});

  /// Convenience — shows the dialog as a modal barrier.
  static Future<void> show(BuildContext context) {
    return showGeneralDialog(
      context: context,
      barrierDismissible: false,
      barrierLabel: 'Update',
      transitionDuration: const Duration(milliseconds: 250),
      transitionBuilder: (ctx, a1, a2, child) {
        final curved = CurvedAnimation(parent: a1, curve: Curves.easeOutCubic);
        return FadeTransition(
          opacity: curved,
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.95, end: 1).animate(curved),
            child: child,
          ),
        );
      },
      pageBuilder: (_, _, _) => const UpdateDialog(),
    );
  }

  @override
  State<UpdateDialog> createState() => _UpdateDialogState();
}

class _UpdateDialogState extends State<UpdateDialog> {
  final _state = UpdateState.instance;
  DateTime? _downloadStart;

  @override
  void initState() {
    super.initState();
    _state.addListener(_onStateChange);
  }

  @override
  void dispose() {
    _state.removeListener(_onStateChange);
    super.dispose();
  }

  void _onStateChange() {
    if (mounted) setState(() {});

    // Track download start time
    final p = _state.progress;
    if (p != null && p > 0) {
      _downloadStart ??= DateTime.now();
    }

    // Close dialog when download completes and install starts
    if (!_state.downloading &&
        _state.progress == null &&
        _state.error == null &&
        _downloadStart != null) {
      _downloadStart = null;
      if (mounted) Navigator.of(context).maybePop();
    }
  }

  String _formatDuration(Duration d) {
    if (d.inMinutes > 0) return '${d.inMinutes}m ${d.inSeconds % 60}s';
    return '${d.inSeconds}s';
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !_state.downloading,
      child: Dialog(
        backgroundColor: AppColors.card,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.lgAll,
          side: const BorderSide(color: AppColors.border),
        ),
        insetPadding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 360),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: _buildContent(),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (_state.checking) return _buildChecking();
    if (_state.forceUpgrade) return _buildForceUpgrade();
    if (_state.downloading) return _buildDownloading();
    if (_state.needsInstallPermission) return _buildInstallPermission();
    if (_state.error != null) return _buildError();
    if (_state.update != null) return _buildUpdateAvailable();
    return _buildUpToDate();
  }

  Widget _buildChecking() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(
          width: 32,
          height: 32,
          child: CircularProgressIndicator(
            strokeWidth: 2.5,
            color: AppColors.accent,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Checking for updates...',
          style: TextStyle(
            color: AppColors.text,
            fontSize: 14,
            fontWeight: FontWeight.w500,
            fontFamily: 'Inter',
          ),
        ),
      ],
    );
  }

  Widget _buildUpdateAvailable() {
    final update = _state.update!;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.accent.withValues(alpha: 0.1),
                borderRadius: AppRadius.mdAll,
              ),
              child: const Icon(
                Icons.system_update_outlined,
                color: AppColors.accent,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'UPDATE AVAILABLE',
                    style: TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.2,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'v${update.version}',
                    style: const TextStyle(
                      color: AppColors.text,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),

        // Release notes
        if (update.notes != null && update.notes!.isNotEmpty) ...[
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: AppRadius.mdAll,
              border: Border.all(color: AppColors.border),
            ),
            child: Text(
              update.notes!,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                fontFamily: 'Inter',
                height: 1.5,
              ),
            ),
          ),
        ],

        const SizedBox(height: 20),

        // Buttons
        Row(
          children: [
            Expanded(
              child: GhostButton(
                height: 40,
                onPressed: () {
                  _state.dismiss();
                  Navigator.of(context).pop();
                },
                child: const Text('LATER'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: AccentButton(
                height: 40,
                onPressed: () => _state.downloadAndInstall(),
                child: const Text('DOWNLOAD'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDownloading() {
    final progress = _state.progress ?? 0;
    final percent = (progress * 100).toStringAsFixed(0);
    final update = _state.update;

    // Estimate total size from content-length (if available)
    // For now show percentage only
    final elapsed = _downloadStart != null
        ? DateTime.now().difference(_downloadStart!)
        : Duration.zero;

    // Estimate remaining time
    String eta = '';
    if (progress > 0.05 && elapsed.inSeconds > 2) {
      final totalEstimate = Duration(
        milliseconds: (elapsed.inMilliseconds / progress).round(),
      );
      final remaining = totalEstimate - elapsed;
      if (remaining.isNegative) {
        eta = 'Almost done...';
      } else {
        eta = '~${_formatDuration(remaining)} remaining';
      }
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppColors.accent,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                update != null
                    ? 'Downloading v${update.version}'
                    : 'Downloading update...',
                style: const TextStyle(
                  color: AppColors.text,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Progress bar
        ClipRRect(
          borderRadius: AppRadius.smAll,
          child: LinearProgressIndicator(
            value: progress > 0 ? progress : null,
            minHeight: 6,
            backgroundColor: AppColors.border,
            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
          ),
        ),
        const SizedBox(height: 10),

        // Stats row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '$percent%',
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 13,
                fontWeight: FontWeight.w600,
                fontFamily: 'Inter',
              ),
            ),
            if (eta.isNotEmpty)
              Text(
                eta,
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontFamily: 'Inter',
                ),
              ),
          ],
        ),

        const SizedBox(height: 16),

        // Cancel button
        SizedBox(
          width: double.infinity,
          child: GhostButton(
            height: 40,
            onPressed: () => _state.cancelDownload(),
            child: const Text('CANCEL'),
          ),
        ),
      ],
    );
  }

  Widget _buildInstallPermission() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.shield_outlined,
          size: 36,
          color: AppColors.amber,
        ),
        const SizedBox(height: 14),
        const Text(
          'Permission Required',
          style: TextStyle(
            color: AppColors.text,
            fontSize: 15,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Allow "Install unknown apps" for Meteoric Admin in Android settings, then come back and tap INSTALL.',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: AppColors.textMuted,
            fontSize: 12,
            fontFamily: 'Inter',
            height: 1.5,
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          child: AccentButton(
            height: 40,
            onPressed: () => _state.retryInstall(),
            child: const Text('INSTALL'),
          ),
        ),
      ],
    );
  }

  Widget _buildForceUpgrade() {
    final update = _state.update;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.warning_amber_rounded,
          size: 36,
          color: AppColors.red,
        ),
        const SizedBox(height: 14),
        const Text(
          'UPDATE REQUIRED',
          style: TextStyle(
            color: AppColors.red,
            fontSize: 13,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.2,
            fontFamily: 'Inter',
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'This version is no longer supported.\nPlease update to continue.',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: AppColors.text,
            fontSize: 13,
            fontFamily: 'Inter',
            height: 1.5,
          ),
        ),
        if (update?.notes != null && update!.notes!.isNotEmpty) ...[
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: AppRadius.mdAll,
              border: Border.all(color: AppColors.border),
            ),
            child: Text(
              update.notes!,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                fontFamily: 'Inter',
                height: 1.5,
              ),
            ),
          ),
        ],
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          child: AccentButton(
            height: 40,
            backgroundColor: AppColors.red,
            onPressed: () => _state.downloadAndInstall(),
            child: const Text(
              'UPDATE NOW',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildError() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.error_outline,
          size: 36,
          color: AppColors.red,
        ),
        const SizedBox(height: 14),
        const Text(
          'Update Failed',
          style: TextStyle(
            color: AppColors.text,
            fontSize: 15,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
        ),
        const SizedBox(height: 8),
        Text(
          _state.error!,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: AppColors.textMuted,
            fontSize: 12,
            fontFamily: 'Inter',
            height: 1.5,
          ),
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(
              child: GhostButton(
                height: 40,
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('CLOSE'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: AccentButton(
                height: 40,
                onPressed: () {
                  _state.downloadAndInstall();
                },
                child: const Text('RETRY'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildUpToDate() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.check_circle_outline,
          size: 36,
          color: AppColors.emerald,
        ),
        const SizedBox(height: 14),
        const Text(
          'You\'re up to date!',
          style: TextStyle(
            color: AppColors.text,
            fontSize: 15,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'v${_state.update?.version ?? AppVersion.version}',
          style: const TextStyle(
            color: AppColors.textMuted,
            fontSize: 12,
            fontFamily: 'Inter',
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          child: GhostButton(
            height: 40,
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ),
      ],
    );
  }
}
