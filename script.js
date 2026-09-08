// Product Data
const products = [
    {
        id: 1,
        name: "Classic Black Jersey",
        price: 89900,
        emoji: "⚫"
    },
    {
        id: 2,
        name: "White Elegance",
        price: 89900,
        emoji: "⚪"
    },
    {
        id: 3,
        name: "Red Thunder",
        price: 94900,
        emoji: "🔴"
    },
    {
        id: 4,
        name: "Blue Velocity",
        price: 94900,
        emoji: "🔵"
    },
    {
        id: 5,
        name: "Gold Premium",
        price: 124900,
        emoji: "🟡"
    },
    {
        id: 6,
        name: "Green Essence",
        price: 94900,
        emoji: "🟢"
    },
    {
        id: 7,
        name: "Purple Elite",
        price: 104900,
        emoji: "🟣"
    },
    {
        id: 8,
        name: "Orange Spirit",
        price: 94900,
        emoji: "🟠"
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartCount();
});

// Display Products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)} ZMW</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Format Price
function formatPrice(price) {
    return price.toLocaleString('en-US');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display Cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">Your cart is empty</p>';
        totalPrice.textContent = formatPrice(0);
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} ZMW x ${item.quantity}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">${formatPrice(itemTotal)} ZMW</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    totalPrice.textContent = formatPrice(total);
}

// Open Cart Modal
function openCart() {
    const cartModal = document.getElementById('cartModal');
    displayCart();
    cartModal.style.display = 'block';
}

// Close Cart Modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase!\n\nTotal: ${formatPrice(total)} ZMW\n\nPlease proceed to payment.`);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
    displayCart();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #000;
        color: #fff;
        padding: 1rem 2rem;
        border-radius: 4px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        letter-spacing: 1px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Scroll to Shop
function scrollToShop() {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

// Cart Link Handler
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.querySelector('.cart-link');
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        const cartModal = document.getElementById('cartModal');
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    };
});