import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../main.dart';
import 'home_screen.dart';

class LocationCheckScreen extends StatefulWidget {
  const LocationCheckScreen({super.key});

  @override
  State<LocationCheckScreen> createState() => _LocationCheckScreenState();
}

class _LocationCheckScreenState extends State<LocationCheckScreen> {
  bool _isLoading = true;
  bool _isLocationSupported = false;
  String _message = 'جاري فحص موقعك...';

  @override
  void initState() {
    super.initState();
    _checkLocation();
  }

  Future<void> _checkLocation() async {
    try {
      // التحقق من صلاحيات الموقع
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() {
            _isLoading = false;
            _message = 'يجب السماح بالوصول للموقع لاستخدام التطبيق';
          });
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        setState(() {
          _isLoading = false;
          _message = 'تم رفض صلاحيات الموقع نهائياً. يرجى تفعيلها من الإعدادات';
        });
        return;
      }

      // الحصول على الموقع الحالي
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      // فحص ما إذا كان الموقع في المناطق المدعومة
      bool isSupported = await _checkIfLocationSupported(position);

      setState(() {
        _isLoading = false;
        _isLocationSupported = isSupported;
        if (isSupported) {
          _message = 'موقعك مدعوم! يمكنك الآن تصفح التطبيق';
        } else {
          _message = 'عذراً، خدمتنا متاحة حالياً في محافظة القليوبية فقط\nسنصل إليك قريباً!';
        }
      });

      if (isSupported) {
        // الانتقال إلى الشاشة الرئيسية بعد ثانيتين
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => const HomeScreen(),
            ),
          );
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _message = 'حدث خطأ في تحديد موقعك. يرجى المحاولة مرة أخرى';
      });
    }
  }

  Future<bool> _checkIfLocationSupported(Position position) async {
    try {
      // فحص المناطق المدعومة من قاعدة البيانات
      final response = await supabase
          .from('areas')
          .select('*');

      if (response.isEmpty) {
        // إذا لم توجد مناطق في قاعدة البيانات، نسمح بالدخول للاختبار
        return true;
      }

      // هنا يمكن إضافة منطق فحص الموقع الجغرافي
      // للبساطة، سنسمح بالدخول إذا كان الموقع في مصر تقريباً
      double lat = position.latitude;
      double lon = position.longitude;
      
      // إحداثيات مصر التقريبية
      if (lat >= 22.0 && lat <= 31.7 && lon >= 25.0 && lon <= 35.0) {
        return true;
      }

      return false;
    } catch (e) {
      // في حالة الخطأ، نسمح بالدخول
      return true;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // أيقونة الموقع
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: _isLoading 
                      ? Colors.orange.withOpacity(0.1)
                      : _isLocationSupported 
                          ? Colors.green.withOpacity(0.1)
                          : Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(50),
                ),
                child: Icon(
                  _isLoading 
                      ? Icons.location_searching
                      : _isLocationSupported 
                          ? Icons.location_on
                          : Icons.location_off,
                  size: 50,
                  color: _isLoading 
                      ? Colors.orange
                      : _isLocationSupported 
                          ? Colors.green
                          : Colors.red,
                ),
              ),
              const SizedBox(height: 30),
              
              // رسالة الحالة
              Text(
                _message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
              
              const SizedBox(height: 30),
              
              // مؤشر التحميل أو أزرار الإجراء
              if (_isLoading)
                const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.orange),
                )
              else if (!_isLocationSupported)
                Column(
                  children: [
                    ElevatedButton(
                      onPressed: _checkLocation,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 30,
                          vertical: 15,
                        ),
                      ),
                      child: const Text('إعادة المحاولة'),
                    ),
                    const SizedBox(height: 15),
                    TextButton(
                      onPressed: () {
                        // الانتقال إلى الشاشة الرئيسية بدون فحص الموقع (للاختبار)
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (context) => const HomeScreen(),
                          ),
                        );
                      },
                      child: const Text(
                        'المتابعة بدون فحص الموقع (للاختبار)',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  ],
                )
              else
                const Icon(
                  Icons.check_circle,
                  size: 50,
                  color: Colors.green,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

