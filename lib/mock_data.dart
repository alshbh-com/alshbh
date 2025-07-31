import 'package:flutter/material.dart';

// Mock Categories
class MockCategory {
  final String id;
  final String name;
  final String imageUrl;

  MockCategory({required this.id, required this.name, required this.imageUrl});
}

List<MockCategory> mockCategories = [
  MockCategory(id: '1', name: 'مطاعم', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=مطاعم'),
  MockCategory(id: '2', name: 'بقالة', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=بقالة'),
  MockCategory(id: '3', name: 'صيدليات', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=صيدليات'),
  MockCategory(id: '4', name: 'حلويات', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=حلويات'),
  MockCategory(id: '5', name: 'مشروبات', imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=مشروبات'),
];

// Mock Stores
class MockStore {
  final String id;
  final String name;
  final String imageUrl;
  final String categoryId;
  final String description;
  final double rating;
  final String deliveryTime;
  final String deliveryFee;

  MockStore({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.categoryId,
    required this.description,
    required this.rating,
    required this.deliveryTime,
    required this.deliveryFee,
  });
}

List<MockStore> mockStores = [
  MockStore(
    id: 's1',
    name: 'مطعم الفلاح',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=الفلاح',
    categoryId: '1',
    description: 'أشهى المأكولات الشرقية والغربية',
    rating: 4.5,
    deliveryTime: '30-45 دقيقة',
    deliveryFee: '10 جنيهات',
  ),
  MockStore(
    id: 's2',
    name: 'سوبر ماركت النور',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=النور',
    categoryId: '2',
    description: 'كل ما تحتاجه لمنزلك',
    rating: 4.2,
    deliveryTime: '20-30 دقيقة',
    deliveryFee: '5 جنيهات',
  ),
  MockStore(
    id: 's3',
    name: 'صيدلية العزبي',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=العزبي',
    categoryId: '3',
    description: 'خدمة 24 ساعة',
    rating: 4.8,
    deliveryTime: '15-25 دقيقة',
    deliveryFee: '7 جنيهات',
  ),
  MockStore(
    id: 's4',
    name: 'حلواني العبد',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=العبد',
    categoryId: '4',
    description: 'أفضل الحلويات الشرقية والغربية',
    rating: 4.7,
    deliveryTime: '30-40 دقيقة',
    deliveryFee: '12 جنيهات',
  ),
];

// Mock Products
class MockProduct {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final double price;
  final String storeId;
  final List<String> sizes;

  MockProduct({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.price,
    required this.storeId,
    this.sizes = const [],
  });
}

List<MockProduct> mockProducts = [
  MockProduct(
    id: 'p1',
    name: 'وجبة دجاج مشوي',
    description: 'نصف دجاجة مشوية مع أرز وسلطة',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=دجاج',
    price: 85.0,
    storeId: 's1',
    sizes: ['صغير', 'متوسط', 'كبير'],
  ),
  MockProduct(
    id: 'p2',
    name: 'بيتزا مارجريتا',
    description: 'بيتزا كلاسيكية بصلصة الطماطم والجبنة',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=بيتزا',
    price: 70.0,
    storeId: 's1',
    sizes: ['صغير', 'متوسط', 'كبير'],
  ),
  MockProduct(
    id: 'p3',
    name: 'أرز بسمتي 1 كجم',
    description: 'أرز بسمتي عالي الجودة',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=أرز',
    price: 30.0,
    storeId: 's2',
  ),
  MockProduct(
    id: 'p4',
    name: 'شوكولاتة كادبوري',
    description: 'شوكولاتة بالحليب 100 جرام',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=شوكولاتة',
    price: 15.0,
    storeId: 's2',
  ),
  MockProduct(
    id: 'p5',
    name: 'مسكن آلام',
    description: 'عبوة 20 قرص',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=مسكن',
    price: 25.0,
    storeId: 's3',
  ),
  MockProduct(
    id: 'p6',
    name: 'كنافة بالمانجو',
    description: 'قطعة كنافة بالمانجو الطازجة',
    imageUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=كنافة',
    price: 40.0,
    storeId: 's4',
  ),
];

// Mock Offers (for home screen)
class MockOffer {
  final String id;
  final String title;
  final String imageUrl;
  final String description;

  MockOffer({required this.id, required this.title, required this.imageUrl, required this.description});
}

List<MockOffer> mockOffers = [
  MockOffer(
    id: 'o1',
    title: 'خصم 20% على أول طلب',
    imageUrl: 'https://via.placeholder.com/300/FF6B35/FFFFFF?text=عرض+1',
    description: 'استمتع بخصم 20% على طلبك الأول من أي مطعم.',
  ),
  MockOffer(
    id: 'o2',
    title: 'توصيل مجاني من السوبر ماركت',
    imageUrl: 'https://via.placeholder.com/300/FF6B35/FFFFFF?text=عرض+2',
    description: 'توصيل مجاني لجميع طلبات البقالة فوق 100 جنيه.',
  ),
  MockOffer(
    id: 'o3',
    title: 'اشترِ واحدة واحصل على الثانية مجانًا',
    imageUrl: 'https://via.placeholder.com/300/FF6B35/FFFFFF?text=عرض+3',
    description: 'عرض خاص على بعض منتجات الحلويات.',
  ),
];


