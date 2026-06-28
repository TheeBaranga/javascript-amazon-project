
import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {

  let productsHTML = '';

  products.forEach((product) => {
      productsHTML += `
          <div class="product-container">
            <div class="product-image-container">
              <img class="product-image" src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <div class="product-quantity-label">
                Select Quantity:
              </div>
              <select class = "js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${product.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
      `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  updateCartQuantity();

  function updateCartQuantity() {
    calculateCartQuantity();
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity}`;

  }

  const addedMessageTimeouts = {};

  document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
      button.addEventListener('click', () => {
          const { productId } = button.dataset;

          // Finding the specific dropdown for this product
          const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
          
          // Getting the value and turn it into a number
          const quantity = Number(quantitySelector.value);

          // Passing both the ID and the quantity to your cart function
          addToCart(productId, quantity);
          updateCartQuantity();


          // Selects the unique "Added" message element for this product
          const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

          // Adds the class that alters the opacity to make it visible
          addedMessage.classList.add('added-to-cart-visible');

          // Checks if this specific product already has an active timer running
          const previousTimeoutId = addedMessageTimeouts[productId];
          if (previousTimeoutId) {
              // If it does, cancels that timer completely
              clearTimeout(previousTimeoutId);
          }

          // Starts a fresh 2-second timer
          const timeoutId = setTimeout(() => {
              addedMessage.classList.remove('added-to-cart-visible');
          }, 2000);

          // Saves this new timer ID into our object so we can reset it on the next click
          addedMessageTimeouts[productId] = timeoutId;
      });
  });
}
