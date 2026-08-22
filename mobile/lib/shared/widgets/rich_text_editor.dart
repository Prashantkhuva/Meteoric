import 'package:dart_quill_delta/dart_quill_delta.dart';
import 'package:flutter/material.dart';
import 'package:flutter_quill/flutter_quill.dart';

import '../../core/theme.dart';
import '../editor/format_converter.dart';

/// Embeddable rich text editor — compact toolbar + editor in a bordered
/// container that lives inline on the current screen (no navigation).
///
/// Accepts any supported [initialContent] shape (HTML string, TipTap JSON,
/// null) and reports the live value via [onChanged] in [outputFormat]:
///   - 'html' → HTML string (email bodies)
///   - 'json' → TipTap JSON doc map (proposal content); null when blank
class InlineRichEditor extends StatefulWidget {
  const InlineRichEditor({
    super.key,
    this.initialContent,
    required this.onChanged,
    this.outputFormat = 'json',
    this.placeholder = 'Write something...',
    this.minHeight = 160,
    this.autoGrow = false,
  });

  final dynamic initialContent;
  final ValueChanged<dynamic> onChanged;

  /// 'json' (TipTap doc, proposals) or 'html' (email bodies).
  final String outputFormat;
  final String placeholder;
  final double minHeight;

  /// When true the editor grows with its content and relies on an ancestor
  /// scrollable (e.g. a form [ListView]) for scrolling.
  final bool autoGrow;

  @override
  State<InlineRichEditor> createState() => _InlineRichEditorState();
}

class _InlineRichEditorState extends State<InlineRichEditor> {
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
    _controller.addListener(_emitValue);
  }

  @override
  void dispose() {
    _controller.removeListener(_emitValue);
    _controller.dispose();
    _focusNode.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  String? _lastEmitted;

  void _emitValue() {
    if (!mounted) return;
    final delta = _controller.document.toDelta();
    final dynamic value;
    if (_isBlank(delta)) {
      value = null;
    } else if (_wantsHtml) {
      value = FormatConverter.deltaToHtml(delta);
    } else {
      value = FormatConverter.deltaToTipTapDoc(delta);
    }
    final key = value == null
        ? ''
        : (_wantsHtml ? value as String : (value as Map)['content'].toString());
    if (key != _lastEmitted) {
      _lastEmitted = key;
      widget.onChanged(value);
    }
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
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
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
                  size: 17,
                ),
              ),
              child: QuillSimpleToolbar(
                controller: _controller,
                config: QuillSimpleToolbarConfig(
                  multiRowsDisplay: false,
                  showDividers: true,
                  dialogTheme: editorDialogTheme(context),
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
                  showClearFormat: false,
                  showAlignmentButtons: false,
                  showHeaderStyle: false,
                  showListNumbers: true,
                  showListBullets: true,
                  showListCheck: false,
                  showCodeBlock: false,
                  showQuote: false,
                  showIndent: false,
                  showLink: true,
                  showUndo: false,
                  showRedo: false,
                  showDirection: false,
                  showSearchButton: false,
                  showSubscript: false,
                  showSuperscript: false,
                  buttonOptions: QuillSimpleToolbarButtonOptions(
                    base: QuillToolbarBaseButtonOptions(iconSize: 16),
                  ),
                ),
              ),
            ),
          ),
          if (widget.autoGrow)
            QuillEditor.basic(
              controller: _controller,
              focusNode: _focusNode,
              scrollController: _scrollController,
              config: QuillEditorConfig(
                scrollable: false,
                placeholder: widget.placeholder,
                padding: const EdgeInsets.all(14),
              ),
            )
          else
            ConstrainedBox(
              constraints: BoxConstraints(minHeight: widget.minHeight),
              child: QuillEditor.basic(
                controller: _controller,
                focusNode: _focusNode,
                scrollController: _scrollController,
                config: QuillEditorConfig(
                  placeholder: widget.placeholder,
                  padding: const EdgeInsets.all(14),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Shared dark dialog theme for editor popups (e.g. link entry).
QuillDialogTheme editorDialogTheme(BuildContext context) => QuillDialogTheme(
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
);
