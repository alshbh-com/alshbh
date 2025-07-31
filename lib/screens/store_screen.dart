import 'package:flutter/material.dart';
import '../main.dart';
import '../models/cart_item.dart';
import '../services/cart_service.dart';

class StoreScreen extends StatefulWidget {
  final Map<String, dynamic> store;

  const StoreScreen({super.key, required this.store});

  @override
  State<StoreScreen> createState() => _StoreScreenState();
}

class _StoreScreenState extends State<StoreScreen> {
  List<dynamic> _products = [];
  bool _isLoading = true;
  final CartService _cartService = CartService();

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    try {
      final response = await supabase
          .from('products')
          .select('*, product_sizes(*)')
          .eq('sub_category_id', widget.store['id'])
          .order('name');

      setState(() {
        _products = response;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('خطأ في تحميل المنتجات: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.store['name'] ?? 'المتجر',
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFFFF6B35),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          StreamBuilder<List<CartItem>>(
            stream: _cartService.cartItems,
            builder: (context, snapshot) {
              final itemCount = snapshot.data?.length ?? 0;
              return Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.shopping_cart, color: Colors.white),
                    onPressed: () {
                      Navigator.pushNamed(context, '/cart');
                    },
                  ),
                  if (itemCount > 0)
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 16,
                          minHeight: 16,
                        ),
                        child: Text(
                          '$itemCount',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF6B35)),
              ),
            )
          : _products.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.inventory_2_outlined,
                        size: 80,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'لا توجد منتجات متاحة في هذا المتجر حالياً',
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
                  onRefresh: _loadProducts,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _products.length,
                    itemBuilder: (context, index) {
                      final product = _products[index];
                      return _buildProductCard(product);
                    },
                  ),
                ),
    );
  }

  Widget _buildProductCard(Map<String, dynamic> product) {
    final List<dynamic> sizes = product['product_sizes'] ?? [];
    
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
          // صورة المنتج
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: Container(
              width: double.infinity,
              height: 200,
              color: Colors.grey[100],
              child: product['image_url'] != null
                  ? Image.network(
                      product['image_url'],
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(
                          Icons.fastfood,
                          size: 50,
                          color: Colors.grey,
                        );
                      },
                    )
                  : const Icon(
                      Icons.fastfood,
                      size: 50,
                      color: Colors.grey,
                    ),
            ),
          ),
          
          // معلومات المنتج
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product['name'] ?? 'منتج',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (product['description'] != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    product['description'],
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
                const SizedBox(height: 16),
                
                // الأحجام والأسعار
                if (sizes.isNotEmpty) ...[
                  const Text(
                    'الأحجام المتاحة:',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...sizes.map((size) => _buildSizeOption(product, size)),
                ] else
                  const Text(
                    'لا توجد أحجام متاحة لهذا المنتج',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSizeOption(Map<String, dynamic> product, Map<String, dynamic> size) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  size['size'] ?? 'حجم',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  '${size['price']} جنيه',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFF6B35),
                  ),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () => _addToCart(product, size),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFF6B35),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('إضافة للسلة'),
          ),
        ],
      ),
    );
  }

  void _addToCart(Map<String, dynamic> product, Map<String, dynamic> size) {
    final cartItem = CartItem(
      productId: product['id'],
      productName: product['name'] ?? 'منتج',
      productSizeId: size['id'],
      sizeName: size['size'] ?? 'حجم',
      price: (size['price'] ?? 0).toDouble(),
      quantity: 1,
      storeId: widget.store['id'],
      storeName: widget.store['name'] ?? 'متجر',
      storeWhatsapp: widget.store['whatsapp_number'],
    );

    _cartService.addItem(cartItem);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('تم إضافة ${product['name']} إلى السلة'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      ),
    );
  }
}

