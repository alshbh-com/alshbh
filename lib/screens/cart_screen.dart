import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import '../models/cart_item.dart';
import '../services/cart_service.dart';
import '../services/favorites_service.dart';
import '../main.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final CartService _cartService = CartService();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();
  
  double _deliveryPrice = 0.0;
  bool _isLoadingDelivery = false;

  @override
  void initState() {
    super.initState();
    _loadDeliveryPrice();
  }

  Future<void> _loadDeliveryPrice() async {
    setState(() {
      _isLoadingDelivery = true;
    });

    try {
      // الحصول على الموقع الحالي
      Position position = await Geolocator.getCurrentPosition();
      
      // البحث عن سعر التوصيل للمنطقة الحالية
      final response = await supabase
          .from('areas')
          .select('delivery_price')
          .limit(1)
          .single();

      setState(() {
        _deliveryPrice = (response['delivery_price'] ?? 15.0).toDouble();
        _isLoadingDelivery = false;
      });
    } catch (e) {
      setState(() {
        _deliveryPrice = 15.0; // سعر افتراضي
        _isLoadingDelivery = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'السلة',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFFFF6B35),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: StreamBuilder<List<CartItem>>(
        stream: _cartService.cartItems,
        builder: (context, snapshot) {
          final items = snapshot.data ?? [];
          
          if (items.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.shopping_cart_outlined,
                    size: 80,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'السلة فارغة',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'أضف بعض المنتجات لتبدأ التسوق',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // عناصر السلة مجمعة حسب المتجر
                    ..._buildCartItemsByStore(items),
                    
                    const SizedBox(height: 20),
                    
                    // ملخص الطلب
                    _buildOrderSummary(items),
                    
                    const SizedBox(height: 20),
                    
                    // معلومات العميل
                    _buildCustomerInfo(),
                    
                    const SizedBox(height: 20),
                    
                    // ملاحظات
                    _buildNotesSection(),
                  ],
                ),
              ),
              
              // زر الطلب
              _buildCheckoutButton(items),
            ],
          );
        },
      ),
    );
  }

  List<Widget> _buildCartItemsByStore(List<CartItem> items) {
    final itemsByStore = _cartService.itemsByStore;
    final List<Widget> widgets = [];

    itemsByStore.forEach((storeId, storeItems) {
      final storeName = storeItems.first.storeName;
      
      widgets.add(
        Container(
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
              // اسم المتجر
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFFFF6B35),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                ),
                child: Text(
                  storeName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              
              // عناصر المتجر
              ...storeItems.map((item) => _buildCartItem(item)),
            ],
          ),
        ),
      );
    });

    return widgets;
  }

  Widget _buildCartItem(CartItem item) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  item.sizeName,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  '${item.price} جنيه',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFF6B35),
                  ),
                ),
              ],
            ),
          ),
          
          // أزرار التحكم في الكمية
          Row(
            children: [
              IconButton(
                onPressed: () {
                  _cartService.updateQuantity(item, item.quantity - 1);
                },
                icon: const Icon(Icons.remove_circle_outline),
                color: Colors.red,
              ),
              Text(
                '${item.quantity}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                onPressed: () {
                  _cartService.updateQuantity(item, item.quantity + 1);
                },
                icon: const Icon(Icons.add_circle_outline),
                color: Colors.green,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderSummary(List<CartItem> items) {
    final subtotal = _cartService.totalAmount;
    final total = subtotal + _deliveryPrice;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ملخص الطلب',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('المجموع الفرعي:'),
              Text('${subtotal.toStringAsFixed(2)} جنيه'),
            ],
          ),
          const SizedBox(height: 8),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('رسوم التوصيل:'),
              _isLoadingDelivery
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Text('${_deliveryPrice.toStringAsFixed(2)} جنيه'),
            ],
          ),
          const Divider(),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'الإجمالي:',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${total.toStringAsFixed(2)} جنيه',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFFF6B35),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCustomerInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
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
          const Text(
            'معلومات العميل',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'الاسم',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.person),
            ),
          ),
          const SizedBox(height: 16),
          
          TextField(
            controller: _phoneController,
            decoration: const InputDecoration(
              labelText: 'رقم الهاتف',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.phone),
            ),
            keyboardType: TextInputType.phone,
          ),
        ],
      ),
    );
  }

  Widget _buildNotesSection() {
    return Container(
      padding: const EdgeInsets.all(16),
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
          const Text(
            'ملاحظات إضافية',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          TextField(
            controller: _notesController,
            decoration: const InputDecoration(
              hintText: 'أضف أي ملاحظات خاصة بطلبك...',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.note),
            ),
            maxLines: 3,
          ),
        ],
      ),
    );
  }

  Widget _buildCheckoutButton(List<CartItem> items) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // زر حفظ في المفضلة
            if (items.isNotEmpty)
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => _saveFavorite(items),
                  icon: const Icon(Icons.favorite_border),
                  label: const Text('حفظ في المفضلة'),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFFF6B35)),
                    foregroundColor: const Color(0xFFFF6B35),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            
            if (items.isNotEmpty) const SizedBox(height: 12),
            
            // زر الطلب
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: items.isNotEmpty ? () => _checkout(items) : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF6B35),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'إرسال الطلب عبر واتساب',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _checkout(List<CartItem> items) async {
    // التحقق من المعلومات المطلوبة
    if (_nameController.text.trim().isEmpty) {
      _showErrorDialog('يرجى إدخال الاسم');
      return;
    }

    if (_phoneController.text.trim().isEmpty) {
      _showErrorDialog('يرجى إدخال رقم الهاتف');
      return;
    }

    try {
      // الحصول على الموقع الحالي
      Position position = await Geolocator.getCurrentPosition();
      
      // تجميع العناصر حسب المتجر وإرسال طلب منفصل لكل متجر
      final itemsByStore = _cartService.itemsByStore;
      
      for (final entry in itemsByStore.entries) {
        final storeItems = entry.value;
        final whatsappNumber = storeItems.first.storeWhatsapp;
        
        if (whatsappNumber != null) {
          await _sendWhatsAppMessage(storeItems, whatsappNumber, position);
        }
      }
      
      // مسح السلة بعد الإرسال
      _cartService.clearCart();
      
      // إظهار رسالة نجاح
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('تم إرسال طلبك بنجاح!'),
            backgroundColor: Colors.green,
          ),
        );
      }
      
    } catch (e) {
      _showErrorDialog('حدث خطأ أثناء إرسال الطلب: $e');
    }
  }

  Future<void> _sendWhatsAppMessage(List<CartItem> items, String whatsappNumber, Position position) async {
    final storeName = items.first.storeName;
    final subtotal = items.fold(0.0, (sum, item) => sum + item.totalPrice);
    final total = subtotal + _deliveryPrice;
    
    String message = '''
🛍️ *طلب جديد من تطبيق طلباتك*

👤 *معلومات العميل:*
الاسم: ${_nameController.text.trim()}
الهاتف: ${_phoneController.text.trim()}

🏪 *المتجر:* $storeName

📦 *تفاصيل الطلب:*
''';

    for (final item in items) {
      message += '''
• ${item.productName} (${item.sizeName})
  الكمية: ${item.quantity}
  السعر: ${item.price} جنيه
  الإجمالي: ${item.totalPrice} جنيه

''';
    }

    message += '''
💰 *ملخص الفاتورة:*
المجموع الفرعي: ${subtotal.toStringAsFixed(2)} جنيه
رسوم التوصيل: ${_deliveryPrice.toStringAsFixed(2)} جنيه
الإجمالي النهائي: ${total.toStringAsFixed(2)} جنيه

💳 *طريقة الدفع:* الدفع عند الاستلام

📍 *الموقع:*
https://maps.google.com/?q=${position.latitude},${position.longitude}
''';

    if (_notesController.text.trim().isNotEmpty) {
      message += '''

📝 *ملاحظات:*
${_notesController.text.trim()}
''';
    }

    message += '''

⏰ *وقت الطلب:* ${DateTime.now().toString().split('.')[0]}

شكراً لاختياركم تطبيق طلباتك! 🙏
''';

    final encodedMessage = Uri.encodeComponent(message);
    final whatsappUrl = 'https://wa.me/$whatsappNumber?text=$encodedMessage';
    
    if (await canLaunchUrl(Uri.parse(whatsappUrl))) {
      await launchUrl(Uri.parse(whatsappUrl), mode: LaunchMode.externalApplication);
    } else {
      throw 'لا يمكن فتح واتساب';
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('خطأ'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  Future<void> _saveFavorite(List<CartItem> items) async {
    final TextEditingController nameController = TextEditingController();
    
    final orderName = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حفظ في المفضلة'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('أدخل اسماً لهذا الطلب:'),
            const SizedBox(height: 16),
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                hintText: 'مثال: طلبي المفضل',
                border: OutlineInputBorder(),
              ),
              autofocus: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              if (nameController.text.trim().isNotEmpty) {
                Navigator.pop(context, nameController.text.trim());
              }
            },
            child: const Text('حفظ'),
          ),
        ],
      ),
    );

    if (orderName != null && orderName.isNotEmpty) {
      try {
        await FavoritesService.saveFavoriteOrder(items, orderName);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('تم حفظ الطلب في المفضلة'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          _showErrorDialog('خطأ في حفظ الطلب: $e');
        }
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}

