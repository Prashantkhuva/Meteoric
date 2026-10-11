import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/core/theme.dart';
import 'package:meteoric_admin/shared/widgets/common.dart';

void main() {
  testWidgets('GhostButton fires inside UnfocusOnTap + ListView form layout',
      (tester) async {
    var taps = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: UnfocusOnTap(
          child: AppScaffold(
            title: 'New invoice',
            body: Form(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  SectionCard(
                    title: 'Line items',
                    child: Column(
                      children: [
                        GhostButton(
                          height: 40,
                          onPressed: () => taps++,
                          child: const Text('ADD LINE ITEM'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('ADD LINE ITEM'));
    await tester.pump();
    expect(taps, 1, reason: 'GhostButton tap must fire in form layout');
  });

  testWidgets('GhostButton fires when keyboard-dismiss overlay competes',
      (tester) async {
    var taps = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: UnfocusOnTap(
          child: Scaffold(
            body: ListView(
              children: [
                GhostButton(
                  onPressed: () => taps++,
                  child: const Text('ADD LINE ITEM'),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('ADD LINE ITEM'));
    await tester.pump();
    expect(taps, 1);
  });

  testWidgets('GhostButton fires while a text field has focus',
      (tester) async {
    var taps = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: UnfocusOnTap(
          child: AppScaffold(
            title: 'New invoice',
            body: Form(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Title'),
                  ),
                  const SizedBox(height: 16),
                  SectionCard(
                    title: 'Line items',
                    child: Column(
                      children: [
                        GhostButton(
                          height: 40,
                          onPressed: () => taps++,
                          child: const Text('ADD LINE ITEM'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Title'));
    await tester.pump();
    expect(
      FocusManager.instance.primaryFocus?.hasFocus,
      isTrue,
      reason: 'precondition: field focused',
    );

    await tester.tap(find.text('ADD LINE ITEM'));
    await tester.pump();
    expect(taps, 1, reason: 'tap must fire while a field is focused');
  });
}
