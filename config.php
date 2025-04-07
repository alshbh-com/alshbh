<?php
// إعدادات الاتصال بقاعدة البيانات (إذا كنت تستخدم MySQL مع PHP)
$db_host = 'localhost';
$db_name = 'fahd_delivery';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// إعدادات أخرى
$site_name = "توصيل الفهد";
$whatsapp_number = "201024713976";
?>