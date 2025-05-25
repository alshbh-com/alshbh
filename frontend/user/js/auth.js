// وظائف المصادقة للمستخدمين
// تطبيق محجوز - حجز الفنادق في اليمن

// متغيرات عامة
let currentUser = null;

// الاستماع لتغييرات حالة المصادقة
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // المستخدم مسجل الدخول
        currentUser = user;
        
        // تحديث واجهة المستخدم
        updateUIForLoggedInUser(user);
        
        // الحصول على بيانات المستخدم الإضافية من Firestore
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                // دمج بيانات المستخدم من Firestore مع كائن المستخدم
                currentUser = { ...currentUser, ...userDoc.data() };
            } else {
                // إنشاء وثيقة المستخدم إذا لم تكن موجودة
                await createUserDocument(user);
            }
        } catch (error) {
            console.error('خطأ في الحصول على بيانات المستخدم:', error);
        }
    } else {
        // المستخدم غير مسجل الدخول
        currentUser = null;
        
        // تحديث واجهة المستخدم
        updateUIForLoggedOutUser();
    }
});

// تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
async function loginWithEmailPassword(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        return { success: false, error: translateFirebaseAuthError(error) };
    }
}

// تسجيل مستخدم جديد باستخدام البريد الإلكتروني وكلمة المرور
async function registerWithEmailPassword(email, password, displayName, phoneNumber) {
    try {
        // إنشاء المستخدم في Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // تحديث اسم العرض
        await user.updateProfile({
            displayName: displayName
        });
        
        // إنشاء وثيقة المستخدم في Firestore
        await createUserDocument(user, { phoneNumber });
        
        return { success: true, user };
    } catch (error) {
        console.error('خطأ في إنشاء الحساب:', error);
        return { success: false, error: translateFirebaseAuthError(error) };
    }
}

// إنشاء وثيقة المستخدم في Firestore
async function createUserDocument(user, additionalData = {}) {
    if (!user) return;
    
    const userRef = db.collection('users').doc(user.uid);
    
    try {
        await userRef.set({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            phoneNumber: additionalData.phoneNumber || '',
            photoURL: user.photoURL || '',
            role: 'user',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('خطأ في إنشاء وثيقة المستخدم:', error);
    }
}

// تسجيل الخروج
async function logout() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        return { success: false, error: error.message };
    }
}

// إعادة تعيين كلمة المرور
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        console.error('خطأ في إعادة تعيين كلمة المرور:', error);
        return { success: false, error: translateFirebaseAuthError(error) };
    }
}

// تحديث بيانات المستخدم
async function updateUserProfile(displayName, phoneNumber, photoURL) {
    if (!currentUser) return { success: false, error: 'المستخدم غير مسجل الدخول' };
    
    try {
        // تحديث بيانات المستخدم في Firebase Auth
        const updateAuthPromise = currentUser.updateProfile({
            displayName: displayName,
            photoURL: photoURL
        });
        
        // تحديث بيانات المستخدم في Firestore
        const updateFirestorePromise = db.collection('users').doc(currentUser.uid).update({
            displayName: displayName,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // انتظار اكتمال العمليتين
        await Promise.all([updateAuthPromise, updateFirestorePromise]);
        
        return { success: true };
    } catch (error) {
        console.error('خطأ في تحديث بيانات المستخدم:', error);
        return { success: false, error: error.message };
    }
}

// تحديث واجهة المستخدم للمستخدم المسجل الدخول
function updateUIForLoggedInUser(user) {
    // إخفاء أزرار تسجيل الدخول والتسجيل
    const authButtonsContainer = document.getElementById('auth-buttons-container');
    if (authButtonsContainer) {
        authButtonsContainer.style.display = 'none';
    }
    
    // إظهار قائمة الملف الشخصي
    const userProfileContainer = document.getElementById('user-profile-container');
    if (userProfileContainer) {
        userProfileContainer.style.display = 'block';
    }
    
    // تحديث اسم المستخدم والصورة
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = user.displayName || 'المستخدم';
    }
    
    const userAvatarElement = document.getElementById('user-avatar');
    if (userAvatarElement) {
        userAvatarElement.src = user.photoURL || 'images/user-placeholder.png';
    }
    
    // إعداد زر تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const result = await logout();
            if (result.success) {
                // إعادة توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الخروج
                window.location.href = 'index.html';
            } else {
                showAlert('حدث خطأ أثناء تسجيل الخروج', 'error');
            }
        });
    }
}

// تحديث واجهة المستخدم للمستخدم غير المسجل
function updateUIForLoggedOutUser() {
    // إظهار أزرار تسجيل الدخول والتسجيل
    const authButtonsContainer = document.getElementById('auth-buttons-container');
    if (authButtonsContainer) {
        authButtonsContainer.style.display = 'flex';
    }
    
    // إخفاء قائمة الملف الشخصي
    const userProfileContainer = document.getElementById('user-profile-container');
    if (userProfileContainer) {
        userProfileContainer.style.display = 'none';
    }
}

// ترجمة أخطاء Firebase Auth إلى رسائل عربية
function translateFirebaseAuthError(error) {
    const errorCode = error.code;
    
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'البريد الإلكتروني مستخدم بالفعل';
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صالح';
        case 'auth/user-disabled':
            return 'تم تعطيل هذا الحساب';
        case 'auth/user-not-found':
            return 'لا يوجد مستخدم بهذا البريد الإلكتروني';
        case 'auth/wrong-password':
            return 'كلمة المرور غير صحيحة';
        case 'auth/weak-password':
            return 'كلمة المرور ضعيفة جدًا';
        case 'auth/too-many-requests':
            return 'تم تعطيل الوصول إلى هذا الحساب مؤقتًا بسبب العديد من محاولات تسجيل الدخول الفاشلة';
        case 'auth/operation-not-allowed':
            return 'تسجيل الدخول بهذه الطريقة غير مسموح به';
        case 'auth/requires-recent-login':
            return 'تتطلب هذه العملية إعادة تسجيل الدخول';
        default:
            return error.message;
    }
}

// التحقق من حالة تسجيل الدخول
function isUserLoggedIn() {
    return currentUser !== null;
}

// الحصول على المستخدم الحالي
function getCurrentUser() {
    return currentUser;
}

// التحقق مما إذا كان المستخدم مسجل الدخول وإعادة التوجيه إذا لزم الأمر
function checkAuthAndRedirect(requireAuth = true, redirectUrl = 'login.html') {
    const isLoggedIn = isUserLoggedIn();
    
    if (requireAuth && !isLoggedIn) {
        // المستخدم غير مسجل الدخول ولكن الصفحة تتطلب تسجيل الدخول
        window.location.href = redirectUrl;
        return false;
    } else if (!requireAuth && isLoggedIn) {
        // المستخدم مسجل الدخول ولكن الصفحة لا تتطلب تسجيل الدخول (مثل صفحة تسجيل الدخول)
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}
