import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/cart_item.dart';

class FavoritesService {
  static const String _favoritesKey = 'favorite_orders';
  
  static Future<List<List<CartItem>>> getFavoriteOrders() async {
    final prefs = await SharedPreferences.getInstance();
    final favoritesJson = prefs.getStringList(_favoritesKey) ?? [];
    
    return favoritesJson.map((orderJson) {
      final List<dynamic> orderData = json.decode(orderJson);
      return orderData.map((itemData) => CartItem.fromJson(itemData)).toList();
    }).toList();
  }
  
  static Future<void> saveFavoriteOrder(List<CartItem> order, String orderName) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await getFavoriteOrders();
    
    // إضافة اسم الطلب كملاحظة في أول عنصر
    if (order.isNotEmpty) {
      final orderWithName = order.map((item) => {
        ...item.toJson(),
        'orderName': orderName,
      }).toList();
      
      final orderJson = json.encode(orderWithName);
      final favoritesJson = prefs.getStringList(_favoritesKey) ?? [];
      favoritesJson.add(orderJson);
      
      await prefs.setStringList(_favoritesKey, favoritesJson);
    }
  }
  
  static Future<void> removeFavoriteOrder(int index) async {
    final prefs = await SharedPreferences.getInstance();
    final favoritesJson = prefs.getStringList(_favoritesKey) ?? [];
    
    if (index >= 0 && index < favoritesJson.length) {
      favoritesJson.removeAt(index);
      await prefs.setStringList(_favoritesKey, favoritesJson);
    }
  }
  
  static Future<String> getFavoriteOrderName(List<CartItem> order) async {
    final prefs = await SharedPreferences.getInstance();
    final favoritesJson = prefs.getStringList(_favoritesKey) ?? [];
    
    for (final orderJson in favoritesJson) {
      final List<dynamic> orderData = json.decode(orderJson);
      if (orderData.isNotEmpty && orderData[0]['orderName'] != null) {
        final savedOrder = orderData.map((itemData) => CartItem.fromJson(itemData)).toList();
        if (_areOrdersEqual(order, savedOrder)) {
          return orderData[0]['orderName'];
        }
      }
    }
    
    return '';
  }
  
  static bool _areOrdersEqual(List<CartItem> order1, List<CartItem> order2) {
    if (order1.length != order2.length) return false;
    
    for (int i = 0; i < order1.length; i++) {
      if (order1[i].productId != order2[i].productId ||
          order1[i].productSizeId != order2[i].productSizeId ||
          order1[i].quantity != order2[i].quantity) {
        return false;
      }
    }
    
    return true;
  }
}

