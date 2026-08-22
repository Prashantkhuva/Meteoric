import 'package:flutter/material.dart';

import '../../core/theme.dart';
import 'rich_text_editor.dart';

/// Full-screen wrapper around [InlineRichEditor] with Save/Close chrome.
///
/// Accepts any supported [initialContent] shape (HTML string, TipTap JSON,
/// null) and returns the edited content in [outputFormat] via [onSave]:
///   - 'html' → HTML string (email bodies)
///   - 'json' → TipTap JSON doc map (proposal content)
class RichTextEditorScreen extends StatefulWidget {
  const RichTextEditorScreen({
    super.key,
    this.initialContent,
    required this.onSave,
    this.outputFormat = 'json',
    this.title = 'Content editor',
  });

  final dynamic initialContent;
  final ValueChanged<dynamic> onSave;

  /// 'json' (TipTap doc, proposals) or 'html' (email bodies).
  final String outputFormat;
  final String title;

  @override
  State<RichTextEditorScreen> createState() => _RichTextEditorScreenState();
}

class _RichTextEditorScreenState extends State<RichTextEditorScreen> {
  late dynamic _value = widget.initialContent;

  void _save() {
    widget.onSave(_value);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(widget.title),
        leading: IconButton(
          icon: const Icon(Icons.close, size: 20, color: AppColors.textMuted),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          TextButton(
            onPressed: _save,
            child: const Text(
              'SAVE',
              style: TextStyle(
                color: AppColors.accent,
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
                fontFamily: 'Inter',
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: InlineRichEditor(
              initialContent: widget.initialContent,
              onChanged: (value) => _value = value,
              outputFormat: widget.outputFormat,
              placeholder: 'Write something...',
            ),
          ),
        ],
      ),
    );
  }
}
