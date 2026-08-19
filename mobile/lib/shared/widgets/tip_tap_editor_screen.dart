import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../core/config.dart';
import '../../core/theme.dart';

/// Standalone TipTap editor screen backed by the site's `/editor` page
/// (app/editor/EditorView.jsx). Communicates via postMessage:
///   page → parent: {type: 'meteoric-editor', payload:{content}} (live)
///                 {type: 'meteoric-editor-save', payload:{content}} (Ctrl/Cmd+S)
///   parent → page: {type: 'meteoric-editor-set', payload:{content}}
class TipTapEditorScreen extends StatefulWidget {
  const TipTapEditorScreen({
    super.key,
    this.initialContent,
    required this.onSave,
    this.outputFormat = 'json',
  });

  final dynamic initialContent;
  final ValueChanged<dynamic> onSave;

  /// 'json' (TipTap doc, proposals) or 'html' (email bodies).
  final String outputFormat;

  @override
  State<TipTapEditorScreen> createState() => _TipTapEditorScreenState();
}

class _TipTapEditorScreenState extends State<TipTapEditorScreen> {
  late final WebViewController _controller;
  dynamic _latestContent;
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _latestContent = widget.initialContent;

    final c = widget.initialContent == null
        ? ''
        : '?c=${Uri.encodeComponent(jsonEncode(widget.initialContent))}';
    final fmt = widget.outputFormat == 'html' ? '&fmt=html' : '';
    final url = '${AppConfig.siteUrl}/editor$c$fmt';

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'MeteoricEditor',
        onMessageReceived: (message) {
          try {
            final data = jsonDecode(message.message);
            if (data is! Map) return;
            final type = data['type'];
            final payload = data['payload'];
            if (payload is Map && payload['content'] != null) {
              _latestContent = payload['content'];
              if (type == 'meteoric-editor-save') {
                widget.onSave(_latestContent);
              }
            }
          } catch (_) {}
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) {
            _injectBridge();
            if (!_loaded) {
              _loaded = true;
              setState(() {});
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Content editor'),
        leading: IconButton(
          icon: const Icon(Icons.close, size: 20, color: AppColors.textMuted),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          TextButton(
            onPressed: () => _save(),
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
      body: _loaded
          ? WebViewWidget(controller: _controller)
          : const Center(
              child: SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),
    );
  }

  void _injectBridge() {
    const script = r'''
(function() {
  if (window.__meteoricBridge) return;
  window.__meteoricBridge = true;
  var orig = window.postMessage.bind(window);
  window.postMessage = function(message, targetOrigin) {
    try {
      if (window.MeteoricEditor) {
        window.MeteoricEditor.postMessage(
          typeof message === 'string' ? message : JSON.stringify(message)
        );
      }
    } catch (e) {}
    return orig(message, targetOrigin);
  };
})();
''';
    _controller.runJavaScript(script);
  }

  void _save() {
    widget.onSave(_latestContent);
  }
}