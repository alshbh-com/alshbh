// عرض المنتجات
document.addEventListener('DOMContentLoaded', function() {
    // تحميل المنتجات من Firebase
    db.collection('products').get().then((querySnapshot) => {
        const featuredProductsContainer = document.getElementById('featured-products');
        const allProductsContainer = document.getElementById('all-products');
        const categories = new Set();
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            categories.add(product.category);
            
            const productCard = `
                <div class="product-card" data-id="${doc.id}" data-category="${product.category}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <span class="product-price">${product.price} ر.س</span>
                        <button class="add-to-cart" data-id="${doc.id}">أضف إلى السلة</button>
                    </div>
                </div>
            `;
            
            if (featuredProductsContainer && product.featured) {
                featuredProductsContainer.innerHTML += productCard;
            }
            
            if (allProductsContainer) {
                allProductsContainer.innerHTML += productCard;
            }
        });
        
        // ملء قائمة الفئات
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
            });
        }
        
        // تحديث عدد العناصر في السلة
        updateCartCount();
    });
    
    // البحث عن المنتجات
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
    
    // تصفية حسب الفئة
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const productCategory = product.getAttribute('data-category');
                if (selectedCategory === 'all' || productCategory === selectedCategory) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
    
    // إضافة عنصر إلى السلة
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        }
    });
});

// إضافة منتج إلى السلة
function addToCart(productId) {
    db.collection('products').doc(productId).get().then((doc) => {
        if (doc.exists) {
            const product = doc.data();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // إظهار تنبيه بإضافة المنتج
            alert(`تم إضافة ${product.name} إلى سلة التسوق`);
        }
    });
}

// تحديث عدد العناصر في السلة
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}