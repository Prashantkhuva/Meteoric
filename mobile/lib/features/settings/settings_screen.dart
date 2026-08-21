import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../core/app_version.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _busy = false;

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
      text:
          user?.userMetadata?['full_name'] ?? user?.userMetadata?['name'] ?? '',
    );
    _email = TextEditingController(text: user?.email ?? '');
    _originalEmail = user?.email ?? '';
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  void _snack(String msg, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isError
            ? AppColors.red.withValues(alpha: 0.9)
            : AppColors.cardRaised,
      ),
    );
  }

  Future<void> _saveProfile() async {
    final name = _name.text.trim();
    final email = _email.text.trim();
    if (name.isEmpty) return _snack('Name cannot be empty', isError: true);
    if (email.isEmpty || !email.contains('@')) {
      return _snack('Enter a valid email', isError: true);
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
      _snack(
        email == _originalEmail
            ? 'Profile updated'
            : 'Profile updated — check your inbox to confirm the new email',
      );
    } catch (err) {
      if (mounted) _snack(_cleanError(err), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _changePassword() async {
    if (_password.text.length < 6) {
      return _snack('Password must be at least 6 characters', isError: true);
    }
    if (_password.text != _confirmPassword.text) {
      return _snack('Passwords do not match', isError: true);
    }

    setState(() => _busy = true);
    try {
      await AuthService.instance.auth.updateUser(
        UserAttributes(password: _password.text),
      );
      if (!mounted) return;
      _password.clear();
      _confirmPassword.clear();
      setState(() {});
      _snack('Password updated');
    } catch (err) {
      if (mounted) _snack(_cleanError(err), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  String _cleanError(Object err) {
    final msg = err.toString().replaceFirst('AuthException: ', '');
    return msg.length > 120 ? '${msg.substring(0, 120)}…' : msg;
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
    final emailChanged = _email.text.trim() != _originalEmail;

    return AppScaffold(
      title: 'Settings',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SectionCard(
            title: 'Profile',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _label('FULL NAME'),
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
                _label('EMAIL'),
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
          ),
          const SizedBox(height: 16),
          SectionCard(
            title: 'Change password',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _label('NEW PASSWORD'),
                TextField(
                  controller: _password,
                  enabled: !_busy,
                  obscureText: !_showPassword,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 14,
                    fontFamily: 'Inter',
                  ),
                  decoration: _input(suffix: _toggleButton()),
                ),
                const SizedBox(height: 14),
                _label('CONFIRM PASSWORD'),
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
          ),
          const SizedBox(height: 16),
          SectionCard(
            title: 'App',
            child: Column(
              children: [
                DetailRow(label: 'Version', value: AppVersion.display),
                DetailRow(label: 'Last updated', value: AppVersion.updatedAt),
                const DetailRow(label: 'Platform', value: 'Android / iOS'),
              ],
            ),
          ),
          const SizedBox(height: 20),
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

  Widget _label(String text) => Padding(
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
    border: OutlineInputBorder(borderSide: BorderSide(color: AppColors.border)),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: AppColors.border),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: AppColors.accent.withValues(alpha: 0.3)),
    ),
    disabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: AppColors.border),
    ),
  );

  Widget _toggleButton() => TextButton(
    onPressed: () => setState(() => _showPassword = !_showPassword),
    child: Text(
      _showPassword ? 'Hide' : 'Show',
      style: const TextStyle(
        color: AppColors.textFaint,
        fontSize: 11,
        fontFamily: 'Inter',
      ),
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
