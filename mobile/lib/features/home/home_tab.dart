import 'package:flutter/foundation.dart';

/// Global tab index for the home shell so nested screens (e.g. dashboard
/// KPI cards) can switch tabs without depending on the shell's state.
final ValueNotifier<int> homeTab = ValueNotifier(0);
