// وظائف إدارة الحجوزات للوحة التحكم الإدارية

// تحميل قائمة الحجوزات
async function loadBookings() {
    const bookingsList = document.getElementById('bookings-list');
    
    try {
        // إظهار حالة التحميل
        bookingsList.innerHTML = '<p>جاري تحميل الحجوزات...</p>';
        
        // الحصول على قائمة الحجوزات
        const bookings = await fetchAllBookings();
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>لا توجد حجوزات حاليًا.</p>';
            return;
        }
        
        // إنشاء جدول الحجوزات
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>رقم الحجز</th>
                        <th>الفندق</th>
                        <th>المستخدم</th>
                        <th>تاريخ الوصول</th>
                        <th>تاريخ المغادرة</th>
                        <th>المبلغ</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // إضافة صفوف الحجوزات
        for (const booking of bookings) {
            // تنسيق التواريخ
            const checkInDate = new Date(booking.checkInDate.seconds * 1000).toLocaleDateString('ar-SA');
            const checkOutDate = new Date(booking.checkOutDate.seconds * 1000).toLocaleDateString('ar-SA');
            
            // تحديد لون الحالة
            let statusClass = '';
            switch (booking.bookingStatus) {
                case 'confirmed':
                    statusClass = 'status-confirmed';
                    break;
                case 'completed':
                    statusClass = 'status-completed';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    break;
                default:
                    statusClass = '';
            }
            
            // ترجمة حالة الحجز
            let statusText = '';
            switch (booking.bookingStatus) {
                case 'confirmed':
                    statusText = 'مؤكد';
                    break;
                case 'completed':
                    statusText = 'مكتمل';
                    break;
                case 'cancelled':
                    statusText = 'ملغي';
                    break;
                default:
                    statusText = booking.bookingStatus;
            }
            
            tableHTML += `
                <tr>
                    <td>${booking.id.substring(0, 8)}...</td>
                    <td>${booking.hotelName || 'غير معروف'}</td>
                    <td>${booking.userName || booking.userId}</td>
                    <td>${checkInDate}</td>
                    <td>${checkOutDate}</td>
                    <td>${booking.totalAmount} ${booking.currency || 'SAR'}</td>
                    <td class="${statusClass}">${statusText}</td>
                    <td>
                        <button class="view-booking-button" data-id="${booking.id}">عرض</button>
                        <button class="update-booking-status-button" data-id="${booking.id}">تحديث الحالة</button>
                    </td>
                </tr>
            `;
        }
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        // عرض الجدول
        bookingsList.innerHTML = tableHTML;
        
        // إعداد أزرار الإجراءات
        setupBookingActionButtons();
        
    } catch (error) {
        bookingsList.innerHTML = '<p>حدث خطأ أثناء تحميل الحجوزات.</p>';
        console.error('خطأ في تحميل الحجوزات:', error);
    }
}

// إعداد أزرار إجراءات الحجوزات
function setupBookingActionButtons() {
    // أزرار عرض الحجز
    const viewButtons = document.querySelectorAll('.view-booking-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            // تنفيذ وظيفة عرض الحجز
            viewBookingDetails(bookingId);
        });
    });
    
    // أزرار تحديث حالة الحجز
    const updateStatusButtons = document.querySelectorAll('.update-booking-status-button');
    updateStatusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            // تنفيذ وظيفة تحديث حالة الحجز
            showUpdateBookingStatusModal(bookingId);
        });
    });
}

// عرض تفاصيل الحجز
async function viewBookingDetails(bookingId) {
    try {
        // الحصول على تفاصيل الحجز
        const booking = await fetchBookingById(bookingId);
        
        // إنشاء نافذة منبثقة لعرض التفاصيل
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'booking-details-modal';
        
        // تنسيق التواريخ
        const checkInDate = new Date(booking.checkInDate.seconds * 1000).toLocaleDateString('ar-SA');
        const checkOutDate = new Date(booking.checkOutDate.seconds * 1000).toLocaleDateString('ar-SA');
        const bookingDate = booking.createdAt ? new Date(booking.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير معروف';
        
        // ترجمة حالة الحجز
        let statusText = '';
        switch (booking.bookingStatus) {
            case 'confirmed':
                statusText = 'مؤكد';
                break;
            case 'completed':
                statusText = 'مكتمل';
                break;
            case 'cancelled':
                statusText = 'ملغي';
                break;
            default:
                statusText = booking.bookingStatus;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>تفاصيل الحجز</h2>
                <div class="booking-details">
                    <p><strong>رقم الحجز:</strong> ${booking.id}</p>
                    <p><strong>الفندق:</strong> ${booking.hotelName || 'غير معروف'}</p>
                    <p><strong>نوع الغرفة:</strong> ${booking.roomName || 'غير معروف'}</p>
                    <p><strong>المستخدم:</strong> ${booking.userName || booking.userId}</p>
                    <p><strong>تاريخ الوصول:</strong> ${checkInDate}</p>
                    <p><strong>تاريخ المغادرة:</strong> ${checkOutDate}</p>
                    <p><strong>عدد الليالي:</strong> ${booking.numberOfNights || 'غير معروف'}</p>
                    <p><strong>عدد الضيوف:</strong> ${booking.guestsCount || 'غير معروف'}</p>
                    <p><strong>المبلغ:</strong> ${booking.totalAmount} ${booking.currency || 'SAR'}</p>
                    <p><strong>حالة الحجز:</strong> ${statusText}</p>
                    <p><strong>تاريخ الحجز:</strong> ${bookingDate}</p>
                    <p><strong>ملاحظات:</strong> ${booking.notes || 'لا توجد ملاحظات'}</p>
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
        
    } catch (error) {
        console.error('خطأ في عرض تفاصيل الحجز:', error);
        showAlert('حدث خطأ أثناء تحميل تفاصيل الحجز', 'error');
    }
}

// عرض نافذة تحديث حالة الحجز
async function showUpdateBookingStatusModal(bookingId) {
    try {
        // الحصول على تفاصيل الحجز
        const booking = await fetchBookingById(bookingId);
        
        // إنشاء نافذة منبثقة لتحديث الحالة
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'update-booking-status-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>تحديث حالة الحجز</h2>
                <form id="update-booking-status-form">
                    <input type="hidden" id="booking-id" value="${bookingId}">
                    <label for="booking-status">الحالة الجديدة:</label>
                    <select id="booking-status" required>
                        <option value="confirmed" ${booking.bookingStatus === 'confirmed' ? 'selected' : ''}>مؤكد</option>
                        <option value="completed" ${booking.bookingStatus === 'completed' ? 'selected' : ''}>مكتمل</option>
                        <option value="cancelled" ${booking.bookingStatus === 'cancelled' ? 'selected' : ''}>ملغي</option>
                    </select>
                    <button type="submit">تحديث الحالة</button>
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
        
        // إعداد نموذج تحديث الحالة
        const form = document.getElementById('update-booking-status-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const bookingId = document.getElementById('booking-id').value;
            const newStatus = document.getElementById('booking-status').value;
            
            try {
                // تحديث حالة الحجز
                // هذه الوظيفة تحتاج إلى إضافتها إلى ملف api.js
                await updateBookingStatus(bookingId, newStatus);
                
                // إغلاق النافذة المنبثقة
                document.body.removeChild(modal);
                
                // إعادة تحميل قائمة الحجوزات
                loadBookings();
                
                // عرض رسالة نجاح
                showAlert('تم تحديث حالة الحجز بنجاح', 'success');
                
            } catch (error) {
                console.error('خطأ في تحديث حالة الحجز:', error);
                showAlert('حدث خطأ أثناء تحديث حالة الحجز', 'error');
            }
        });
        
    } catch (error) {
        console.error('خطأ في عرض نافذة تحديث حالة الحجز:', error);
        showAlert('حدث خطأ أثناء تحميل بيانات الحجز', 'error');
    }
}

// تحديث حالة الحجز (يجب إضافتها إلى ملف api.js)
async function updateBookingStatus(bookingId, newStatus) {
    return await fetchAPI(`/bookings/${bookingId}/status`, 'PUT', { status: newStatus });
}
