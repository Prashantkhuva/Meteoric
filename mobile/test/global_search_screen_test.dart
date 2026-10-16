import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/theme.dart';
import 'package:meteoric_admin/features/search/global_search_screen.dart';

void main() {
  Widget wrap() =>
      MaterialApp(theme: AppTheme.dark, home: const GlobalSearchScreen());

  testWidgets('shows search field and min-length hint initially', (
    tester,
  ) async {
    await tester.pumpWidget(wrap());
    expect(find.byType(TextField), findsOneWidget);
    expect(
      find.text('Type at least 2 characters to search everything.'),
      findsOneWidget,
    );
  });

  testWidgets('single character keeps hint and shows clear button', (
    tester,
  ) async {
    await tester.pumpWidget(wrap());
    await tester.enterText(find.byType(TextField), 'a');
    await tester.pump();
    expect(
      find.text('Type at least 2 characters to search everything.'),
      findsOneWidget,
    );
    expect(find.byIcon(Icons.close), findsOneWidget);
  });

  testWidgets('two characters schedule search without crashing', (
    tester,
  ) async {
    await tester.pumpWidget(wrap());
    await tester.enterText(find.byType(TextField), 'ab');
    // Debounce timer scheduled — loading replaces the hint immediately
    await tester.pump();
    expect(
      find.text('Type at least 2 characters to search everything.'),
      findsNothing,
    );
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    // Fire debounce; mocked HTTP client fails fast → error state, no crash
    await tester.pump(const Duration(milliseconds: 400));
    expect(tester.takeException(), isNull);
  });
}
