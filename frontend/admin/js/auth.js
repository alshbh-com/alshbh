// وظائف المصادقة للوحة التحكم الإدارية

// حالة المصادقة
let currentAdmin = null;

// الاستماع لتغييرات حالة المصادقة
auth.onAuthStateChanged(user => {
    if (user) {
        // التحقق من أن المستخدم هو مدير
        checkIfAdmin(user);
    } else {
        // المستخدم غير مسجل الدخول
        currentAdmin = null;
        updateUIForLoggedOut();
    }
});

// التحقق من أن المستخدم هو مدير
async function checkIfAdmin(user) {
    try {
        // التحقق من دور المستخدم في Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists && userDoc.data().role === 'admin') {
            // المستخدم هو مدير
            currentAdmin = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userDoc.data().displayName || 'مدير',
                role: 'admin'
            };
            updateUIForLoggedIn();
        } else {
            // المستخدم ليس مديرًا، تسجيل الخروج
            console.warn('محاولة دخول من مستخدم غير مدير');
            auth.signOut();
            showLoginError('ليس لديك صلاحيات الوصول للوحة التحكم.');
        }
    } catch (error) {
        console.error('خطأ في التحقق من صلاحيات المدير:', error);
        auth.signOut();
        showLoginError('حدث خطأ أثناء التحقق من الصلاحيات. الرجاء المحاولة مرة أخرى.');
    }
}

// تسجيل الدخول
async function loginAdmin(email, password) {
    try {
        // إخفاء رسائل الخطأ السابقة
        hideLoginError();
        
        // محاولة تسجيل الدخول
        await auth.signInWithEmailAndPassword(email, password);
        // التحقق من الصلاحيات يتم في onAuthStateChanged
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        
        // عرض رسالة خطأ مناسبة
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            showLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        } else if (error.code === 'auth/too-many-requests') {
            showLoginError('تم تعطيل الحساب مؤقتًا بسبب محاولات دخول متكررة. الرجاء المحاولة لاحقًا.');
        } else {
            showLoginError('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
        }
    }
}

// تسجيل الخروج
function logoutAdmin() {
    auth.signOut()
        .then(() => {
            console.log('تم تسجيل الخروج بنجاح');
        })
        .catch(error => {
            console.error('خطأ في تسجيل الخروج:', error);
        });
}

// عرض رسالة خطأ تسجيل الدخول
function showLoginError(message) {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// إخفاء رسالة خطأ تسجيل الدخول
function hideLoginError() {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// تحديث واجهة المستخدم عند تسجيل الدخول
function updateUIForLoggedIn() {
    // إخفاء زر تسجيل الدخول وإظهار معلومات المدير
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('admin-info').style.display = 'flex';
    document.getElementById('admin-email').textContent = currentAdmin.email;
    
    // إخفاء نافذة تسجيل الدخول إذا كانت مفتوحة
    document.getElementById('login-modal').style.display = 'none';
    
    // إظهار القائمة الجانبية والمحتوى الرئيسي
    document.getElementById('admin-nav').style.display = 'block';
    document.getElementById('admin-main-content').style.display = 'block';
    
    // تحميل البيانات الأولية
    loadInitialData();
}

// تحديث واجهة المستخدم عند تسجيل الخروج
function updateUIForLoggedOut() {
    // إظهار زر تسجيل الدخول وإخفاء معلومات المدير
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('admin-info').style.display = 'none';
    
    // إخفاء القائمة الجانبية والمحتوى الرئيسي
    document.getElementById('admin-nav').style.display = 'none';
    document.getElementById('admin-main-content').style.display = 'none';
}

// تحميل البيانات الأولية بعد تسجيل الدخول
function loadInitialData() {
    // تحميل إعدادات التطبيق
    loadAppSettings();
    
    // تحميل بيانات لوحة القيادة
    loadDashboardData();
    
    // يمكن إضافة المزيد من عمليات التحميل الأولية هنا
}
