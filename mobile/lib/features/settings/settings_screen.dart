import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../core/app_version.dart';
import '../../core/biometric_service.dart';
import '../../core/device_info.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../core/update_state.dart';
import '../../shared/widgets/common.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _busy = false;
  String _role = '';
  bool _editingProfile = false;
  bool _editingPassword = false;
  int _runtimePatch = AppVersion.patch;
  bool _biometricEnabled = false;
  bool _biometricAvailable = false;

  late final TextEditingController _name;
  late final TextEditingController _email;
  final _password = TextEditingController();
  final _confirmPassword = TextEditingController();
  bool _showPassword = false;
  String _originalEmail = '';

  @override
  void initState() {
    super.initState();
    final user = AuthService.user;
    _name = TextEditingController(
      text: user?.userMetadata?['full_name'] ??
          user?.userMetadata?['name'] ??
          '',
    );
    _email = TextEditingController(text: user?.email ?? '');
    _originalEmail = user?.email ?? '';
    _loadRole();
    _loadBiometric();
    UpdateState.instance.addListener(_onUpdateState);
    _loadRuntimePatch();
  }

  Future<void> _loadRuntimePatch() async {
    final p = await AppVersion.runtimePatch;
    if (mounted) setState(() => _runtimePatch = p);
  }

  @override
  void dispose() {
    UpdateState.instance.removeListener(_onUpdateState);
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  void _onUpdateState() {
    if (mounted) setState(() {});
  }

  Future<void> _loadRole() async {
    final data = await AuthService.myRole;
    if (!mounted) return;
    setState(() => _role = data?['role'] ?? '');
  }

  Future<void> _loadBiometric() async {
    final avail = await BiometricService.isAvailable;
    final enabled = await BiometricService.isEnabled;
    if (!mounted) return;
    setState(() {
      _biometricAvailable = avail;
      _biometricEnabled = enabled;
    });
  }

  Future<void> _toggleBiometric(bool value) async {
    Haptic.tap();
    final result = await BiometricService.toggle();
    if (mounted) setState(() => _biometricEnabled = result);
  }

  void _snack(String msg, {bool error = false}) =>
      error ? Toast.error(context, msg) : Toast.success(context, msg);

  Future<void> _saveProfile() async {
    final name = _name.text.trim();
    final email = _email.text.trim();
    if (name.isEmpty) return _snack('Name cannot be empty', error: true);
    if (email.isEmpty || !email.contains('@')) {
      return _snack('Enter a valid email', error: true);
    }

    setState(() => _busy = true);
    try {
      await AuthService.instance.auth.updateUser(
        UserAttributes(
          data: {'full_name': name},
          email: email == _originalEmail ? null : email,
        ),
      );
      if (!mounted) return;
      setState(() => _editingProfile = false);
      _snack(
        email == _originalEmail
            ? 'Profile updated'
            : 'Profile updated — check your inbox to confirm the new email',
      );
    } catch (err) {
      if (mounted) _snack(_clean(err), error: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _changePassword() async {
    if (_password.text.length < 6) {
      return _snack('Password must be at least 6 characters', error: true);
    }
    if (_password.text != _confirmPassword.text) {
      return _snack('Passwords do not match', error: true);
    }

    setState(() => _busy = true);
    try {
      await AuthService.instance.auth.updateUser(
        UserAttributes(password: _password.text),
      );
      if (!mounted) return;
      _password.clear();
      _confirmPassword.clear();
      setState(() => _editingPassword = false);
      _snack('Password updated');
    } catch (err) {
      if (mounted) _snack(_clean(err), error: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  String _clean(Object err) {
    final msg = err.toString().replaceFirst('AuthException: ', '');
    return msg.length > 120 ? '${msg.substring(0, 120)}…' : msg;
  }

  Color get _roleColor {
    switch (_role) {
      case 'superadmin':
        return AppColors.accent;
      case 'admin':
        return AppColors.emerald;
      case 'speaker':
        return AppColors.textMuted;
      default:
        return AppColors.textFaint;
    }
  }

  Future<void> _checkForUpdate() async {
    await UpdateState.instance.checkForUpdate();
    if (!mounted) return;
    final state = UpdateState.instance;
    if (state.update == null && state.error == null) {
      Toast.info(context, 'You are on the latest version');
    }
  }

  Future<void> _signOut() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sign out'),
        content: const Text('Sign out of Meteoric Admin?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          AccentButton(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('SIGN OUT'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _busy = true);
    try {
      await AuthService.signOut();
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const _SignedOut()),
          (_) => false,
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final displayName =
        AuthService.user?.userMetadata?['full_name'] ??
        AuthService.user?.userMetadata?['name'] ??
        _originalEmail.split('@').first;

    return UnfocusOnTap(
      child: AppScaffold(
        title: 'Settings',
        body: ListView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
          children: [
            // ── Profile header ──────────────────────────────────────
            _buildProfileHeader(displayName),
            const SizedBox(height: 24),

            // ── Account section ─────────────────────────────────────
            _sectionLabel('ACCOUNT'),
            const SizedBox(height: 10),
            _buildAccountCard(displayName),

            // ── Edit profile (expanded) ────────────────────────────
            AnimatedSize(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeInOut,
              alignment: Alignment.topCenter,
              child: _editingProfile
                  ? _buildProfileForm()
                  : const SizedBox.shrink(),
            ),

            const SizedBox(height: 28),

            // ── Security section ────────────────────────────────────
            _sectionLabel('SECURITY'),
            const SizedBox(height: 10),
            _buildSecurityCard(),

            const SizedBox(height: 28),

            // ── App section ─────────────────────────────────────────
            _sectionLabel('APP'),
            const SizedBox(height: 10),
            _buildAppCard(),
            const SizedBox(height: 12),
            _buildUpdateChecker(),

            const SizedBox(height: 32),

            // ── Sign out ──────────────────────────────────────────
            _buildSignOutButton(),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  // ── Profile header ──────────────────────────────────────────────

  Widget _buildProfileHeader(String displayName) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: AppRadius.lgAll,
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 56,
            height: 56,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: _roleColor.withValues(alpha: 0.1),
              borderRadius: AppRadius.lgAll,
              border: Border.all(
                color: _roleColor.withValues(alpha: 0.25),
                width: 1.5,
              ),
            ),
            child: Text(
              displayName[0].toUpperCase(),
              style: TextStyle(
                color: _roleColor,
                fontSize: 22,
                fontWeight: FontWeight.w700,
                fontFamily: 'Inter',
              ),
            ),
          ),
          const SizedBox(width: 16),
          // Name + email
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayName,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Inter',
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  _originalEmail,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 12,
                    fontFamily: 'Inter',
                  ),
                ),
                if (_role.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 3,
                    ),
                    decoration: BoxDecoration(
                      color: _roleColor.withValues(alpha: 0.1),
                      borderRadius: AppRadius.smAll,
                    ),
                    child: Text(
                      _role.toUpperCase(),
                      style: TextStyle(
                        color: _roleColor,
                        fontSize: 9,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          // Edit chevron
          GestureDetector(
            onTap: () {
              Haptic.tap();
              setState(() {
                _editingProfile = !_editingProfile;
                if (_editingProfile) {
                  _editingPassword = false;
                  _password.clear();
                  _confirmPassword.clear();
                }
              });
            },
            child: Container(
              width: 32,
              height: 32,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: AppColors.textFaint.withValues(alpha: 0.06),
                borderRadius: AppRadius.smAll,
              ),
              child: Icon(
                _editingProfile
                    ? Icons.close_rounded
                    : Icons.chevron_right_rounded,
                size: 18,
                color: AppColors.textMuted,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Account card ────────────────────────────────────────────────

  Widget _buildAccountCard(String displayName) {
    return _CardContainer(
      child: Column(
        children: [
          _infoRow('Name', displayName),
          _rowDivider(),
          _infoRow('Email', _originalEmail),
          _rowDivider(),
          _infoRow('Role', _role.toUpperCase(), valueColor: _roleColor),
        ],
      ),
    );
  }

  // ── Security card ───────────────────────────────────────────────

  Widget _buildSecurityCard() {
    return _CardContainer(
      child: Column(
        children: [
          _expandableRow(
            icon: Icons.lock_outline_rounded,
            label: 'Password',
            subtitle: 'Update your password',
            expanded: _editingPassword,
            onTap: () {
              setState(() {
                _editingPassword = !_editingPassword;
                if (_editingPassword) {
                  _editingProfile = false;
                }
              });
            },
            child: _editingPassword ? _buildPasswordForm() : null,
          ),
          if (_biometricAvailable) ...[
            _rowDivider(),
            _toggleRow(
              icon: Icons.fingerprint_rounded,
              label: 'Biometric Lock',
              subtitle: 'Fingerprint / face to open app',
              value: _biometricEnabled,
              onChanged: _toggleBiometric,
            ),
          ],
        ],
      ),
    );
  }

  // ── App card ────────────────────────────────────────────────────

  Widget _buildAppCard() {
    return _CardContainer(
      child: Column(
        children: [
          _infoRow(
            'Version',
            _runtimePatch > 0
                ? '${AppVersion.version} (patch $_runtimePatch)'
                : AppVersion.display,
          ),
          _rowDivider(),
          _infoRow('Updated', AppVersion.updatedAt),
          if (DeviceInfo.model != 'unknown') ...[
            _rowDivider(),
            _infoRow('Device', DeviceInfo.model),
          ],
        ],
      ),
    );
  }

  // ── Sign out button ─────────────────────────────────────────────

  Widget _buildSignOutButton() {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: _busy ? null : _signOut,
        borderRadius: AppRadius.lgAll,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: Color(0x08FF4242),
            borderRadius: AppRadius.lgAll,
            border: Border.all(
              color: AppColors.red.withValues(alpha: 0.2),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.logout_rounded,
                size: 16,
                color: AppColors.red,
              ),
              const SizedBox(width: 8),
              const Text(
                'SIGN OUT',
                style: TextStyle(
                  color: AppColors.red,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.8,
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Update checker ──────────────────────────────────────────────

  Widget _buildUpdateChecker() {
    final state = UpdateState.instance;
    final checking = state.checking;
    final downloading = state.downloading;
    final update = state.update;
    final error = state.error;
    final forced = state.forceUpgrade;

    return _CardContainer(
      child: Column(
        children: [
          InkWell(
            onTap: checking || downloading ? null : _checkForUpdate,
            borderRadius: AppRadius.lgAll,
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: (forced ? AppColors.red : AppColors.accent)
                          .withValues(alpha: 0.06),
                      borderRadius: AppRadius.smAll,
                      border: Border.all(
                        color: (forced ? AppColors.red : AppColors.accent)
                            .withValues(alpha: 0.12),
                      ),
                    ),
                    child: checking
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: AppColors.accent,
                            ),
                          )
                        : Icon(
                            forced
                                ? Icons.warning_rounded
                                : Icons.system_update_rounded,
                            size: 16,
                            color: forced ? AppColors.red : AppColors.accent,
                          ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          checking
                              ? 'Checking\u2026'
                              : update != null
                                  ? (forced
                                      ? 'Update Required'
                                      : 'Update Available')
                                  : 'Check for Updates',
                          style: TextStyle(
                            color: forced ? AppColors.red : AppColors.text,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            fontFamily: 'Inter',
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          checking
                              ? 'Looking for the latest version\u2026'
                              : update != null
                                  ? 'Version ${update.version} is ready'
                                  : 'Tap to check for a newer version',
                          style: TextStyle(
                            color: update != null
                                ? (forced ? AppColors.red : AppColors.accent)
                                : AppColors.textFaint,
                            fontSize: 11,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (!checking && !downloading && update == null)
                    const Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: AppColors.textFaint,
                    ),
                ],
              ),
            ),
          ),
          if (update != null && !downloading) ...[
            _rowDivider(),
            if (update.notes != null && update.notes!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    update.notes!,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 12,
                      fontFamily: 'Inter',
                      height: 1.4,
                    ),
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              child: SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: state.downloadAndInstall,
                  style: TextButton.styleFrom(
                    backgroundColor: forced ? AppColors.red : AppColors.accent,
                    foregroundColor:
                        forced ? Colors.white : AppColors.onAccent,
                    padding: const EdgeInsets.symmetric(vertical: 11),
                    shape: RoundedRectangleBorder(
                      borderRadius: AppRadius.smAll,
                    ),
                  ),
                  child: Text(
                    forced ? 'UPDATE NOW' : 'DOWNLOAD & INSTALL',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.2,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
            ),
          ],
          if (downloading) ...[
            _rowDivider(),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Downloading update\u2026',
                          style: TextStyle(
                            color: AppColors.text,
                            fontSize: 13,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                      Text(
                        '${((state.progress ?? 0) * 100).toInt()}%',
                        style: const TextStyle(
                          color: AppColors.accent,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: AppRadius.xxsAll,
                    child: LinearProgressIndicator(
                      value: (state.progress ?? 0).clamp(0.0, 1.0),
                      minHeight: 3,
                      backgroundColor: AppColors.border,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        AppColors.accent,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (error != null) ...[
            _rowDivider(),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              child: Text(
                error,
                style: const TextStyle(
                  color: AppColors.red,
                  fontSize: 12,
                  fontFamily: 'Inter',
                  height: 1.4,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ── Helper widgets ──────────────────────────────────────────────

  Widget _sectionLabel(String text) => Text(
    text,
    style: const TextStyle(
      color: AppColors.textFaint,
      fontSize: 10,
      fontWeight: FontWeight.w600,
      letterSpacing: 1.4,
      fontFamily: 'Inter',
    ),
  );

  Widget _infoRow(String label, String value, {Color? valueColor}) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
    child: Row(
      children: [
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 13,
              fontFamily: 'Inter',
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? AppColors.text,
            fontSize: 13,
            fontWeight: FontWeight.w500,
            fontFamily: 'Inter',
          ),
        ),
      ],
    ),
  );

  Widget _rowDivider() => const Padding(
    padding: EdgeInsets.symmetric(horizontal: 16),
    child: Divider(height: 1, color: AppColors.border),
  );

  Widget _toggleRow({
    required IconData icon,
    required String label,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: (value ? AppColors.accent : AppColors.textFaint)
                  .withValues(alpha: 0.06),
              borderRadius: AppRadius.smAll,
              border: Border.all(
                color: (value ? AppColors.accent : AppColors.textFaint)
                    .withValues(alpha: 0.12),
              ),
            ),
            child: Icon(
              icon,
              size: 16,
              color: value ? AppColors.accent : AppColors.textMuted,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    fontFamily: 'Inter',
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 11,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeThumbColor: AppColors.onAccent,
            activeTrackColor: AppColors.accent,
            inactiveTrackColor: AppColors.border,
          ),
        ],
      ),
    );
  }

  Widget _expandableRow({
    required IconData icon,
    required String label,
    required String subtitle,
    required bool expanded,
    required VoidCallback onTap,
    Widget? child,
  }) {
    return Column(
      children: [
        InkWell(
          onTap: () {
            Haptic.tap();
            onTap();
          },
          borderRadius: AppRadius.lgAll,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.textFaint.withValues(alpha: 0.06),
                    borderRadius: AppRadius.smAll,
                    border: Border.all(
                      color: AppColors.textFaint.withValues(alpha: 0.12),
                    ),
                  ),
                  child: Icon(icon, size: 16, color: AppColors.textMuted),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          fontFamily: 'Inter',
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          color: AppColors.textFaint,
                          fontSize: 11,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ],
                  ),
                ),
                AnimatedRotation(
                  turns: expanded ? 0.5 : 0,
                  duration: const Duration(milliseconds: 200),
                  child: const Icon(
                    Icons.keyboard_arrow_down_rounded,
                    size: 20,
                    color: AppColors.textFaint,
                  ),
                ),
              ],
            ),
          ),
        ),
        AnimatedSize(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeInOut,
          alignment: Alignment.topCenter,
          child: child ?? const SizedBox.shrink(),
        ),
      ],
    );
  }

  Widget _buildProfileForm() {
    final emailChanged = _email.text.trim() != _originalEmail;
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _inputLabel('FULL NAME'),
          TextField(
            controller: _name,
            enabled: !_busy,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 14,
              fontFamily: 'Inter',
            ),
            decoration: _input(),
          ),
          const SizedBox(height: 14),
          _inputLabel('EMAIL'),
          TextField(
            controller: _email,
            enabled: !_busy,
            keyboardType: TextInputType.emailAddress,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 14,
              fontFamily: 'Inter',
            ),
            decoration: _input(),
          ),
          if (emailChanged) ...[
            const SizedBox(height: 8),
            const Text(
              'A confirmation link will be sent to the new email address.',
              style: TextStyle(
                color: AppColors.amber,
                fontSize: 11,
                fontFamily: 'Inter',
              ),
            ),
          ],
          const SizedBox(height: 16),
          AccentButton(
            height: 40,
            onPressed: _busy ? null : _saveProfile,
            child: const Text('SAVE PROFILE'),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordForm() {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _inputLabel('NEW PASSWORD'),
          TextField(
            controller: _password,
            enabled: !_busy,
            obscureText: !_showPassword,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 14,
              fontFamily: 'Inter',
            ),
            decoration: _input(
              suffix: TextButton(
                onPressed: () =>
                    setState(() => _showPassword = !_showPassword),
                child: Text(
                  _showPassword ? 'Hide' : 'Show',
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 11,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),
          _inputLabel('CONFIRM PASSWORD'),
          TextField(
            controller: _confirmPassword,
            enabled: !_busy,
            obscureText: !_showPassword,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 14,
              fontFamily: 'Inter',
            ),
            decoration: _input(),
          ),
          if (_password.text.isNotEmpty &&
              _confirmPassword.text.isNotEmpty &&
              _password.text != _confirmPassword.text) ...[
            const SizedBox(height: 8),
            const Text(
              'Passwords do not match',
              style: TextStyle(
                color: AppColors.red,
                fontSize: 11,
                fontFamily: 'Inter',
              ),
            ),
          ],
          const SizedBox(height: 16),
          AccentButton(
            height: 40,
            onPressed: _busy ? null : _changePassword,
            child: const Text('UPDATE PASSWORD'),
          ),
        ],
      ),
    );
  }

  Widget _inputLabel(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Text(
      text,
      style: const TextStyle(
        color: AppColors.textFaint,
        fontSize: 10,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.2,
        fontFamily: 'Inter',
      ),
    ),
  );

  InputDecoration _input({Widget? suffix}) => InputDecoration(
    isDense: true,
    suffixIcon: suffix,
    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
    border: OutlineInputBorder(
      borderRadius: AppRadius.smAll,
      borderSide: const BorderSide(color: AppColors.border),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: AppRadius.smAll,
      borderSide: const BorderSide(color: AppColors.border),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: AppRadius.smAll,
      borderSide: BorderSide(
        color: AppColors.accent.withValues(alpha: 0.3),
      ),
    ),
    disabledBorder: OutlineInputBorder(
      borderRadius: AppRadius.smAll,
      borderSide: const BorderSide(color: AppColors.border),
    ),
  );
}

/// Reusable rounded card container for grouped sections.
class _CardContainer extends StatelessWidget {
  const _CardContainer({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: AppRadius.lgAll,
        border: Border.all(color: AppColors.border),
      ),
      child: child,
    );
  }
}

class _SignedOut extends StatelessWidget {
  const _SignedOut();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: SizedBox(
          width: 22,
          height: 22,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      ),
    );
  }
}
