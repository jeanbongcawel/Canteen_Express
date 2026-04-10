// Display Menu (continued)
function displayMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    
    menuItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'menu-item';
        itemEl.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
            </div>
            <button onclick="addToCart(${item.id})" class="add-btn">
                ${isStaff ? 'Edit' : 'Add to Cart 🛒'}
            </button>
        `;
        grid.appendChild(itemEl);
    });
}

// Add to Cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(c => c.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    showNotification(`Added ${item.name} to cart! ✅`);
    if (!isStaff) updateCartDisplay();
}

// Update Cart Display
function updateCartDisplay() {
    const cartEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartEl.innerHTML = '<p>Your cart is empty 😔</p>';
        totalEl.textContent = '$0';
        return;
    }
    
    cartEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.icon} ${item.name}</span>
            <span>$${item.price} x ${item.quantity} = $${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = `Total: $${total}`;
}

// Remove from Cart
function removeFromCart(itemId) {
    const index = cart.findIndex(c => c.id === itemId);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartDisplay();
        showNotification('Item updated! ✅');
    }
}

// Place Order
function placeOrder() {
    if (cart.length === 0) {
        showError('Cart is empty! Add items first.');
        return;
    }
    
    const order = {
        id: Date.now(),
        user: currentUser,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toLocaleString(),
        status: 'Pending'
    };
    
    orders.unshift(order);
    localStorage.setItem('canteenOrders', JSON.stringify(orders));
    
    cart = [];
    updateCartDisplay();
    showNotification('Order placed successfully! 🍽️');
    
    if (isStaff) displayOrders();
}

// Display Orders (Staff Only)
function displayOrders() {
    const ordersEl = document.getElementById('orders-list');
    if (!isStaff) {
        ordersEl.innerHTML = '<p>👮 Staff only feature</p>';
        return;
    }
    
    if (orders.length === 0) {
        ordersEl.innerHTML = '<p>No orders yet 📭</p>';
        return;
    }
    
    ordersEl.innerHTML = orders.map(order => `
        <div class="order-item ${order.status.toLowerCase()}">
            <div class="order-header">
                <h4>Order #${order.id}</h4>
                <span class="status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <p><strong>${order.user}</strong> - ${order.timestamp}</p>
            <div class="order-items">
                ${order.items.map(item => 
                    `<span>${item.icon} ${item.name} x${item.quantity}</span>`
                ).join('')}
            </div>
            <p class="order-total">Total: $${order.total}</p>
            ${order.status === 'Pending' ? `
                <div class="order-actions">
                    <button onclick="updateOrderStatus(${order.id}, 'Preparing')" class="status-btn preparing">Cooking 👨‍🍳</button>
                    <button onclick="updateOrderStatus(${order.id}, 'Ready')" class="status-btn ready">Ready ✅</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Update Order Status
function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('canteenOrders', JSON.stringify(orders));
        displayOrders();
        showNotification(`Order #${orderId} is now ${status}!`);
    }
}

// Manage Menu (Staff Only)
function displayMenuList() {
    const manageEl = document.getElementById('manage');
    if (!isStaff) {
        manageEl.innerHTML = '<p>👮 Staff only feature</p>';
        return;
    }
    
    manageEl.innerHTML = `
        <h3>Manage Menu 📝</h3>
        ${menuItems.map(item => `
            <div class="menu-manage-item">
                <span>${item.icon} ${item.name} - $${item.price}</span>
                <div>
                    <button onclick="editMenuItem(${item.id})" class="edit-btn">Edit</button>
                    <button onclick="deleteMenuItem(${item.id})" class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('')}
        <button onclick="showAddItemForm()" class="add-menu-btn">+ Add New Item</button>
    `;
}

// Simple notifications
function showNotification(message) {
    // You can implement a toast notification here
    console.log(message);
    // For demo: show in a notification area if you have one
}

// Additional staff functions (basic implementations)
function editMenuItem(id) {
    showNotification(`Edit item ${id} (implement edit form)`);
}

function deleteMenuItem(id) {
    if (confirm('Delete this menu item?')) {
        const index = menuItems.findIndex(i => i.id === id);
        if (index > -1) {
            menuItems.splice(index, 1);
            displayMenu();
            displayMenuList();
            showNotification('Item deleted!');
        }
    }
}

function showAddItemForm() {
    showNotification('Add new item form (implement modal)');
}

// Clear all orders (staff only)
function clearOrders() {
    if (isStaff && confirm('Clear all orders?')) {
        orders = [];
        localStorage.removeItem('canteenOrders');
        displayOrders();
        showNotification('All orders cleared!');
    }
}