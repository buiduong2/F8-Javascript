export class ProductList {
    constructor(datas, el, cart) {
        this.datas = datas;
        this.el = el;
        this.cart = cart;
        this.moute();
    }
    moute() {
        var _this = this;
        this.el.append(...this.datas
            .map(function (data) {
            return new ProductItem(data.id, data.name, data.price, _this.cart.addToCart.bind(_this.cart, data.id));
        })
            .map(function (productItem) {
            return productItem.el;
        }));
    }
}
export class ProductItem {
    constructor(id, name, price, addToCart) {
        this.el = document.createElement("tr");
        this.el.innerHTML = ProductItem.getInnerHTML();
        this.buttonEl = this.el.querySelector("button");
        this.inputEl = this.el.querySelector("input");
        this.addToCartCb = addToCart;
        this.moute(id, name, price);
    }
    moute(id, name, price) {
        this.el.querySelector(".product-id").textContent = String(id);
        this.el.querySelector(".product-name").textContent = name;
        this.el.querySelector(".product-price").textContent = price.toFixed(2);
        this.buttonEl.addEventListener("click", this.addToCart.bind(this));
    }
    addToCart() {
        this.addToCartCb(this.getQuantity());
    }
    getQuantity() {
        var quantity = Number(this.inputEl.value);
        quantity = !isNaN(quantity) ? quantity : 1;
        quantity = Math.max(1, Math.floor(quantity));
        return quantity;
    }
    static getInnerHTML() {
        return `
                <td class="product-id"></td>
                <td class="product-name"></td>
                <td class="product-price"></td>
                <td class="product-action">
                    <input type="number" value="1">
                    <button>Thêm vào giỏ</button>
                </td>
                `;
    }
}
