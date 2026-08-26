import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../core/app_version.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
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
  }

  Future<void> _loadRole() async {
    final data = await AuthService.myRole;
    if (!mounted) return;
    setState(() => _role = data?['role'] ?? '');
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
    super.dispose();
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

    return AppScaffold(
      title: 'Settings',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ── Identity card ──────────────────────────────────────
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.card,
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: _roleColor.withValues(alpha: 0.1),
                    border: Border.all(
                      color: _roleColor.withValues(alpha: 0.25),
                    ),
                  ),
                  child: Text(
                    displayName[0].toUpperCase(),
                    style: TextStyle(
                      color: _roleColor,
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        displayName,
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _originalEmail,
                        style: const TextStyle(
                          color: AppColors.textFaint,
                          fontSize: 12,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ],
                  ),
                ),
                if (_role.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _roleColor.withValues(alpha: 0.08),
                      border: Border.all(
                        color: _roleColor.withValues(alpha: 0.2),
                      ),
                    ),
                    child: Text(
                      _role.toUpperCase(),
                      style: TextStyle(
                        color: _roleColor,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // ── Account ────────────────────────────────────────────
          _sectionHeader('ACCOUNT'),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: AppColors.card,
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                _infoRow('Name', displayName),
                _divider(),
                _infoRow('Email', _originalEmail),
                _divider(),
                _infoRow('Role', _role.toUpperCase(), valueColor: _roleColor),
              ],
            ),
          ),
          const SizedBox(height: 6),
          Align(
            alignment: Alignment.centerRight,
            child: _textButton(
              _editingProfile ? 'CANCEL' : 'EDIT PROFILE',
              onPressed: () {
                setState(() {
                  _editingProfile = !_editingProfile;
                  if (_editingProfile) {
                    _editingPassword = false;
                    _password.clear();
                    _confirmPassword.clear();
                  }
                });
              },
            ),
          ),

          // ── Edit profile (expanded) ────────────────────────────
          AnimatedSize(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeInOut,
            alignment: Alignment.topCenter,
            child: _editingProfile
                ? _buildProfileForm()
                : const SizedBox.shrink(),
          ),

          const SizedBox(height: 24),

          // ── Security ───────────────────────────────────────────
          _sectionHeader('SECURITY'),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: AppColors.card,
              border: Border.all(color: AppColors.border),
            ),
            child: _expandableRow(
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
          ),

          const SizedBox(height: 24),

          // ── App info ──────────────────────────────────────────
          _sectionHeader('APP'),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: AppColors.card,
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                _infoRow('Version', AppVersion.display),
                _divider(),
                _infoRow('Build', 'Patch ${AppVersion.patch}'),
                _divider(),
                _infoRow('Updated', AppVersion.updatedAt),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // ── Sign out ──────────────────────────────────────────
          GhostButton(
            borderColor: AppColors.red.withValues(alpha: 0.4),
            textColor: AppColors.red,
            onPressed: _busy ? null : _signOut,
            child: const Text('SIGN OUT'),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // ── Sub-widgets ───────────────────────────────────────────────

  Widget _sectionHeader(String text) => Text(
    text,
    style: const TextStyle(
      color: AppColors.textFaint,
      fontSize: 10,
      fontWeight: FontWeight.w600,
      letterSpacing: 1.2,
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

  Widget _divider() => const Padding(
    padding: EdgeInsets.symmetric(horizontal: 16),
    child: Divider(height: 1, color: AppColors.border),
  );

  Widget _textButton(String text, {VoidCallback? onPressed}) => TextButton(
    onPressed: onPressed,
    style: TextButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      minimumSize: Size.zero,
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
    ),
    child: Text(
      text,
      style: const TextStyle(
        color: AppColors.accent,
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.6,
        fontFamily: 'Inter',
      ),
    ),
  );

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
          onTap: onTap,
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
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(bottom: 6),
            child: Text(
              'FULL NAME',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
          ),
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
          const Padding(
            padding: EdgeInsets.only(bottom: 6),
            child: Text(
              'EMAIL',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
          ),
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
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(bottom: 6),
            child: Text(
              'NEW PASSWORD',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
          ),
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
          const Padding(
            padding: EdgeInsets.only(bottom: 6),
            child: Text(
              'CONFIRM PASSWORD',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                fontFamily: 'Inter',
              ),
            ),
          ),
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

  InputDecoration _input({Widget? suffix}) => InputDecoration(
    isDense: true,
    suffixIcon: suffix,
    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
    border: OutlineInputBorder(
      borderSide: BorderSide(color: AppColors.border),
    ),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: AppColors.border),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: AppColors.accent.withValues(alpha: 0.3),
      ),
    ),
    disabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: AppColors.border),
    ),
  );
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
