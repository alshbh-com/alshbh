<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $notes = $_POST['notes'] ?? '';
    $payment_method = $_POST['payment_method'] ?? '';
    $cart = json_decode($_POST['cart'], true) ?? [];
    
    // بناء رسالة الواتساب
    $message = "طلب جديد من $name\n";
    $message .= "رقم الهاتف: $phone\n";
    $message .= "العنوان: $address\n\n";
    $message .= "الطلبات:\n";
    
    $total = 0;
    foreach ($cart as $item) {
        $message .= "{$item['name']} - {$item['quantity']} x {$item['price']} ر.س\n";
        $total += $item['price'] * $item['quantity'];
    }
    
    $message .= "\nالمجموع: $total ر.س\n";
    $message .= "طريقة الدفع: $payment_method";
    
    // ترميز الرسالة للرابط
    $encoded_message = urlencode($message);
    
    // إعادة توجيه إلى واتساب
    header("Location: https://wa.me/{$whatsapp_number}?text={$encoded_message}");
    exit;
} else {
    header("Location: checkout.html");
    exit;
}
?>