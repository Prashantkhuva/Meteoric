import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  bool _loading = true;
  bool _canManageUsers = false;
  List<Map<String, dynamic>> _users = [];
  String? _changingRoleFor;
  String? _resendingFor;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    final roleRow = await AuthService.myRole;
    if (!mounted) return;
    _canManageUsers = roleRow?['can_manage_users'] ?? false;
    await _loadUsers();
  }

  Future<void> _loadUsers() async {
    setState(() => _loading = true);
    try {
      final data = await ApiClient.instance.usersListWithRoles();
      final list = data['users'];
      if (list is List) _users = list.cast<Map<String, dynamic>>();
    } catch (err) {
      if (mounted) Toast.error(context, _clean(err));
    }
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _changeRole(String userId, String newRole) async {
    setState(() => _changingRoleFor = userId);
    try {
      final res = await ApiClient.instance.usersUpdateRole({
        'userId': userId,
        'role': newRole,
      });
      if (!mounted) return;
      if (res['error'] != null) {
        Toast.error(context, res['error']);
      } else {
        Toast.success(context, 'Role updated');
        await _loadUsers();
      }
    } catch (err) {
      if (mounted) Toast.error(context, _clean(err));
    }
    if (mounted) setState(() => _changingRoleFor = null);
  }

  Future<void> _resendInvite(String userId) async {
    setState(() => _resendingFor = userId);
    try {
      final res = await ApiClient.instance.usersResendInvite({
        'userId': userId,
      });
      if (!mounted) return;
      if (res['error'] != null) {
        Toast.error(context, res['error']);
      } else {
        Toast.success(context, 'Invitation resent');
      }
    } catch (err) {
      if (mounted) Toast.error(context, _clean(err));
    }
    if (mounted) setState(() => _resendingFor = null);
  }

  void _showInviteSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.cardRaised,
      shape: const RoundedRectangleBorder(),
      builder: (_) => _InviteSheet(onInvited: () {
        Navigator.pop(context);
        _loadUsers();
      }),
    );
  }

  String _clean(Object e) {
    final s = e.toString().replaceFirst('Exception: ', '');
    return s.length > 120 ? '${s.substring(0, 120)}…' : s;
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Team',
      actions: [
        if (_canManageUsers)
          IconButton(
            onPressed: _showInviteSheet,
            icon: const Icon(Icons.person_add_outlined, size: 20),
            tooltip: 'Invite user',
          ),
      ],
      body: _loading
          ? const LoadingView()
          : _users.isEmpty
              ? const EmptyState(
                  message: 'No team members yet', icon: Icons.group_outlined)
              : RefreshIndicator(
                  onRefresh: _loadUsers,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _users.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 8),
                    itemBuilder: (context, i) => _UserTile(
                      user: _users[i],
                      canManage: _canManageUsers,
                      changing: _changingRoleFor == _users[i]['id'],
                      resending: _resendingFor == _users[i]['id'],
                      onRoleChanged: (role) =>
                          _changeRole(_users[i]['id'], role),
                      onResend: () => _resendInvite(_users[i]['id']),
                    ),
                  ),
                ),
    );
  }
}

// ── User tile ───────────────────────────────────────────────────────────

class _UserTile extends StatelessWidget {
  const _UserTile({
    required this.user,
    required this.canManage,
    required this.changing,
    required this.resending,
    required this.onRoleChanged,
    required this.onResend,
  });

  final Map<String, dynamic> user;
  final bool canManage;
  final bool changing;
  final bool resending;
  final ValueChanged<String> onRoleChanged;
  final VoidCallback onResend;

  static const _roleColors = {
    'superadmin': AppColors.accent,
    'admin': AppColors.emerald,
    'speaker': AppColors.textMuted,
  };

  @override
  Widget build(BuildContext context) {
    final name = (user['full_name'] as String?) ?? '';
    final email = (user['email'] as String?) ?? '';
    final role = (user['role'] as String?) ?? '';
    final onboarded = user['onboarding_completed'] == true;
    final initial = name.isNotEmpty
        ? name[0].toUpperCase()
        : email.isNotEmpty
            ? email[0].toUpperCase()
            : '?';
    final color = _roleColors[role] ?? AppColors.textFaint;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            // Avatar
            Container(
              width: 36,
              height: 36,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                border: Border.all(color: color.withValues(alpha: 0.25)),
              ),
              child: Text(
                initial,
                style: TextStyle(
                  color: color,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Inter',
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Name + email
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name.isNotEmpty ? name : email,
                    style: const TextStyle(
                      color: AppColors.text,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      fontFamily: 'Inter',
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (name.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      email,
                      style: const TextStyle(
                        color: AppColors.textFaint,
                        fontSize: 11,
                        fontFamily: 'Inter',
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 8),

            // Role badge + status
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (canManage && role.isNotEmpty)
                  changing
                      ? const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 1.5),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.08),
                            border:
                                Border.all(color: color.withValues(alpha: 0.2)),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: role,
                              isDense: true,
                              isExpanded: false,
                              dropdownColor: AppColors.cardRaised,
                              style: TextStyle(
                                color: color,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                fontFamily: 'Inter',
                                letterSpacing: 0.8,
                              ),
                              icon:
                                  Icon(Icons.expand_more, size: 12, color: color),
                              items: const [
                                DropdownMenuItem(
                                    value: 'superadmin',
                                    child: Text('SUPERADMIN')),
                                DropdownMenuItem(
                                    value: 'admin', child: Text('ADMIN')),
                                DropdownMenuItem(
                                    value: 'speaker', child: Text('SPEAKER')),
                              ],
                              onChanged: (v) =>
                                  v != null ? onRoleChanged(v) : null,
                            ),
                          ),
                        )
                else
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.08),
                      border: Border.all(color: color.withValues(alpha: 0.2)),
                    ),
                    child: Text(
                      role.toUpperCase(),
                      style: TextStyle(
                        color: color,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Inter',
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                const SizedBox(height: 4),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      onboarded ? 'Active' : 'Pending',
                      style: TextStyle(
                        color:
                            onboarded ? AppColors.emerald : AppColors.amber,
                        fontSize: 10,
                        fontFamily: 'Inter',
                      ),
                    ),
                    if (!onboarded && canManage) ...[
                      const SizedBox(width: 6),
                      resending
                          ? const SizedBox(
                              width: 10,
                              height: 10,
                              child: CircularProgressIndicator(
                                  strokeWidth: 1),
                            )
                          : GestureDetector(
                              onTap: onResend,
                              child: const Text(
                                'Resend',
                                style: TextStyle(
                                  color: AppColors.accent,
                                  fontSize: 10,
                                  fontFamily: 'Inter',
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                    ],
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ── Invite bottom sheet ─────────────────────────────────────────────────

class _InviteSheet extends StatefulWidget {
  const _InviteSheet({required this.onInvited});
  final VoidCallback onInvited;

  @override
  State<_InviteSheet> createState() => _InviteSheetState();
}

class _InviteSheetState extends State<_InviteSheet> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  String _role = 'admin';
  bool _busy = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    super.dispose();
  }

  Future<void> _invite() async {
    final name = _name.text.trim();
    final email = _email.text.trim();
    if (name.isEmpty || email.isEmpty || !email.contains('@')) {
      Toast.error(context, 'Enter a valid name and email');
      return;
    }

    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.usersInvite({
        'name': name,
        'email': email,
        'role': _role,
      });
      if (!mounted) return;
      if (res['error'] != null) {
        Toast.error(context, res['error']);
      } else {
        Toast.success(context, 'Invitation sent');
        widget.onInvited();
      }
    } catch (err) {
      if (mounted) {
        final s = err.toString().replaceFirst('Exception: ', '');
        Toast.error(context, s.length > 120 ? '${s.substring(0, 120)}…' : s);
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
          20, 20, 20, MediaQuery.of(context).viewInsets.bottom + 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Invite team member',
            style: TextStyle(
              color: AppColors.text,
              fontSize: 16,
              fontWeight: FontWeight.w600,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 16),
          _label('NAME'),
          TextField(
            controller: _name,
            enabled: !_busy,
            style: const TextStyle(
                color: AppColors.text, fontSize: 14, fontFamily: 'Inter'),
            decoration: _input(),
          ),
          const SizedBox(height: 12),
          _label('EMAIL'),
          TextField(
            controller: _email,
            enabled: !_busy,
            keyboardType: TextInputType.emailAddress,
            style: const TextStyle(
                color: AppColors.text, fontSize: 14, fontFamily: 'Inter'),
            decoration: _input(),
          ),
          const SizedBox(height: 12),
          _label('ROLE'),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.border),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _role,
                isExpanded: true,
                dropdownColor: AppColors.cardRaised,
                style: const TextStyle(
                  color: AppColors.text,
                  fontSize: 14,
                  fontFamily: 'Inter',
                ),
                items: const [
                  DropdownMenuItem(value: 'admin', child: Text('Admin')),
                  DropdownMenuItem(value: 'speaker', child: Text('Speaker')),
                  DropdownMenuItem(
                      value: 'superadmin', child: Text('Superadmin')),
                ],
                onChanged: (v) => v != null ? setState(() => _role = v) : null,
              ),
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: AccentButton(
              height: 44,
              onPressed: _busy ? null : _invite,
              child: _busy
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('SEND INVITATION'),
            ),
          ),
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

  InputDecoration _input() => InputDecoration(
        isDense: true,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        border: OutlineInputBorder(
            borderSide: BorderSide(color: AppColors.border)),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide:
              BorderSide(color: AppColors.accent.withValues(alpha: 0.3)),
        ),
      );
}
