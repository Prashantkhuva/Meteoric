import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../core/api_client.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../home/home_shell.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  final _nameController = TextEditingController(
    text:
        AuthService.user?.userMetadata?['full_name'] ??
        AuthService.user?.userMetadata?['name'] ??
        '',
  );
  final _newPassword = TextEditingController();
  final _confirmPassword = TextEditingController();
  bool _obscurePassword = true;
  int _step = 0;
  bool _saving = false;

  @override
  void dispose() {
    _pageController.dispose();
    _nameController.dispose();
    _newPassword.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  void _next() {
    if (_step < 3) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _prev() {
    if (_step > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _saveName() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      Toast.error(context, 'Name cannot be empty');
      return;
    }
    setState(() => _saving = true);
    try {
      await AuthService.instance.auth.updateUser(
        UserAttributes(data: {'full_name': name}),
      );
      _next();
    } catch (err) {
      if (mounted) Toast.error(context, err.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _savePassword() async {
    final pw = _newPassword.text;
    final confirm = _confirmPassword.text;
    if (pw.length < 6) {
      Toast.error(context, 'Password must be at least 6 characters');
      return;
    }
    if (pw != confirm) {
      Toast.error(context, 'Passwords do not match');
      return;
    }
    setState(() => _saving = true);
    try {
      await AuthService.instance.auth.updateUser(UserAttributes(password: pw));
      _newPassword.clear();
      _confirmPassword.clear();
      _next();
    } catch (err) {
      if (mounted) Toast.error(context, err.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _complete() async {
    setState(() => _saving = true);
    try {
      await ApiClient.instance.onboardComplete();
      // Update local metadata so the gate doesn't re-trigger
      await AuthService.instance.auth.updateUser(
        UserAttributes(data: {'onboarding_completed': true}),
      );
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const HomeShell()),
          (_) => false,
        );
      }
    } catch (err) {
      if (mounted) Toast.error(context, err.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final displayName =
        AuthService.user?.userMetadata?['full_name'] ??
        AuthService.user?.userMetadata?['name'] ??
        '';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Step indicator
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
              child: Row(
                children: List.generate(4, (i) {
                  final active = i <= _step;
                  return Expanded(
                    child: Container(
                      height: 3,
                      margin: EdgeInsets.only(right: i < 3 ? 8 : 0),
                      color: active ? AppColors.accent : AppColors.border,
                    ),
                  );
                }),
              ),
            ),
            // Pages
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (i) => setState(() => _step = i),
                children: [
                  _buildWelcomeStep(displayName),
                  _buildPasswordStep(),
                  _buildProfileStep(),
                  _buildDoneStep(displayName),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Step 1: Welcome ──────────────────────────────────────────────

  Widget _buildWelcomeStep(String name) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Spacer(),
          Container(
            width: 56,
            height: 56,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: AppColors.accent.withValues(alpha: 0.08),
              border: Border.all(
                color: AppColors.accent.withValues(alpha: 0.15),
              ),
            ),
            child: const Icon(
              Icons.waving_hand_rounded,
              size: 28,
              color: AppColors.accent,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Welcome${name.isNotEmpty ? ', $name' : ''}',
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 26,
              fontWeight: FontWeight.w700,
              fontFamily: 'Inter',
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Let\'s get your account set up. This takes less than a minute.',
            style: TextStyle(
              color: AppColors.textMuted,
              fontSize: 15,
              fontFamily: 'Inter',
              height: 1.5,
            ),
          ),
          const Spacer(),
          AccentButton(
            height: 48,
            onPressed: _next,
            child: const Text('GET STARTED'),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildPasswordStep() {
    final mismatched =
        _newPassword.text.isNotEmpty &&
        _confirmPassword.text.isNotEmpty &&
        _newPassword.text != _confirmPassword.text;
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Spacer(flex: 2),
          const Text(
            'This is your first login. Set a new password to secure your account.',
            style: TextStyle(
              color: AppColors.textMuted,
              fontSize: 14,
              fontFamily: 'Inter',
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'New Password',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _newPassword,
            obscureText: _obscurePassword,
            onChanged: (_) => setState(() {}),
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 16,
              fontFamily: 'Inter',
            ),
            decoration: InputDecoration(
              hintText: 'Min. 6 characters',
              hintStyle: const TextStyle(
                color: AppColors.textFaint,
                fontFamily: 'Inter',
              ),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                  size: 18,
                  color: AppColors.textMuted,
                ),
                onPressed: () =>
                    setState(() => _obscurePassword = !_obscurePassword),
              ),
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
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Confirm Password',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _confirmPassword,
            obscureText: _obscurePassword,
            onChanged: (_) => setState(() {}),
            onSubmitted: (_) => _saving ? null : _savePassword(),
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 16,
              fontFamily: 'Inter',
            ),
            decoration: InputDecoration(
              hintText: 'Re-enter your password',
              hintStyle: const TextStyle(
                color: AppColors.textFaint,
                fontFamily: 'Inter',
              ),
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
            ),
          ),
          if (mismatched) ...[
            const SizedBox(height: 8),
            const Text(
              'Passwords do not match',
              style: TextStyle(
                color: AppColors.red,
                fontSize: 12,
                fontFamily: 'Inter',
              ),
            ),
          ],
          const Spacer(flex: 3),
          Row(
            children: [
              GhostButton(
                onPressed: _saving ? null : _prev,
                child: const Text('BACK'),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AccentButton(
                  height: 48,
                  onPressed: _saving ? null : _savePassword,
                  child: Text(_saving ? 'SAVING...' : 'CONTINUE'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  // ── Step 3: Profile ─────────────────────────────────────────────

  Widget _buildProfileStep() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Spacer(flex: 2),
          const Text(
            'Your Name',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _nameController,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 16,
              fontFamily: 'Inter',
            ),
            decoration: InputDecoration(
              hintText: 'Enter your full name',
              hintStyle: const TextStyle(
                color: AppColors.textFaint,
                fontFamily: 'Inter',
              ),
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
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'This is how your name appears to the team.',
            style: TextStyle(
              color: AppColors.textFaint,
              fontSize: 12,
              fontFamily: 'Inter',
            ),
          ),
          const Spacer(flex: 3),
          Row(
            children: [
              GhostButton(
                onPressed: _saving ? null : _prev,
                child: const Text('BACK'),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AccentButton(
                  height: 48,
                  onPressed: _saving ? null : _saveName,
                  child: Text(_saving ? 'SAVING...' : 'CONTINUE'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  // ── Step 4: Done ────────────────────────────────────────────────

  Widget _buildDoneStep(String name) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Spacer(),
          Container(
            width: 56,
            height: 56,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: AppColors.emerald.withValues(alpha: 0.08),
              border: Border.all(
                color: AppColors.emerald.withValues(alpha: 0.15),
              ),
            ),
            child: const Icon(
              Icons.check_circle_outline_rounded,
              size: 28,
              color: AppColors.emerald,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'You\'re all set!',
            style: TextStyle(
              color: AppColors.text,
              fontSize: 26,
              fontWeight: FontWeight.w700,
              fontFamily: 'Inter',
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Your account is ready. Welcome to the team!',
            style: TextStyle(
              color: AppColors.textMuted,
              fontSize: 15,
              fontFamily: 'Inter',
              height: 1.5,
            ),
          ),
          const Spacer(),
          AccentButton(
            height: 48,
            onPressed: _saving ? null : _complete,
            child: Text(_saving ? 'SETTING UP...' : 'ENTER APP'),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
