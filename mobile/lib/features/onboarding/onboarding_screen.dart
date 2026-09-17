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
    text: AuthService.user?.userMetadata?['full_name'] ??
        AuthService.user?.userMetadata?['name'] ??
        '',
  );
  int _step = 0;
  bool _saving = false;

  @override
  void dispose() {
    _pageController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _next() {
    if (_step < 2) {
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
                children: List.generate(3, (i) {
                  final active = i <= _step;
                  return Expanded(
                    child: Container(
                      height: 3,
                      margin: EdgeInsets.only(right: i < 2 ? 8 : 0),
                      color: active
                          ? AppColors.accent
                          : AppColors.border,
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
              border: Border.all(color: AppColors.accent.withValues(alpha: 0.15)),
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

  // ── Step 2: Profile ─────────────────────────────────────────────

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

  // ── Step 3: Done ────────────────────────────────────────────────

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
              border: Border.all(color: AppColors.emerald.withValues(alpha: 0.15)),
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
