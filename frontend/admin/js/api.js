// وظائف الاتصال بالواجهة الخلفية (API) للوحة التحكم الإدارية

// الرابط الأساسي للواجهة الخلفية
const API_BASE_URL = 'http://localhost:3000/api'; // يمكن تغييره للإنتاج

// الحصول على توكن المصادقة للطلبات
function getAuthToken() {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        if (user) {
            user.getIdToken()
                .then(token => resolve(token))
                .catch(error => {
                    console.error('خطأ في الحصول على توكن المصادقة:', error);
                    reject(error);
                });
        } else {
            reject(new Error('المستخدم غير مسجل الدخول'));
        }
    });
}

// دالة مساعدة لإرسال طلبات HTTP
async function fetchAPI(endpoint, method = 'GET', data = null) {
    try {
        // الحصول على توكن المصادقة
        const token = await getAuthToken();
        
        // إعداد خيارات الطلب
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        // إضافة البيانات للطلبات POST و PUT
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        // إرسال الطلب
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // التحقق من حالة الاستجابة
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `خطأ في الطلب: ${response.status}`);
        }
        
        // إرجاع البيانات
        return await response.json();
        
    } catch (error) {
        console.error(`خطأ في طلب ${endpoint}:`, error);
        throw error;
    }
}

// ===== وظائف API الفنادق =====

// الحصول على جميع الفنادق
async function fetchHotels() {
    return await fetchAPI('/hotels');
}

// الحصول على فندق محدد
async function fetchHotelById(hotelId) {
    return await fetchAPI(`/hotels/${hotelId}`);
}

// إضافة فندق جديد
async function createHotel(hotelData) {
    return await fetchAPI('/hotels', 'POST', hotelData);
}

// تحديث فندق
async function updateHotel(hotelId, hotelData) {
    return await fetchAPI(`/hotels/${hotelId}`, 'PUT', hotelData);
}

// حذف فندق
async function deleteHotel(hotelId) {
    return await fetchAPI(`/hotels/${hotelId}`, 'DELETE');
}

// الحصول على غرف فندق محدد
async function fetchHotelRooms(hotelId) {
    return await fetchAPI(`/hotels/${hotelId}/rooms`);
}

// إضافة غرفة لفندق
async function addHotelRoom(hotelId, roomData) {
    return await fetchAPI(`/hotels/${hotelId}/rooms`, 'POST', roomData);
}

// ===== وظائف API الحجوزات =====

// الحصول على جميع الحجوزات
async function fetchAllBookings() {
    return await fetchAPI('/bookings');
}

// الحصول على حجز محدد
async function fetchBookingById(bookingId) {
    return await fetchAPI(`/bookings/${bookingId}`);
}

// ===== وظائف API المستخدمين =====

// الحصول على جميع المستخدمين
async function fetchUsers() {
    return await fetchAPI('/users');
}

// الحصول على مستخدم محدد
async function fetchUserById(userId) {
    return await fetchAPI(`/users/${userId}`);
}

// تحديث دور مستخدم
async function updateUserRole(userId, role) {
    return await fetchAPI(`/users/${userId}/role`, 'PUT', { role });
}

// ===== وظائف API المراجعات =====

// الحصول على جميع المراجعات
async function fetchAllReviews() {
    return await fetchAPI('/reviews');
}

// الموافقة على مراجعة
async function approveReview(reviewId) {
    return await fetchAPI(`/reviews/${reviewId}/approve`, 'PUT');
}

// حذف مراجعة
async function deleteReview(reviewId) {
    return await fetchAPI(`/reviews/${reviewId}`, 'DELETE');
}

// ===== وظائف API الإعدادات =====

// الحصول على إعدادات التطبيق
async function fetchAppSettings() {
    return await fetchAPI('/settings');
}

// تحديث إعدادات التطبيق
async function updateAppSettings(settingsData) {
    return await fetchAPI('/settings', 'PUT', settingsData);
}

// ===== وظائف API لوحة القيادة =====

// الحصول على إحصائيات لوحة القيادة
async function fetchDashboardStats() {
    // هذه وظيفة وهمية، يمكن إنشاء نقطة نهاية خاصة بالإحصائيات
    // أو تجميع البيانات من عدة طلبات
    
    try {
        // الحصول على عدد الفنادق
        const hotels = await fetchHotels();
        const hotelsCount = hotels.length;
        
        // الحصول على عدد الحجوزات
        const bookings = await fetchAllBookings();
        const bookingsCount = bookings.length;
        
        // الحصول على عدد المستخدمين
        const users = await fetchUsers();
        const usersCount = users.length;
        
        // الحصول على عدد المراجعات
        const reviews = await fetchAllReviews();
        const reviewsCount = reviews.length;
        const pendingReviewsCount = reviews.filter(review => !review.approved).length;
        
        // إرجاع الإحصائيات
        return {
            hotelsCount,
            bookingsCount,
            usersCount,
            reviewsCount,
            pendingReviewsCount
        };
    } catch (error) {
        console.error('خطأ في الحصول على إحصائيات لوحة القيادة:', error);
        // إرجاع قيم افتراضية في حالة الخطأ
        return {
            hotelsCount: 0,
            bookingsCount: 0,
            usersCount: 0,
            reviewsCount: 0,
            pendingReviewsCount: 0
        };
    }
}

// ===== وظائف رفع الملفات =====

// رفع صورة إلى Firebase Storage
async function uploadImage(file, path) {
    try {
        // إنشاء مرجع للملف في Storage
        const storageRef = storage.ref(`${path}/${Date.now()}_${file.name}`);
        
        // رفع الملف
        const uploadTask = storageRef.put(file);
        
        // الانتظار حتى اكتمال الرفع
        await uploadTask;
        
        // الحصول على رابط التنزيل
        const downloadURL = await storageRef.getDownloadURL();
        
        return downloadURL;
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        throw error;
    }
}
