// وظائف إدارة المستخدمين للوحة التحكم الإدارية

// تحميل قائمة المستخدمين
async function loadUsers() {
    const usersList = document.getElementById('users-list');
    
    try {
        // إظهار حالة التحميل
        usersList.innerHTML = '<p>جاري تحميل المستخدمين...</p>';
        
        // الحصول على قائمة المستخدمين
        const users = await fetchUsers();
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>لا يوجد مستخدمين حاليًا.</p>';
            return;
        }
        
        // إنشاء جدول المستخدمين
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>رقم الهاتف</th>
                        <th>الدور</th>
                        <th>تاريخ التسجيل</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // إضافة صفوف المستخدمين
        for (const user of users) {
            // تنسيق تاريخ التسجيل
            const createdAt = user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير معروف';
            
            // ترجمة دور المستخدم
            let roleText = '';
            switch (user.role) {
                case 'admin':
                    roleText = 'مدير';
                    break;
                case 'user':
                    roleText = 'مستخدم';
                    break;
                default:
                    roleText = user.role || 'مستخدم';
            }
            
            tableHTML += `
                <tr>
                    <td>${user.displayName || 'غير معروف'}</td>
                    <td>${user.email || 'غير معروف'}</td>
                    <td>${user.phoneNumber || 'غير معروف'}</td>
                    <td>${roleText}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="view-user-button" data-id="${user.id}">عرض</button>
                        <button class="change-role-button" data-id="${user.id}" data-role="${user.role}">تغيير الدور</button>
                    </td>
                </tr>
            `;
        }
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        // عرض الجدول
        usersList.innerHTML = tableHTML;
        
        // إعداد أزرار الإجراءات
        setupUserActionButtons();
        
    } catch (error) {
        usersList.innerHTML = '<p>حدث خطأ أثناء تحميل المستخدمين.</p>';
        console.error('خطأ في تحميل المستخدمين:', error);
    }
}

// إعداد أزرار إجراءات المستخدمين
function setupUserActionButtons() {
    // أزرار عرض المستخدم
    const viewButtons = document.querySelectorAll('.view-user-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            // تنفيذ وظيفة عرض المستخدم
            viewUserDetails(userId);
        });
    });
    
    // أزرار تغيير دور المستخدم
    const changeRoleButtons = document.querySelectorAll('.change-role-button');
    changeRoleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            const currentRole = button.getAttribute('data-role');
            // تنفيذ وظيفة تغيير دور المستخدم
            showChangeRoleModal(userId, currentRole);
        });
    });
}

// عرض تفاصيل المستخدم
async function viewUserDetails(userId) {
    try {
        // الحصول على تفاصيل المستخدم
        const user = await fetchUserById(userId);
        
        // إنشاء نافذة منبثقة لعرض التفاصيل
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'user-details-modal';
        
        // تنسيق تاريخ التسجيل
        const createdAt = user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير معروف';
        const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير معروف';
        
        // ترجمة دور المستخدم
        let roleText = '';
        switch (user.role) {
            case 'admin':
                roleText = 'مدير';
                break;
            case 'user':
                roleText = 'مستخدم';
                break;
            default:
                roleText = user.role || 'مستخدم';
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>تفاصيل المستخدم</h2>
                <div class="user-details">
                    <p><strong>الاسم:</strong> ${user.displayName || 'غير معروف'}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${user.email || 'غير معروف'}</p>
                    <p><strong>رقم الهاتف:</strong> ${user.phoneNumber || 'غير معروف'}</p>
                    <p><strong>الدور:</strong> ${roleText}</p>
                    <p><strong>تاريخ التسجيل:</strong> ${createdAt}</p>
                    <p><strong>آخر تسجيل دخول:</strong> ${lastLogin}</p>
                </div>
                <h3>إحصائيات المستخدم</h3>
                <div class="user-stats">
                    <p><strong>عدد الحجوزات:</strong> <span id="user-bookings-count">جاري التحميل...</span></p>
                    <p><strong>عدد المراجعات:</strong> <span id="user-reviews-count">جاري التحميل...</span></p>
                </div>
            </div>
        `;
        
        // إضافة النافذة المنبثقة إلى المستند
        document.body.appendChild(modal);
        
        // إظهار النافذة المنبثقة
        modal.style.display = 'flex';
        
        // إعداد زر الإغلاق
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // إغلاق النافذة عند النقر خارجها
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // تحميل إحصائيات المستخدم
        loadUserStats(userId);
        
    } catch (error) {
        console.error('خطأ في عرض تفاصيل المستخدم:', error);
        showAlert('حدث خطأ أثناء تحميل تفاصيل المستخدم', 'error');
    }
}

// تحميل إحصائيات المستخدم
async function loadUserStats(userId) {
    try {
        // الحصول على حجوزات المستخدم
        // هذه الوظيفة تحتاج إلى إضافتها إلى ملف api.js
        const userBookings = await fetchUserBookings(userId);
        document.getElementById('user-bookings-count').textContent = userBookings.length;
        
        // الحصول على مراجعات المستخدم
        // هذه الوظيفة تحتاج إلى إضافتها إلى ملف api.js
        const userReviews = await fetchUserReviews(userId);
        document.getElementById('user-reviews-count').textContent = userReviews.length;
        
    } catch (error) {
        console.error('خطأ في تحميل إحصائيات المستخدم:', error);
        document.getElementById('user-bookings-count').textContent = 'خطأ في التحميل';
        document.getElementById('user-reviews-count').textContent = 'خطأ في التحميل';
    }
}

// عرض نافذة تغيير دور المستخدم
function showChangeRoleModal(userId, currentRole) {
    // إنشاء نافذة منبثقة لتغيير الدور
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'change-role-modal';
    
    // تحديد الدور الحالي
    const isAdmin = currentRole === 'admin';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>تغيير دور المستخدم</h2>
            <form id="change-role-form">
                <input type="hidden" id="user-id" value="${userId}">
                <p>الدور الحالي: <strong>${isAdmin ? 'مدير' : 'مستخدم'}</strong></p>
                <label for="new-role">الدور الجديد:</label>
                <select id="new-role" required>
                    <option value="user" ${!isAdmin ? 'selected' : ''}>مستخدم</option>
                    <option value="admin" ${isAdmin ? 'selected' : ''}>مدير</option>
                </select>
                <button type="submit">تغيير الدور</button>
            </form>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى المستند
    document.body.appendChild(modal);
    
    // إظهار النافذة المنبثقة
    modal.style.display = 'flex';
    
    // إعداد زر الإغلاق
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // إغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // إعداد نموذج تغيير الدور
    const form = document.getElementById('change-role-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('user-id').value;
        const newRole = document.getElementById('new-role').value;
        
        try {
            // تغيير دور المستخدم
            await updateUserRole(userId, newRole);
            
            // إغلاق النافذة المنبثقة
            document.body.removeChild(modal);
            
            // إعادة تحميل قائمة المستخدمين
            loadUsers();
            
            // عرض رسالة نجاح
            showAlert('تم تغيير دور المستخدم بنجاح', 'success');
            
        } catch (error) {
            console.error('خطأ في تغيير دور المستخدم:', error);
            showAlert('حدث خطأ أثناء تغيير دور المستخدم', 'error');
        }
    });
}

// الحصول على حجوزات المستخدم (يجب إضافتها إلى ملف api.js)
async function fetchUserBookings(userId) {
    return await fetchAPI(`/users/${userId}/bookings`);
}

// الحصول على مراجعات المستخدم (يجب إضافتها إلى ملف api.js)
async function fetchUserReviews(userId) {
    return await fetchAPI(`/users/${userId}/reviews`);
}
