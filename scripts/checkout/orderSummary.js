import {cart, removeFromCart, updateDeliveryOption, calculateCartQuantity, updateQuantity} from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';


export function renderOrderSummary() {

    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays, 'days'
        );
        const dateString = deliveryDate.format('dddd, MMMM D');


        cartSummaryHTML += `
        <div class="cart-item-container  
        js-cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity
                    js-product-quantity-${matchingProduct.id}">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" 
                        data-product-id="${matchingProduct.id}">
                    Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" 
                    data-product-id = "${matchingProduct.id}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
            </div>
        </div>
        `
    });


    function deliveryOptionsHTML(matchingProduct, cartItem) {
        
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays, 'days'
            );
            const dateString = deliveryDate.format('dddd, MMMM D');

            const priceString = deliveryOption.priceCents === 0
            ? 'FREE'
            : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option"
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${deliveryOption.id}">
                        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} - Shipping
                        </div>
                    </div>
                </div>
            `
        });

        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
    document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.remove();

            const cartQuantity = calculateCartQuantity();
            document.querySelector('.js-cart-items-count').innerHTML = `${cartQuantity} items`;
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.js-update-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            // Get the product ID from the clicked link's data attribute
            const { productId } = link.dataset;
            
            // Find the specific container for this product in the DOM
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            
            // Add the CSS class to trigger the visual change
            container.classList.add('is-editing-quantity');
        });
    });

    document.querySelectorAll('.save-quantity-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const { productId } = link.closest('.js-cart-item-container').querySelector('.js-update-link').dataset;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            const quantityInput = container.querySelector('.quantity-input');
            const newQuantity = parseInt(quantityInput.value);
            
            if (newQuantity < 0 || newQuantity >= 1000) {
                alert('Quantity must be at least 0 and less than 1000');
                return;
            }
            
            // If quantity is exactly 0, delete the item!
            if (newQuantity === 0) {
                removeFromCart(productId); // Remove from data
                container.remove();        // Remove from the screen
                
                // Update the header and payment summary, then stop running
                const cartQuantity = calculateCartQuantity();
                document.querySelector('.js-cart-items-count').innerHTML = `${cartQuantity} items`;
                renderPaymentSummary();
                return; 
            }

            // Remove the editing class ONLY after validation passes preventing closing immediately on invalid input
            container.classList.remove('is-editing-quantity');

            // Update the cart array
            updateQuantity(productId, newQuantity);

            // Update the quantity label on the item itself
            const quantityLabel = container.querySelector('.quantity-label');
            quantityLabel.textContent = newQuantity;

            // Update the Checkout Header text
            const cartQuantity = calculateCartQuantity();
            document.querySelector('.js-cart-items-count').innerHTML = `${cartQuantity} items`;

            // Update the total price on the right side
            renderPaymentSummary();
        });

    });

    document.querySelectorAll('.quantity-input')
    .forEach((input) => {
        input.addEventListener('keydown', (event) => {
            // Check if the key pressed was 'Enter'
            if (event.key === 'Enter') {
                // Find the specific container for this input
                const container = input.closest('.js-cart-item-container');
                
                // Find the save link inside this specific container
                const saveLink = container.querySelector('.save-quantity-link');
                
                // Trigger a click on the save link
                saveLink.click();
            }
        });
    });

    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        });
};
