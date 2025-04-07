// عرض محتويات السلة
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>سلة التسوق فارغة</p>';
        } else {
            cart.forEach(item => {
                cartItemsContainer.innerHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${item.price} ر.س</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn plus">+</button>
                            </div>
                            <div class="remove-item">إزالة</div>
                        </div>
                    </div>
                `;
            });
        }
        
        updateCartSummary();
    }
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
    
    // إدارة الكمية
    document.addEventListener('click', function(e) {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        
        const productId = cartItem.getAttribute('data-id');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (e.target.classList.contains('plus')) {
            cart[itemIndex].quantity += 1;
        } else if (e.target.classList.contains('minus')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                // إذا كانت الكمية 1 ونقوم بالطرح، نزيل العنصر
                cart.splice(itemIndex, 1);
                cartItem.remove();
            }
        } else if (e.target.classList.contains('remove-item')) {
            cart.splice(itemIndex, 1);
            cartItem.remove();
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartSummary();
        updateCartCount();
        
        // إذا أصبحت السلة فارغة
        if (cart.length === 0) {
            document.getElementById('cart-items').innerHTML = '<p>سلة التسوق فارغة</p>';
        }
    });
});

// تحديث ملخص السلة
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const total = subtotal + 15; // إضافة رسوم التوصيل
    
    document.getElementById('subtotal').textContent = `${subtotal} ج.م`;
    document.getElementById('total').textContent = `${total} ج.م`;
}