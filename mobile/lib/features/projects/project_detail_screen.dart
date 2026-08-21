import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import '../../shared/widgets/status_flow.dart';
import 'project_form_screen.dart';

class ProjectDetailScreen extends StatefulWidget {
  const ProjectDetailScreen({super.key, required this.project});

  final Map<String, dynamic> project;

  @override
  State<ProjectDetailScreen> createState() => _ProjectDetailScreenState();
}

class _ProjectDetailScreenState extends State<ProjectDetailScreen> {
  late Map<String, dynamic> _project;
  bool _busy = false;
  bool _changed = false;

  @override
  void initState() {
    super.initState();
    _project = widget.project;
  }

  Map<String, dynamic>? get _client {
    final client = _project['client'];
    return client is Map ? client.cast<String, dynamic>() : null;
  }

  Future<void> _changeStatus(String status) async {
    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.projectStatus(
        (_project['id'] as num).toInt(),
        status,
      );
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        setState(() {
          _project = {..._project, 'status': status};
          _changed = true;
        });
        _snack('Status updated');
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _delete() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete project'),
        content: const Text('Delete this project? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          AccentButton(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            backgroundColor: AppColors.red,
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('DELETE'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.projectDelete(
        (_project['id'] as num).toInt(),
      );
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        Navigator.of(context).pop(true);
      }
    } catch (err) {
      if (mounted) _snack(err.toString(), isError: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
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

  @override
  Widget build(BuildContext context) {
    final client = _client;
    final budget = (_project['budget'] as num?)?.toDouble();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        Navigator.of(context).pop(_changed);
      },
      child: AppScaffold(
        title: _project['name'] ?? 'Project',
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              children: [
                StatusBadge(
                  meta: Status.get(Status.projects, _project['status']),
                ),
                const Spacer(),
                Text(
                  Fmt.date(_project['created_at'] as String?),
                  style: const TextStyle(
                    color: AppColors.textFaint,
                    fontSize: 10,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (client != null)
              SectionCard(
                title: 'Client',
                child: Column(
                  children: [
                    DetailRow(label: 'Name', value: client['name'] ?? '—'),
                    DetailRow(label: 'Email', value: client['email'] ?? '—'),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            SectionCard(
              title: 'Details',
              child: Column(
                children: [
                  DetailRow(
                    label: 'Description',
                    value: _project['description'] ?? '—',
                  ),
                  DetailRow(
                    label: 'Budget',
                    value: budget != null && budget > 0
                        ? Fmt.money(budget)
                        : '—',
                  ),
                  DetailRow(
                    label: 'Services',
                    value: _project['services'] ?? '—',
                  ),
                  DetailRow(
                    label: 'Start date',
                    value: _project['start_date'] ?? '—',
                  ),
                  DetailRow(
                    label: 'Deadline',
                    value: _project['deadline'] ?? '—',
                  ),
                  DetailRow(label: 'Notes', value: _project['notes'] ?? '—'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            StatusFlowSection(
              metaMap: Status.projects,
              transitions: StatusFlow.projects,
              current: _project['status'] is String
                  ? _project['status'] as String
                  : null,
              busy: _busy,
              flowKey: 'projects',
              onSelect: _changeStatus,
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: GhostButton(
                    onPressed: _busy
                        ? null
                        : () async {
                            final changed = await Navigator.of(context)
                                .push<bool>(
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        ProjectFormScreen(project: _project),
                                  ),
                                );
                            if (changed == true && mounted) setState(() {});
                          },
                    child: const Text('EDIT'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: GhostButton(
                    borderColor: AppColors.red.withValues(alpha: 0.4),
                    textColor: AppColors.red,
                    onPressed: _busy ? null : _delete,
                    child: const Text('DELETE'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
