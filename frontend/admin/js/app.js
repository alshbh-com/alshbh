// الملف الرئيسي للوحة التحكم الإدارية

// تنفيذ عند تحميل المستند
document.addEventListener('DOMContentLoaded', () => {
    console.log('تطبيق لوحة التحكم الإدارية جاهز');
    
    // إعداد صفحات لوحة التحكم
    setupDashboardPage();
    setupHotelsPage();
    setupBookingsPage();
    setupUsersPage();
    setupReviewsPage();
    setupSettingsPage();
    
    // إضافة تأثير الموجة للأزرار
    addRippleEffect();
});

// إعداد صفحة لوحة القيادة
function setupDashboardPage() {
    const dashboardPage = document.getElementById('dashboard-page');
    
    // إنشاء بطاقات الإحصائيات
    const statsContainer = document.createElement('div');
    statsContainer.className = 'dashboard-cards';
    
    // إضافة بطاقات الإحصائيات
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>الفنادق</h3>
            <div class="number" id="hotels-count">0</div>
            <div class="label">إجمالي الفنادق</div>
        </div>
        <div class="stat-card">
            <h3>الحجوزات</h3>
            <div class="number" id="bookings-count">0</div>
            <div class="label">إجمالي الحجوزات</div>
        </div>
        <div class="stat-card">
            <h3>المستخدمين</h3>
            <div class="number" id="users-count">0</div>
            <div class="label">إجمالي المستخدمين</div>
        </div>
        <div class="stat-card">
            <h3>المراجعات</h3>
            <div class="number" id="reviews-count">0</div>
            <div class="label">إجمالي المراجعات</div>
        </div>
        <div class="stat-card">
            <h3>المراجعات المعلقة</h3>
            <div class="number" id="pending-reviews-count">0</div>
            <div class="label">بانتظار الموافقة</div>
        </div>
    `;
    
    // إضافة الإحصائيات إلى الصفحة
    dashboardPage.appendChild(statsContainer);
    
    // إضافة قسم آخر حجوزات
    const recentBookingsSection = document.createElement('div');
    recentBookingsSection.innerHTML = `
        <h3>آخر الحجوزات</h3>
        <div id="recent-bookings">
            <p>جاري التحميل...</p>
        </div>
    `;
    
    // إضافة قسم آخر الحجوزات إلى الصفحة
    dashboardPage.appendChild(recentBookingsSection);
}

// تحديث إحصائيات لوحة القيادة
function updateDashboardStats(stats) {
    document.getElementById('hotels-count').textContent = stats.hotelsCount || 0;
    document.getElementById('bookings-count').textContent = stats.bookingsCount || 0;
    document.getElementById('users-count').textContent = stats.usersCount || 0;
    document.getElementById('reviews-count').textContent = stats.reviewsCount || 0;
    document.getElementById('pending-reviews-count').textContent = stats.pendingReviewsCount || 0;
}

// إعداد صفحة إدارة الفنادق
function setupHotelsPage() {
    const hotelsPage = document.getElementById('hotels-page');
    const hotelsList = document.getElementById('hotels-list');
    
    // إضافة نموذج إضافة فندق جديد
    const addHotelModal = document.createElement('div');
    addHotelModal.className = 'modal';
    addHotelModal.id = 'add-hotel-modal';
    addHotelModal.style.display = 'none';
    
    addHotelModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>إضافة فندق جديد</h2>
            <form id="add-hotel-form">
                <label for="hotel-name">اسم الفندق:</label>
                <input type="text" id="hotel-name" required>
                
                <label for="hotel-description">وصف الفندق:</label>
                <textarea id="hotel-description" rows="4"></textarea>
                
                <label for="hotel-city">المدينة:</label>
                <input type="text" id="hotel-city" required>
                
                <label for="hotel-region">المنطقة/الحي:</label>
                <input type="text" id="hotel-region">
                
                <label for="hotel-address">العنوان:</label>
                <input type="text" id="hotel-address">
                
                <label for="hotel-stars">عدد النجوم:</label>
                <select id="hotel-stars" required>
                    <option value="1">1 نجمة</option>
                    <option value="2">2 نجمة</option>
                    <option value="3">3 نجوم</option>
                    <option value="4">4 نجوم</option>
                    <option value="5">5 نجوم</option>
                </select>
                
                <label for="hotel-amenities">وسائل الراحة (مفصولة بفواصل):</label>
                <input type="text" id="hotel-amenities" placeholder="واي فاي, مسبح, موقف سيارات">
                
                <button type="submit">إضافة الفندق</button>
            </form>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    hotelsPage.appendChild(addHotelModal);
    
    // إعداد زر إضافة فندق جديد
    const addHotelButton = document.getElementById('add-hotel-button');
    addHotelButton.addEventListener('click', () => {
        document.getElementById('add-hotel-modal').style.display = 'flex';
    });
    
    // إعداد زر إغلاق النافذة المنبثقة
    const closeButton = addHotelModal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        addHotelModal.style.display = 'none';
    });
    
    // إعداد نموذج إضافة فندق
    const addHotelForm = document.getElementById('add-hotel-form');
    addHotelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // جمع بيانات الفندق
        const hotelData = {
            name: document.getElementById('hotel-name').value,
            description: document.getElementById('hotel-description').value,
            city: document.getElementById('hotel-city').value,
            region: document.getElementById('hotel-region').value,
            address: document.getElementById('hotel-address').value,
            stars: parseInt(document.getElementById('hotel-stars').value),
            amenities: document.getElementById('hotel-amenities').value.split(',').map(item => item.trim()).filter(item => item)
        };
        
        try {
            // إظهار حالة التحميل
            showLoading('add-hotel-form', true);
            
            // إرسال البيانات إلى الواجهة الخلفية
            const newHotel = await createHotel(hotelData);
            
            // إخفاء النافذة المنبثقة
            addHotelModal.style.display = 'none';
            
            // إعادة تحميل قائمة الفنادق
            loadHotels();
            
            // عرض رسالة نجاح
            showAlert('تم إضافة الفندق بنجاح', 'success');
            
            // إعادة تعيين النموذج
            addHotelForm.reset();
            
        } catch (error) {
            // عرض رسالة خطأ
            showAlert('حدث خطأ أثناء إضافة الفندق', 'error');
            console.error('خطأ في إضافة الفندق:', error);
        } finally {
            // إخفاء حالة التحميل
            showLoading('add-hotel-form', false);
        }
    });
    
    // تحميل قائمة الفنادق
    loadHotels();
}

// تحميل قائمة الفنادق
async function loadHotels() {
    const hotelsList = document.getElementById('hotels-list');
    
    try {
        // إظهار حالة التحميل
        hotelsList.innerHTML = '<p>جاري تحميل الفنادق...</p>';
        
        // الحصول على قائمة الفنادق
        const hotels = await fetchHotels();
        
        if (hotels.length === 0) {
            hotelsList.innerHTML = '<p>لا توجد فنادق حاليًا.</p>';
            return;
        }
        
        // إنشاء جدول الفنادق
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>المدينة</th>
                        <th>النجوم</th>
                        <th>عدد الغرف</th>
                        <th>التقييم</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // إضافة صفوف الفنادق
        for (const hotel of hotels) {
            // الحصول على عدد الغرف
            let roomsCount = 0;
            try {
                const rooms = await fetchHotelRooms(hotel.id);
                roomsCount = rooms.length;
            } catch (error) {
                console.error(`خطأ في الحصول على غرف الفندق ${hotel.id}:`, error);
            }
            
            tableHTML += `
                <tr>
                    <td>${hotel.name}</td>
                    <td>${hotel.city}</td>
                    <td>${hotel.stars} ★</td>
                    <td>${roomsCount}</td>
                    <td>${hotel.averageRating ? hotel.averageRating.toFixed(1) + ' ★' : 'لا يوجد'}</td>
                    <td>
                        <button class="edit-hotel-button" data-id="${hotel.id}">تعديل</button>
                        <button class="view-rooms-button" data-id="${hotel.id}">الغرف</button>
                        <button class="delete-hotel-button" data-id="${hotel.id}">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        // عرض الجدول
        hotelsList.innerHTML = tableHTML;
        
        // إعداد أزرار الإجراءات
        setupHotelActionButtons();
        
    } catch (error) {
        hotelsList.innerHTML = '<p>حدث خطأ أثناء تحميل الفنادق.</p>';
        console.error('خطأ في تحميل الفنادق:', error);
    }
}

// إعداد أزرار إجراءات الفنادق
function setupHotelActionButtons() {
    // أزرار تعديل الفندق
    const editButtons = document.querySelectorAll('.edit-hotel-button');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hotelId = button.getAttribute('data-id');
            // تنفيذ وظيفة تعديل الفندق
            editHotel(hotelId);
        });
    });
    
    // أزرار عرض الغرف
    const viewRoomsButtons = document.querySelectorAll('.view-rooms-button');
    viewRoomsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hotelId = button.getAttribute('data-id');
            // تنفيذ وظيفة عرض غرف الفندق
            viewHotelRooms(hotelId);
        });
    });
    
    // أزرار حذف الفندق
    const deleteButtons = document.querySelectorAll('.delete-hotel-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hotelId = button.getAttribute('data-id');
            // تنفيذ وظيفة حذف الفندق
            confirmDeleteHotel(hotelId);
        });
    });
}

// وظائف إدارة الفنادق الأخرى (تعديل، عرض الغرف، حذف) ستضاف لاحقًا

// إعداد صفحة إدارة الحجوزات
function setupBookingsPage() {
    // سيتم تنفيذ هذه الوظيفة لاحقًا
    console.log('إعداد صفحة إدارة الحجوزات');
}

// إعداد صفحة إدارة المستخدمين
function setupUsersPage() {
    // سيتم تنفيذ هذه الوظيفة لاحقًا
    console.log('إعداد صفحة إدارة المستخدمين');
}

// إعداد صفحة إدارة المراجعات
function setupReviewsPage() {
    // سيتم تنفيذ هذه الوظيفة لاحقًا
    console.log('إعداد صفحة إدارة المراجعات');
}

// إعداد صفحة الإعدادات
function setupSettingsPage() {
    const settingsForm = document.getElementById('settings-form');
    
    // إعداد نموذج الإعدادات
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // جمع بيانات الإعدادات
        const settingsData = {
            appName: document.getElementById('setting-app-name').value
            // يمكن إضافة المزيد من الإعدادات هنا
        };
        
        try {
            // إظهار حالة التحميل
            showLoading('settings-form', true);
            
            // إرسال البيانات إلى الواجهة الخلفية
            const updatedSettings = await updateAppSettings(settingsData);
            
            // تحديث اسم التطبيق في الواجهة
            document.getElementById('app-name-display').textContent = updatedSettings.appName;
            
            // عرض رسالة نجاح
            showAlert('تم حفظ الإعدادات بنجاح', 'success');
            
        } catch (error) {
            // عرض رسالة خطأ
            showAlert('حدث خطأ أثناء حفظ الإعدادات', 'error');
            console.error('خطأ في حفظ الإعدادات:', error);
        } finally {
            // إخفاء حالة التحميل
            showLoading('settings-form', false);
        }
    });
}
