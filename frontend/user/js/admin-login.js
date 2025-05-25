// إضافة زر تسجيل الدخول للمدير في الصفحة الرئيسية للمستخدم

// إضافة زر تسجيل الدخول للمدير
function addAdminLoginButton() {
    // إنشاء زر تسجيل الدخول
    const adminLoginButton = document.createElement('a');
    adminLoginButton.id = 'admin-login-link';
    adminLoginButton.href = '/admin/';
    adminLoginButton.className = 'admin-login-button';
    adminLoginButton.innerHTML = '<i class="fas fa-user-shield"></i> دخول المدير';
    
    // إضافة الزر إلى الصفحة
    const headerElement = document.querySelector('header');
    if (headerElement) {
        // إنشاء حاوية للزر
        const adminButtonContainer = document.createElement('div');
        adminButtonContainer.className = 'admin-login-container';
        adminButtonContainer.appendChild(adminLoginButton);
        
        // إضافة الحاوية إلى الهيدر
        headerElement.appendChild(adminButtonContainer);
    } else {
        // إذا لم يكن هناك هيدر، أضف الزر إلى الجسم
        document.body.appendChild(adminLoginButton);
    }
    
    // إضافة أنماط CSS للزر
    const style = document.createElement('style');
    style.textContent = `
        .admin-login-container {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 100;
        }
        
        .admin-login-button {
            display: inline-block;
            padding: 8px 12px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        
        .admin-login-button:hover {
            background-color: rgba(0, 0, 0, 0.7);
        }
        
        .admin-login-button i {
            margin-left: 5px;
        }
        
        @media (max-width: 768px) {
            .admin-login-container {
                position: fixed;
                top: auto;
                bottom: 10px;
                left: 10px;
            }
        }
    `;
    document.head.appendChild(style);
}

// تنفيذ الوظيفة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    addAdminLoginButton();
});
