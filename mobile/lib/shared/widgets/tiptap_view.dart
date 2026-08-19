import 'package:flutter/material.dart';
import '../../core/theme.dart';

/// Renders a TipTap editor JSON document (doc → paragraph/heading/lists with
/// bold/italic/underline/link marks) natively. Mirrors the web admin's
/// `renderContent` in proposals/PageContent.jsx.
class TipTapView extends StatelessWidget {
  const TipTapView({super.key, required this.content});

  final dynamic content;

  @override
  Widget build(BuildContext context) {
    dynamic doc = content;
    if (doc is String) {
      return Text(
        doc,
        style: const TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.6, fontFamily: 'Inter'),
      );
    }
    if (doc is! Map || doc['type'] != 'doc' || doc['content'] is! List) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final node in (doc['content'] as List).cast<Map>()) _buildNode(node),
      ],
    );
  }

  Widget _buildNode(Map node, {double indent = 0}) {
    final type = node['type'];
    final children = (node['content'] as List?)?.cast<Map>() ?? const <Map>[];

    switch (type) {
      case 'paragraph':
        return Padding(
          padding: EdgeInsets.only(bottom: 8, left: indent),
          child: _inline(children),
        );
      case 'heading':
        final level = (node['attrs']?['level'] as num?)?.toInt() ?? 1;
        final sizes = {1: 18.0, 2: 16.0, 3: 14.0};
        return Padding(
          padding: EdgeInsets.only(bottom: 8, top: 4, left: indent),
          child: Text(
            _plainText(children),
            style: TextStyle(
              color: AppColors.text,
              fontSize: sizes[level] ?? 14,
              fontWeight: FontWeight.w600,
              fontFamily: 'Inter',
            ),
          ),
        );
      case 'bulletList':
        return Padding(
          padding: EdgeInsets.only(bottom: 8, left: indent),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final item in children) _listItem(item, '•'),
            ],
          ),
        );
      case 'orderedList':
        return Padding(
          padding: EdgeInsets.only(bottom: 8, left: indent),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (var i = 0; i < children.length; i++) _listItem(children[i], '${i + 1}.'),
            ],
          ),
        );
      case 'blockquote':
        return Container(
          margin: EdgeInsets.only(bottom: 8, left: indent),
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            border: Border(left: BorderSide(color: AppColors.accent.withValues(alpha: 0.4), width: 2)),
          ),
          child: _inline(children),
        );
      case 'horizontalRule':
        return Padding(
          padding: EdgeInsets.only(bottom: 12, left: indent),
          child: const Divider(color: AppColors.border),
        );
      default:
        return Padding(
          padding: EdgeInsets.only(bottom: 8, left: indent),
          child: _inline(children),
        );
    }
  }

  Widget _listItem(Map node, String marker) {
    final children = (node['content'] as List?)?.cast<Map>() ?? const <Map>[];
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$marker ',
            style: const TextStyle(color: AppColors.accent, fontSize: 13, fontFamily: 'Inter'),
          ),
          Expanded(
            child: node['type'] == 'listItem'
                ? (_hasNestedList(children)
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          for (final c in children)
                            c['type'] == 'paragraph'
                                ? _inline((c['content'] as List?)?.cast<Map>() ?? const [])
                                : _buildNode(c, indent: 12),
                        ],
                      )
                    : _inline(children))
                : _inline(children),
          ),
        ],
      ),
    );
  }

  bool _hasNestedList(List<Map> children) {
    return children.any((c) => c['type'] == 'bulletList' || c['type'] == 'orderedList');
  }

  Widget _inline(List<Map> nodes) {
    if (nodes.isEmpty) {
      return const Text(
        ' ',
        style: TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.6, fontFamily: 'Inter'),
      );
    }
    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        for (final node in nodes) _inlineNode(node),
      ],
    );
  }

  Widget _inlineNode(Map node) {
    final text = (node['text'] ?? '') as String;
    final marks = (node['marks'] as List?)?.cast<Map>() ?? const <Map>[];
    final markTypes = marks.map((m) => m['type']).toSet();

    Widget child = Text(
      text,
      style: const TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.6, fontFamily: 'Inter'),
    );

    if (markTypes.contains('bold')) {
      child = Text(
        text,
        style: const TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.6, fontWeight: FontWeight.w700, fontFamily: 'Inter'),
      );
    }
    if (markTypes.contains('italic')) {
      child = Text(
        text,
        style: const TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.6, fontStyle: FontStyle.italic, fontFamily: 'Inter'),
      );
    }
    if (markTypes.contains('underline')) {
      child = Text(
        text,
        style: const TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.6, decoration: TextDecoration.underline, fontFamily: 'Inter'),
      );
    }
    if (markTypes.contains('link')) {
      final href = marks
          .firstWhere((m) => m['type'] == 'link', orElse: () => const {})['attrs']?['href'] as String?;
      child = GestureDetector(
        onTap: () => _openLink(href),
        child: Text(
          text,
          style: const TextStyle(color: AppColors.accent, fontSize: 13, height: 1.6, decoration: TextDecoration.underline, fontFamily: 'Inter'),
        ),
      );
    }
    return child;
  }

  String _plainText(List<Map> nodes) {
    return nodes.map((n) => n['text'] ?? '').join();
  }

  void _openLink(String? href) {
    if (href == null || href.isEmpty) return;
    // URL opening handled by caller via callback if needed; safe fallback noop.
  }
}