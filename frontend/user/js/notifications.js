// نظام الإشعارات الأساسي
// هذا الملف يحتوي على وظائف إدارة الإشعارات للمستخدمين

// استدعاء Firebase
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // المستخدم مسجل الدخول
            console.log("المستخدم مسجل الدخول:", user.uid);
            setupNotifications(user);
        }
    });
});

// إعداد نظام الإشعارات
function setupNotifications(user) {
    // الاشتراك في الإشعارات
    subscribeToNotifications(user.uid);
    
    // عرض الإشعارات غير المقروءة
    displayUnreadNotifications(user.uid);
    
    // إعداد زر الإشعارات
    setupNotificationButton();
}

// الاشتراك في الإشعارات
function subscribeToNotifications(userId) {
    // الاستماع للتغييرات في مجموعة الإشعارات الخاصة بالمستخدم
    firebase.firestore().collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            // التحقق من وجود إشعارات جديدة
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const notification = change.doc.data();
                    
                    // إذا كان الإشعار جديدًا، عرضه
                    if (!notification.read) {
                        showNotificationToast(notification);
                    }
                }
            });
            
            // تحديث عدد الإشعارات غير المقروءة
            updateUnreadCount(userId);
        });
}

// عرض الإشعارات غير المقروءة
function displayUnreadNotifications(userId) {
    // الحصول على الإشعارات غير المقروءة
    firebase.firestore().collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            // تحديث عدد الإشعارات غير المقروءة
            updateUnreadCount(userId, querySnapshot.size);
        })
        .catch((error) => {
            console.error("خطأ في الحصول على الإشعارات غير المقروءة:", error);
        });
}

// تحديث عدد الإشعارات غير المقروءة
function updateUnreadCount(userId, count) {
    // إذا لم يتم تمرير العدد، احسبه من قاعدة البيانات
    if (count === undefined) {
        firebase.firestore().collection('notifications')
            .where('userId', '==', userId)
            .where('read', '==', false)
            .get()
            .then((querySnapshot) => {
                updateNotificationBadge(querySnapshot.size);
            })
            .catch((error) => {
                console.error("خطأ في حساب عدد الإشعارات غير المقروءة:", error);
            });
    } else {
        // استخدام العدد المحدد
        updateNotificationBadge(count);
    }
}

// تحديث شارة الإشعارات
function updateNotificationBadge(count) {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// إعداد زر الإشعارات
function setupNotificationButton() {
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // فتح قائمة الإشعارات
            toggleNotificationMenu();
        });
    }
}

// تبديل قائمة الإشعارات
function toggleNotificationMenu() {
    const notificationMenu = document.getElementById('notification-menu');
    if (notificationMenu) {
        // تبديل حالة العرض
        if (notificationMenu.style.display === 'block') {
            notificationMenu.style.display = 'none';
        } else {
            // قبل العرض، قم بتحديث قائمة الإشعارات
            updateNotificationList();
            notificationMenu.style.display = 'block';
        }
    }
}

// تحديث قائمة الإشعارات
function updateNotificationList() {
    const notificationList = document.getElementById('notification-list');
    if (!notificationList) return;
    
    // الحصول على المستخدم الحالي
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    // إضافة مؤشر التحميل
    notificationList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    
    // الحصول على الإشعارات
    firebase.firestore().collection('notifications')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(10) // الحد الأقصى للإشعارات المعروضة
        .get()
        .then((querySnapshot) => {
            // إزالة مؤشر التحميل
            notificationList.innerHTML = '';
            
            if (querySnapshot.empty) {
                // لا توجد إشعارات
                notificationList.innerHTML = '<div class="no-notifications">لا توجد إشعارات</div>';
                return;
            }
            
            // عرض الإشعارات
            querySnapshot.forEach((doc) => {
                const notification = doc.data();
                const notificationElement = createNotificationElement(doc.id, notification);
                notificationList.appendChild(notificationElement);
                
                // تحديث حالة القراءة
                if (!notification.read) {
                    markNotificationAsRead(doc.id);
                }
            });
            
            // تحديث عدد الإشعارات غير المقروءة
            updateUnreadCount(user.uid, 0);
        })
        .catch((error) => {
            console.error("خطأ في الحصول على الإشعارات:", error);
            notificationList.innerHTML = '<div class="error-message">حدث خطأ أثناء تحميل الإشعارات</div>';
        });
}

// إنشاء عنصر الإشعار
function createNotificationElement(id, notification) {
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification-item';
    if (!notification.read) {
        notificationElement.classList.add('unread');
    }
    
    // تنسيق التاريخ
    const notificationDate = notification.createdAt ? new Date(notification.createdAt.toDate()) : new Date();
    const formattedDate = formatDate(notificationDate);
    
    // تحديد أيقونة الإشعار بناءً على النوع
    let icon = '';
    switch (notification.type) {
        case 'booking_confirmation':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'booking_cancellation':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'review_approved':
            icon = '<i class="fas fa-star"></i>';
            break;
        case 'payment_confirmation':
            icon = '<i class="fas fa-credit-card"></i>';
            break;
        case 'system':
            icon = '<i class="fas fa-bell"></i>';
            break;
        default:
            icon = '<i class="fas fa-bell"></i>';
    }
    
    // إنشاء HTML للإشعار
    notificationElement.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-date">${formattedDate}</div>
        </div>
    `;
    
    // إضافة مستمع الحدث للنقر على الإشعار
    notificationElement.addEventListener('click', function() {
        // تنفيذ الإجراء المرتبط بالإشعار
        handleNotificationClick(notification);
    });
    
    return notificationElement;
}

// التعامل مع النقر على الإشعار
function handleNotificationClick(notification) {
    // تنفيذ الإجراء المرتبط بالإشعار بناءً على النوع والبيانات
    if (notification.data && notification.data.url) {
        // إذا كان الإشعار يحتوي على رابط، انتقل إليه
        window.location.href = notification.data.url;
    } else if (notification.type === 'booking_confirmation' && notification.data && notification.data.bookingId) {
        // إذا كان الإشعار تأكيد حجز، انتقل إلى صفحة تفاصيل الحجز
        window.location.href = `bookings.html?id=${notification.data.bookingId}`;
    }
    
    // إغلاق قائمة الإشعارات
    const notificationMenu = document.getElementById('notification-menu');
    if (notificationMenu) {
        notificationMenu.style.display = 'none';
    }
}

// تحديد الإشعار كمقروء
function markNotificationAsRead(notificationId) {
    firebase.firestore().collection('notifications')
        .doc(notificationId)
        .update({
            read: true,
            readAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch((error) => {
            console.error("خطأ في تحديث حالة قراءة الإشعار:", error);
        });
}

// عرض إشعار منبثق
function showNotificationToast(notification) {
    // التحقق من دعم الإشعارات في المتصفح
    if (!("Notification" in window)) {
        console.log("هذا المتصفح لا يدعم إشعارات سطح المكتب");
        return;
    }
    
    // التحقق من إذن الإشعارات
    if (Notification.permission === "granted") {
        // إنشاء إشعار
        createBrowserNotification(notification);
    } else if (Notification.permission !== "denied") {
        // طلب الإذن
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                createBrowserNotification(notification);
            }
        });
    }
    
    // إنشاء إشعار داخل الصفحة
    createToastNotification(notification);
}

// إنشاء إشعار المتصفح
function createBrowserNotification(notification) {
    const title = notification.title || 'محجوز';
    const options = {
        body: notification.message,
        icon: '/images/logo-placeholder.png'
    };
    
    const browserNotification = new Notification(title, options);
    
    browserNotification.onclick = function() {
        // تنفيذ الإجراء المرتبط بالإشعار
        handleNotificationClick(notification);
        
        // إغلاق الإشعار
        browserNotification.close();
    };
}

// إنشاء إشعار منبثق داخل الصفحة
function createToastNotification(notification) {
    // التحقق من وجود حاوية الإشعارات المنبثقة
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        // إنشاء حاوية الإشعارات المنبثقة
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // إنشاء الإشعار المنبثق
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // تحديد أيقونة الإشعار بناءً على النوع
    let icon = '';
    switch (notification.type) {
        case 'booking_confirmation':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'booking_cancellation':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'review_approved':
            icon = '<i class="fas fa-star"></i>';
            break;
        case 'payment_confirmation':
            icon = '<i class="fas fa-credit-card"></i>';
            break;
        case 'system':
            icon = '<i class="fas fa-bell"></i>';
            break;
        default:
            icon = '<i class="fas fa-bell"></i>';
    }
    
    // إنشاء HTML للإشعار المنبثق
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${notification.title}</div>
            <div class="toast-message">${notification.message}</div>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // إضافة الإشعار المنبثق إلى الحاوية
    toastContainer.appendChild(toast);
    
    // إضافة مستمع الحدث للنقر على الإشعار
    toast.addEventListener('click', function(e) {
        // تجاهل النقر على زر الإغلاق
        if (e.target.closest('.toast-close')) {
            return;
        }
        
        // تنفيذ الإجراء المرتبط بالإشعار
        handleNotificationClick(notification);
        
        // إزالة الإشعار المنبثق
        toast.remove();
    });
    
    // إضافة مستمع الحدث لزر الإغلاق
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // إزالة الإشعار المنبثق
            toast.remove();
        });
    }
    
    // إزالة الإشعار المنبثق بعد 5 ثوانٍ
    setTimeout(function() {
        toast.classList.add('toast-hide');
        
        // إزالة الإشعار المنبثق بعد انتهاء التأثير
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 5000);
}

// تنسيق التاريخ
function formatDate(date) {
    // الحصول على الفرق بالدقائق
    const diffMinutes = Math.floor((new Date() - date) / (1000 * 60));
    
    if (diffMinutes < 1) {
        return 'الآن';
    } else if (diffMinutes < 60) {
        return `منذ ${diffMinutes} دقيقة`;
    } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `منذ ${hours} ساعة`;
    } else if (diffMinutes < 10080) {
        const days = Math.floor(diffMinutes / 1440);
        return `منذ ${days} يوم`;
    } else {
        // تنسيق التاريخ
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// إنشاء إشعار جديد (للاختبار)
function createTestNotification() {
    // الحصول على المستخدم الحالي
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    // إنشاء إشعار جديد
    const notification = {
        userId: user.uid,
        type: 'booking_confirmation',
        title: 'تأكيد الحجز',
        message: 'تم تأكيد حجزك في فندق القصر بنجاح.',
        data: {
            bookingId: 'BK12345678',
            hotelId: '1',
            hotelName: 'فندق القصر'
        },
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // إضافة الإشعار إلى قاعدة البيانات
    firebase.firestore().collection('notifications')
        .add(notification)
        .then((docRef) => {
            console.log("تم إنشاء إشعار جديد:", docRef.id);
        })
        .catch((error) => {
            console.error("خطأ في إنشاء الإشعار:", error);
        });
}

// إنشاء إشعار تأكيد الحجز
function createBookingConfirmationNotification(userId, bookingId, hotelId, hotelName) {
    // إنشاء إشعار جديد
    const notification = {
        userId: userId,
        type: 'booking_confirmation',
        title: 'تأكيد الحجز',
        message: `تم تأكيد حجزك في ${hotelName} بنجاح.`,
        data: {
            bookingId: bookingId,
            hotelId: hotelId,
            hotelName: hotelName,
            url: `bookings.html?id=${bookingId}`
        },
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // إضافة الإشعار إلى قاعدة البيانات
    return firebase.firestore().collection('notifications')
        .add(notification);
}

// تصدير الوظائف للاستخدام في ملفات أخرى
window.notifications = {
    createBookingConfirmationNotification,
    createTestNotification
};
