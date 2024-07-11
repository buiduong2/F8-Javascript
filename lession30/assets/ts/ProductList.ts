import { F8 } from "./utils.js";
import { Cart } from "./Cart.js";
import type { Options } from "./utils.js";

export class ProductList {

    datas: Data[];
    el: HTMLElement
    cart: Cart

    constructor(datas: Data[], el: HTMLElement, cart: Cart) {
        this.datas = datas;
        this.el = el
        this.cart = cart;
        this.moute();
    }

    moute(): void {
        var _this = this;
        this.el.append(
            ...this.datas
                .map(function (data) {
                    return new ProductItem(data.id, data.name, data.price, _this.cart.addToCart.bind(_this.cart, data.id))
                })
                .map(function (productItem) {
                    return productItem.el
                })
        )
    }




}

export class ProductItem {
    el: HTMLElement;
    buttonEl: HTMLButtonElement;
    inputEl: HTMLInputElement;
    addToCartCb: (quantity: number) => void

    constructor(id: number, name: string, price: number, addToCart: (quantity: number) => void) {
        this.el = document.createElement("tr");
        this.el.innerHTML = ProductItem.getInnerHTML();
        this.buttonEl = this.el.querySelector("button") as HTMLButtonElement;
        this.inputEl = this.el.querySelector("input") as HTMLInputElement;
        this.addToCartCb = addToCart;
        this.moute(id, name, price);
    }

    moute(id: number, name: string, price: number): void {
        (this.el.querySelector(".product-id") as HTMLElement).textContent = String(id);
        (this.el.querySelector(".product-name") as HTMLElement).textContent = name;
        (this.el.querySelector(".product-price") as HTMLElement).textContent = price.toFixed(2);

        this.buttonEl.addEventListener("click", this.addToCart.bind(this));
    }

    addToCart() {
        this.addToCartCb(this.getQuantity());
    }

    getQuantity(): number {
        var quantity = Number(this.inputEl.value);
        quantity = !isNaN(quantity) ? quantity : 1
        quantity = Math.max(1, Math.floor(quantity));
        return quantity
    }

    static getInnerHTML(): string {
        return `
                <td class="product-id"></td>
                <td class="product-name"></td>
                <td class="product-price"></td>
                <td class="product-action">
                    <input type="number" value="1">
                    <button>Thêm vào giỏ</button>
                </td>
                `
    }
}


export type Data = {
    id: number,
    name: string,
    price: number
}