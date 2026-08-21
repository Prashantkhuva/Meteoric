import 'package:flutter/material.dart';

import '../../core/theme.dart';

/// A single filter group (e.g. Status, Score, Source).
class FilterGroup {
  const FilterGroup({
    required this.key,
    required this.label,
    required this.options,
    this.allValue = 'all',
  });

  final String key;
  final String label;

  /// value -> label, excluding the "all" entry which is prepended automatically.
  final List<MapEntry<String, String>> options;
  final String allValue;

  List<MapEntry<String, String>> get allOptions => [
    MapEntry(allValue, 'All ${label.toLowerCase()}'),
    ...options,
  ];
}

/// Premium compact filter bar: one scrollable row of pills, one per group.
/// Tapping a pill opens a themed bottom sheet to pick a value.
///
/// [values] maps group key -> selected option value; missing keys default
/// to the group's "all" value.
class FilterBar extends StatelessWidget {
  const FilterBar({
    super.key,
    required this.groups,
    required this.values,
    required this.onChanged,
  });

  final List<FilterGroup> groups;
  final Map<String, String> values;
  final ValueChanged<Map<String, String>> onChanged;

  bool get _hasActiveFilters =>
      groups.any((g) => (values[g.key] ?? g.allValue) != g.allValue);

  void _select(BuildContext context, String activeKey) async {
    final group = groups.firstWhere((g) => g.key == activeKey);
    final current = values[group.key] ?? group.allValue;
    final selected = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: AppColors.card,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
      builder: (ctx) => _FilterSheet(group: group, current: current),
    );
    if (selected == null || selected == current) return;
    onChanged({...values, group.key: selected});
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 44,
      decoration: const BoxDecoration(
        color: AppColors.card,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        children: [
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  for (final group in groups) ...[
                    _pill(context, group),
                    const SizedBox(width: 8),
                  ],
                ],
              ),
            ),
          ),
          if (_hasActiveFilters)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: IconButton(
                visualDensity: VisualDensity.compact,
                icon: const Icon(
                  Icons.filter_alt_off_outlined,
                  size: 16,
                  color: AppColors.textMuted,
                ),
                tooltip: 'Clear filters',
                onPressed: () {
                  onChanged({for (final g in groups) g.key: g.allValue});
                },
              ),
            ),
        ],
      ),
    );
  }

  Widget _pill(BuildContext context, FilterGroup group) {
    final value = values[group.key] ?? group.allValue;
    final isActive = value != group.allValue;
    final valueLabel = group.allOptions
        .firstWhere((o) => o.key == value, orElse: () => group.allOptions.first)
        .value;

    return Material(
      color: isActive
          ? AppColors.accent.withValues(alpha: 0.08)
          : AppColors.cardRaised,
      child: InkWell(
        onTap: () => _select(context, group.key),
        child: Container(
          height: 30,
          padding: const EdgeInsets.symmetric(horizontal: 10),
          decoration: BoxDecoration(
            border: Border.all(
              color: isActive
                  ? AppColors.accent.withValues(alpha: 0.5)
                  : AppColors.border,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                group.label.toUpperCase(),
                style: TextStyle(
                  color: isActive ? AppColors.accent : AppColors.textFaint,
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1,
                  fontFamily: 'Inter',
                ),
              ),
              const SizedBox(width: 6),
              Text(
                valueLabel,
                style: TextStyle(
                  color: isActive ? AppColors.accent : AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Inter',
                ),
              ),
              const SizedBox(width: 4),
              Icon(
                Icons.keyboard_arrow_down_rounded,
                size: 14,
                color: isActive ? AppColors.accent : AppColors.textFaint,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FilterSheet extends StatelessWidget {
  const _FilterSheet({required this.group, required this.current});

  final FilterGroup group;
  final String current;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
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
                Expanded(
                  child: Text(
                    'FILTER BY ${group.label.toUpperCase()}',
                    style: const TextStyle(
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
                  icon: const Icon(
                    Icons.close,
                    size: 18,
                    color: AppColors.textMuted,
                  ),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          Flexible(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  for (final option in group.allOptions)
                    InkWell(
                      onTap: () => Navigator.pop(context, option.key),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 13,
                        ),
                        decoration: const BoxDecoration(
                          border: Border(
                            bottom: BorderSide(color: AppColors.borderSoft),
                          ),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                option.value,
                                style: TextStyle(
                                  color: option.key == current
                                      ? AppColors.accent
                                      : AppColors.text,
                                  fontSize: 13,
                                  fontWeight: option.key == current
                                      ? FontWeight.w600
                                      : FontWeight.w400,
                                  fontFamily: 'Inter',
                                ),
                              ),
                            ),
                            if (option.key == current)
                              const Icon(
                                Icons.check_rounded,
                                size: 18,
                                color: AppColors.accent,
                              ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
