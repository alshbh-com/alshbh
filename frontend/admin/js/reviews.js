// وظائف إدارة المراجعات للوحة التحكم الإدارية

// تحميل قائمة المراجعات
async function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    
    try {
        // إظهار حالة التحميل
        reviewsList.innerHTML = '<p>جاري تحميل المراجعات...</p>';
        
        // الحصول على قائمة المراجعات
        const reviews = await fetchAllReviews();
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>لا توجد مراجعات حاليًا.</p>';
            return;
        }
        
        // فرز المراجعات: المعلقة أولاً ثم المعتمدة
        reviews.sort((a, b) => {
            if (a.approved === b.approved) {
                // إذا كانت الحالة متساوية، رتب حسب التاريخ (الأحدث أولاً)
                return b.createdAt.seconds - a.createdAt.seconds;
            }
            // المراجعات المعلقة أولاً
            return a.approved ? 1 : -1;
        });
        
        // إنشاء جدول المراجعات
        let tableHTML = `
            <div class="reviews-filter">
                <label for="reviews-filter-select">عرض:</label>
                <select id="reviews-filter-select">
                    <option value="all">جميع المراجعات</option>
                    <option value="pending">المراجعات المعلقة</option>
                    <option value="approved">المراجعات المعتمدة</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>الفندق</th>
                        <th>المستخدم</th>
                        <th>التقييم</th>
                        <th>التعليق</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // إضافة صفوف المراجعات
        for (const review of reviews) {
            // تنسيق التاريخ
            const createdAt = review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير معروف';
            
            // تحديد لون الحالة
            const statusClass = review.approved ? 'status-approved' : 'status-pending';
            const statusText = review.approved ? 'معتمدة' : 'معلقة';
            
            // تقصير التعليق إذا كان طويلاً
            const shortComment = review.comment.length > 50 ? review.comment.substring(0, 50) + '...' : review.comment;
            
            tableHTML += `
                <tr class="review-row ${review.approved ? 'approved' : 'pending'}">
                    <td>${review.hotelName || review.hotelId}</td>
                    <td>${review.userName || review.userId}</td>
                    <td>${review.rating.overall} ★</td>
                    <td>${shortComment}</td>
                    <td>${createdAt}</td>
                    <td class="${statusClass}">${statusText}</td>
                    <td>
                        <button class="view-review-button" data-id="${review.id}">عرض</button>
                        ${!review.approved ? `<button class="approve-review-button" data-id="${review.id}">اعتماد</button>` : ''}
                        <button class="delete-review-button" data-id="${review.id}">حذف</button>
                    </td>
                </tr>
            `;
        }
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        // عرض الجدول
        reviewsList.innerHTML = tableHTML;
        
        // إعداد أزرار الإجراءات
        setupReviewActionButtons();
        
        // إعداد فلتر المراجعات
        setupReviewsFilter();
        
    } catch (error) {
        reviewsList.innerHTML = '<p>حدث خطأ أثناء تحميل المراجعات.</p>';
        console.error('خطأ في تحميل المراجعات:', error);
    }
}

// إعداد فلتر المراجعات
function setupReviewsFilter() {
    const filterSelect = document.getElementById('reviews-filter-select');
    
    filterSelect.addEventListener('change', () => {
        const filterValue = filterSelect.value;
        const reviewRows = document.querySelectorAll('.review-row');
        
        reviewRows.forEach(row => {
            if (filterValue === 'all') {
                row.style.display = '';
            } else if (filterValue === 'pending') {
                row.style.display = row.classList.contains('pending') ? '' : 'none';
            } else if (filterValue === 'approved') {
                row.style.display = row.classList.contains('approved') ? '' : 'none';
            }
        });
    });
}

// إعداد أزرار إجراءات المراجعات
function setupReviewActionButtons() {
    // أزرار عرض المراجعة
    const viewButtons = document.querySelectorAll('.view-review-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-id');
            // تنفيذ وظيفة عرض المراجعة
            viewReviewDetails(reviewId);
        });
    });
    
    // أزرار اعتماد المراجعة
    const approveButtons = document.querySelectorAll('.approve-review-button');
    approveButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-id');
            // تنفيذ وظيفة اعتماد المراجعة
            confirmApproveReview(reviewId);
        });
    });
    
    // أزرار حذف المراجعة
    const deleteButtons = document.querySelectorAll('.delete-review-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-id');
            // تنفيذ وظيفة حذف المراجعة
            confirmDeleteReview(reviewId);
        });
    });
}

// عرض تفاصيل المراجعة
async function viewReviewDetails(reviewId) {
    try {
        // الحصول على تفاصيل المراجعة
        // هذه الوظيفة تحتاج إلى إضافتها إلى ملف api.js
        const review = await fetchReviewById(reviewId);
        
        // إنشاء نافذة منبثقة لعرض التفاصيل
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'review-details-modal';
        
        // تنسيق التاريخ
        const createdAt = review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير معروف';
        
        // تحديد لون الحالة
        const statusClass = review.approved ? 'status-approved' : 'status-pending';
        const statusText = review.approved ? 'معتمدة' : 'معلقة';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>تفاصيل المراجعة</h2>
                <div class="review-details">
                    <p><strong>الفندق:</strong> ${review.hotelName || review.hotelId}</p>
                    <p><strong>المستخدم:</strong> ${review.userName || review.userId}</p>
                    <p><strong>التقييم الكلي:</strong> ${review.rating.overall} ★</p>
                    <p><strong>تقييم النظافة:</strong> ${review.rating.cleanliness || 0} ★</p>
                    <p><strong>تقييم الخدمة:</strong> ${review.rating.service || 0} ★</p>
                    <p><strong>تقييم الموقع:</strong> ${review.rating.location || 0} ★</p>
                    <p><strong>تقييم القيمة:</strong> ${review.rating.value || 0} ★</p>
                    <p><strong>التعليق:</strong> ${review.comment}</p>
                    <p><strong>التاريخ:</strong> ${createdAt}</p>
                    <p><strong>الحالة:</strong> <span class="${statusClass}">${statusText}</span></p>
                </div>
                <div class="review-actions">
                    ${!review.approved ? `<button id="approve-review-btn" data-id="${review.id}">اعتماد المراجعة</button>` : ''}
                    <button id="delete-review-btn" data-id="${review.id}">حذف المراجعة</button>
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
        
        // إعداد زر الاعتماد
        const approveButton = document.getElementById('approve-review-btn');
        if (approveButton) {
            approveButton.addEventListener('click', () => {
                const reviewId = approveButton.getAttribute('data-id');
                document.body.removeChild(modal);
                confirmApproveReview(reviewId);
            });
        }
        
        // إعداد زر الحذف
        const deleteButton = document.getElementById('delete-review-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                const reviewId = deleteButton.getAttribute('data-id');
                document.body.removeChild(modal);
                confirmDeleteReview(reviewId);
            });
        }
        
    } catch (error) {
        console.error('خطأ في عرض تفاصيل المراجعة:', error);
        showAlert('حدث خطأ أثناء تحميل تفاصيل المراجعة', 'error');
    }
}

// تأكيد اعتماد المراجعة
function confirmApproveReview(reviewId) {
    if (confirm('هل أنت متأكد من اعتماد هذه المراجعة؟')) {
        approveReview(reviewId);
    }
}

// اعتماد المراجعة
async function approveReview(reviewId) {
    try {
        // اعتماد المراجعة
        await approveReview(reviewId);
        
        // إعادة تحميل قائمة المراجعات
        loadReviews();
        
        // عرض رسالة نجاح
        showAlert('تم اعتماد المراجعة بنجاح', 'success');
        
    } catch (error) {
        console.error('خطأ في اعتماد المراجعة:', error);
        showAlert('حدث خطأ أثناء اعتماد المراجعة', 'error');
    }
}

// تأكيد حذف المراجعة
function confirmDeleteReview(reviewId) {
    if (confirm('هل أنت متأكد من حذف هذه المراجعة؟ لا يمكن التراجع عن هذا الإجراء.')) {
        deleteReview(reviewId);
    }
}

// حذف المراجعة
async function deleteReview(reviewId) {
    try {
        // حذف المراجعة
        await deleteReview(reviewId);
        
        // إعادة تحميل قائمة المراجعات
        loadReviews();
        
        // عرض رسالة نجاح
        showAlert('تم حذف المراجعة بنجاح', 'success');
        
    } catch (error) {
        console.error('خطأ في حذف المراجعة:', error);
        showAlert('حدث خطأ أثناء حذف المراجعة', 'error');
    }
}

// الحصول على مراجعة محددة (يجب إضافتها إلى ملف api.js)
async function fetchReviewById(reviewId) {
    return await fetchAPI(`/reviews/${reviewId}`);
}
