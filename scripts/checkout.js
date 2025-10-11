import { loadProducts } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
// import '../data/cart-class.js';
// import "../data/backend-practice.js";


new Promise((resolve) => {
    console.log('start promise');
    loadProducts(() => {
        console.log('finished loading');
        resolve();
    });
}).then(() => {
    console.log('next step');
})



loadProducts (() => {
    renderOrderSummary();
    renderPaymentSummary();
});


