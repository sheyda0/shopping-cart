const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDom = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".cart-item-clear");

import { productsData } from "/products.js";

let cart = [];

// 1. get products

class Products {
    getProduct() {
        return productsData;
    }
}

let buttonsDOM = [];
// 2. display products

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(item => {
            result += `<div class="product">
            <div class="img-container">
                <img class="product-img" src=${item.imageUrl} alt="p-1">
            </div>
            <div class="product-description">
                <p class="product-price">${item.price} $</p>
                <p class="product-title">${item.title}</p>
            </div>
            <button class="add-to-cart" data-id="${item.id}">add to cart</button>
        </div>`;
        });
        productsDom.innerHTML = result;
    }
    getAddToCartBtns() {
        const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
        buttonsDOM = addToCartBtns;
        addToCartBtns.forEach(btn => {
            const id = btn.dataset.id;
            const isInCart = cart.find(p => p.id === parseInt(id));
            if (isInCart) {
                btn.innerText = "in cart";
                btn.ariaDisabled = true;
            }
            btn.addEventListener("click", (event) => {
                event.target.innerText = "in cart";
                event.target.disabled = true;
                // get product from products
                const addedProduct = {...Storage.getProduct(id), quantity: 1 };
                // add to cart 
                cart = [...cart, addedProduct];
                // save cart to local storage
                Storage.saveCart(cart);
                // update cart value
                this.setCartValue(cart);
                // add to cart item
                this.addCartItem(addedProduct);
                // get cart from storage
            });
        });
    }
    setCartValue(cart) {
        // 1.cart items
        // 2.total price
        let tempCartItems = 0;
        const totalPrice = cart.reduce((acc, curr) => {
            tempCartItems += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        cartTotal.innerText = `total price: ${totalPrice.toFixed(2)} $`;
        cartItems.innerText = tempCartItems;
    }
    addCartItem(cartItem) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img class="cart-item-img" src=${cartItem.imageUrl} alt="p-1">
        <div class="cart-item-description">
            <h4>${cartItem.title}</h4>
            <h5>${cartItem.price} $</h5>
        </div>
        <div class="cart-item-conteoller">
            <i class="fas fa-chevron-up" data-id="${cartItem.id}"></i>
            <p>${cartItem.quantity}</p>
            <i class="fas fa-chevron-down data-id="${cartItem.id}"></i>
        </div>
        <div>
            <i class="fa fa-trash-alt" data-id="${cartItem.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }
    setupApp() {
        // get cart from storage
        cart = Storage.getCart() || [];
        // addCartItem
        cart.forEach((cartItem) => this.addCartItem(cartItem));
        // set values
        this.setCartValue(cart);
    }
    cartLogic() {
        clearCart.addEventListener("click", () => this.clearCart());
    }
    clearCart() {
        // remove
        cart.forEach(cItem => this.removeItem(cItem.id));
        // remove cart content children
        while (cartContent.children.length) {
            cartContent.removeChild(cartContent.children[0]);
        }
        closeModalFunction();
    }
    removeItem(id) {
        //  update cart
        cart = cart.filter(cItem => cItem.id !== id);
        // update total price and cart item
        this.setCartValue(cart);
        // update storage
        Storage.saveCart(cart);
        // update text and disabled
        this.getSingleButton(id);
    }
    getSingleButton(id) {
        let button = buttonsDOM.find(btn => parseInt(btn.dataset.id) === parseInt(id));
        button.innerText = "add to cart";
        button.disabled = false;
    }
}

// 3. storage

class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    static getProduct(id) {
        const _products = JSON.parse(localStorage.getItem('products'));
        return _products.find(product => product.id === parseInt(id));
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem('cart'));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProduct();
    const ui = new UI();
    // set up: get cart and set up app
    ui.setupApp();
    ui.displayProducts(productsData);
    ui.getAddToCartBtns();
    ui.cartLogic();
    Storage.saveProducts(productsData);
});

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);

function showModalFunction() {
    backDrop.style.display = "block";
    cartModal.style.opacity = "1";
    cartModal.style.top = "10%";
}

function closeModalFunction() {
    backDrop.style.display = "none";
    cartModal.style.opacity = "0";
    cartModal.style.top = "-100%";
}