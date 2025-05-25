// وظائف الاتصال بالواجهة الخلفية
// تطبيق محجوز - حجز الفنادق في اليمن

// عنوان الخادم الخلفي
const API_BASE_URL = 'http://localhost:3000/api';

// وظيفة عامة للاتصال بالـ API
async function fetchAPI(endpoint, method = 'GET', data = null) {
    try {
        // تحضير خيارات الطلب
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        // إضافة التوكن إذا كان المستخدم مسجل الدخول
        const user = getCurrentUser();
        if (user) {
            const token = await user.getIdToken();
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // إضافة البيانات إذا كانت موجودة
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
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
        console.error(`خطأ في الاتصال بالـ API (${endpoint}):`, error);
        throw error;
    }
}

// ===== وظائف البحث والفنادق =====

// البحث عن الفنادق
async function searchHotels(params) {
    const queryParams = new URLSearchParams();
    
    // إضافة معايير البحث إلى الاستعلام
    if (params.city) queryParams.append('city', params.city);
    if (params.checkIn) queryParams.append('checkIn', params.checkIn);
    if (params.checkOut) queryParams.append('checkOut', params.checkOut);
    if (params.guests) queryParams.append('guests', params.guests);
    if (params.rooms) queryParams.append('rooms', params.rooms);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.rating) queryParams.append('rating', params.rating);
    if (params.amenities) queryParams.append('amenities', params.amenities.join(','));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.limit) queryParams.append('limit', params.limit);
    
    return await fetchAPI(`/hotels/search?${queryParams.toString()}`);
}

// الحصول على قائمة الفنادق المميزة
async function getFeaturedHotels(limit = 4) {
    return await fetchAPI(`/hotels/featured?limit=${limit}`);
}

// الحصول على تفاصيل فندق محدد
async function getHotelDetails(hotelId) {
    return await fetchAPI(`/hotels/${hotelId}`);
}

// الحصول على غرف فندق محدد
async function getHotelRooms(hotelId, checkIn, checkOut) {
    let endpoint = `/hotels/${hotelId}/rooms`;
    
    // إضافة تواريخ الوصول والمغادرة إذا كانت متوفرة
    if (checkIn && checkOut) {
        endpoint += `?checkIn=${checkIn}&checkOut=${checkOut}`;
    }
    
    return await fetchAPI(endpoint);
}

// التحقق من توفر الغرف
async function checkRoomAvailability(hotelId, roomId, checkIn, checkOut, guests) {
    return await fetchAPI(`/availability/check`, 'POST', {
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guests
    });
}

// ===== وظائف الحجوزات =====

// إنشاء حجز جديد
async function createBooking(bookingData) {
    return await fetchAPI('/bookings', 'POST', bookingData);
}

// الحصول على حجوزات المستخدم
async function getUserBookings() {
    return await fetchAPI('/bookings/user');
}

// الحصول على تفاصيل حجز محدد
async function getBookingDetails(bookingId) {
    return await fetchAPI(`/bookings/${bookingId}`);
}

// إلغاء حجز
async function cancelBooking(bookingId) {
    return await fetchAPI(`/bookings/${bookingId}/cancel`, 'PUT');
}

// ===== وظائف المراجعات =====

// الحصول على مراجعات فندق محدد
async function getHotelReviews(hotelId) {
    return await fetchAPI(`/hotels/${hotelId}/reviews`);
}

// إضافة مراجعة جديدة
async function addReview(hotelId, reviewData) {
    return await fetchAPI(`/hotels/${hotelId}/reviews`, 'POST', reviewData);
}

// ===== وظائف المستخدم =====

// تحديث الملف الشخصي للمستخدم
async function updateUserProfile(userData) {
    return await fetchAPI('/users/profile', 'PUT', userData);
}

// إضافة فندق إلى المفضلة
async function addToFavorites(hotelId) {
    return await fetchAPI('/users/favorites', 'POST', { hotelId });
}

// إزالة فندق من المفضلة
async function removeFromFavorites(hotelId) {
    return await fetchAPI(`/users/favorites/${hotelId}`, 'DELETE');
}

// الحصول على قائمة الفنادق المفضلة
async function getFavoriteHotels() {
    return await fetchAPI('/users/favorites');
}

// ===== وظائف المدن =====

// الحصول على قائمة المدن
async function getCities() {
    return await fetchAPI('/cities');
}

// الحصول على عدد الفنادق في كل مدينة
async function getCityHotelsCount() {
    return await fetchAPI('/cities/hotels-count');
}

// ===== وظائف إعدادات التطبيق =====

// الحصول على إعدادات التطبيق
async function getAppSettings() {
    return await fetchAPI('/settings');
}

// ===== وظائف الاشتراك في النشرة البريدية =====

// الاشتراك في النشرة البريدية
async function subscribeToNewsletter(email) {
    return await fetchAPI('/newsletter/subscribe', 'POST', { email });
}

// ===== وظائف التحميل والرفع =====

// رفع صورة
async function uploadImage(file, folder = 'images') {
    // إنشاء نموذج البيانات
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    try {
        // تحضير خيارات الطلب
        const options = {
            method: 'POST',
            body: formData
        };
        
        // إضافة التوكن إذا كان المستخدم مسجل الدخول
        const user = getCurrentUser();
        if (user) {
            const token = await user.getIdToken();
            options.headers = {
                'Authorization': `Bearer ${token}`
            };
        }
        
        // إرسال الطلب
        const response = await fetch(`${API_BASE_URL}/upload`, options);
        
        // التحقق من حالة الاستجابة
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `خطأ في رفع الصورة: ${response.status}`);
        }
        
        // إرجاع البيانات
        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        throw error;
    }
}
