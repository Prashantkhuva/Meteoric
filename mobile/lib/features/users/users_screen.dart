import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/supabase.dart';
import '../../core/theme.dart';
import '../../core/toast.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/filter_bar.dart';

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  bool _loading = true;
  bool _canManageUsers = false;
  bool _isSuperadmin = false;
  String? _currentUserId;
  List<Map<String, dynamic>> _users = [];
  String? _changingRoleFor;
  String? _resendingFor;
  String? _deletingFor;

  final _search = TextEditingController();
  String _roleFilter = 'all';

  static const _roleOptions = [
    MapEntry('superadmin', 'Superadmin'),
    MapEntry('admin', 'Admin'),
    MapEntry('speaker', 'Speaker'),
  ];

  @override
  void initState() {
    super.initState();
    _init();
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  Future<void> _init() async {
    final u = AuthService.user;
    _currentUserId = u?.id;
    final roleRow = await AuthService.myRole;
    if (!mounted) return;
    final role = roleRow?['role'] as String? ?? '';
    _canManageUsers = roleRow?['can_manage_users'] ?? false;
    _isSuperadmin =
        role == 'superadmin' || u?.email == 'work.prashantkhuva@gmail.com';
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

  List<Map<String, dynamic>> get _filteredUsers {
    var result = _users;
    final q = _search.text.toLowerCase().trim();
    if (q.isNotEmpty) {
      result = result.where((u) {
        final name = (u['full_name'] as String? ?? '').toLowerCase();
        final email = (u['email'] as String? ?? '').toLowerCase();
        return name.contains(q) || email.contains(q);
      }).toList();
    }
    if (_roleFilter != 'all') {
      result = result.where((u) => u['role'] == _roleFilter).toList();
    }
    return result;
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

  Future<void> _deleteUser(Map<String, dynamic> user) async {
    final email = user['email'] as String? ?? '';
    final userId = user['id'] as String?;
    if (userId == null) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.cardRaised,
        shape: const RoundedRectangleBorder(),
        title: const Text(
          'Delete User',
          style: TextStyle(
            color: AppColors.text,
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
        ),
        content: Text(
          'Are you sure you want to permanently delete $email? This action cannot be undone.',
          style: const TextStyle(
            color: AppColors.textMuted,
            fontSize: 13,
            height: 1.5,
            fontFamily: 'Inter',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text(
              'Cancel',
              style: TextStyle(
                color: AppColors.textMuted,
                fontFamily: 'Inter',
              ),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text(
              'Delete',
              style: TextStyle(
                color: AppColors.red,
                fontWeight: FontWeight.w600,
                fontFamily: 'Inter',
              ),
            ),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    setState(() => _deletingFor = userId);
    try {
      final res = await ApiClient.instance.usersDelete({
        'userId': userId,
      });
      if (!mounted) return;
      if (res['error'] != null) {
        Toast.error(context, res['error']);
      } else {
        Toast.success(context, '$email has been removed');
        await _loadUsers();
      }
    } catch (err) {
      if (mounted) Toast.error(context, _clean(err));
    }
    if (mounted) setState(() => _deletingFor = null);
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

  void _openDetail(Map<String, dynamic> user) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => _UserDetailScreen(
          user: user,
          isSuperadmin: _isSuperadmin,
          canManage: _canManageUsers,
          currentUserId: _currentUserId,
          onRoleChanged: (role) => _changeRole(user['id'], role),
          onResend: () => _resendInvite(user['id']),
          onDelete: () async {
            await _deleteUser(user);
            if (mounted) Navigator.pop(context);
          },
        ),
      ),
    );
  }

  String _clean(Object e) {
    final s = e.toString().replaceFirst('Exception: ', '');
    return s.length > 120 ? '${s.substring(0, 120)}…' : s;
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredUsers;
    final superadminCount =
        _users.where((u) => u['role'] == 'superadmin').length;
    final adminCount = _users.where((u) => u['role'] == 'admin').length;
    final speakerCount = _users.where((u) => u['role'] == 'speaker').length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Team'),
        automaticallyImplyLeading: true,
        actions: [
          if (_canManageUsers)
            IconButton(
              onPressed: _showInviteSheet,
              icon: const Icon(Icons.person_add_outlined, size: 20),
              tooltip: 'Invite user',
            ),
        ],
      ),
      body: _loading
          ? const LoadingView()
          : _users.isEmpty
              ? _buildEmptyState()
              : Column(
                  children: [
                    // Summary bar
                    Container(
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                      child: Row(
                        children: [
                          Text(
                            '${_users.length} member${_users.length != 1 ? 's' : ''}',
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 12,
                              fontFamily: 'Inter',
                            ),
                          ),
                          const SizedBox(width: 8),
                          if (superadminCount > 0)
                            _SummaryDot(
                                label: '$superadminCount superadmin',
                                color: AppColors.accent),
                          if (adminCount > 0) ...[
                            const SizedBox(width: 6),
                            _SummaryDot(
                                label: '$adminCount admin',
                                color: AppColors.emerald),
                          ],
                          if (speakerCount > 0) ...[
                            const SizedBox(width: 6),
                            _SummaryDot(
                                label: '$speakerCount speaker',
                                color: AppColors.textMuted),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    // Search
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: TextField(
                        controller: _search,
                        onChanged: (_) => setState(() {}),
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 14,
                          fontFamily: 'Inter',
                        ),
                        decoration: InputDecoration(
                          hintText: 'Search name, email...',
                          hintStyle: const TextStyle(
                            color: AppColors.textFaint,
                            fontSize: 14,
                            fontFamily: 'Inter',
                          ),
                          prefixIcon: const Icon(
                            Icons.search,
                            size: 18,
                            color: AppColors.textFaint,
                          ),
                          suffixIcon: _search.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(
                                    Icons.close,
                                    size: 16,
                                    color: AppColors.textMuted,
                                  ),
                                  onPressed: () {
                                    _search.clear();
                                    setState(() {});
                                  },
                                )
                              : null,
                          isDense: true,
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 10),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.zero,
                            borderSide:
                                BorderSide(color: AppColors.border),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.zero,
                            borderSide:
                                BorderSide(color: AppColors.border),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.zero,
                            borderSide: BorderSide(
                                color: AppColors.accent.withValues(alpha: 0.3)),
                          ),
                          filled: true,
                          fillColor: AppColors.card,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Role filter pills
                    FilterBar(
                      groups: [
                        FilterGroup(
                          key: 'role',
                          label: 'Role',
                          options: _roleOptions,
                        ),
                      ],
                      values: {'role': _roleFilter},
                      onChanged: (v) =>
                          setState(() => _roleFilter = v['role'] ?? 'all'),
                    ),
                    // User list
                    Expanded(
                      child: filtered.isEmpty
                          ? _buildNoResults()
                          : RefreshIndicator(
                              onRefresh: _loadUsers,
                              child: ListView.separated(
                                padding: const EdgeInsets.all(16),
                                itemCount: filtered.length,
                                separatorBuilder: (_, _) =>
                                    const SizedBox(height: 8),
                                itemBuilder: (context, i) => _UserTile(
                                  user: filtered[i],
                                  canManage: _canManageUsers,
                                  isSuperadmin: _isSuperadmin,
                                  currentUserId: _currentUserId,
                                  changing:
                                      _changingRoleFor == filtered[i]['id'],
                                  resending:
                                      _resendingFor == filtered[i]['id'],
                                  deleting:
                                      _deletingFor == filtered[i]['id'],
                                  onRoleChanged: (role) =>
                                      _changeRole(filtered[i]['id'], role),
                                  onResend: () =>
                                      _resendInvite(filtered[i]['id']),
                                  onDelete: () =>
                                      _deleteUser(filtered[i]),
                                  onTap: () => _openDetail(filtered[i]),
                                ),
                              ),
                            ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.card,
                border: Border.all(color: AppColors.border),
              ),
              child: const Icon(
                Icons.group_outlined,
                size: 24,
                color: AppColors.textFaint,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'No team members yet',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 14,
                fontWeight: FontWeight.w500,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Invite your first team member to get started',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 12,
                fontFamily: 'Inter',
              ),
            ),
            if (_canManageUsers) ...[
              const SizedBox(height: 16),
              GestureDetector(
                onTap: _showInviteSheet,
                child: const Text(
                  'INVITE TEAM MEMBER',
                  style: TextStyle(
                    color: AppColors.accent,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.8,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildNoResults() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.search_off_outlined,
              size: 24,
              color: AppColors.textFaint,
            ),
            const SizedBox(height: 12),
            const Text(
              'No results found',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 14,
                fontWeight: FontWeight.w500,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Try adjusting your search or filters',
              style: TextStyle(
                color: AppColors.textFaint,
                fontSize: 12,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: () {
                _search.clear();
                setState(() => _roleFilter = 'all');
              },
              child: const Text(
                'CLEAR FILTERS',
                style: TextStyle(
                  color: AppColors.accent,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.8,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Summary dot ────────────────────────────────────────────────────────

class _SummaryDot extends StatelessWidget {
  const _SummaryDot({required this.label, required this.color});
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 4,
          height: 4,
          decoration: BoxDecoration(color: color),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textFaint,
            fontSize: 11,
            fontFamily: 'Inter',
          ),
        ),
      ],
    );
  }
}

// ── User tile ───────────────────────────────────────────────────────────

class _UserTile extends StatelessWidget {
  const _UserTile({
    required this.user,
    required this.canManage,
    required this.isSuperadmin,
    required this.currentUserId,
    required this.changing,
    required this.resending,
    required this.deleting,
    required this.onRoleChanged,
    required this.onResend,
    required this.onDelete,
    required this.onTap,
  });

  final Map<String, dynamic> user;
  final bool canManage;
  final bool isSuperadmin;
  final String? currentUserId;
  final bool changing;
  final bool resending;
  final bool deleting;
  final ValueChanged<String> onRoleChanged;
  final VoidCallback onResend;
  final VoidCallback onDelete;
  final VoidCallback onTap;

  static const _roleColors = {
    'superadmin': AppColors.accent,
    'admin': AppColors.emerald,
    'speaker': AppColors.textMuted,
  };

  static const _roleLabels = {
    'superadmin': 'SUPERADMIN',
    'admin': 'ADMIN',
    'speaker': 'SPEAKER',
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
    final canDelete = isSuperadmin && user['id'] != currentUserId;
    final canEditRole = canManage && role.isNotEmpty;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.card,
          border: Border.all(color: AppColors.border),
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            children: [
              Row(
                children: [
                  // Avatar
                  Container(
                    width: 40,
                    height: 40,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.1),
                      border: Border.all(color: color.withValues(alpha: 0.25)),
                    ),
                    child: Text(
                      initial,
                      style: TextStyle(
                        color: color,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Name + email + status
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
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: onboarded
                                    ? AppColors.emerald.withValues(alpha: 0.1)
                                    : AppColors.amber.withValues(alpha: 0.1),
                                border: Border.all(
                                  color: onboarded
                                      ? AppColors.emerald
                                          .withValues(alpha: 0.25)
                                      : AppColors.amber
                                          .withValues(alpha: 0.25),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 4,
                                    height: 4,
                                    decoration: BoxDecoration(
                                      color: onboarded
                                          ? AppColors.emerald
                                          : AppColors.amber,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    onboarded ? 'ACTIVE' : 'PENDING',
                                    style: TextStyle(
                                      color: onboarded
                                          ? AppColors.emerald
                                          : AppColors.amber,
                                      fontSize: 8,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 0.8,
                                      fontFamily: 'Inter',
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Role badge / dropdown
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (canEditRole)
                        changing
                            ? const SizedBox(
                                width: 14,
                                height: 14,
                                child: CircularProgressIndicator(
                                    strokeWidth: 1.5),
                              )
                            : GestureDetector(
                                onTap: () => _showRolePicker(context),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: color.withValues(alpha: 0.08),
                                    border: Border.all(
                                        color: color.withValues(alpha: 0.2)),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        width: 5,
                                        height: 5,
                                        decoration:
                                            BoxDecoration(color: color),
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        _roleLabels[role] ?? role.toUpperCase(),
                                        style: TextStyle(
                                          color: color,
                                          fontSize: 9,
                                          fontWeight: FontWeight.w700,
                                          letterSpacing: 0.8,
                                          fontFamily: 'Inter',
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      Icon(
                                        Icons.keyboard_arrow_down_rounded,
                                        size: 12,
                                        color: color,
                                      ),
                                    ],
                                  ),
                                ),
                              )
                      else
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.08),
                            border: Border.all(
                                color: color.withValues(alpha: 0.2)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 5,
                                height: 5,
                                decoration: BoxDecoration(color: color),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                _roleLabels[role] ?? role.toUpperCase(),
                                style: TextStyle(
                                  color: color,
                                  fontSize: 9,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 0.8,
                                  fontFamily: 'Inter',
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ],
              ),

              // Action row (resend + delete)
              if ((!onboarded && canManage) || canDelete) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.only(top: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                        top: BorderSide(color: AppColors.borderSoft)),
                  ),
                  child: Row(
                    children: [
                      if (!onboarded && canManage) ...[
                        resending
                            ? const SizedBox(
                                width: 12,
                                height: 12,
                                child: CircularProgressIndicator(
                                    strokeWidth: 1),
                              )
                            : GestureDetector(
                                onTap: onResend,
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.refresh,
                                      size: 13,
                                      color: AppColors.accent,
                                    ),
                                    SizedBox(width: 4),
                                    Text(
                                      'Resend invite',
                                      style: TextStyle(
                                        color: AppColors.accent,
                                        fontSize: 11,
                                        fontFamily: 'Inter',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                      ],
                      const Spacer(),
                      if (canDelete)
                        deleting
                            ? const SizedBox(
                                width: 12,
                                height: 12,
                                child: CircularProgressIndicator(
                                    strokeWidth: 1,
                                    color: AppColors.red),
                              )
                            : GestureDetector(
                                onTap: onDelete,
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.delete_outline,
                                      size: 13,
                                      color: AppColors.red,
                                    ),
                                    SizedBox(width: 4),
                                    Text(
                                      'Delete',
                                      style: TextStyle(
                                        color: AppColors.red,
                                        fontSize: 11,
                                        fontFamily: 'Inter',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _showRolePicker(BuildContext context) {
    final role = (user['role'] as String?) ?? '';
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.card,
      shape: const RoundedRectangleBorder(),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(16, 14, 8, 12),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  const Expanded(
                    child: Text(
                      'CHANGE ROLE',
                      style: TextStyle(
                        color: AppColors.textFaint,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.2,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    icon: const Icon(Icons.close,
                        size: 18, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
            ),
            for (final entry in _UserTile._roleLabels.entries) ...[
              InkWell(
                onTap: () {
                  Navigator.pop(ctx);
                  if (entry.key != role) onRoleChanged(entry.key);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                  decoration: const BoxDecoration(
                    border: Border(
                        bottom: BorderSide(color: AppColors.borderSoft)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _UserTile._roleColors[entry.key] ??
                              AppColors.textFaint,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          entry.value,
                          style: TextStyle(
                            color: entry.key == role
                                ? AppColors.accent
                                : AppColors.text,
                            fontSize: 14,
                            fontWeight: entry.key == role
                                ? FontWeight.w600
                                : FontWeight.w400,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                      if (entry.key == role)
                        const Icon(Icons.check_rounded,
                            size: 18, color: AppColors.accent),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ── User detail screen ─────────────────────────────────────────────────

class _UserDetailScreen extends StatelessWidget {
  const _UserDetailScreen({
    required this.user,
    required this.isSuperadmin,
    required this.canManage,
    required this.currentUserId,
    required this.onRoleChanged,
    required this.onResend,
    required this.onDelete,
  });

  final Map<String, dynamic> user;
  final bool isSuperadmin;
  final bool canManage;
  final String? currentUserId;
  final ValueChanged<String> onRoleChanged;
  final VoidCallback onResend;
  final VoidCallback onDelete;

  static const _roleColors = {
    'superadmin': AppColors.accent,
    'admin': AppColors.emerald,
    'speaker': AppColors.textMuted,
  };

  static const _roleLabels = {
    'superadmin': 'Superadmin',
    'admin': 'Admin',
    'speaker': 'Speaker',
  };

  static const _rolePermissions = {
    'superadmin': [
      'Manage team members',
      'Full data access',
      'Send emails',
      'System settings',
    ],
    'admin': [
      'View & edit all data',
      'Send proposals & invoices',
      'Manage projects',
    ],
    'speaker': ['View all data', 'Read-only access'],
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
    final canDelete = isSuperadmin && user['id'] != currentUserId;
    final createdAt = user['created_at'] as String?;
    String formattedDate = '';
    if (createdAt != null) {
      try {
        final dt = DateTime.parse(createdAt);
        final months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        final days = [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday'
        ];
        formattedDate =
            '${days[dt.weekday - 1]}, ${months[dt.month - 1]} ${dt.day}, ${dt.year}';
      } catch (_) {
        formattedDate = createdAt;
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('User Details'),
        actions: [
          if (!onboarded && canManage)
            IconButton(
              onPressed: onResend,
              icon: const Icon(Icons.refresh, size: 20),
              tooltip: 'Resend invitation',
            ),
          if (canDelete)
            IconButton(
              onPressed: onDelete,
              icon: const Icon(Icons.delete_outline,
                  size: 20, color: AppColors.red),
              tooltip: 'Delete user',
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    border: Border.all(color: color.withValues(alpha: 0.25)),
                  ),
                  child: Text(
                    initial,
                    style: TextStyle(
                      color: color,
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
                        name.isNotEmpty ? name : 'Unnamed',
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        email,
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 13,
                          fontFamily: 'Inter',
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Role card
            _InfoCard(
              label: 'ROLE',
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.08),
                      border: Border.all(color: color.withValues(alpha: 0.2)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 5,
                          height: 5,
                          decoration: BoxDecoration(color: color),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _roleLabels[role] ?? role,
                          style: TextStyle(
                            color: color,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.6,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  if (isSuperadmin)
                    GestureDetector(
                      onTap: () => _showRolePicker(context),
                      child: const Text(
                        'Change',
                        style: TextStyle(
                          color: AppColors.accent,
                          fontSize: 12,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Status card
            _InfoCard(
              label: 'STATUS',
              child: Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: onboarded ? AppColors.emerald : AppColors.amber,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    onboarded ? 'Active' : 'Pending',
                    style: TextStyle(
                      color:
                          onboarded ? AppColors.emerald : AppColors.amber,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    onboarded
                        ? '— Account fully set up'
                        : '— Awaiting first login',
                    style: const TextStyle(
                      color: AppColors.textFaint,
                      fontSize: 12,
                      fontFamily: 'Inter',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Joined card
            if (formattedDate.isNotEmpty)
              _InfoCard(
                label: 'JOINED',
                child: Row(
                  children: [
                    const Icon(
                      Icons.calendar_today_outlined,
                      size: 14,
                      color: AppColors.textFaint,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      formattedDate,
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 13,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ],
                ),
              ),
            if (formattedDate.isNotEmpty) const SizedBox(height: 10),

            // Permissions card
            _InfoCard(
              label: 'PERMISSIONS',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (final perm
                      in _rolePermissions[role] ?? []) ...[
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        children: [
                          Container(
                            width: 3,
                            height: 3,
                            decoration: const BoxDecoration(
                                color: AppColors.textFaint),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            perm,
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 13,
                              fontFamily: 'Inter',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Action buttons
            if (!onboarded && canManage) ...[
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: onResend,
                  icon: const Icon(Icons.refresh, size: 16),
                  label: const Text('RESEND INVITATION'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.text,
                    side: const BorderSide(color: AppColors.border),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: const RoundedRectangleBorder(),
                    textStyle: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.8,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
            if (canDelete)
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: onDelete,
                  icon: const Icon(Icons.delete_outline, size: 16),
                  label: const Text('DELETE USER'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.red,
                    side: BorderSide(
                        color: AppColors.red.withValues(alpha: 0.3)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: const RoundedRectangleBorder(),
                    textStyle: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.8,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _showRolePicker(BuildContext context) {
    final role = (user['role'] as String?) ?? '';
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.card,
      shape: const RoundedRectangleBorder(),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(16, 14, 8, 12),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  const Expanded(
                    child: Text(
                      'CHANGE ROLE',
                      style: TextStyle(
                        color: AppColors.textFaint,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.2,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    icon: const Icon(Icons.close,
                        size: 18, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
            ),
            for (final entry in _roleLabels.entries) ...[
              InkWell(
                onTap: () {
                  Navigator.pop(ctx);
                  if (entry.key != role) onRoleChanged(entry.key);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                  decoration: const BoxDecoration(
                    border: Border(
                        bottom: BorderSide(color: AppColors.borderSoft)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _roleColors[entry.key] ??
                              AppColors.textFaint,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          entry.value,
                          style: TextStyle(
                            color: entry.key == role
                                ? AppColors.accent
                                : AppColors.text,
                            fontSize: 14,
                            fontWeight: entry.key == role
                                ? FontWeight.w600
                                : FontWeight.w400,
                            fontFamily: 'Inter',
                          ),
                        ),
                      ),
                      if (entry.key == role)
                        const Icon(Icons.check_rounded,
                            size: 18, color: AppColors.accent),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ── Info card ──────────────────────────────────────────────────────────

class _InfoCard extends StatelessWidget {
  const _InfoCard({required this.label, required this.child});
  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textFaint,
              fontSize: 9,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
          child,
        ],
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

  static const _roleDescriptions = {
    'superadmin': 'Full access. Manage users, all data, send emails, settings.',
    'admin': 'CRUD all data. Send proposals/invoices. Cannot manage users.',
    'speaker': 'View-only. Can see all data but cannot edit or send emails.',
  };

  static const _roleColors = {
    'superadmin': AppColors.accent,
    'admin': AppColors.emerald,
    'speaker': AppColors.textMuted,
  };

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
    final color = _roleColors[_role] ?? AppColors.textFaint;

    return Padding(
      padding: EdgeInsets.fromLTRB(
          20, 20, 20, MediaQuery.of(context).viewInsets.bottom + 20),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppColors.accent.withValues(alpha: 0.08),
                    border: Border.all(
                        color: AppColors.accent.withValues(alpha: 0.2)),
                  ),
                  child: const Icon(
                    Icons.person_add_outlined,
                    size: 18,
                    color: AppColors.accent,
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Invite team member',
                        style: TextStyle(
                          color: AppColors.text,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'They\'ll receive an email with setup instructions',
                        style: TextStyle(
                          color: AppColors.textFaint,
                          fontSize: 11,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Name
            _label('FULL NAME'),
            TextField(
              controller: _name,
              enabled: !_busy,
              style: const TextStyle(
                  color: AppColors.text, fontSize: 14, fontFamily: 'Inter'),
              decoration: _input(),
            ),
            const SizedBox(height: 14),

            // Email
            _label('EMAIL ADDRESS'),
            TextField(
              controller: _email,
              enabled: !_busy,
              keyboardType: TextInputType.emailAddress,
              style: const TextStyle(
                  color: AppColors.text, fontSize: 14, fontFamily: 'Inter'),
              decoration: _input(),
            ),
            const SizedBox(height: 14),

            // Role
            _label('ROLE'),
            GestureDetector(
              onTap: _busy ? null : _showRolePicker,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(color: color),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      _role[0].toUpperCase() + _role.substring(1),
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 14,
                        fontFamily: 'Inter',
                      ),
                    ),
                    const Spacer(),
                    const Icon(
                      Icons.keyboard_arrow_down_rounded,
                      size: 18,
                      color: AppColors.textMuted,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              _roleDescriptions[_role] ?? '',
              style: const TextStyle(
                color: AppColors.textFaint,
                fontSize: 11,
                fontFamily: 'Inter',
              ),
            ),
            const SizedBox(height: 20),

            // Submit
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
            const SizedBox(height: 10),
            const Center(
              child: Text(
                'An auto-generated password will be emailed.',
                style: TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 11,
                  fontFamily: 'Inter',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showRolePicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.card,
      shape: const RoundedRectangleBorder(),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(16, 14, 8, 12),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  const Expanded(
                    child: Text(
                      'SELECT ROLE',
                      style: TextStyle(
                        color: AppColors.textFaint,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.2,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ),
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    icon: const Icon(Icons.close,
                        size: 18, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
            ),
            for (final entry in _roleColors.entries) ...[
              InkWell(
                onTap: () {
                  Navigator.pop(ctx);
                  setState(() => _role = entry.key);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                  decoration: const BoxDecoration(
                    border: Border(
                        bottom: BorderSide(color: AppColors.borderSoft)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(color: entry.value),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              entry.key[0].toUpperCase() +
                                  entry.key.substring(1),
                              style: TextStyle(
                                color: entry.key == _role
                                    ? AppColors.accent
                                    : AppColors.text,
                                fontSize: 14,
                                fontWeight: entry.key == _role
                                    ? FontWeight.w600
                                    : FontWeight.w400,
                                fontFamily: 'Inter',
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _roleDescriptions[entry.key] ?? '',
                              style: const TextStyle(
                                color: AppColors.textFaint,
                                fontSize: 11,
                                fontFamily: 'Inter',
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (entry.key == _role)
                        const Icon(Icons.check_rounded,
                            size: 18, color: AppColors.accent),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
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
            borderRadius: BorderRadius.zero,
            borderSide: BorderSide(color: AppColors.border)),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide:
              BorderSide(color: AppColors.accent.withValues(alpha: 0.3)),
        ),
      );
}
