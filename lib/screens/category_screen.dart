import 'package:flutter/material.dart';
import '../main.dart';
import 'store_screen.dart';

class CategoryScreen extends StatefulWidget {
  final Map<String, dynamic> category;

  const CategoryScreen({super.key, required this.category});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  List<dynamic> _stores = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStores();
  }

  Future<void> _loadStores() async {
    try {
      final response = await supabase
          .from('sub_categories_stores')
          .select('*')
          .eq('main_category_id', widget.category['id'])
          .order('name');

      setState(() {
        _stores = response;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('خطأ في تحميل المتاجر: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.category['name'] ?? 'الفئة',
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFFFF6B35),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF6B35)),
              ),
            )
          : _stores.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.store_mall_directory_outlined,
                        size: 80,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'لا توجد متاجر متاحة في هذه الفئة حالياً',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadStores,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _stores.length,
                    itemBuilder: (context, index) {
                      final store = _stores[index];
                      return _buildStoreCard(store);
                    },
                  ),
                ),
    );
  }

  Widget _buildStoreCard(Map<String, dynamic> store) {
    final bool isOpen = _isStoreOpen(store);
    final String status = store['status'] ?? 'open';
    final bool isAvailable = status == 'open' && isOpen;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: isAvailable
              ? () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => StoreScreen(store: store),
                    ),
                  );
                }
              : null,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // أيقونة المتجر
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: isAvailable
                        ? const Color(0xFFFF6B35).withOpacity(0.1)
                        : Colors.grey.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Icon(
                    Icons.store,
                    size: 30,
                    color: isAvailable
                        ? const Color(0xFFFF6B35)
                        : Colors.grey,
                  ),
                ),
                const SizedBox(width: 16),
                
                // معلومات المتجر
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        store['name'] ?? 'متجر',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: isAvailable ? Colors.black : Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 4),
                      
                      // حالة المتجر
                      Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: isAvailable ? Colors.green : Colors.red,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _getStoreStatusText(store, isOpen),
                            style: TextStyle(
                              fontSize: 14,
                              color: isAvailable ? Colors.green : Colors.red,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      
                      // أوقات العمل
                      if (store['opening_time'] != null && store['closing_time'] != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            'من ${store['opening_time']} إلى ${store['closing_time']}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                
                // سهم الانتقال
                Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: isAvailable ? Colors.grey : Colors.grey[300],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  bool _isStoreOpen(Map<String, dynamic> store) {
    final String? openingTime = store['opening_time'];
    final String? closingTime = store['closing_time'];
    
    if (openingTime == null || closingTime == null) {
      return true; // إذا لم تكن أوقات العمل محددة، نعتبر المتجر مفتوح
    }

    try {
      final now = DateTime.now();
      final currentTime = TimeOfDay.fromDateTime(now);
      
      final opening = _parseTimeOfDay(openingTime);
      final closing = _parseTimeOfDay(closingTime);
      
      final currentMinutes = currentTime.hour * 60 + currentTime.minute;
      final openingMinutes = opening.hour * 60 + opening.minute;
      final closingMinutes = closing.hour * 60 + closing.minute;
      
      if (closingMinutes > openingMinutes) {
        // نفس اليوم
        return currentMinutes >= openingMinutes && currentMinutes <= closingMinutes;
      } else {
        // يمتد إلى اليوم التالي
        return currentMinutes >= openingMinutes || currentMinutes <= closingMinutes;
      }
    } catch (e) {
      return true; // في حالة الخطأ، نعتبر المتجر مفتوح
    }
  }

  TimeOfDay _parseTimeOfDay(String timeString) {
    final parts = timeString.split(':');
    return TimeOfDay(
      hour: int.parse(parts[0]),
      minute: int.parse(parts[1]),
    );
  }

  String _getStoreStatusText(Map<String, dynamic> store, bool isOpen) {
    final String status = store['status'] ?? 'open';
    
    if (status == 'closed') {
      return 'مغلق مؤقتاً';
    } else if (!isOpen) {
      return 'مغلق الآن';
    } else {
      return 'مفتوح الآن';
    }
  }
}

