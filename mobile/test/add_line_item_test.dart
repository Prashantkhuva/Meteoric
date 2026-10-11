import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/theme.dart';
import 'package:meteoric_admin/features/invoices/invoice_form_screen.dart';
import 'package:meteoric_admin/features/proposals/proposal_form_screen.dart';

void main() {
  testWidgets('InvoiceFormScreen: ADD LINE ITEM adds a row', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const InvoiceFormScreen(),
      ),
    );
    // Allow initState network calls to fail fast (no host in tests).
    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump();

    expect(find.text('No line items yet.'), findsOneWidget);

    await tester.tap(find.text('ADD LINE ITEM'));
    await tester.pump();

    expect(
      find.byKey(const ValueKey('item_0')),
      findsOneWidget,
      reason: 'first line item row must appear after tap',
    );
  });

  testWidgets('InvoiceFormScreen: ADD LINE ITEM works with focused field',
      (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const InvoiceFormScreen(),
      ),
    );
    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump();

    // Focus something first — keyboard-open path.
    final taxField = find.byType(TextFormField).first;
    await tester.tap(taxField);
    await tester.pump();

    await tester.tap(find.text('ADD LINE ITEM'));
    await tester.pump();

    expect(find.byKey(const ValueKey('item_0')), findsOneWidget);
  });

  testWidgets('ProposalFormScreen: ADD LINE ITEM adds a row', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const ProposalFormScreen(),
      ),
    );
    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump();

    expect(find.text('No line items yet.'), findsOneWidget);

    await tester.tap(find.text('ADD LINE ITEM'));
    await tester.pump();

    expect(find.byKey(const ValueKey('pricing_0')), findsOneWidget);
  });
}
