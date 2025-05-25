// وظائف التعدد اللغوي
// هذا الملف يحتوي على وظائف دعم اللغات المتعددة في التطبيق

// المتغيرات العامة
let currentLanguage = 'ar'; // اللغة الافتراضية هي العربية
let translations = {}; // كائن يحتوي على جميع الترجمات

// تحميل ملفات الترجمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديد اللغة الحالية من التخزين المحلي أو الافتراضية
    currentLanguage = localStorage.getItem('language') || 'ar';
    
    // تحديث قائمة اختيار اللغة
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    // تحميل ملف الترجمة للغة الحالية
    loadTranslations(currentLanguage);
    
    // إعداد مستمع الحدث لتغيير اللغة
    setupLanguageChangeListener();
    
    // تحديث اتجاه الصفحة بناءً على اللغة
    updatePageDirection();
});

// تحميل ملف الترجمة
function loadTranslations(lang) {
    fetch(`locales/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            translations = data;
            applyTranslations();
        })
        .catch(error => {
            console.error('Error loading translations:', error);
            // في حالة الفشل، استخدم اللغة الافتراضية
            if (lang !== 'ar') {
                console.log('Falling back to default language (Arabic)');
                loadTranslations('ar');
            }
        });
}

// تطبيق الترجمات على الصفحة
function applyTranslations() {
    // تطبيق الترجمات على العناصر التي تحتوي على سمة data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        
        if (translation) {
            // إذا كان العنصر له سمة data-i18n-attr، قم بتطبيق الترجمة على السمة المحددة
            const attr = element.getAttribute('data-i18n-attr');
            if (attr) {
                element.setAttribute(attr, translation);
            } else {
                // وإلا، قم بتطبيق الترجمة على محتوى النص
                element.textContent = translation;
            }
        }
    });
    
    // تطبيق الترجمات على العناصر التي تحتوي على سمة placeholder
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key);
        
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });
    
    // تحديث اسم التطبيق والشعار
    updateAppNameAndLogo();
    
    // تحديث معلومات الاتصال في التذييل
    updateContactInfo();
    
    // تحديث السنة الحالية في التذييل
    updateCurrentYear();
}

// الحصول على ترجمة لمفتاح معين
function getTranslation(key) {
    // تقسيم المفتاح إلى أجزاء (مثال: "nav.home" -> ["nav", "home"])
    const parts = key.split('.');
    
    // البحث عن الترجمة في كائن الترجمات
    let translation = translations;
    for (const part of parts) {
        if (translation && translation[part] !== undefined) {
            translation = translation[part];
        } else {
            console.warn(`Translation not found for key: ${key}`);
            return key; // إرجاع المفتاح نفسه إذا لم يتم العثور على ترجمة
        }
    }
    
    // إذا كانت الترجمة نصًا، أرجعها
    if (typeof translation === 'string') {
        return translation;
    }
    
    // وإلا، أرجع المفتاح نفسه
    console.warn(`Translation for key ${key} is not a string:`, translation);
    return key;
}

// إعداد مستمع الحدث لتغيير اللغة
function setupLanguageChangeListener() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const newLanguage = this.value;
            changeLanguage(newLanguage);
        });
    }
}

// تغيير اللغة
function changeLanguage(lang) {
    // حفظ اللغة الجديدة في التخزين المحلي
    localStorage.setItem('language', lang);
    currentLanguage = lang;
    
    // تحميل ملف الترجمة للغة الجديدة
    loadTranslations(lang);
    
    // تحديث اتجاه الصفحة
    updatePageDirection();
}

// تحديث اتجاه الصفحة بناءً على اللغة
function updatePageDirection() {
    const html = document.documentElement;
    
    if (currentLanguage === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
        
        // إضافة فئة rtl للجسم
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
        
        // إضافة فئة ltr للجسم
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
    }
}

// تحديث اسم التطبيق والشعار
function updateAppNameAndLogo() {
    // تحديث اسم التطبيق
    const appNameElements = document.querySelectorAll('#app-name, #footer-app-name');
    appNameElements.forEach(element => {
        if (translations.app && translations.app.name) {
            element.textContent = translations.app.name;
        }
    });
    
    // يمكن أيضًا تحديث الشعار إذا كان يختلف بين اللغات
    // const appLogoElements = document.querySelectorAll('#app-logo, #footer-logo');
    // appLogoElements.forEach(element => {
    //     if (translations.app && translations.app.logo) {
    //         element.src = translations.app.logo;
    //     }
    // });
}

// تحديث معلومات الاتصال في التذييل
function updateContactInfo() {
    // تحديث العنوان
    const addressElement = document.getElementById('contact-address');
    if (addressElement && translations.footer && translations.footer.contact && translations.footer.contact.address) {
        addressElement.textContent = translations.footer.contact.address;
    }
    
    // تحديث رقم الهاتف
    const phoneElement = document.getElementById('contact-phone');
    if (phoneElement && translations.footer && translations.footer.contact && translations.footer.contact.phone) {
        phoneElement.textContent = translations.footer.contact.phone;
    }
    
    // تحديث البريد الإلكتروني
    const emailElement = document.getElementById('contact-email');
    if (emailElement && translations.footer && translations.footer.contact && translations.footer.contact.email) {
        emailElement.textContent = translations.footer.contact.email;
    }
}

// تحديث السنة الحالية في التذييل
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// ترجمة نص باستخدام مفتاح
function translate(key, params = {}) {
    let translation = getTranslation(key);
    
    // استبدال المعلمات في النص
    for (const param in params) {
        translation = translation.replace(`{${param}}`, params[param]);
    }
    
    return translation;
}

// تحديث جميع النصوص في الصفحة
function updatePageTexts() {
    applyTranslations();
}

// تصدير الوظائف للاستخدام في ملفات أخرى
window.i18n = {
    translate,
    changeLanguage,
    getCurrentLanguage: () => currentLanguage,
    updatePageTexts
};
