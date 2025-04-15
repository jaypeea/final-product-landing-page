document.addEventListener('DOMContentLoaded', function() {
    // Shared cart functionality
    const cart = JSON.parse(localStorage.getItem('ufrag-cart')) || [];
    
    // Update cart count in header
    function updateCartCount() {
        document.querySelectorAll('#cart-count').forEach(element => {
            element.textContent = cart.length;
        });
    }
    
    // For index.html - Add to Cart functionality
    if (document.querySelector('.add-to-cart')) {
        const addedToCartMessage = document.getElementById('added-to-cart-message');
        
        function showAddedToCartMessage() {
            addedToCartMessage.style.display = 'block';
            setTimeout(() => {
                addedToCartMessage.style.display = 'none';
            }, 3000);
        }
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const item = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: `₱${parseFloat(this.dataset.price).toFixed(2)}`,
                    image: this.dataset.image
                };
                
                cart.push(item);
                localStorage.setItem('ufrag-cart', JSON.stringify(cart));
                updateCartCount();
                showAddedToCartMessage();
            });
        });
        
        updateCartCount();
    }
    
    // For cart.html - Cart page functionality
    if (document.getElementById('cart-items-container')) {
        const cartContainer = document.getElementById('cart-items-container');
        const checkoutBtn = document.getElementById('checkout-btn');
        const purchaseModal = document.getElementById('purchase-modal');
        const continueBtn = document.getElementById('continue-btn');
        
        function formatCurrency(value) {
            return new Intl.NumberFormat('en-PH', { 
                style: 'currency', 
                currency: 'PHP' 
            }).format(value);
        }
        
        function renderCart() {
            if (cart.length === 0) {
                cartContainer.innerHTML = `
                    <div class="text-center py-8">
                        <p class="text-lg mb-4">Your cart is empty</p>
                        <a href="index.html#shop" class="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                            Continue Shopping
                        </a>
                    </div>
                `;
                checkoutBtn.style.display = 'none';
                return;
            }
            
            let cartHTML = '';
            let totalPrice = 0;
            
            cart.forEach(item => {
                const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                totalPrice += priceValue;
                
                cartHTML += `
                    <div class="cart-item flex items-center justify-between p-4 border rounded-lg mb-4">
                        <div class="flex items-center">
                            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-contain mr-4">
                            <div>
                                <h3 class="font-semibold">${item.name}</h3>
                                <p class="text-gray-600">${item.price}</p>
                            </div>
                        </div>
                        <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}">
                            Remove
                        </button>
                    </div>
                `;
            });
            
            cartHTML += `
                <div class="total-price text-right mt-4 mb-8">
                    <p class="text-lg font-semibold">Total: ${formatCurrency(totalPrice)}</p>
                </div>
            `;
            
            cartContainer.innerHTML = cartHTML;
            checkoutBtn.style.display = 'block';
            checkoutBtn.classList.add('active');
            
            // Add event listeners for remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = this.getAttribute('data-id');
                    const updatedCart = cart.filter(item => item.id !== itemId);
                    localStorage.setItem('ufrag-cart', JSON.stringify(updatedCart));
                    location.reload(); // Refresh to show updated cart
                });
            });
        }
        
        // Checkout button click
        checkoutBtn.addEventListener('click', function() {
            // Clear the cart
            localStorage.removeItem('ufrag-cart');
            // Show confirmation modal
            purchaseModal.style.display = 'flex';
        });
        
        // Continue shopping button
        continueBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        
        // Initialize cart on page load
        renderCart();
        updateCartCount();
    }
});