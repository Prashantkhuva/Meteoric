import '../../core/native.dart';

/// Minimal RFC-4180 CSV builder + share helper for list exports.
class CsvExport {
  CsvExport._();

  static String build(List<List<String>> rows) {
    final buffer = StringBuffer();
    for (final row in rows) {
      buffer.writeln(
        row
            .map((cell) {
              final value = cell.replaceAll('\r\n', '\n').trim();
              final needsQuotes =
                  value.contains(',') ||
                  value.contains('"') ||
                  value.contains('\n');
              return needsQuotes ? '"${value.replaceAll('"', '""')}"' : value;
            })
            .join(','),
      );
    }
    return buffer.toString();
  }

  /// Writes the CSV to cache and opens the Android share sheet.
  static Future<void> share({
    required String filename,
    required List<List<String>> rows,
  }) async {
    await Native.shareFile(
      name: filename,
      mime: 'text/csv',
      content: build(rows),
    );
  }

  /// Dated export filename, e.g. `leads-2026-08-21.csv`.
  static String datedName(String prefix) {
    final now = DateTime.now();
    final m = now.month.toString().padLeft(2, '0');
    final d = now.day.toString().padLeft(2, '0');
    return '$prefix-${now.year}-$m-$d.csv';
  }
}

String csvDate(dynamic iso) {
  if (iso == null) return '';
  final s = iso.toString();
  return s.length >= 10 ? s.substring(0, 10) : s;
}

/// Parses simple RFC-4180 CSV text (handles quoted cells + escaped quotes).
/// Returns rows of cells; first row is the header.
List<List<String>> parseCsv(String text) {
  final rows = <List<String>>[];
  var cell = StringBuffer();
  var row = <String>[];
  var inQuotes = false;
  for (var i = 0; i < text.length; i++) {
    final ch = text[i];
    if (inQuotes) {
      if (ch == '"') {
        if (i + 1 < text.length && text[i + 1] == '"') {
          cell.write('"');
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell.write(ch);
      }
    } else if (ch == '"') {
      inQuotes = true;
    } else if (ch == ',') {
      row.add(cell.toString());
      cell = StringBuffer();
    } else if (ch == '\n' || ch == '\r') {
      if (ch == '\r' && i + 1 < text.length && text[i + 1] == '\n') i++;
      row.add(cell.toString());
      cell = StringBuffer();
      if (row.any((c) => c.trim().isNotEmpty)) rows.add(row);
      row = <String>[];
    } else {
      cell.write(ch);
    }
  }
  if (cell.isNotEmpty || row.isNotEmpty) {
    row.add(cell.toString());
    if (row.any((c) => c.trim().isNotEmpty)) rows.add(row);
  }
  return rows;
}
