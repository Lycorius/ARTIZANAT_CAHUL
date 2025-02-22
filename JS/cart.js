class CartManager {
    constructor() {
        this.cartContainer = document.querySelector('.cart-items');
        this.totalElement = document.querySelector('.cart-total');
        this.cartCountElements = document.querySelectorAll('.cart-count');
        this.init();
        this.setupStorageListener();
    }

    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.renderCart();
                this.updateCartCount();
            }
        });
    }

    static updateCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'cart',
            newValue: JSON.stringify(cart)
        }));
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        this.cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    init() {
        this.renderCart();
        this.bindEvents();
        this.updateCartCount();
        this.setupOrderForm();
    }

    renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (!this.cartContainer) return;
        
        if (cart.length === 0) {
            this.cartContainer.innerHTML = '<p class="empty-cart">Coșul dvs. este gol</p>';
            this.updateTotal(0);
            return;
        }

        this.cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}" data-category="${item.categorie}">
                <img src="${item.imagine}" alt="${item.nume}">
                <div class="item-details">
                    <h3>${item.nume}</h3>
                    <div class="item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <p class="item-price">${item.pret}</p>
                        <button class="remove-btn">×</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateTotal();
    }

    updateTotal() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.pret.replace(' MDL', ''));
            return sum + (price * item.quantity);
        }, 0);

        if (this.totalElement) {
            this.totalElement.textContent = `Total: ${total.toFixed(2)} MDL`;
        }
    }

    updateItemQuantity(productId, change) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cart.find(i => i.id === productId);
        
        if (item) {
            item.quantity = Math.max(1, (item.quantity || 1) + change);
            CartManager.updateCart(cart);
        }
    }

    removeItem(productId) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart = cart.filter(item => item.id !== productId);
        CartManager.updateCart(cart);
    }

    bindEvents() {
        if (!this.cartContainer) return;

        this.cartContainer.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const productId = parseInt(cartItem.dataset.id);

            if (e.target.classList.contains('plus')) {
                this.updateItemQuantity(productId, 1);
            }
            else if (e.target.classList.contains('minus')) {
                this.updateItemQuantity(productId, -1);
            }
            else if (e.target.classList.contains('remove-btn')) {
                this.removeItem(productId);
            }
        });
    }

    setupOrderForm() {
        const checkoutBtn = document.querySelector('.checkout-btn');
        const modal = document.getElementById('orderModal');
        const closeBtn = document.querySelector('.close-modal');
        const orderForm = document.getElementById('orderForm');

        checkoutBtn?.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (cart.length === 0) {
                alert('Coșul dvs. este gol');
                return;
            }
            modal.style.display = 'block';
            modal.offsetHeight;
            modal.classList.add('active');
            
            const orderDetails = cart.map(item => 
                `${item.nume} - ${item.quantity}x - ${item.pret}`
            ).join('\n');
            
            document.getElementById('orderDetails').value = orderDetails;
        });

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };

        closeBtn?.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        orderForm?.addEventListener('submit', (e) => {
            localStorage.removeItem('cart');
            this.renderCart();
            this.updateCartCount();
            modal.style.display = 'none';
            alert('Comanda dvs. a fost trimisă cu succes!');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CartManager();
    updateCartCount();

    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });
});

window.CartManager = CartManager;

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    document.querySelectorAll('.cart-count').forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}
