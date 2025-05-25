// وظائف واجهة المستخدم للوحة التحكم الإدارية

// تنفيذ عند تحميل المستند
document.addEventListener('DOMContentLoaded', () => {
    // إعداد أحداث النقر على روابط التنقل
    setupNavigation();
    
    // إعداد نافذة تسجيل الدخول
    setupLoginModal();
    
    // إعداد نموذج تسجيل الدخول
    setupLoginForm();
    
    // إعداد زر تسجيل الخروج
    setupLogoutButton();
});

// إعداد أحداث التنقل بين الصفحات
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // إزالة الفئة النشطة من جميع الروابط
            navLinks.forEach(l => l.classList.remove('active'));
            
            // إضافة الفئة النشطة للرابط المنقور
            link.classList.add('active');
            
            // إخفاء جميع الصفحات
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active-page'));
            
            // إظهار الصفحة المطلوبة
            const pageId = link.getAttribute('data-page') + '-page';
            document.getElementById(pageId).classList.add('active-page');
        });
    });
}

// إعداد نافذة تسجيل الدخول
function setupLoginModal() {
    const loginButton = document.getElementById('login-button');
    const loginModal = document.getElementById('login-modal');
    const closeButton = document.querySelector('.close-button');
    
    // فتح النافذة عند النقر على زر تسجيل الدخول
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
    
    // إغلاق النافذة عند النقر على زر الإغلاق
    closeButton.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// إعداد نموذج تسجيل الدخول
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('admin-email-input').value;
        const password = document.getElementById('admin-password-input').value;
        
        // استدعاء وظيفة تسجيل الدخول من ملف auth.js
        loginAdmin(email, password);
    });
}

// إعداد زر تسجيل الخروج
function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    
    logoutButton.addEventListener('click', () => {
        // استدعاء وظيفة تسجيل الخروج من ملف auth.js
        logoutAdmin();
    });
}

// تحميل إعدادات التطبيق
async function loadAppSettings() {
    try {
        const settings = await fetchAppSettings();
        
        // تحديث اسم التطبيق في الواجهة
        if (settings && settings.appName) {
            document.getElementById('app-name-display').textContent = settings.appName;
            
            // تحديث حقل اسم التطبيق في نموذج الإعدادات
            document.getElementById('setting-app-name').value = settings.appName;
        }
        
        // يمكن إضافة المزيد من تحديثات الإعدادات هنا
        
    } catch (error) {
        console.error('خطأ في تحميل إعدادات التطبيق:', error);
    }
}

// تحميل بيانات لوحة القيادة
async function loadDashboardData() {
    try {
        // تحميل إحصائيات لوحة القيادة
        const stats = await fetchDashboardStats();
        
        // تحديث الإحصائيات في الواجهة
        updateDashboardStats(stats);
        
    } catch (error) {
        console.error('خطأ في تحميل بيانات لوحة القيادة:', error);
    }
}

// تحديث إحصائيات لوحة القيادة
function updateDashboardStats(stats) {
    // سيتم تنفيذ هذه الوظيفة لاحقًا عند إنشاء مكونات لوحة القيادة
    console.log('تحديث إحصائيات لوحة القيادة:', stats);
}

// إضافة تأثير الموجة (Ripple) للأزرار
function addRippleEffect() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.classList.add('ripple');
    });
}

// تحديث حالة التحميل
function showLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    
    if (element) {
        if (isLoading) {
            element.classList.add('loading');
            // يمكن إضافة عنصر تحميل دوار هنا
        } else {
            element.classList.remove('loading');
            // إزالة عنصر التحميل
        }
    }
}

// عرض رسالة تنبيه
function showAlert(message, type = 'info') {
    // إنشاء عنصر التنبيه
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // إضافة التنبيه إلى المستند
    document.body.appendChild(alert);
    
    // إزالة التنبيه بعد 3 ثوانٍ
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 500);
    }, 3000);
}
