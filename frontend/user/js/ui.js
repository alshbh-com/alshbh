// وظائف واجهة المستخدم العامة
// تطبيق محجوز - حجز الفنادق في اليمن

// تنفيذ عند تحميل المستند
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة عناصر واجهة المستخدم
    initUI();
    
    // تحميل البيانات الأولية
    loadInitialData();
    
    // إعداد أحداث النموذج
    setupFormEvents();
});

// تهيئة عناصر واجهة المستخدم
function initUI() {
    // تهيئة القائمة المتنقلة للجوال
    setupMobileMenu();
    
    // تهيئة قائمة الضيوف
    setupGuestsDropdown();
    
    // تحديث السنة الحالية في الفوتر
    updateCurrentYear();
    
    // تهيئة شريط التمرير للتقييمات
    setupTestimonialsSlider();
}

// تهيئة القائمة المتنقلة للجوال
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
}

// تهيئة قائمة الضيوف
function setupGuestsDropdown() {
    const guestsInput = document.getElementById('guests-input');
    const guestsDropdown = document.getElementById('guests-dropdown');
    const guestsApply = document.getElementById('guests-apply');
    
    if (guestsInput && guestsDropdown) {
        // فتح/إغلاق القائمة المنسدلة
        guestsInput.addEventListener('click', (e) => {
            e.stopPropagation();
            guestsDropdown.style.display = guestsDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (guestsDropdown.style.display === 'block' && !guestsDropdown.contains(e.target) && e.target !== guestsInput) {
                guestsDropdown.style.display = 'none';
            }
        });
        
        // إعداد أزرار العداد
        const counterButtons = document.querySelectorAll('.counter-btn');
        counterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const countElement = document.getElementById(`${target}-count`);
                let count = parseInt(countElement.textContent);
                
                if (button.classList.contains('plus')) {
                    // زيادة العدد مع مراعاة الحدود القصوى
                    if ((target === 'adults' && count < 10) || 
                        (target === 'children' && count < 6) || 
                        (target === 'rooms' && count < 5)) {
                        count++;
                    }
                } else if (button.classList.contains('minus')) {
                    // تقليل العدد مع مراعاة الحدود الدنيا
                    if ((target === 'adults' && count > 1) || 
                        (target === 'children' && count > 0) || 
                        (target === 'rooms' && count > 1)) {
                        count--;
                    }
                }
                
                countElement.textContent = count;
            });
        });
        
        // تطبيق التغييرات
        if (guestsApply) {
            guestsApply.addEventListener('click', () => {
                updateGuestsSummary();
                guestsDropdown.style.display = 'none';
            });
        }
    }
}

// تحديث ملخص الضيوف
function updateGuestsSummary() {
    const adultsCount = parseInt(document.getElementById('adults-count').textContent);
    const childrenCount = parseInt(document.getElementById('children-count').textContent);
    const roomsCount = parseInt(document.getElementById('rooms-count').textContent);
    const guestsSummary = document.getElementById('guests-summary');
    
    if (guestsSummary) {
        const adultsText = adultsCount === 1 ? 'بالغ' : 'بالغين';
        const childrenText = childrenCount === 1 ? 'طفل' : 'أطفال';
        const roomsText = roomsCount === 1 ? 'غرفة' : 'غرف';
        
        guestsSummary.textContent = `${adultsCount} ${adultsText}، ${childrenCount} ${childrenText}، ${roomsCount} ${roomsText}`;
    }
}

// تحديث السنة الحالية في الفوتر
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// تهيئة شريط التمرير للتقييمات
function setupTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const prevButton = document.getElementById('testimonial-prev');
    const nextButton = document.getElementById('testimonial-next');
    
    if (slider && prevButton && nextButton) {
        let slideIndex = 0;
        let slideWidth = 0;
        let slidesCount = 0;
        
        // تحديث أبعاد الشرائح
        function updateSliderDimensions() {
            const slide = slider.querySelector('.testimonial-card');
            if (slide) {
                slideWidth = slide.offsetWidth + parseInt(window.getComputedStyle(slide).marginRight);
                slidesCount = slider.children.length;
            }
        }
        
        // التمرير إلى الشريحة المحددة
        function scrollToSlide(index) {
            updateSliderDimensions();
            
            // التأكد من أن الفهرس ضمن النطاق
            if (index < 0) {
                slideIndex = 0;
            } else if (index >= slidesCount - getVisibleSlidesCount()) {
                slideIndex = slidesCount - getVisibleSlidesCount();
            } else {
                slideIndex = index;
            }
            
            slider.scrollTo({
                left: slideIndex * slideWidth,
                behavior: 'smooth'
            });
        }
        
        // الحصول على عدد الشرائح المرئية
        function getVisibleSlidesCount() {
            return Math.floor(slider.offsetWidth / slideWidth);
        }
        
        // إعداد أزرار التنقل
        prevButton.addEventListener('click', () => {
            scrollToSlide(slideIndex - 1);
        });
        
        nextButton.addEventListener('click', () => {
            scrollToSlide(slideIndex + 1);
        });
        
        // تحديث الأبعاد عند تغيير حجم النافذة
        window.addEventListener('resize', () => {
            updateSliderDimensions();
            scrollToSlide(slideIndex);
        });
        
        // تهيئة أولية
        updateSliderDimensions();
    }
}

// تحميل البيانات الأولية
async function loadInitialData() {
    try {
        // تحميل إعدادات التطبيق
        loadAppSettings();
        
        // تحميل الفنادق المميزة
        loadFeaturedHotels();
        
        // تحميل عدد الفنادق في المدن
        loadCityHotelsCount();
        
        // تحميل التقييمات
        loadTestimonials();
    } catch (error) {
        console.error('خطأ في تحميل البيانات الأولية:', error);
    }
}

// تحميل إعدادات التطبيق
async function loadAppSettings() {
    try {
        const settings = await getAppSettings();
        
        // تحديث اسم التطبيق
        const appNameElements = document.querySelectorAll('#app-name, #footer-app-name');
        appNameElements.forEach(element => {
            element.textContent = settings.appName || 'محجوز';
        });
        
        // تحديث شعار التطبيق
        if (settings.appLogoUrl) {
            const logoElements = document.querySelectorAll('#app-logo, #footer-logo');
            logoElements.forEach(element => {
                element.src = settings.appLogoUrl;
            });
        }
        
        // تحديث معلومات الاتصال
        if (settings.contactEmail) {
            const contactEmailElement = document.getElementById('contact-email');
            if (contactEmailElement) {
                contactEmailElement.textContent = settings.contactEmail;
            }
        }
        
        if (settings.contactPhone) {
            const contactPhoneElement = document.getElementById('contact-phone');
            if (contactPhoneElement) {
                contactPhoneElement.textContent = settings.contactPhone;
            }
        }
        
        if (settings.contactAddress) {
            const contactAddressElement = document.getElementById('contact-address');
            if (contactAddressElement) {
                contactAddressElement.textContent = settings.contactAddress;
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل إعدادات التطبيق:', error);
    }
}

// تحميل الفنادق المميزة
async function loadFeaturedHotels() {
    const hotelsContainer = document.getElementById('top-hotels-container');
    if (!hotelsContainer) return;
    
    try {
        const hotels = await getFeaturedHotels(4);
        
        // إزالة هياكل التحميل
        hotelsContainer.innerHTML = '';
        
        // إضافة الفنادق
        hotels.forEach(hotel => {
            const hotelCard = createHotelCard(hotel);
            hotelsContainer.appendChild(hotelCard);
        });
    } catch (error) {
        console.error('خطأ في تحميل الفنادق المميزة:', error);
        hotelsContainer.innerHTML = '<p>حدث خطأ أثناء تحميل الفنادق. يرجى المحاولة مرة أخرى.</p>';
    }
}

// إنشاء بطاقة فندق
function createHotelCard(hotel) {
    const card = document.createElement('a');
    card.href = `hotel.html?id=${hotel.id}`;
    card.className = 'hotel-card';
    
    // تنسيق السعر
    const formattedPrice = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: hotel.currency || 'SAR'
    }).format(hotel.price);
    
    // إنشاء نجوم التقييم
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= hotel.rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= hotel.rating) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    card.innerHTML = `
        <img src="${hotel.thumbnail || 'images/hotel-placeholder.jpg'}" alt="${hotel.name}" class="hotel-image">
        <div class="hotel-info">
            <h3 class="hotel-name">${hotel.name}</h3>
            <div class="hotel-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${hotel.city}, ${hotel.neighborhood || ''}</span>
            </div>
            <div class="hotel-rating">
                <div class="rating-stars">${starsHTML}</div>
                <span class="rating-count">(${hotel.reviewsCount || 0} تقييم)</span>
            </div>
            <div class="hotel-price">
                <div>
                    <span class="price">${formattedPrice}</span>
                    <span class="price-period">/ ليلة</span>
                </div>
                <button class="btn btn-primary btn-sm">عرض التفاصيل</button>
            </div>
        </div>
    `;
    
    return card;
}

// تحميل عدد الفنادق في المدن
async function loadCityHotelsCount() {
    try {
        const cityCounts = await getCityHotelsCount();
        
        // تحديث عدد الفنادق في كل مدينة
        Object.keys(cityCounts).forEach(city => {
            const countElement = document.getElementById(`${city}-hotels-count`);
            if (countElement) {
                countElement.textContent = cityCounts[city];
            }
        });
    } catch (error) {
        console.error('خطأ في تحميل عدد الفنادق في المدن:', error);
    }
}

// تحميل التقييمات
async function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;
    
    try {
        // الحصول على التقييمات المميزة
        const reviews = await fetchAPI('/reviews/featured');
        
        // إزالة هياكل التحميل
        testimonialsContainer.innerHTML = '';
        
        // إضافة التقييمات
        reviews.forEach(review => {
            const testimonialCard = createTestimonialCard(review);
            testimonialsContainer.appendChild(testimonialCard);
        });
        
        // تحديث شريط التمرير
        setupTestimonialsSlider();
    } catch (error) {
        console.error('خطأ في تحميل التقييمات:', error);
        testimonialsContainer.innerHTML = '<p>حدث خطأ أثناء تحميل التقييمات. يرجى المحاولة مرة أخرى.</p>';
    }
}

// إنشاء بطاقة تقييم
function createTestimonialCard(review) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    // تنسيق التاريخ
    const reviewDate = review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : '';
    
    // إنشاء نجوم التقييم
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= review.rating.overall) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= review.rating.overall) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    card.innerHTML = `
        <div class="testimonial-header">
            <img src="${review.userPhoto || 'images/user-placeholder.png'}" alt="${review.userName}" class="testimonial-avatar">
            <div class="testimonial-user">
                <h4>${review.userName}</h4>
                <div class="testimonial-date">${reviewDate}</div>
            </div>
        </div>
        <div class="testimonial-rating">${starsHTML}</div>
        <p class="testimonial-text">${review.comment}</p>
    `;
    
    return card;
}

// إعداد أحداث النموذج
function setupFormEvents() {
    // نموذج البحث الرئيسي
    const heroSearchForm = document.getElementById('hero-search-form');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // جمع بيانات البحث
            const destination = document.getElementById('destination').value;
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const adults = document.getElementById('adults-count').textContent;
            const children = document.getElementById('children-count').textContent;
            const rooms = document.getElementById('rooms-count').textContent;
            
            // بناء عنوان URL للبحث
            const searchParams = new URLSearchParams();
            if (destination) searchParams.append('destination', destination);
            if (checkIn) searchParams.append('checkIn', checkIn);
            if (checkOut) searchParams.append('checkOut', checkOut);
            searchParams.append('adults', adults);
            searchParams.append('children', children);
            searchParams.append('rooms', rooms);
            
            // الانتقال إلى صفحة البحث
            window.location.href = `search.html?${searchParams.toString()}`;
        });
    }
    
    // نموذج الاشتراك في النشرة البريدية
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();
            
            if (!email) {
                showAlert('يرجى إدخال بريدك الإلكتروني', 'error');
                return;
            }
            
            try {
                await subscribeToNewsletter(email);
                showAlert('تم الاشتراك في النشرة البريدية بنجاح', 'success');
                emailInput.value = '';
            } catch (error) {
                showAlert('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.', 'error');
            }
        });
    }
}

// عرض تنبيه للمستخدم
function showAlert(message, type = 'info') {
    // التحقق من وجود حاوية التنبيهات
    let alertsContainer = document.querySelector('.alerts-container');
    
    // إنشاء حاوية التنبيهات إذا لم تكن موجودة
    if (!alertsContainer) {
        alertsContainer = document.createElement('div');
        alertsContainer.className = 'alerts-container';
        document.body.appendChild(alertsContainer);
        
        // إضافة أنماط CSS للتنبيهات
        const style = document.createElement('style');
        style.textContent = `
            .alerts-container {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 90%;
                width: 400px;
            }
            
            .alert {
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                animation: slideIn 0.3s ease-out forwards;
            }
            
            .alert-success {
                background-color: #4caf50;
                color: white;
            }
            
            .alert-error {
                background-color: #f44336;
                color: white;
            }
            
            .alert-info {
                background-color: #2196f3;
                color: white;
            }
            
            .alert-warning {
                background-color: #ff9800;
                color: white;
            }
            
            .alert-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 20px;
                margin-right: 10px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // إنشاء عنصر التنبيه
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;
    
    // إضافة التنبيه إلى الحاوية
    alertsContainer.appendChild(alert);
    
    // إعداد زر الإغلاق
    const closeButton = alert.querySelector('.alert-close');
    closeButton.addEventListener('click', () => {
        alert.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            alertsContainer.removeChild(alert);
        }, 300);
    });
    
    // إزالة التنبيه تلقائيًا بعد 5 ثوانٍ
    setTimeout(() => {
        if (alert.parentNode === alertsContainer) {
            alert.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (alert.parentNode === alertsContainer) {
                    alertsContainer.removeChild(alert);
                }
            }, 300);
        }
    }, 5000);
}

// إظهار حالة التحميل
function showLoading(containerId, isLoading) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (isLoading) {
        // إنشاء عنصر التحميل
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-spinner';
        loadingElement.innerHTML = '<div class="spinner"></div>';
        
        // إضافة أنماط CSS للتحميل
        if (!document.getElementById('loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .loading-spinner {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // إضافة عنصر التحميل إلى الحاوية
        container.style.position = 'relative';
        container.appendChild(loadingElement);
    } else {
        // إزالة عنصر التحميل
        const loadingElement = container.querySelector('.loading-spinner');
        if (loadingElement) {
            container.removeChild(loadingElement);
        }
    }
}
