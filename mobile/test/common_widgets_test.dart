import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:meteoric_admin/shared/widgets/common.dart';
import 'package:meteoric_admin/core/theme.dart';

void main() {
  Widget wrap(Widget child) => MaterialApp(
        theme: AppTheme.dark,
        home: Scaffold(body: child),
      );

  group('LoadingView', () {
    testWidgets('shows default label', (tester) async {
      await tester.pumpWidget(wrap(const LoadingView()));
      expect(find.text('Loading...'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('shows custom label', (tester) async {
      await tester.pumpWidget(wrap(const LoadingView(label: 'Fetching data...')));
      expect(find.text('Fetching data...'), findsOneWidget);
    });
  });

  group('EmptyState', () {
    testWidgets('shows message text', (tester) async {
      await tester.pumpWidget(wrap(
        const EmptyState(message: 'No items found'),
      ));
      expect(find.text('No items found'), findsOneWidget);
    });

    testWidgets('shows title when provided', (tester) async {
      await tester.pumpWidget(wrap(
        const EmptyState(title: 'All clear', message: 'Nothing to see here'),
      ));
      expect(find.text('All clear'), findsOneWidget);
      expect(find.text('Nothing to see here'), findsOneWidget);
    });

    testWidgets('shows action button when provided', (tester) async {
      var tapped = false;
      await tester.pumpWidget(wrap(
        EmptyState(
          message: 'Empty',
          action: 'Add item',
          onAction: () => tapped = true,
        ),
      ));
      expect(find.text('Add item'), findsOneWidget);
      await tester.tap(find.text('Add item'));
      expect(tapped, isTrue);
    });

    testWidgets('hides action button when onAction is null', (tester) async {
      await tester.pumpWidget(wrap(
        const EmptyState(message: 'Empty', action: 'Add item'),
      ));
      expect(find.text('Add item'), findsNothing);
    });
  });

  group('DetailRow', () {
    testWidgets('shows label and value', (tester) async {
      await tester.pumpWidget(wrap(
        const DetailRow(label: 'Status', value: 'Active'),
      ));
      expect(find.text('STATUS'), findsOneWidget);
      expect(find.text('Active'), findsOneWidget);
    });

    testWidgets('applies strong styling when requested', (tester) async {
      await tester.pumpWidget(wrap(
        const DetailRow(label: 'Amount', value: '\$5,000', strong: true),
      ));
      expect(find.text('\$5,000'), findsOneWidget);
      final text = tester.widget<Text>(find.text('\$5,000'));
      expect(text.style?.fontWeight, FontWeight.w700);
    });
  });

  group('KpiCard', () {
    testWidgets('shows label and value', (tester) async {
      await tester.pumpWidget(wrap(
        const KpiCard(label: 'Leads', value: '42'),
      ));
      expect(find.text('LEADS'), findsOneWidget);
      expect(find.text('42'), findsOneWidget);
    });

    testWidgets('shows subtitle when provided', (tester) async {
      await tester.pumpWidget(wrap(
        const KpiCard(label: 'Revenue', value: '\$10k', sub: '+12% this week'),
      ));
      expect(find.text('+12% this week'), findsOneWidget);
    });

    testWidgets('calls onTap when tapped', (tester) async {
      var tapped = false;
      await tester.pumpWidget(wrap(
        KpiCard(label: 'Test', value: '0', onTap: () => tapped = true),
      ));
      await tester.tap(find.text('0'));
      expect(tapped, isTrue);
    });
  });

  group('PaginationBar', () {
    testWidgets('shows page info', (tester) async {
      await tester.pumpWidget(wrap(
        PaginationBar(
          page: 1,
          total: 50,
          pageSize: 15,
          onPageChanged: (_) {},
        ),
      ));
      expect(find.text('4 pages'), findsOneWidget);
    });

    testWidgets('disables PREV on first page', (tester) async {
      await tester.pumpWidget(wrap(
        PaginationBar(
          page: 1,
          total: 50,
          pageSize: 15,
          onPageChanged: (_) {},
        ),
      ));
      final ghostButtons = tester.widgetList<GhostButton>(find.byType(GhostButton)).toList();
      expect(ghostButtons[0].onPressed, isNull, reason: 'PREV should be disabled on page 1');
    });

    testWidgets('disables NEXT on last page', (tester) async {
      await tester.pumpWidget(wrap(
        PaginationBar(
          page: 4,
          total: 50,
          pageSize: 15,
          onPageChanged: (_) {},
        ),
      ));
      final ghostButtons = tester.widgetList<GhostButton>(find.byType(GhostButton)).toList();
      expect(ghostButtons[1].onPressed, isNull, reason: 'NEXT should be disabled on last page');
    });
  });

  group('AccentButton', () {
    testWidgets('renders child text', (tester) async {
      await tester.pumpWidget(wrap(
        AccentButton(onPressed: () {}, child: const Text('Submit')),
      ));
      expect(find.text('Submit'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      var tapped = false;
      await tester.pumpWidget(wrap(
        AccentButton(onPressed: () => tapped = true, child: const Text('Go')),
      ));
      await tester.tap(find.text('Go'));
      expect(tapped, isTrue);
    });

    testWidgets('does not call onPressed when null', (tester) async {
      await tester.pumpWidget(wrap(
        AccentButton(onPressed: null, child: const Text('Disabled')),
      ));
      await tester.tap(find.text('Disabled'));
      // No error means onPressed was not called
    });
  });

  group('GhostButton', () {
    testWidgets('renders child text', (tester) async {
      await tester.pumpWidget(wrap(
        GhostButton(onPressed: () {}, child: const Text('Cancel')),
      ));
      expect(find.text('Cancel'), findsOneWidget);
    });
  });

  group('AppScaffold', () {
    testWidgets('shows title in AppBar', (tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: AppScaffold(title: 'Dashboard', body: SizedBox()),
      ));
      expect(find.text('Dashboard'), findsOneWidget);
    });

    testWidgets('shows body content', (tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: AppScaffold(
          title: 'Test',
          body: Text('Body content'),
        ),
      ));
      expect(find.text('Body content'), findsOneWidget);
    });
  });

  group('SectionCard', () {
    testWidgets('shows title when provided', (tester) async {
      await tester.pumpWidget(wrap(
        const SectionCard(title: 'Details', child: SizedBox()),
      ));
      expect(find.text('Details'), findsOneWidget);
    });

    testWidgets('hides title when null', (tester) async {
      await tester.pumpWidget(wrap(
        const SectionCard(child: Text('Content')),
      ));
      expect(find.text('Content'), findsOneWidget);
    });
  });
}
