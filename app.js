// Database of requested products
const products = [
    {
        id: 1,
        title: "DELL S-Series 68.58 cm (27 inch) Full HD LED Backlit IPS Panel Monitor (S2725HSM)",
        price: 599,
        originalPrice: 2995,
        discount: "80% OFF",
        category: "Electronics",
        image: "https://m.media-amazon.com/images/I/71s1f0aV2eL._AC_SL1500_.jpg",
        specs: ["27 Inch Full HD Display", "2x HDMI, Built-in 6W Speakers", "TÜV Rheinland 4-Star Eye Comfort", "Flicker-Free Technology"],
        link: "https://dl.flipkart.com/dl/dell-s-series-68-58-cm-27-inch-full-hd-led-backlit-ips-panel-2xhdmi-built-in-6w-dual-speakers-tv-rheinland-4-star-eye-comfort-flicker-free-monitor-s2725hsm/p/itm30564131564c1"
    },
    {
        id: 2,
        title: "Canon EOS R100 Mirrorless Camera RF-S 18-45mm f/4.5-6.3 IS STM",
        price: 599,
        originalPrice: 2995,
        discount: "80% OFF",
        category: "Electronics",
        image: "https://m.media-amazon.com/images/I/71c42Y3vB9L._AC_SL1500_.jpg",
        specs: ["24.1 MP APS-C CMOS Sensor", "DIGIC 8 Image Processor", "4K 24p Video with Crop", "Compact and Lightweight Body"],
        link: "https://dl.flipkart.com/dl/canon-eos-r100-mirrorless-camera-rf-s-18-45mm-f-4-5-6-3-stm/p/itm3bc65ea11d81b"
    },
    {
        id: 3,
        title: "Trivety Embroidered Semi-Stitched Lehenga Choli",
        price: 599,
        originalPrice: 2995,
        discount: "80% OFF",
        category: "Fashion",
        image: "https://m.media-amazon.com/images/I/71Y+z95C04L._AC_UY1100_.jpg",
        specs: ["Fabric: Heavy Net with Embroidery", "Semi-Stitched Free Size", "Includes Unstitched Blouse Piece", "Matching Net Dupatta Included"],
        link: "https://dl.flipkart.com/dl/trivety-embroidered-semi-stitched-lehenga-choli/p/itmd2ba1da2d9d7f"
    }
];

// App State (Persisted in LocalStorage)
let cart = JSON.parse(localStorage.getItem('fk_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('fk_wishlist')) || [];
let orders = JSON.parse(localStorage.getItem('fk_orders')) || [];
let currentSearch = "";

// Save state helper
function saveState() {
    localStorage.setItem('fk_cart', JSON.stringify(cart));
    localStorage.setItem('fk_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('fk_orders', JSON.stringify(orders));
    updateBadges();
}

function updateBadges() {
    document.getElementById('cart-badge').innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('wishlist-badge').innerText = wishlist.length;
}

// Single Page Navigation Controller
function navigateTo(page, param = null) {
    const container = document.getElementById('app-container');
    
    // Update bottom nav active state
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${page}`);
    if (activeNav) activeNav.classList.add('active');

    switch (page) {
        case 'home':
            renderHome(container);
            break;
        case 'products':
            renderProducts(container);
            break;
        case 'detail':
            renderDetail(container, param);
            break;
        case 'cart':
            renderCart(container);
            break;
        case 'wishlist':
            renderWishlist(container);
            break;
        case 'checkout':
            renderCheckout(container);
            break;
        case 'payment':
            renderPayment(container, param);
            break;
        case 'orders':
            renderOrders(container);
            break;
        default:
            renderHome(container);
    }
    window.scrollTo(0, 0);
}

// 1. Home Page
function renderHome(container) {
    let filtered = products.filter(p => p.title.toLowerCase().includes(currentSearch.toLowerCase()));
    
    container.innerHTML = `
        <div class="offer-banner">🔥 BIG BILLION DEAL: ALL ITEMS FLAT 80% OFF 🔥</div>
        <div class="section-title">Exclusive Deals for You</div>
        <div class="product-grid">
            ${filtered.map(p => createProductCard(p)).join('')}
        </div>
    `;
}

// Product Card HTML
function createProductCard(product) {
    const isWish = wishlist.some(id => id === product.id);
    return `
        <div class="product-card">
            <i class="fa-solid fa-heart wishlist-icon ${isWish ? 'active' : ''}" onclick="toggleWishlist(${product.id}, event)"></i>
            <div onclick="navigateTo('detail', ${product.id})">
                <img src="${product.image}" class="product-img" alt="${product.title}">
                <div class="product-title">${product.title}</div>
                <div class="price-box">
                    <span class="curr-price">₹${product.price}</span>
                    <span class="orig-price">₹${product.originalPrice}</span>
                    <span class="discount-tag">${product.discount}</span>
                </div>
            </div>
        </div>
    `;
}

// 2. Products Page
function renderProducts(container) {
    renderHome(container);
}

// 3. Product Detail Page
function renderDetail(container, productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return navigateTo('home');

    const isWish = wishlist.some(id => id === p.id);

    container.innerHTML = `
        <div class="detail-container">
            <div style="text-align:right;">
                <i class="fa-solid fa-heart wishlist-icon ${isWish ? 'active' : ''}" style="position:static; font-size:22px;" onclick="toggleWishlist(${p.id}, event)"></i>
            </div>
            <img src="${p.image}" class="detail-img" alt="${p.title}">
            <h2 style="font-size: 15px; font-weight:500; margin: 10px 0;">${p.title}</h2>
            <div class="price-box" style="margin-bottom: 15px;">
                <span class="curr-price" style="font-size:22px;">₹${p.price}</span>
                <span class="orig-price" style="font-size:14px;">₹${p.originalPrice}</span>
                <span class="discount-tag" style="font-size:14px;">${p.discount}</span>
            </div>
            <div style="background:#e8f5e9; color:#2e7d32; padding:8px; font-size:12px; font-weight:bold; margin-bottom:15px;">
                ⚡ Special Offer: Extra 80% discount applied automatically!
            </div>
            <h3 style="font-size:14px; margin-bottom:8px;">Product Details</h3>
            <ul style="font-size:12px; color:#555; padding-left:18px; line-height:1.8;">
                ${p.specs.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>
        <div class="btn-row">
            <button class="btn-cart" onclick="addToCart(${p.id})">ADD TO CART</button>
            <button class="btn-buy" onclick="buyNow(${p.id})">BUY NOW</button>
        </div>
    `;
}

// 4. Cart Page
function renderCart(container) {
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 50px 20px; background:white;">
                <i class="fa-solid fa-cart-shopping" style="font-size: 50px; color:#ccc; margin-bottom:15px;"></i>
                <p style="font-weight:bold;">Your Cart is Empty!</p>
                <p style="font-size:12px; color:#878787; margin-bottom:15px;">Explore items with 80% discount</p>
                <button onclick="navigateTo('home')" style="background:#2874f0; color:white; border:none; padding:10px 20px; font-weight:bold;">SHOP NOW</button>
            </div>
        `;
        return;
    }

    let totalOriginal = cart.reduce((acc, item) => acc + (item.originalPrice * item.qty), 0);
    let totalDiscount = cart.reduce((acc, item) => acc + ((item.originalPrice - item.price) * item.qty), 0);
    let finalAmount = totalOriginal - totalDiscount;

    container.innerHTML = `
        <div class="section-title">My Cart (${cart.length})</div>
        ${cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" class="cart-img">
                <div style="flex:1;">
                    <div class="product-title">${item.title}</div>
                    <div class="price-box" style="margin:5px 0;">
                        <span class="curr-price">₹${item.price}</span>
                        <span class="orig-price">₹${item.originalPrice}</span>
                        <span class="discount-tag">${item.discount}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                        <span style="font-size:13px; font-weight:bold;">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                        <span onclick="removeFromCart(${item.id})" style="font-size:12px; color:#878787; margin-left:15px; cursor:pointer; font-weight:bold;">REMOVE</span>
                    </div>
                </div>
            </div>
        `).join('')}

        <div class="price-details">
            <div style="font-weight:bold; font-size:14px; margin-bottom:10px; color:#878787;">PRICE DETAILS</div>
            <div class="price-row"><span>Price (${cart.length} items)</span><span>₹${totalOriginal}</span></div>
            <div class="price-row"><span>Discount (80%)</span><span style="color:#388e3c;">-₹${totalDiscount}</span></div>
            <div class="price-row"><span>Delivery Charges</span><span style="color:#388e3c;">FREE</span></div>
            <div class="price-row total-row"><span>Total Amount</span><span>₹${finalAmount}</span></div>
        </div>

        <div style="position:fixed; bottom:52px; left:0; width:100%; background:white; padding:10px 15px; display:flex; justify-between; align-items:center; box-shadow:0 -2px 5px rgba(0,0,0,0.1); z-index:900;">
            <div>
                <div style="font-size:16px; font-weight:bold;">₹${finalAmount}</div>
                <div style="font-size:10px; color:#388e3c;">Saved ₹${totalDiscount}</div>
            </div>
            <button onclick="navigateTo('checkout')" style="background:#fb641b; color:white; border:none; padding:12px 30px; font-weight:bold; font-size:14px;">PLACE ORDER</button>
        </div>
    `;
}

// 5. Wishlist Page
function renderWishlist(container) {
    const wishProducts = products.filter(p => wishlist.includes(p.id));
    if (wishProducts.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 50px 20px; background:white;">
                <i class="fa-regular fa-heart" style="font-size: 50px; color:#ccc; margin-bottom:15px;"></i>
                <p style="font-weight:bold;">Empty Wishlist</p>
                <p style="font-size:12px; color:#878787;">Save items you want to buy later</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="section-title">My Wishlist (${wishProducts.length})</div>
        <div class="product-grid">
            ${wishProducts.map(p => createProductCard(p)).join('')}
        </div>
    `;
}

// 6. Checkout Page
function renderCheckout(container) {
    container.innerHTML = `
        <div class="section-title">Delivery Address</div>
        <form id="addressForm" onsubmit="handleCheckout(event)" style="background:white; padding:15px;">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="custName" required placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label>Mobile Number</label>
                <input type="tel" id="custPhone" required placeholder="10-digit phone number">
            </div>
            <div class="form-group">
                <label>Pincode</label>
                <input type="text" id="custPin" required placeholder="6-digit pincode">
            </div>
            <div class="form-group">
                <label>House No. / Building Name</label>
                <input type="text" id="custHouse" required placeholder="Address detail">
            </div>
            <div class="form-group">
                <label>Road Name / Area / Colony</label>
                <input type="text" id="custArea" required placeholder="Area detail">
            </div>
            <button type="submit" style="width:100%; background:#fb641b; color:white; border:none; padding:12px; font-weight:bold; font-size:14px; margin-top:10px;">DELIVER HERE</button>
        </form>
    `;
}

// 7. Payment Selection Page
function renderPayment(container, addressData) {
    const amount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    container.innerHTML = `
        <div class="section-title">Select Payment Method (Total: ₹${amount})</div>
        <div style="padding:10px;">
            <div class="payment-option" id="opt-phonepe" onclick="selectPayment('phonepe')">
                <input type="radio" name="payMethod" value="phonepe" id="r1">
                <label for="r1" style="font-weight:bold; font-size:14px;">PhonePe UPI</label>
            </div>

            <div class="payment-option" id="opt-paytm" onclick="selectPayment('paytm')">
                <input type="radio" name="payMethod" value="paytm" id="r2">
                <label for="r2" style="font-weight:bold; font-size:14px;">Paytm UPI</label>
            </div>

            <div class="payment-option" id="opt-qr" onclick="selectPayment('qr')">
                <input type="radio" name="payMethod" value="qr" id="r3">
                <label for="r3" style="font-weight:bold; font-size:14px;">Scan & Pay with QR / Bank</label>
            </div>

            <div id="payment-content" style="margin-top:15px;"></div>

            <button onclick="confirmOrder('${addressData}')" style="width:100%; background:#388e3c; color:white; border:none; padding:12px; font-weight:bold; font-size:14px; margin-top:15px;">CONFIRM & PAY ₹${amount}</button>
        </div>
    `;
}

function selectPayment(type) {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    document.getElementById(`opt-${type}`).classList.add('selected');
    const content = document.getElementById('payment-content');

    if (type === 'phonepe') {
        content.innerHTML = `<div style="background:white; padding:15px; border-radius:4px;">Enter PhonePe UPI ID: <input type="text" placeholder="username@ybl" style="width:100%; padding:8px; margin-top:5px; border:1px solid #ccc;"></div>`;
    } else if (type === 'paytm') {
        content.innerHTML = `<div style="background:white; padding:15px; border-radius:4px;">Enter Paytm UPI ID: <input type="text" placeholder="username@paytm" style="width:100%; padding:8px; margin-top:5px; border:1px solid #ccc;"></div>`;
    } else if (type === 'qr') {
        content.innerHTML = `
            <div class="qr-box">
                <p style="font-weight:bold; font-size:13px;">Scan QR Code to pay via any UPI App</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=FlipkartDeals&am=599" class="qr-img" alt="UPI QR Code">
                <p style="font-size:11px; color:#878787;">Bank Account: 123456789012 | IFSC: SBIN0001234</p>
            </div>
        `;
    }
}

// 8. Orders Page
function renderOrders(container) {
    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 50px 20px; background:white;">
                <i class="fa-solid fa-box-open" style="font-size: 50px; color:#ccc; margin-bottom:15px;"></i>
                <p style="font-weight:bold;">No Orders Yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="section-title">My Orders</div>
        ${orders.map(o => `
            <div class="order-card" style="flex-direction:column;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding-bottom:6px; margin-bottom:8px;">
                    <span style="font-size:12px; font-weight:bold; color:#2874f0;">Order ID: #${o.id}</span>
                    <span style="font-size:11px; background:#e8f5e9; color:#2e7d32; padding:2px 6px; font-weight:bold;">${o.status}</span>
                </div>
                ${o.items.map(i => `
                    <div style="display:flex; gap:10px; margin-bottom:6px;">
                        <img src="${i.image}" style="width:40px; height:40px; object-fit:contain;">
                        <div>
                            <div style="font-size:12px; font-weight:bold;">${i.title}</div>
                            <div style="font-size:11px; color:#878787;">Qty: ${i.qty} | ₹${i.price}</div>
                        </div>
                    </div>
                `).join('')}
                <div style="font-size:11px; color:#878787; border-top:1px solid #eee; padding-top:6px;">
                    Deliver To: ${o.address}
                </div>
            </div>
        `).join('')}
    `;
}

// Actions & Handlers
function toggleWishlist(id, event) {
    event.stopPropagation();
    const idx = wishlist.indexOf(id);
    if (idx > -1) {
        wishlist.splice(idx, 1);
    } else {
        wishlist.push(id);
    }
    saveState();
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav && activeNav.id === 'nav-wishlist') {
        renderWishlist(document.getElementById('app-container'));
    } else {
        renderHome(document.getElementById('app-container'));
    }
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, qty: 1 });
    }
    saveState();
    alert('Item added to cart!');
}

function buyNow(id) {
    cart = [];
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
    saveState();
    navigateTo('checkout');
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
        saveState();
        renderCart(document.getElementById('app-container'));
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveState();
    renderCart(document.getElementById('app-container'));
}

function handleSearch() {
    currentSearch = document.getElementById('searchInput').value;
    renderHome(document.getElementById('app-container'));
}

function handleCheckout(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const house = document.getElementById('custHouse').value;
    const area = document.getElementById('custArea').value;
    const pin = document.getElementById('custPin').value;

    const fullAddr = `${name}, ${house}, ${area}, Pincode: ${pin} (Ph: ${phone})`;
    navigateTo('payment', fullAddr);
}

function confirmOrder(address) {
    const selectedPay = document.querySelector('input[name="payMethod"]:checked');
    if (!selectedPay) {
        alert('Please select a payment method!');
        return;
    }

    const order = {
        id: Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        address: address,
        status: 'Order Placed (Confirmed)',
        date: new Date().toLocaleDateString()
    };

    orders.unshift(order);
    cart = [];
    saveState();
    alert('Order Placed Successfully!');
    navigateTo('orders');
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    navigateTo('home');
});
