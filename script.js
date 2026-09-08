// Product Data - Organized by League
const productsByLeague = {
    premier_league: [
        { id: 1, name: "Premier League Classic", price: 3500, emoji: "⚪" },
        { id: 2, name: "Premier League Striped", price: 3500, emoji: "🔵" },
        { id: 3, name: "Premier League Red", price: 3500, emoji: "🔴" },
        { id: 4, name: "Premier League Away", price: 3500, emoji: "⚫" }
    ],
    la_liga: [
        { id: 5, name: "La Liga Home", price: 3200, emoji: "💛" },
        { id: 6, name: "La Liga Away", price: 3200, emoji: "🤍" },
        { id: 7, name: "La Liga Orange", price: 3200, emoji: "🟠" },
        { id: 8, name: "La Liga Blue", price: 3200, emoji: "🔵" }
    ],
    serie_a: [
        { id: 9, name: "Serie A Azzurri", price: 3300, emoji: "🔵" },
        { id: 10, name: "Serie A White", price: 3300, emoji: "⚪" },
        { id: 11, name: "Serie A Rossoneri", price: 3300, emoji: "🔴" },
        { id: 12, name: "Serie A Bianconeri", price: 3300, emoji: "⚫" }
    ],
    bundesliga: [
        { id: 13, name: "Bundesliga Red", price: 2900, emoji: "🔴" },
        { id: 14, name: "Bundesliga Black", price: 2900, emoji: "⚫" },
        { id: 15, name: "Bundesliga Yellow", price: 2900, emoji: "💛" },
        { id: 16, name: "Bundesliga White", price: 2900, emoji: "⚪" }
    ],
    ligue_1: [
        { id: 17, name: "Ligue 1 Parisian", price: 3800, emoji: "🔵" },
        { id: 18, name: "Ligue 1 Monaco", price: 3400, emoji: "🔴" },
        { id: 19, name: "Ligue 1 Marseille", price: 3400, emoji: "⚪" },
        { id: 20, name: "Ligue 1 Lyon", price: 3400, emoji: "⚫" }
    ]
};

const specialJerseys = [
    { id: 101, name: "Vintage Classic 1990", price: 4500, emoji: "🏆" },
    { id: 102, name: "Limited Edition Gold", price: 5200, emoji: "🟡" },
    { id: 103, name: "Champions League Memorial", price: 4800, emoji: "👑" },
    { id: 104, name: "World Cup Legends", price: 5500, emoji: "🌍" },
    { id: 105, name: "Retro Future Design", price: 4200, emoji: "🚀" },
    { id: 106, name: "Elite Diamond Edition", price: 6500, emoji: "💎" }
];

// Current view state
let currentView = 'all';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
    updateCartCount();
    setupLeagueToggle();
});

// Setup League Toggle
function setupLeagueToggle() {
    const toggleButtons = document.querySelectorAll('.league-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const league = this.dataset.league;
            displayProducts(league);
        });
    });
}

// Display Products based on League
function displayProducts(league) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    currentView = league;

    let productsToShow = [];

    if (league === 'all') {
        productsToShow = Object.values(productsByLeague).flat();
    } else if (league === 'special') {
        productsToShow = specialJerseys;
    } else {
        productsToShow = productsByLeague[league] || [];
    }

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #888;">No jerseys available</p>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)} ZMW</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Format Price
function formatPrice(price) {
    return price.toLocaleString('en-US');
}

// Add to Cart
function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
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