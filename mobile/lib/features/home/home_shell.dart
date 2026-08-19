import 'package:flutter/material.dart';
import '../dashboard/dashboard_screen.dart';
import '../leads/leads_screen.dart';
import '../clients/clients_screen.dart';
import '../more/more_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  static const _tabs = [
    DashboardScreen(),
    LeadsScreen(),
    ClientsScreen(),
    MoreScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _index, children: _tabs),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined, size: 22), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.person_search_outlined, size: 22), label: 'Leads'),
          BottomNavigationBarItem(icon: Icon(Icons.people_outline, size: 22), label: 'Clients'),
          BottomNavigationBarItem(icon: Icon(Icons.grid_view_outlined, size: 22), label: 'More'),
        ],
      ),
    );
  }
}