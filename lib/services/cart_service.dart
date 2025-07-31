import 'dart:async';
import '../models/cart_item.dart';

class CartService {
  static final CartService _instance = CartService._internal();
  factory CartService() => _instance;
  CartService._internal();

  final List<CartItem> _items = [];
  final StreamController<List<CartItem>> _cartController = StreamController<List<CartItem>>.broadcast();

  Stream<List<CartItem>> get cartItems => _cartController.stream;
  List<CartItem> get items => List.unmodifiable(_items);

  void addItem(CartItem item) {
    // البحث عن عنصر مشابه في السلة
    final existingIndex = _items.indexWhere(
      (existingItem) => existingItem.productId == item.productId && 
                       existingItem.productSizeId == item.productSizeId,
    );

    if (existingIndex >= 0) {
      // إذا وُجد العنصر، زيادة الكمية
      _items[existingIndex].quantity += item.quantity;
    } else {
      // إذا لم يوجد، إضافة عنصر جديد
      _items.add(item);
    }

    _cartController.add(List.from(_items));
  }

  void removeItem(CartItem item) {
    _items.removeWhere(
      (existingItem) => existingItem.productId == item.productId && 
                       existingItem.productSizeId == item.productSizeId,
    );
    _cartController.add(List.from(_items));
  }

  void updateQuantity(CartItem item, int newQuantity) {
    if (newQuantity <= 0) {
      removeItem(item);
      return;
    }

    final existingIndex = _items.indexWhere(
      (existingItem) => existingItem.productId == item.productId && 
                       existingItem.productSizeId == item.productSizeId,
    );

    if (existingIndex >= 0) {
      _items[existingIndex].quantity = newQuantity;
      _cartController.add(List.from(_items));
    }
  }

  void clearCart() {
    _items.clear();
    _cartController.add(List.from(_items));
  }

  double get totalAmount {
    return _items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  int get totalItems {
    return _items.fold(0, (sum, item) => sum + item.quantity);
  }

  // تجميع العناصر حسب المتجر
  Map<String, List<CartItem>> get itemsByStore {
    final Map<String, List<CartItem>> grouped = {};
    
    for (final item in _items) {
      if (!grouped.containsKey(item.storeId)) {
        grouped[item.storeId] = [];
      }
      grouped[item.storeId]!.add(item);
    }
    
    return grouped;
  }

  void dispose() {
    _cartController.close();
  }
}

