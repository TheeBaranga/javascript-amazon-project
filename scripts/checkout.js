import { loadProducts, loadProductsFetch } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { cart, loadCart } from "../data/cart.js";
// import '../data/cart-class.js';
// import "../data/backend-practice.js";

async function loadPage() {
    try {
        await loadProductsFetch();

        const value = await new Promise((resolve, reject) => {
            //throw 'error';
            loadCart(() => {
                resolve('value3');
                //reject('error3');
            });
        });

        displayQuantity();

    } catch (error) {
        console.log('Unexpected error, please try again later');
    }

    renderOrderSummary();
    renderPaymentSummary();

}
loadPage();

function displayQuantity() {
    let quantity = 0;
        cart.forEach((cartItem) => {
            quantity += cartItem.quantity
        });
    
        document.querySelector('.js-cart-items-count').innerHTML = `${quantity} items`;
}

/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })

]).then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
new Promise((resolve) => {
        loadProducts(() => {
        resolve('value1');
    });

}).then((value) => {
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });

}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
loadProducts (() => {
    loadCart(() => {
        renderOrderSummary();
        renderPaymentSummary();
    });
});
*/

