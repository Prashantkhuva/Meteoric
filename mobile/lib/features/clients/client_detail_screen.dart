import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/constants.dart';
import '../../core/formatters.dart';
import '../../core/theme.dart';
import '../../shared/widgets/common.dart';
import 'client_form_screen.dart';

class ClientDetailScreen extends StatefulWidget {
  const ClientDetailScreen({super.key, required this.client});

  final Map<String, dynamic> client;

  @override
  State<ClientDetailScreen> createState() => _ClientDetailScreenState();
}

class _ClientDetailScreenState extends State<ClientDetailScreen> {
  late Map<String, dynamic> _client;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _client = widget.client;
  }

  Future<void> _changeStatus(String status) async {
    setState(() => _busy = true);
    try {
      final res = await ApiClient.instance.clientStatus(
        (_client['id'] as num).toInt(),
        status,
      );
      if (!mounted) return;
      if (res.containsKey('error')) {
        _snack(res['error'] as String, isError: true);
      } else {
        setState(() => _client = {..._client, 'status': status});
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
        title: const Text('Delete client'),
        content: Text(
          'Delete "${_client['name']}"? This cannot be undone.',
          style: const TextStyle(
            fontSize: 13,
            color: AppColors.textMuted,
            fontFamily: 'Inter',
          ),
        ),
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
      final res = await ApiClient.instance.clientDelete(
        (_client['id'] as num).toInt(),
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
    return AppScaffold(
      title: _client['name'] ?? 'Client',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              StatusBadge(meta: Status.get(Status.clients, _client['status'])),
              const Spacer(),
              Text(
                'Added ${Fmt.date(_client['created_at'] as String?)}',
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 10,
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SectionCard(
            title: 'Details',
            child: Column(
              children: [
                DetailRow(label: 'Email', value: _client['email'] ?? '—'),
                DetailRow(label: 'Phone', value: _client['phone'] ?? '—'),
                DetailRow(label: 'Company', value: _client['company'] ?? '—'),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SectionCard(
            title: 'Update status',
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final entry in Status.clients.entries)
                  GestureDetector(
                    onTap: _busy ? null : () => _changeStatus(entry.key),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: _client['status'] == entry.key
                            ? entry.value.color.withValues(alpha: 0.15)
                            : Colors.transparent,
                        border: Border.all(
                          color: _client['status'] == entry.key
                              ? entry.value.color
                              : AppColors.border,
                        ),
                      ),
                      child: Text(
                        entry.value.label,
                        style: TextStyle(
                          color: _client['status'] == entry.key
                              ? entry.value.color
                              : AppColors.textMuted,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Inter',
                        ),
                      ),
                    ),
                  ),
              ],
            ),
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
                                      ClientFormScreen(client: _client),
                                ),
                              );
                          if (changed == true && mounted) {
                            setState(() {});
                          }
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
    );
  }
}
