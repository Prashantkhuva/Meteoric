import 'package:flutter/material.dart';

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
      _users = await AuthService.listUsersWithRoles();
    } catch (err) {
      if (mounted) Toast.error(context, _clean(err));
    }
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _changeRole(String userId, String newRole) async {
    setState(() => _changingRoleFor = userId);
    final err = await AuthService.setUserRole(userId, newRole);
    if (!mounted) return;
    if (err != null) {
      Toast.error(context, err);
    } else {
      Toast.success(context, 'Role updated');
      await _loadUsers();
    }
  }

  String _clean(Object e) {
    final s = e.toString().replaceFirst('Exception: ', '');
    return s.length > 100 ? '${s.substring(0, 100)}…' : s;
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Team',
      body: _loading
          ? const LoadingView()
          : _users.isEmpty
              ? const EmptyState(message: 'No team members yet', icon: Icons.group_outlined)
              : RefreshIndicator(
                  onRefresh: _loadUsers,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _users.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 8),
                    itemBuilder: (context, i) => _UserTile(
                      user: _users[i],
                      canManage: _canManageUsers,
                      changing: _changingRoleFor == _users[i]['user_id'],
                      onRoleChanged: (role) =>
                          _changeRole(_users[i]['user_id'], role),
                    ),
                  ),
                ),
    );
  }
}

class _UserTile extends StatelessWidget {
  const _UserTile({
    required this.user,
    required this.canManage,
    required this.changing,
    required this.onRoleChanged,
  });

  final Map<String, dynamic> user;
  final bool canManage;
  final bool changing;
  final ValueChanged<String> onRoleChanged;

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
    final color = _roleColors[role] ?? AppColors.textMuted;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
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
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.08),
                            border: Border.all(color: color.withValues(alpha: 0.2)),
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
                              icon: Icon(Icons.expand_more, size: 12, color: color),
                              items: const [
                                DropdownMenuItem(value: 'superadmin', child: Text('SUPERADMIN')),
                                DropdownMenuItem(value: 'admin', child: Text('ADMIN')),
                                DropdownMenuItem(value: 'speaker', child: Text('SPEAKER')),
                              ],
                              onChanged: (v) => v != null ? onRoleChanged(v) : null,
                            ),
                          ),
                        )
                else
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
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
                Text(
                  onboarded ? 'Active' : 'Pending',
                  style: TextStyle(
                    color: onboarded ? AppColors.emerald : AppColors.amber,
                    fontSize: 10,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
