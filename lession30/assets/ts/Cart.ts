import { type Data as ProductData } from "./ProductList.js";

export class Cart {

    productDatas: ProductData[]
    el: HTMLElement
    tableEl: HTMLElement;
    totalPriceEl: HTMLElement;
    totalQuantityEl: HTMLElement;
    btnRemoveCartEl: HTMLButtonElement;
    cartMessageEl: HTMLElement;
    cartItems: CartItem[]
    totalPrice: number;
    totalQuantity: number;


    constructor(el: HTMLElement, productDatas: ProductData[]) {
        this.tableEl = document.querySelector(".section-cart .product-list") as HTMLElement;
        this.el = el;
        this.el.innerHTML = Cart.getInnerHTML();
        this.totalPriceEl = this.el.querySelector(".product-quantity") as HTMLElement;
        this.totalQuantityEl = this.el.querySelector(".product-total-price") as HTMLElement;
        this.cartMessageEl = document.querySelector(".section-cart .message") as HTMLElement;
        this.btnRemoveCartEl = document.querySelector(".section-cart .btn-remove-cart") as HTMLButtonElement;
        this.productDatas = productDatas;
        this.cartItems = []
        this.totalQuantity = 0;
        this.totalPrice = 0;
        this.moute();
    }
    moute() {
        this.updateTotalInfo();
        this.updateCartItemIndex();
        this.btnRemoveCartEl.addEventListener("click", this.removeAllCartItem.bind(this))
    }

    addToCart(id: number, quantity: number) {
        var cartItem = this.findCartItemById(id);

        if (cartItem !== undefined) {
            this.addQuantityToCartItem(cartItem, quantity);
        } else {
            var productData = this.productDatas.find(function (product) {
                return product.id === id;
            })

            if (!productData) {
                return;
            }
            this.addNewCartItem(productData, quantity);
        }

        this.updateTotalInfo();
    }

    addNewCartItem(productData: ProductData, quantity: number) {
        var cartItem = new CartItem(
            productData,
            quantity,
            this.onCartItemUpdate.bind(this),
            this.remove.bind(this)
        );
        this.cartItems.push(cartItem);
        this.el.insertBefore(cartItem.el, this.el.lastElementChild)
        this.updateCartItemIndex();
    }

    addQuantityToCartItem(cartItem: CartItem, additionalQuanity: number) {
        cartItem.addQuantity(additionalQuanity);
    }

    remove(cartItem: CartItem) {
        this.cartItems = this.cartItems.filter(function (item) {
            return item !== cartItem
        })

        this.updateTotalInfo();
        this.updateCartItemIndex();
    }

    removeAllCartItem() {
        this.cartItems.forEach(function (item) {
            item.remove();
        })
        this.cartItems = [];
        this.updateTotalInfo();
    }

    updateCartItemIndex() {
        this.cartItems.forEach(function (item, index) {
            item.setIndex(index + 1);
        })
    }

    updateTotalInfo(): void {
        this.updateTotalPrice();
        this.updateTotalQuantity();
        if (this.totalQuantity === 0) {
            this.tableEl.style.display = "none"
            this.btnRemoveCartEl.style.display = "none"
            this.cartMessageEl.style.display = ""
        } else {
            this.tableEl.style.display = ""
            this.btnRemoveCartEl.style.display = ""
            this.cartMessageEl.style.display = "none"
        }
    }


    updateTotalPrice() {
        this.totalPrice = this.cartItems.reduce(function (prev, cur) {
            return prev + cur.getTotalPrice();
        }, 0)
        this.totalPriceEl.innerText = this.totalPrice.toFixed(2);
    }

    updateTotalQuantity() {
        this.totalQuantity = this.cartItems.reduce(function (prev, cur) {
            return prev + cur.getQuantity();
        }, 0)
        this.totalQuantityEl.innerText = String(this.totalQuantity);
    }

    onCartItemUpdate() {
        this.updateTotalPrice();
        this.updateTotalQuantity();
    }

    findCartItemById(id: number): CartItem | undefined {
        return this.cartItems.find(function (item) {
            return item.id === id
        })
    }

    static getInnerHTML(): string {
        return `
            <tr>
                <td colspan="3">Tổng</td>
                <td class="product-total-price" ></td>
                <td class="product-quantity" colspan="2"></td>
            </tr>
        `
    }
}

export class CartItem {
    id: number;
    el: HTMLElement;
    currentQuantity: number;
    priceEl: HTMLElement;
    quantityEl: HTMLInputElement;
    totalPriceEl: HTMLElement;
    removeBtnEl: HTMLButtonElement;

    emitter: { [key: string]: Function };
    constructor(
        productData: ProductData, quantity: number,
        notifyChangeQuantity: (cartItem: CartItem) => void,
        notiffyRemove: (cartItem: CartItem) => void
    ) {
        this.id = productData.id;
        this.el = document.createElement("tr");
        this.el.innerHTML = CartItem.getInnerHTML();
        this.quantityEl = (this.el.querySelector(".product-quantity input") as HTMLInputElement);
        this.priceEl = this.el.querySelector(".product-price") as HTMLElement;
        this.totalPriceEl = this.el.querySelector(".product-total-price") as HTMLElement;
        this.removeBtnEl = this.el.querySelector(".product-action button") as HTMLButtonElement;

        this.emitter = {
            changeQuantity: notifyChangeQuantity,
            remove: notiffyRemove
        }
        this.currentQuantity = quantity;
        this.moute(productData, quantity)
    }

    moute(productData: ProductData, quantity: number) {
        this.quantityEl.value = String(quantity);
        (this.el.querySelector(".product-name") as HTMLElement).textContent = productData.name;
        (this.el.querySelector(".product-price") as HTMLElement).textContent = String(productData.price);
        (this.el.querySelector(".product-total-price") as HTMLElement).textContent = String(this.getTotalPrice());

        this.removeBtnEl.addEventListener("click", this.remove.bind(this, true))
        this.quantityEl.addEventListener("change", this.updateQuantity.bind(this));
        this.quantityEl.addEventListener("blur", this.setQuantity.bind(this))

    }

    remove(notify?: boolean) {
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

    addQuantity(number: number) {
        this.currentQuantity += number;
        this.updateInterface();
    }

    updateInterface() {
        this.setQuantity();
        this.setTotalPrice();
    }

    setIndex(index: number): void {
        (this.el.querySelector(".product-id") as HTMLElement).textContent = String(index);
    }

    getTotalPrice(): number {
        return this.getPrice() * this.getQuantity();
    }

    setTotalPrice() {
        this.totalPriceEl.innerText = this.getTotalPrice().toFixed(2);
    }

    getQuantity(): number {
        var value: number = Number(this.quantityEl.value);
        var quantity = isNaN(value) ? 1 : Math.max(1, Math.floor(value));
        return quantity;
    }


    setQuantity(): void {
        this.quantityEl.value = String(this.currentQuantity);
    }

    getPrice(): number {
        return Number(this.priceEl.textContent)
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
        `
    }
}