import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../services/favorites_service.dart';
import '../services/cart_service.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  List<List<CartItem>> _favoriteOrders = [];
  bool _isLoading = true;
  final CartService _cartService = CartService();

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final favorites = await FavoritesService.getFavoriteOrders();
      setState(() {
        _favoriteOrders = favorites;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('خطأ في تحميل المفضلة: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'الطلبات المفضلة',
          style: TextStyle(
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
          : _favoriteOrders.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.favorite_border,
                        size: 80,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'لا توجد طلبات مفضلة',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'احفظ طلباتك المفضلة لإعادة طلبها بسهولة',
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
                  onRefresh: _loadFavorites,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _favoriteOrders.length,
                    itemBuilder: (context, index) {
                      final order = _favoriteOrders[index];
                      return _buildFavoriteOrderCard(order, index);
                    },
                  ),
                ),
    );
  }

  Widget _buildFavoriteOrderCard(List<CartItem> order, int index) {
    final totalPrice = order.fold(0.0, (sum, item) => sum + item.totalPrice);
    final itemCount = order.fold(0, (sum, item) => sum + item.quantity);
    
    // الحصول على اسم الطلب من البيانات المحفوظة
    String orderName = 'طلب مفضل ${index + 1}';
    
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // رأس البطاقة
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFFFF6B35),
              borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.favorite,
                  color: Colors.white,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    orderName,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () => _removeFavorite(index),
                  icon: const Icon(
                    Icons.delete_outline,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          
          // تفاصيل الطلب
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ملخص الطلب
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        '$itemCount عنصر',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                    Text(
                      '${totalPrice.toStringAsFixed(2)} جنيه',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFFF6B35),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 12),
                
                // عناصر الطلب (أول 3 عناصر)
                ...order.take(3).map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(
                    children: [
                      Text(
                        '• ${item.productName}',
                        style: const TextStyle(fontSize: 14),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '(${item.sizeName})',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'x${item.quantity}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                )),
                
                // إظهار عدد العناصر الإضافية
                if (order.length > 3)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      'و ${order.length - 3} عناصر أخرى...',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                
                const SizedBox(height: 16),
                
                // أزرار الإجراء
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => _showOrderDetails(order),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFFFF6B35)),
                          foregroundColor: const Color(0xFFFF6B35),
                        ),
                        child: const Text('عرض التفاصيل'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => _reorderFavorite(order),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFF6B35),
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('إعادة الطلب'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showOrderDetails(List<CartItem> order) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تفاصيل الطلب'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: order.length,
            itemBuilder: (context, index) {
              final item = order[index];
              return ListTile(
                title: Text(item.productName),
                subtitle: Text('${item.sizeName} - ${item.price} جنيه'),
                trailing: Text('x${item.quantity}'),
              );
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إغلاق'),
          ),
        ],
      ),
    );
  }

  void _reorderFavorite(List<CartItem> order) {
    // إضافة جميع عناصر الطلب المفضل إلى السلة
    for (final item in order) {
      _cartService.addItem(item);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('تم إضافة الطلب المفضل إلى السلة'),
        backgroundColor: Colors.green,
      ),
    );

    // الانتقال إلى شاشة السلة
    Navigator.pushNamed(context, '/cart');
  }

  Future<void> _removeFavorite(int index) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف من المفضلة'),
        content: const Text('هل أنت متأكد من حذف هذا الطلب من المفضلة؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('حذف'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await FavoritesService.removeFavoriteOrder(index);
      _loadFavorites();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('تم حذف الطلب من المفضلة'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}

