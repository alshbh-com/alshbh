class CartItem {
  final String productId;
  final String productName;
  final String productSizeId;
  final String sizeName;
  final double price;
  int quantity;
  final String storeId;
  final String storeName;
  final String? storeWhatsapp;

  CartItem({
    required this.productId,
    required this.productName,
    required this.productSizeId,
    required this.sizeName,
    required this.price,
    required this.quantity,
    required this.storeId,
    required this.storeName,
    this.storeWhatsapp,
  });

  double get totalPrice => price * quantity;

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'productName': productName,
      'productSizeId': productSizeId,
      'sizeName': sizeName,
      'price': price,
      'quantity': quantity,
      'storeId': storeId,
      'storeName': storeName,
      'storeWhatsapp': storeWhatsapp,
    };
  }

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      productId: json['productId'],
      productName: json['productName'],
      productSizeId: json['productSizeId'],
      sizeName: json['sizeName'],
      price: json['price'].toDouble(),
      quantity: json['quantity'],
      storeId: json['storeId'],
      storeName: json['storeName'],
      storeWhatsapp: json['storeWhatsapp'],
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is CartItem &&
        other.productId == productId &&
        other.productSizeId == productSizeId;
  }

  @override
  int get hashCode => productId.hashCode ^ productSizeId.hashCode;
}

