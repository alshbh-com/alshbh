// وظائف إضافة التقييمات والمراجعات
// هذا الملف يحتوي على وظائف إضافة وعرض التقييمات والمراجعات للفنادق

// استدعاء Firebase
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // المستخدم مسجل الدخول
            console.log("المستخدم مسجل الدخول:", user.uid);
            setupReviewFunctionality(user);
        } else {
            // المستخدم غير مسجل الدخول
            console.log("المستخدم غير مسجل الدخول");
            // إخفاء أزرار إضافة التقييم
            hideReviewButtons();
        }
    });
});

// إعداد وظائف التقييم
function setupReviewFunctionality(user) {
    // الحصول على معرف الفندق من عنوان URL (إذا كنا في صفحة تفاصيل الفندق)
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');
    
    // إذا كنا في صفحة تفاصيل الفندق
    if (hotelId) {
        // التحقق مما إذا كان المستخدم قد أقام في هذا الفندق
        checkUserStayedAtHotel(user.uid, hotelId);
    }
    
    // إعداد نموذج إضافة التقييم
    setupReviewForm(user.uid);
    
    // إعداد أزرار إضافة التقييم في صفحة الحجوزات
    setupReviewButtons(user.uid);
}

// التحقق مما إذا كان المستخدم قد أقام في الفندق
function checkUserStayedAtHotel(userId, hotelId) {
    // البحث عن حجوزات المستخدم المكتملة لهذا الفندق
    firebase.firestore().collection('bookings')
        .where('userId', '==', userId)
        .where('hotelId', '==', hotelId)
        .where('status', '==', 'completed')
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // المستخدم لديه حجز مكتمل في هذا الفندق
                // التحقق مما إذا كان المستخدم قد قام بالتقييم بالفعل
                checkUserReviewedHotel(userId, hotelId);
            } else {
                // المستخدم لم يقم بالإقامة في هذا الفندق
                console.log("المستخدم لم يقم بالإقامة في هذا الفندق");
                // إخفاء زر إضافة التقييم في صفحة تفاصيل الفندق
                const addReviewBtn = document.getElementById('add-review-btn');
                if (addReviewBtn) {
                    addReviewBtn.style.display = 'none';
                }
            }
        })
        .catch((error) => {
            console.error("خطأ في التحقق من إقامة المستخدم:", error);
        });
}

// التحقق مما إذا كان المستخدم قد قام بالتقييم بالفعل
function checkUserReviewedHotel(userId, hotelId) {
    firebase.firestore().collection('reviews')
        .where('userId', '==', userId)
        .where('hotelId', '==', hotelId)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // المستخدم قام بالتقييم بالفعل
                console.log("المستخدم قام بالتقييم بالفعل");
                // تحديث زر إضافة التقييم
                const addReviewBtn = document.getElementById('add-review-btn');
                if (addReviewBtn) {
                    addReviewBtn.textContent = 'تعديل التقييم';
                    addReviewBtn.setAttribute('data-review-id', querySnapshot.docs[0].id);
                }
            }
        })
        .catch((error) => {
            console.error("خطأ في التحقق من تقييم المستخدم:", error);
        });
}

// إعداد نموذج إضافة التقييم
function setupReviewForm(userId) {
    const reviewForm = document.getElementById('review-form');
    if (!reviewForm) return;
    
    // إعداد نجوم التقييم
    setupRatingStars();
    
    // إضافة مستمع الحدث لزر إرسال التقييم
    const submitReviewBtn = document.getElementById('submit-review-btn');
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', function() {
            // التحقق من صحة البيانات
            if (!validateReviewForm()) {
                return;
            }
            
            // جمع بيانات التقييم
            const hotelId = document.getElementById('review-hotel-id').value;
            const bookingId = document.getElementById('review-booking-id').value;
            const rating = parseInt(document.getElementById('rating-input').getAttribute('data-selected') || '0');
            const title = document.getElementById('review-title').value;
            const text = document.getElementById('review-text').value;
            const serviceRatings = {
                cleanliness: parseInt(document.getElementById('cleanliness-rating').getAttribute('data-selected') || '0'),
                comfort: parseInt(document.getElementById('comfort-rating').getAttribute('data-selected') || '0'),
                location: parseInt(document.getElementById('location-rating').getAttribute('data-selected') || '0'),
                service: parseInt(document.getElementById('service-rating').getAttribute('data-selected') || '0')
            };
            
            // التحقق مما إذا كان هذا تعديلًا لتقييم موجود
            const reviewId = submitReviewBtn.getAttribute('data-review-id');
            
            if (reviewId) {
                // تحديث التقييم الموجود
                updateReview(reviewId, {
                    rating,
                    title,
                    text,
                    serviceRatings,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                // إضافة تقييم جديد
                addNewReview({
                    userId,
                    hotelId,
                    bookingId,
                    rating,
                    title,
                    text,
                    serviceRatings,
                    status: 'pending', // بانتظار الموافقة
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
    }
    
    // إضافة مستمع الحدث لزر إلغاء التقييم
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', function() {
            // إغلاق نافذة التقييم
            const reviewModal = document.getElementById('review-modal');
            if (reviewModal) {
                reviewModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// إعداد نجوم التقييم
function setupRatingStars() {
    const ratingInputs = document.querySelectorAll('.rating-input');
    
    ratingInputs.forEach(ratingInput => {
        const stars = ratingInput.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                highlightStars(stars, rating);
            });
            
            star.addEventListener('mouseout', () => {
                // إعادة تعيين النجوم إلى الحالة السابقة
                const selectedRating = parseInt(ratingInput.getAttribute('data-selected') || '0');
                highlightStars(stars, selectedRating);
            });
            
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                ratingInput.setAttribute('data-selected', rating.toString());
                highlightStars(stars, rating);
            });
        });
    });
}

// إبراز النجوم
function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// التحقق من صحة نموذج التقييم
function validateReviewForm() {
    // التحقق من التقييم العام
    const rating = parseInt(document.getElementById('rating-input').getAttribute('data-selected') || '0');
    if (rating === 0) {
        alert('يرجى تحديد التقييم العام.');
        return false;
    }
    
    // التحقق من عنوان التقييم
    const reviewTitle = document.getElementById('review-title').value;
    if (!reviewTitle) {
        alert('يرجى إدخال عنوان للتقييم.');
        return false;
    }
    
    // التحقق من نص التقييم
    const reviewText = document.getElementById('review-text').value;
    if (!reviewText) {
        alert('يرجى إدخال تفاصيل التقييم.');
        return false;
    }
    
    // التحقق من تقييمات الخدمات
    const serviceRatings = [
        parseInt(document.getElementById('cleanliness-rating').getAttribute('data-selected') || '0'),
        parseInt(document.getElementById('comfort-rating').getAttribute('data-selected') || '0'),
        parseInt(document.getElementById('location-rating').getAttribute('data-selected') || '0'),
        parseInt(document.getElementById('service-rating').getAttribute('data-selected') || '0')
    ];
    
    if (serviceRatings.some(rating => rating === 0)) {
        alert('يرجى تقييم جميع الخدمات.');
        return false;
    }
    
    return true;
}

// إضافة تقييم جديد
function addNewReview(reviewData) {
    firebase.firestore().collection('reviews')
        .add(reviewData)
        .then((docRef) => {
            console.log("تم إضافة التقييم بنجاح:", docRef.id);
            
            // إغلاق نافذة التقييم
            const reviewModal = document.getElementById('review-modal');
            if (reviewModal) {
                reviewModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // تحديث زر إضافة التقييم في صفحة الحجوزات
            updateReviewButtonStatus(reviewData.bookingId);
            
            // عرض رسالة نجاح
            alert('تم إرسال التقييم بنجاح. سيتم مراجعته ونشره قريبًا.');
            
            // تحديث متوسط تقييم الفندق
            updateHotelRating(reviewData.hotelId);
        })
        .catch((error) => {
            console.error("خطأ في إضافة التقييم:", error);
            alert('حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.');
        });
}

// تحديث تقييم موجود
function updateReview(reviewId, reviewData) {
    firebase.firestore().collection('reviews')
        .doc(reviewId)
        .update(reviewData)
        .then(() => {
            console.log("تم تحديث التقييم بنجاح");
            
            // إغلاق نافذة التقييم
            const reviewModal = document.getElementById('review-modal');
            if (reviewModal) {
                reviewModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // عرض رسالة نجاح
            alert('تم تحديث التقييم بنجاح.');
            
            // تحديث متوسط تقييم الفندق
            const hotelId = document.getElementById('review-hotel-id').value;
            updateHotelRating(hotelId);
        })
        .catch((error) => {
            console.error("خطأ في تحديث التقييم:", error);
            alert('حدث خطأ أثناء تحديث التقييم. يرجى المحاولة مرة أخرى.');
        });
}

// تحديث متوسط تقييم الفندق
function updateHotelRating(hotelId) {
    // الحصول على جميع التقييمات المعتمدة للفندق
    firebase.firestore().collection('reviews')
        .where('hotelId', '==', hotelId)
        .where('status', '==', 'approved')
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // حساب متوسط التقييم
                let totalRating = 0;
                let totalReviews = 0;
                
                querySnapshot.forEach((doc) => {
                    const reviewData = doc.data();
                    totalRating += reviewData.rating;
                    totalReviews++;
                });
                
                const averageRating = totalRating / totalReviews;
                
                // تحديث متوسط تقييم الفندق
                firebase.firestore().collection('hotels')
                    .doc(hotelId)
                    .update({
                        rating: averageRating,
                        reviewsCount: totalReviews
                    })
                    .then(() => {
                        console.log("تم تحديث متوسط تقييم الفندق بنجاح");
                    })
                    .catch((error) => {
                        console.error("خطأ في تحديث متوسط تقييم الفندق:", error);
                    });
            }
        })
        .catch((error) => {
            console.error("خطأ في الحصول على تقييمات الفندق:", error);
        });
}

// تحديث حالة زر إضافة التقييم في صفحة الحجوزات
function updateReviewButtonStatus(bookingId) {
    const reviewButton = document.querySelector(`.add-review-btn[data-booking-id="${bookingId}"]`);
    if (reviewButton) {
        reviewButton.textContent = 'تم التقييم';
        reviewButton.disabled = true;
        reviewButton.classList.remove('btn-outline');
        reviewButton.classList.add('btn-success');
    }
}

// إعداد أزرار إضافة التقييم في صفحة الحجوزات
function setupReviewButtons(userId) {
    const reviewButtons = document.querySelectorAll('.add-review-btn');
    
    reviewButtons.forEach(button => {
        const bookingId = button.getAttribute('data-booking-id');
        const hotelId = button.getAttribute('data-hotel-id');
        const hotelName = button.getAttribute('data-hotel-name');
        
        // التحقق مما إذا كان المستخدم قد قام بالتقييم بالفعل
        firebase.firestore().collection('reviews')
            .where('userId', '==', userId)
            .where('bookingId', '==', bookingId)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // المستخدم قام بالتقييم بالفعل
                    button.textContent = 'تم التقييم';
                    button.disabled = true;
                    button.classList.remove('btn-outline');
                    button.classList.add('btn-success');
                } else {
                    // إضافة مستمع الحدث لزر إضافة التقييم
                    button.addEventListener('click', function() {
                        // فتح نافذة إضافة التقييم
                        openReviewModal(bookingId, hotelId, hotelName);
                    });
                }
            })
            .catch((error) => {
                console.error("خطأ في التحقق من تقييم المستخدم:", error);
            });
    });
}

// فتح نافذة إضافة التقييم
function openReviewModal(bookingId, hotelId, hotelName) {
    const reviewModal = document.getElementById('review-modal');
    if (!reviewModal) return;
    
    // تحديث عنوان النافذة المنبثقة
    const reviewHotelName = document.getElementById('review-hotel-name');
    if (reviewHotelName) {
        reviewHotelName.textContent = hotelName;
    }
    
    // تحديث معرف الفندق ومعرف الحجز
    const reviewHotelId = document.getElementById('review-hotel-id');
    if (reviewHotelId) {
        reviewHotelId.value = hotelId;
    }
    
    const reviewBookingId = document.getElementById('review-booking-id');
    if (reviewBookingId) {
        reviewBookingId.value = bookingId;
    }
    
    // إعادة تعيين نموذج التقييم
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.reset();
    }
    
    // إعادة تعيين نجوم التقييم
    resetRatingStars();
    
    // فتح النافذة المنبثقة
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// إعادة تعيين نجوم التقييم
function resetRatingStars() {
    const ratingInputs = document.querySelectorAll('.rating-input');
    
    ratingInputs.forEach(ratingInput => {
        const stars = ratingInput.querySelectorAll('i');
        
        // إزالة الفئة النشطة من جميع النجوم
        stars.forEach(star => {
            star.classList.remove('active');
        });
        
        // إعادة تعيين السمة data-selected
        ratingInput.removeAttribute('data-selected');
    });
}

// إخفاء أزرار إضافة التقييم
function hideReviewButtons() {
    const reviewButtons = document.querySelectorAll('.add-review-btn');
    
    reviewButtons.forEach(button => {
        button.style.display = 'none';
    });
}

// عرض تقييمات الفندق
function displayHotelReviews(hotelId) {
    const reviewsContainer = document.getElementById('hotel-reviews');
    if (!reviewsContainer) return;
    
    // إضافة مؤشر التحميل
    reviewsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    
    // الحصول على تقييمات الفندق المعتمدة
    firebase.firestore().collection('reviews')
        .where('hotelId', '==', hotelId)
        .where('status', '==', 'approved')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            // إزالة مؤشر التحميل
            reviewsContainer.innerHTML = '';
            
            if (querySnapshot.empty) {
                // لا توجد تقييمات
                reviewsContainer.innerHTML = '<div class="no-reviews">لا توجد تقييمات لهذا الفندق حتى الآن.</div>';
                return;
            }
            
            // عرض التقييمات
            querySnapshot.forEach((doc) => {
                const reviewData = doc.data();
                
                // الحصول على بيانات المستخدم
                firebase.firestore().collection('users')
                    .doc(reviewData.userId)
                    .get()
                    .then((userDoc) => {
                        if (userDoc.exists) {
                            const userData = userDoc.data();
                            
                            // إنشاء عنصر التقييم
                            const reviewElement = createReviewElement(reviewData, userData);
                            
                            // إضافة عنصر التقييم إلى الحاوية
                            reviewsContainer.appendChild(reviewElement);
                        }
                    })
                    .catch((error) => {
                        console.error("خطأ في الحصول على بيانات المستخدم:", error);
                    });
            });
        })
        .catch((error) => {
            console.error("خطأ في الحصول على تقييمات الفندق:", error);
            reviewsContainer.innerHTML = '<div class="error-message">حدث خطأ أثناء تحميل التقييمات. يرجى المحاولة مرة أخرى.</div>';
        });
}

// إنشاء عنصر التقييم
function createReviewElement(reviewData, userData) {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    
    // تنسيق التاريخ
    const reviewDate = reviewData.createdAt ? new Date(reviewData.createdAt.toDate()) : new Date();
    const formattedDate = reviewDate.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // إنشاء نجوم التقييم
    let ratingStars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= reviewData.rating) {
            ratingStars += '<i class="fas fa-star"></i>';
        } else {
            ratingStars += '<i class="far fa-star"></i>';
        }
    }
    
    // إنشاء HTML للتقييم
    reviewElement.innerHTML = `
        <div class="review-header">
            <div class="review-user">
                <img src="${userData.photoURL || 'images/user-placeholder.png'}" alt="${userData.displayName || 'مستخدم'}" class="review-user-avatar">
                <div class="review-user-info">
                    <div class="review-user-name">${userData.displayName || 'مستخدم'}</div>
                    <div class="review-date">${formattedDate}</div>
                </div>
            </div>
            <div class="review-rating">
                <div class="rating-stars">${ratingStars}</div>
                <div class="rating-value">${reviewData.rating}/5</div>
            </div>
        </div>
        <div class="review-content">
            <h4 class="review-title">${reviewData.title}</h4>
            <p class="review-text">${reviewData.text}</p>
        </div>
        <div class="review-service-ratings">
            <div class="service-rating-item">
                <div class="service-rating-label">النظافة</div>
                <div class="service-rating-value">${reviewData.serviceRatings.cleanliness}/5</div>
            </div>
            <div class="service-rating-item">
                <div class="service-rating-label">الراحة</div>
                <div class="service-rating-value">${reviewData.serviceRatings.comfort}/5</div>
            </div>
            <div class="service-rating-item">
                <div class="service-rating-label">الموقع</div>
                <div class="service-rating-value">${reviewData.serviceRatings.location}/5</div>
            </div>
            <div class="service-rating-item">
                <div class="service-rating-label">الخدمة</div>
                <div class="service-rating-value">${reviewData.serviceRatings.service}/5</div>
            </div>
        </div>
    `;
    
    return reviewElement;
}
