import { Cart } from "./Cart.js";
import { ProductList } from "./ProductList.js";
var productListEl = document.querySelector(".section-product .product-list tbody");
var cartEl = document.querySelector(".section-cart .product-list tbody");
var products = [{
        "id": 1,
        "name": "Vodka - Lemon, Absolut",
        "price": 377.46
    }, {
        "id": 2,
        "name": "Chocolate - Dark Callets",
        "price": 759.67
    }, {
        "id": 3,
        "name": "Lettuce - Frisee",
        "price": 4.32
    }, {
        "id": 4,
        "name": "Jicama",
        "price": 131.68
    }, {
        "id": 5,
        "name": "Beef - Top Sirloin",
        "price": 829.91
    }];
var cart = new Cart(cartEl, products);
var productList = new ProductList(products, productListEl, cart);
