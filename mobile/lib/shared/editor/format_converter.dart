import 'dart:convert';

import 'package:dart_quill_delta/dart_quill_delta.dart';
import 'package:flutter_quill/flutter_quill.dart';
import 'package:flutter_quill_delta_from_html/flutter_quill_delta_from_html.dart';
import 'package:vsc_quill_delta_to_html/vsc_quill_delta_to_html.dart';

/// Conversions between the three content formats used across web + mobile:
///   - HTML strings (email bodies, AI-generated proposal drafts)
///   - TipTap / ProseMirror JSON docs (proposal `content` column)
///   - Quill Deltas (native editor storage)
///
/// Supported blocks: paragraph, heading 1-6, bullet/ordered lists,
/// blockquote. Inline: bold, italic, underline, strike, code, link.
class FormatConverter {
  FormatConverter._();

  /// Builds a Quill [Document] from any supported content shape
  /// (HTML string, stringified JSON, TipTap doc map, raw Delta list).
  /// Returns null when there is nothing to edit yet.
  static Document? documentFromContent(dynamic content) {
    if (content == null) return null;
    try {
      if (content is String) {
        final trimmed = content.trim();
        if (trimmed.isEmpty) return null;
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            final decoded = jsonDecode(trimmed);
            final fromJson = documentFromContent(decoded);
            if (fromJson != null) return fromJson;
          } catch (_) {}
        }
        return Document.fromDelta(
          _withTrailingNewline(HtmlToDelta().convert(trimmed)),
        );
      }
      if (content is Map && content['type'] == 'doc') {
        return Document.fromDelta(tipTapToDelta(content));
      }
      if (content is List) {
        return Document.fromJson(content.cast<Map<String, dynamic>>());
      }
    } catch (_) {
      return null;
    }
    return null;
  }

  /// Delta → HTML (email bodies via Resend).
  static String deltaToHtml(Delta delta) {
    return QuillDeltaToHtmlConverter(delta.toJson()).convert();
  }

  /// Delta → TipTap JSON doc (proposal `content` column).
  /// Returns null when the document has no text.
  static Map<String, dynamic>? deltaToTipTapDoc(Delta delta) {
    final nodes = _linesToNodes(_deltaToLines(delta));
    if (nodes.isEmpty) return null;
    return {'type': 'doc', 'content': nodes};
  }

  /// TipTap JSON doc → Delta.
  static Delta tipTapToDelta(Map<dynamic, dynamic> doc) {
    final delta = Delta();
    _nodesToDelta((doc['content'] as List?) ?? const [], delta);
    return _withTrailingNewline(delta);
  }

  // ------------------------------------------------------------------
  // TipTap → Delta
  // ------------------------------------------------------------------

  static void _nodesToDelta(List<dynamic> nodes, Delta delta) {
    for (final node in nodes.cast<Map<dynamic, dynamic>>()) {
      switch (node['type']) {
        case 'heading':
          _inlineToDelta(node['content'], delta);
          delta.insert('\n', {
            'header': ((node['attrs'] as Map?)?['level'] as num?)?.toInt() ?? 2,
          });
        case 'bulletList':
          _listToDelta(node['content'], 'bullet', delta);
        case 'orderedList':
          _listToDelta(node['content'], 'ordered', delta);
        case 'blockquote':
          for (final child
              in ((node['content'] as List?) ?? const [])
                  .cast<Map<dynamic, dynamic>>()) {
            _inlineToDelta(child['content'], delta);
            delta.insert('\n', {'blockquote': true});
          }
        default:
          _inlineToDelta(node['content'], delta);
          delta.insert('\n');
      }
    }
  }

  static void _listToDelta(List<dynamic>? items, String tag, Delta delta) {
    for (final item in (items ?? const []).cast<Map<dynamic, dynamic>>()) {
      for (final block
          in ((item['content'] as List?) ?? const [])
              .cast<Map<dynamic, dynamic>>()) {
        _inlineToDelta(block['content'], delta);
        delta.insert('\n', {'list': tag});
      }
    }
  }

  static void _inlineToDelta(dynamic content, Delta delta) {
    if (content is! List) return;
    for (final leaf in content.cast<Map<dynamic, dynamic>>()) {
      switch (leaf['type']) {
        case 'hardBreak':
          delta.insert(' ');
        case 'text':
          final marks = <String, dynamic>{};
          for (final mark
              in ((leaf['marks'] as List?) ?? const [])
                  .cast<Map<dynamic, dynamic>>()) {
            switch (mark['type']) {
              case 'bold':
                marks['bold'] = true;
              case 'italic':
                marks['italic'] = true;
              case 'underline':
                marks['underline'] = true;
              case 'strike':
                marks['strike'] = true;
              case 'code':
                marks['code'] = true;
              case 'link':
                final href = ((mark['attrs'] as Map?)?['href'] ?? '') as String;
                if (href.isNotEmpty) marks['link'] = href;
            }
          }
          delta.insert(
            leaf['text'] as String? ?? '',
            marks.isEmpty ? null : marks,
          );
      }
    }
  }

  // ------------------------------------------------------------------
  // Delta → TipTap
  // ------------------------------------------------------------------

  /// A line is a list of inline segments plus its block attributes
  /// (taken from the attributes of the op that ends the line).
  static List<_Line> _deltaToLines(Delta delta) {
    final lines = <_Line>[];
    var segments = <_Segment>[];

    for (final op in delta.operations) {
      final attrs = op.attributes;
      if (op.data is! String) continue; // skip embeds (images etc.)
      final parts = (op.data as String).split('\n');
      for (var i = 0; i < parts.length; i++) {
        if (i > 0) {
          lines.add(_Line(segments, attrs));
          segments = <_Segment>[];
        }
        if (parts[i].isNotEmpty) {
          segments.add(_Segment(parts[i], attrs));
        }
      }
    }
    if (segments.isNotEmpty) lines.add(_Line(segments, null));
    return lines;
  }

  static List<Map<String, dynamic>> _linesToNodes(List<_Line> lines) {
    // Drop leading/trailing empty lines but keep interior ones (spacing).
    while (lines.isNotEmpty && lines.first.isEmptyLine) {
      lines.removeAt(0);
    }
    while (lines.isNotEmpty && lines.last.isEmptyLine) {
      lines.removeLast();
    }

    final nodes = <Map<String, dynamic>>[];
    var i = 0;
    while (i < lines.length) {
      final line = lines[i];
      final header = line.blockAttrs?['header'];
      final list = line.blockAttrs?['list'];
      final quote = line.blockAttrs?['blockquote'];

      if (header is num && header >= 1 && header <= 6) {
        nodes.add({
          'type': 'heading',
          'attrs': {'level': header.toInt()},
          'content': _segmentsToInline(line.segments),
        });
        i++;
      } else if (list == 'bullet' || list == 'ordered') {
        final items = <Map<String, dynamic>>[];
        while (i < lines.length &&
            lines[i].blockAttrs?['list'] == list &&
            !lines[i].isEmptyLine) {
          items.add({
            'type': 'listItem',
            'content': [_paragraphNode(lines[i].segments)],
          });
          i++;
        }
        nodes.add({
          'type': list == 'ordered' ? 'orderedList' : 'bulletList',
          'content': items,
        });
      } else if (quote == true) {
        final paragraphs = <Map<String, dynamic>>[];
        while (i < lines.length &&
            lines[i].blockAttrs?['blockquote'] == true &&
            !lines[i].isEmptyLine) {
          paragraphs.add(_paragraphNode(lines[i].segments));
          i++;
        }
        nodes.add({'type': 'blockquote', 'content': paragraphs});
      } else {
        nodes.add(_paragraphNode(line.segments));
        i++;
      }
    }
    return nodes;
  }

  static Map<String, dynamic> _paragraphNode(List<_Segment> segments) {
    final inline = _segmentsToInline(segments);
    return {'type': 'paragraph', if (inline.isNotEmpty) 'content': inline};
  }

  static List<Map<String, dynamic>> _segmentsToInline(List<_Segment> segments) {
    final out = <Map<String, dynamic>>[];
    for (final seg in segments) {
      final marks = <Map<String, dynamic>>[];
      final attrs = seg.attrs ?? const {};
      void flag(String key, String type) {
        if (attrs[key] == true) marks.add({'type': type});
      }

      flag('bold', 'bold');
      flag('italic', 'italic');
      flag('underline', 'underline');
      flag('strike', 'strike');
      flag('code', 'code');
      final link = attrs['link'];
      if (link is String && link.isNotEmpty) {
        marks.add({
          'type': 'link',
          'attrs': {'href': link},
        });
      }
      out.add({
        'type': 'text',
        'text': seg.text,
        if (marks.isNotEmpty) 'marks': marks,
      });
    }
    return out;
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  static Delta _withTrailingNewline(Delta delta) {
    final ops = delta.operations;
    if (ops.isNotEmpty) {
      final last = ops.last;
      if (last.data is String && (last.data as String).endsWith('\n')) {
        return delta;
      }
    }
    final result = Delta();
    for (final op in ops) {
      result.push(op);
    }
    result.insert('\n');
    return result;
  }
}

class _Segment {
  const _Segment(this.text, this.attrs);
  final String text;
  final Map<String, dynamic>? attrs;
}

class _Line {
  const _Line(this.segments, this.blockAttrs);
  final List<_Segment> segments;
  final Map<String, dynamic>? blockAttrs;

  bool get isEmptyLine => segments.every((s) => s.text.trim().isEmpty);
}
