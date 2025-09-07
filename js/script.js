// Ambil keranjang dari localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Tambah ke keranjang
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Tampilkan notifikasi yang lebih menarik
    showNotification(`${name} berhasil ditambahkan ke keranjang!`);
    updateCartCounter();
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Hapus notifikasi yang ada
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fungsi untuk menampilkan notifikasi sukses dengan detail pesanan
function showSuccessNotification(orderDetails) {
    // Hapus notifikasi yang ada
    const existingNotification = document.querySelector('.success-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi sukses yang lebih detail
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="success-content">
            <div class="success-header">
                <i class="fas fa-check-circle"></i>
                <h3>Pesanan Berhasil Dibuat!</h3>
            </div>
            <div class="success-body">
                <p><strong>Nomor Pesanan:</strong> ${orderDetails.orderNumber}</p>
                <p><strong>Total Pembayaran:</strong> Rp ${orderDetails.total.toLocaleString()}</p>
                <p><strong>Metode Pembayaran:</strong> ${orderDetails.payment}</p>
                <p><strong>Tanggal:</strong> ${orderDetails.date} ${orderDetails.time}</p>
                <p><strong>Jumlah Item:</strong> ${orderDetails.items.length} produk</p>
            </div>
            <div class="success-footer">
                <p>✨ Terima kasih telah berbelanja di <strong>Auréa & Co</strong>!</p>
                <p>📧 Konfirmasi pesanan telah dikirim ke email Anda</p>
                <p>🚚 Estimasi pengiriman: 2-4 hari kerja</p>
            </div>
            <button class="close-success" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto close setelah 10 detik
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
}

// Update counter keranjang
function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = cart.length;
        counter.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Tampilkan isi keranjang
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='text-align: center; color: #7f8c8d; padding: 2rem;'>Keranjang masih kosong</p>";
        cartTotal.innerText = "";
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">Rp ${item.price.toLocaleString()}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });

    cartTotal.innerHTML = `<strong>Total: Rp ${total.toLocaleString()}</strong>`;
}

// Hapus item dari keranjang
function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCounter();
    showNotification(`${itemName} dihapus dari keranjang`);
}

// Checkout selesai
function completeCheckout() {
    let alamat = document.getElementById("alamat").value;
    let payment = document.getElementById("payment-method");
    let selectedPayment = document.querySelector('input[name="payment"]:checked');

    if (cart.length === 0) {
        showNotification("Keranjang masih kosong!");
        return;
    }
    if (!alamat || !alamat.trim()) {
        showNotification("Silakan isi alamat pengiriman!");
        return;
    }
    if (!selectedPayment) {
        showNotification("Silakan pilih metode pembayaran!");
        return;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const shipping = subtotal >= 500000 ? 0 : 15000;
    const total = subtotal + shipping;

    // Generate order number
    const orderNumber = 'AUR' + Date.now().toString().slice(-8);
    
    // Simpan detail pesanan
    const orderDetails = {
        orderNumber: orderNumber,
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        payment: selectedPayment.value,
        address: alamat.trim(),
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID')
    };

    // Kosongkan keranjang SEBELUM menampilkan konfirmasi
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();

    // Tampilkan notifikasi sukses dengan detail
    showSuccessNotification(orderDetails);
    
    // Update tampilan cart jika ada
    if (document.getElementById("cart-items")) {
        displayCart();
    }
    
    // Redirect ke halaman utama setelah 3 detik
    setTimeout(() => {
        window.location.href = "Index.html";
    }, 3000);
}

// Smooth scrolling untuk navigasi
function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Animasi saat scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .section-title');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Update cart counter saat halaman dimuat
    updateCartCounter();
    
    // Display cart jika ada elemen cart
    if (document.getElementById("cart-items")) {
        displayCart();
    }
    
    // Animasi scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger animasi pertama kali
    animateOnScroll();
});

// Fungsi untuk form kontak
function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        showNotification('Harap lengkapi semua field!');
        return;
    }
    
    // Simulasi pengiriman form
    showNotification('Pesan Anda berhasil dikirim! Kami akan segera merespons.');
    
    // Reset form
    document.getElementById('contact-form').reset();
}

// CSS untuk animasi notifikasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
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
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #ecf0f1;
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .cart-item-info h4 {
        margin: 0 0 0.5rem 0;
        color: #344353ff;
    }
    
    .cart-item-price {
        margin: 0;
        color: #e74c3c;
        font-weight: 600;
    }
    
    .remove-btn {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .remove-btn:hover {
        background: #c0392b;
    }
    
    .cart-counter {
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        padding: 0.2rem 0.5rem;
        font-size: 0.8rem;
        position: absolute;
        top: -5px;
        right: -10px;
        min-width: 18px;
        text-align: center;
        display: none;
    }
    
    .success-notification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(76, 70, 70, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }
    
    .success-content {
        background: white;
        color: #333;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .success-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .success-header i {
        font-size: 2rem;
        color: #27ae60;
        margin-right: 0.5rem;
    }
    
    .success-body p {
        margin: 0.5rem 0;
    }
    
    .success-footer {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #778283ff;
    }
    
    .close-success {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .close-success:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);
