export class Cart {
    constructor(el, productDatas) {
        this.tableEl = document.querySelector(".section-cart .product-list");
        this.el = el;
        this.el.innerHTML = Cart.getInnerHTML();
        this.totalPriceEl = this.el.querySelector(".product-quantity");
        this.totalQuantityEl = this.el.querySelector(".product-total-price");
        this.cartMessageEl = document.querySelector(".section-cart .message");
        this.btnRemoveCartEl = document.querySelector(".section-cart .btn-remove-cart");
        this.productDatas = productDatas;
        this.cartItems = [];
        this.totalQuantity = 0;
        this.totalPrice = 0;
        this.moute();
    }
    moute() {
        this.updateTotalInfo();
        this.updateCartItemIndex();
        this.btnRemoveCartEl.addEventListener("click", this.removeAllCartItem.bind(this));
    }
    addToCart(id, quantity) {
        var cartItem = this.findCartItemById(id);
        if (cartItem !== undefined) {
            this.addQuantityToCartItem(cartItem, quantity);
        }
        else {
            var productData = this.productDatas.find(function (product) {
                return product.id === id;
            });
            if (!productData) {
                return;
            }
            this.addNewCartItem(productData, quantity);
        }
        this.updateTotalInfo();
    }
    addNewCartItem(productData, quantity) {
        var cartItem = new CartItem(productData, quantity, this.onCartItemUpdate.bind(this), this.remove.bind(this));
        this.cartItems.push(cartItem);
        this.el.insertBefore(cartItem.el, this.el.lastElementChild);
        this.updateCartItemIndex();
    }
    addQuantityToCartItem(cartItem, additionalQuanity) {
        cartItem.addQuantity(additionalQuanity);
    }
    remove(cartItem) {
        this.cartItems = this.cartItems.filter(function (item) {
            return item !== cartItem;
        });
        this.updateTotalInfo();
        this.updateCartItemIndex();
    }
    removeAllCartItem() {
        this.cartItems.forEach(function (item) {
            item.remove();
        });
        this.cartItems = [];
        this.updateTotalInfo();
    }
    updateCartItemIndex() {
        this.cartItems.forEach(function (item, index) {
            item.setIndex(index + 1);
        });
    }
    updateTotalInfo() {
        this.updateTotalPrice();
        this.updateTotalQuantity();
        if (this.totalQuantity === 0) {
            this.tableEl.style.display = "none";
            this.btnRemoveCartEl.style.display = "none";
            this.cartMessageEl.style.display = "";
        }
        else {
            this.tableEl.style.display = "";
            this.btnRemoveCartEl.style.display = "";
            this.cartMessageEl.style.display = "none";
        }
    }
    updateTotalPrice() {
        this.totalPrice = this.cartItems.reduce(function (prev, cur) {
            return prev + cur.getTotalPrice();
        }, 0);
        this.totalPriceEl.innerText = this.totalPrice.toFixed(2);
    }
    updateTotalQuantity() {
        this.totalQuantity = this.cartItems.reduce(function (prev, cur) {
            return prev + cur.getQuantity();
        }, 0);
        this.totalQuantityEl.innerText = String(this.totalQuantity);
    }
    onCartItemUpdate() {
        this.updateTotalPrice();
        this.updateTotalQuantity();
    }
    findCartItemById(id) {
        return this.cartItems.find(function (item) {
            return item.id === id;
        });
    }
    static getInnerHTML() {
        return `
            <tr>
                <td colspan="3">Tổng</td>
                <td class="product-total-price" ></td>
                <td class="product-quantity" colspan="2"></td>
            </tr>
        `;
    }
}
export class CartItem {
    constructor(productData, quantity, notifyChangeQuantity, notiffyRemove) {
        this.id = productData.id;
        this.el = document.createElement("tr");
        this.el.innerHTML = CartItem.getInnerHTML();
        this.quantityEl = this.el.querySelector(".product-quantity input");
        this.priceEl = this.el.querySelector(".product-price");
        this.totalPriceEl = this.el.querySelector(".product-total-price");
        this.removeBtnEl = this.el.querySelector(".product-action button");
        this.emitter = {
            changeQuantity: notifyChangeQuantity,
            remove: notiffyRemove
        };
        this.currentQuantity = quantity;
        this.moute(productData, quantity);
    }
    moute(productData, quantity) {
        this.quantityEl.value = String(quantity);
        this.el.querySelector(".product-name").textContent = productData.name;
        this.el.querySelector(".product-price").textContent = String(productData.price);
        this.el.querySelector(".product-total-price").textContent = String(this.getTotalPrice());
        this.removeBtnEl.addEventListener("click", this.remove.bind(this, true));
        this.quantityEl.addEventListener("change", this.updateQuantity.bind(this));
        this.quantityEl.addEventListener("blur", this.setQuantity.bind(this));
    }
    remove(notify) {
        this.el.remove();
        if (notify) {
            this.emitter.remove(this);
        }
    }
    updateQuantity() {
        var newQuantity = this.getQuantity();
        if (this.currentQuantity !== newQuantity) {
            this.currentQuantity = newQuantity;
            this.emitter.changeQuantity();
            this.updateInterface();
        }
    }
    addQuantity(number) {
        this.currentQuantity += number;
        this.updateInterface();
    }
    updateInterface() {
        this.setQuantity();
        this.setTotalPrice();
    }
    setIndex(index) {
        this.el.querySelector(".product-id").textContent = String(index);
    }
    getTotalPrice() {
        return this.getPrice() * this.getQuantity();
    }
    setTotalPrice() {
        this.totalPriceEl.innerText = this.getTotalPrice().toFixed(2);
    }
    getQuantity() {
        var value = Number(this.quantityEl.value);
        var quantity = isNaN(value) ? 1 : Math.max(1, Math.floor(value));
        return quantity;
    }
    setQuantity() {
        this.quantityEl.value = String(this.currentQuantity);
    }
    getPrice() {
        return Number(this.priceEl.textContent);
    }
    static getInnerHTML() {
        return `
            <td class="product-id"></td>
            <td class="product-name"></td>
            <td class="product-price"></td>
            <td class="product-quantity"><input type="number" ></td>
            <td class="product-total-price"></td>
            <td class="product-action">
                <button>Xóa</button>
            </td>
        `;
    }
}
