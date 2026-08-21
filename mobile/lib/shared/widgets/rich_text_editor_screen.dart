import 'package:dart_quill_delta/dart_quill_delta.dart';
import 'package:flutter/material.dart';
import 'package:flutter_quill/flutter_quill.dart';

import '../../core/theme.dart';
import '../editor/format_converter.dart';

/// Native rich text editor (flutter_quill) — no WebView, works offline.
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
  late final QuillController _controller;
  late final FocusNode _focusNode;
  late final ScrollController _scrollController;

  bool get _wantsHtml => widget.outputFormat == 'html';

  @override
  void initState() {
    super.initState();
    _controller = QuillController(
      document:
          FormatConverter.documentFromContent(widget.initialContent) ??
          Document(),
      selection: const TextSelection.collapsed(offset: 0),
    );
    _focusNode = FocusNode();
    _scrollController = ScrollController();
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _save() {
    _focusNode.unfocus();
    final delta = _controller.document.toDelta();
    if (_isBlank(delta)) {
      widget.onSave(null);
    } else if (_wantsHtml) {
      widget.onSave(FormatConverter.deltaToHtml(delta));
    } else {
      widget.onSave(FormatConverter.deltaToTipTapDoc(delta));
    }
    Navigator.of(context).pop();
  }

  bool _isBlank(Delta delta) {
    for (final op in delta.operations) {
      if (op.data is String && (op.data as String).trim().isNotEmpty) {
        return false;
      }
    }
    return true;
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
          Container(
            decoration: const BoxDecoration(
              color: AppColors.card,
              border: Border(bottom: BorderSide(color: AppColors.border)),
            ),
            child: Theme(
              data: Theme.of(context).copyWith(
                iconTheme: const IconThemeData(
                  color: AppColors.textMuted,
                  size: 18,
                ),
              ),
              child: QuillSimpleToolbar(
                controller: _controller,
                config: QuillSimpleToolbarConfig(
                  showDividers: true,
                  showFontFamily: false,
                  showFontSize: false,
                  showBoldButton: true,
                  showItalicButton: true,
                  showSmallButton: false,
                  showUnderLineButton: true,
                  showStrikeThrough: true,
                  showInlineCode: false,
                  showColorButton: false,
                  showBackgroundColorButton: false,
                  showClearFormat: true,
                  showAlignmentButtons: false,
                  showHeaderStyle: true,
                  showListNumbers: true,
                  showListBullets: true,
                  showListCheck: false,
                  showCodeBlock: false,
                  showQuote: true,
                  showIndent: false,
                  showLink: true,
                  showUndo: true,
                  showRedo: true,
                  showDirection: false,
                  showSearchButton: false,
                  showSubscript: false,
                  showSuperscript: false,
                  buttonOptions: const QuillSimpleToolbarButtonOptions(
                    base: QuillToolbarBaseButtonOptions(iconSize: 18),
                  ),
                  dialogTheme: QuillDialogTheme(
                    dialogBackgroundColor: AppColors.cardRaised,
                    labelTextStyle: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 13,
                      fontFamily: 'Inter',
                    ),
                    inputTextStyle: const TextStyle(
                      color: AppColors.text,
                      fontSize: 14,
                      fontFamily: 'Inter',
                    ),
                    buttonTextStyle: const TextStyle(
                      color: AppColors.accent,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: QuillEditor.basic(
              controller: _controller,
              focusNode: _focusNode,
              scrollController: _scrollController,
              config: const QuillEditorConfig(
                placeholder: 'Write something...',
                padding: EdgeInsets.all(16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
