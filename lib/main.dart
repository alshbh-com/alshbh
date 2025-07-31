import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://jfusqoiczhzpaagchbnd.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdXNxb2ljemh6cGFhZ2NoYm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNjU0NzQsImV4cCI6MjA1Mzc0MTQ3NH0.sb_publishable_5hkDF0nlqbG2Qw_ib_S-Iw_OBwnhbes',
  );
  
  runApp(const TalabatkApp());
}

final supabase = Supabase.instance.client;

class TalabatkApp extends StatelessWidget {
  const TalabatkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'طلباتك',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.orange,
        primaryColor: const Color(0xFFFF6B35),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFF6B35),
          brightness: Brightness.light,
        ),
        fontFamily: 'Cairo',
        useMaterial3: true,
      ),
      home: const SplashScreen(),
    );
  }
}

