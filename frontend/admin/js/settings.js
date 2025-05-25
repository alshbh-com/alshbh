// وظائف إدارة إعدادات التطبيق للوحة التحكم الإدارية

// تحميل إعدادات التطبيق
async function loadAppSettings() {
    try {
        // الحصول على إعدادات التطبيق
        const settings = await fetchAppSettings();
        
        // تحديث حقول النموذج
        document.getElementById('setting-app-name').value = settings.appName || '';
        
        // إذا كان هناك حقول إضافية، يمكن إضافتها هنا
        if (document.getElementById('setting-contact-email')) {
            document.getElementById('setting-contact-email').value = settings.contactEmail || '';
        }
        
        if (document.getElementById('setting-currency')) {
            document.getElementById('setting-currency').value = settings.defaultCurrency || 'SAR';
        }
        
        // تحديث اسم التطبيق في الواجهة
        document.getElementById('app-name-display').textContent = settings.appName || 'تطبيق حجز الفنادق';
        
        // إذا كان هناك شعار، يمكن تحديثه هنا
        if (settings.appLogoUrl) {
            // إضافة عنصر الصورة إذا لم يكن موجودًا
            let logoImg = document.getElementById('app-logo');
            if (!logoImg) {
                logoImg = document.createElement('img');
                logoImg.id = 'app-logo';
                logoImg.alt = 'شعار التطبيق';
                // إضافة الصورة إلى العنصر المناسب
                const headerTitle = document.querySelector('header h1');
                if (headerTitle) {
                    headerTitle.prepend(logoImg);
                }
            }
            logoImg.src = settings.appLogoUrl;
        }
        
    } catch (error) {
        console.error('خطأ في تحميل إعدادات التطبيق:', error);
        showAlert('حدث خطأ أثناء تحميل إعدادات التطبيق', 'error');
    }
}

// إعداد صفحة الإعدادات
function setupSettingsPage() {
    const settingsForm = document.getElementById('settings-form');
    
    // إضافة حقول إضافية للنموذج
    settingsForm.innerHTML = `
        <label for="setting-app-name">اسم التطبيق:</label>
        <input type="text" id="setting-app-name" required>
        
        <label for="setting-contact-email">البريد الإلكتروني للتواصل:</label>
        <input type="email" id="setting-contact-email">
        
        <label for="setting-currency">العملة الافتراضية:</label>
        <select id="setting-currency">
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="YER">ريال يمني (YER)</option>
            <option value="USD">دولار أمريكي (USD)</option>
        </select>
        
        <label for="setting-app-logo">شعار التطبيق:</label>
        <div class="file-upload">
            <input type="file" id="setting-app-logo" accept="image/*">
            <div id="logo-preview"></div>
        </div>
        
        <button type="submit">حفظ الإعدادات</button>
    `;
    
    // إعداد معاينة الشعار
    const logoInput = document.getElementById('setting-app-logo');
    const logoPreview = document.getElementById('logo-preview');
    
    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="معاينة الشعار">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // إعداد نموذج الإعدادات
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // إظهار حالة التحميل
            showLoading('settings-form', true);
            
            // جمع بيانات الإعدادات
            const settingsData = {
                appName: document.getElementById('setting-app-name').value,
                contactEmail: document.getElementById('setting-contact-email').value,
                defaultCurrency: document.getElementById('setting-currency').value
            };
            
            // رفع الشعار إذا تم اختياره
            const logoFile = document.getElementById('setting-app-logo').files[0];
            if (logoFile) {
                try {
                    const logoUrl = await uploadImage(logoFile, 'app_logos');
                    settingsData.appLogoUrl = logoUrl;
                } catch (uploadError) {
                    console.error('خطأ في رفع الشعار:', uploadError);
                    showAlert('حدث خطأ أثناء رفع الشعار', 'error');
                }
            }
            
            // إرسال البيانات إلى الواجهة الخلفية
            const updatedSettings = await updateAppSettings(settingsData);
            
            // تحديث اسم التطبيق في الواجهة
            document.getElementById('app-name-display').textContent = updatedSettings.appName;
            
            // تحديث الشعار إذا تم تغييره
            if (updatedSettings.appLogoUrl) {
                let logoImg = document.getElementById('app-logo');
                if (!logoImg) {
                    logoImg = document.createElement('img');
                    logoImg.id = 'app-logo';
                    logoImg.alt = 'شعار التطبيق';
                    const headerTitle = document.querySelector('header h1');
                    if (headerTitle) {
                        headerTitle.prepend(logoImg);
                    }
                }
                logoImg.src = updatedSettings.appLogoUrl;
            }
            
            // عرض رسالة نجاح
            showAlert('تم حفظ الإعدادات بنجاح', 'success');
            
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات:', error);
            showAlert('حدث خطأ أثناء حفظ الإعدادات', 'error');
        } finally {
            // إخفاء حالة التحميل
            showLoading('settings-form', false);
        }
    });
    
    // تحميل الإعدادات الحالية
    loadAppSettings();
}
