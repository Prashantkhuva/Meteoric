import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/shared/editor/format_converter.dart';
import 'package:dart_quill_delta/dart_quill_delta.dart';

void main() {
  group('FormatConverter.documentFromContent', () {
    test('returns null for null content', () {
      expect(FormatConverter.documentFromContent(null), isNull);
    });

    test('returns null for empty string', () {
      expect(FormatConverter.documentFromContent(''), isNull);
    });

    test('returns null for whitespace-only string', () {
      expect(FormatConverter.documentFromContent('   '), isNull);
    });

    test('parses HTML string', () {
      final doc = FormatConverter.documentFromContent('<p>Hello</p>');
      expect(doc, isNotNull);
      expect(doc!.toPlainText(), contains('Hello'));
    });

    test('parses TipTap JSON string', () {
      final json = '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hello"}]}]}';
      final doc = FormatConverter.documentFromContent(json);
      expect(doc, isNotNull);
      expect(doc!.toPlainText(), contains('Hello'));
    });

    test('parses TipTap JSON map', () {
      final doc = FormatConverter.documentFromContent({
        'type': 'doc',
        'content': [
          {
            'type': 'paragraph',
            'content': [
              {'type': 'text', 'text': 'World'},
            ],
          },
        ],
      });
      expect(doc, isNotNull);
      expect(doc!.toPlainText(), contains('World'));
    });

    test('parses Quill Delta list', () {
      final doc = FormatConverter.documentFromContent([
        {'insert': 'Delta text\n'},
      ]);
      expect(doc, isNotNull);
      expect(doc!.toPlainText(), contains('Delta text'));
    });
  });

  group('FormatConverter.tipTapToDelta', () {
    test('converts simple paragraph', () {
      final doc = {
        'type': 'doc',
        'content': [
          {
            'type': 'paragraph',
            'content': [
              {'type': 'text', 'text': 'Hello world'},
            ],
          },
        ],
      };
      final delta = FormatConverter.tipTapToDelta(doc);
      expect(delta.isNotEmpty, isTrue);
      final text = delta.operations
          .where((op) => op.data is String)
          .map((op) => op.data as String)
          .join();
      expect(text, contains('Hello world'));
    });

    test('converts heading', () {
      final doc = {
        'type': 'doc',
        'content': [
          {
            'type': 'heading',
            'attrs': {'level': 1},
            'content': [
              {'type': 'text', 'text': 'Title'},
            ],
          },
        ],
      };
      final delta = FormatConverter.tipTapToDelta(doc);
      expect(delta.isNotEmpty, isTrue);
    });

    test('converts bold text', () {
      final doc = {
        'type': 'doc',
        'content': [
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': 'Bold',
                'marks': [{'type': 'bold'}],
              },
            ],
          },
        ],
      };
      final delta = FormatConverter.tipTapToDelta(doc);
      final ops = delta.operations;
      final boldOp = ops.firstWhere(
        (op) => op.attributes != null && op.attributes!['bold'] == true,
        orElse: () => throw StateError('No bold op found'),
      );
      expect(boldOp.data, 'Bold');
    });

    test('handles empty doc content', () {
      final doc = {'type': 'doc', 'content': []};
      final delta = FormatConverter.tipTapToDelta(doc);
      expect(delta.isNotEmpty, isTrue); // trailing newline
    });
  });

  group('FormatConverter.deltaToTipTapDoc', () {
    test('converts simple text to TipTap doc', () {
      final delta = Delta()..insert('Hello\n');
      final doc = FormatConverter.deltaToTipTapDoc(delta);
      expect(doc, isNotNull);
      expect(doc!['type'], 'doc');
      final content = doc['content'] as List;
      expect(content, isNotEmpty);
      expect(content[0]['type'], 'paragraph');
    });

    test('returns null for empty delta', () {
      final delta = Delta();
      final doc = FormatConverter.deltaToTipTapDoc(delta);
      expect(doc, isNull);
    });
  });

  group('FormatConverter.deltaToHtml', () {
    test('converts text to HTML', () {
      final delta = Delta()..insert('Hello\n');
      final html = FormatConverter.deltaToHtml(delta);
      expect(html, contains('Hello'));
    });
  });
}
