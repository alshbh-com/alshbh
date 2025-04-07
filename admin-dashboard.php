<?php
session_start();

// التحقق من تسجيل الدخول
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: admin-login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - توصيل الفهد</title>
    <link rel="stylesheet" href="admin-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <aside class="sidebar">
            <h2>توصيل الفهد</h2>
            <nav>
                <ul>
                    <li class="active"><a href="admin-dashboard.php"><i class="fas fa-tachometer-alt"></i> لوحة التحكم</a></li>
                    <li><a href="#products"><i class="fas fa-box"></i> المنتجات</a></li>
                    <li><a href="#orders"><i class="fas fa-shopping-cart"></i> الطلبات</a></li>
                    <li><a href="index.html"><i class="fas fa-sign-out-alt"></i> العودة للمتجر</a></li>
                </ul>
            </nav>
        </aside>

        <main class="main-content">
            <header class="admin-header">
                <h1>لوحة التحكم</h1>
                <div class="admin-actions">
                    <span>مرحباً، الأدمن</span>
                    <a href="logout.php" class="logout-btn">تسجيل الخروج</a>
                </div>
            </header>

            <div class="dashboard-cards">
                <div class="card">
                    <h3>إجمالي الطلبات</h3>
                    <p id="total-orders">0</p>
                </div>
                <div class="card">
                    <h3>المنتجات</h3>
                    <p id="total-products">0</p>
                </div>
                <div class="card">
                    <h3>طلبات اليوم</h3>
                    <p id="today-orders">0</p>
                </div>
            </div>

            <section class="recent-orders">
                <h2>أحدث الطلبات</h2>
                <div class="orders-table" id="orders-table">
                    <!-- سيتم ملؤها بواسطة JavaScript -->
                </div>
            </section>
        </main>
    </div>

    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js"></script>
    <script src="firebase.js"></script>
    <script>
        // جلب إحصائيات المتجر
        db.collection('orders').get().then((querySnapshot) => {
            document.getElementById('total-orders').textContent = querySnapshot.size;
            
            const today = new Date().toISOString().split('T')[0];
            const todayOrders = Array.from(querySnapshot.docs).filter(doc => 
                doc.data().date.split('T')[0] === today
            ).length;
            document.getElementById('today-orders').textContent = todayOrders;
        });

        db.collection('products').get().then((querySnapshot) => {
            document.getElementById('total-products').textContent = querySnapshot.size;
        });

        // جلب أحدث الطلبات
        db.collection('orders').orderBy('date', 'desc').limit(5).get().then((querySnapshot) => {
            const ordersTable = document.getElementById('orders-table');
            
            querySnapshot.forEach((doc) => {
                const order = doc.data();
                ordersTable.innerHTML += `
                    <div class="order-row">
                        <div class="order-id">#${doc.id.substring(0, 6)}</div>
                        <div class="customer-name">${order.customerName}</div>
                        <div class="order-total">${order.total} ر.س</div>
                        <div class="order-status ${order.status === 'مكتمل' ? 'completed' : 'pending'}">${order.status}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                    </div>
                `;
            });
        });
    </script>
</body>
</html>