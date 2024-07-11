export function Cart(el, productDatas) {
	this.tableEl = document.querySelector('.section-cart .product-list')
	this.el = el
	this.el.innerHTML = Cart.getInnerHTML()
	this.totalPriceEl = this.el.querySelector('.product-quantity')
	this.totalQuantityEl = this.el.querySelector('.product-total-price')
	this.cartMessageEl = document.querySelector('.section-cart .message')
	this.btnRemoveCartEl = document.querySelector(
		'.section-cart .btn-remove-cart'
	)
	this.productDatas = productDatas
	this.cartItems = []
	this.totalQuantity = 0
	this.totalPrice = 0
	this.moute()
}
Cart.LOCAL_STORAGE_KEY = 'SHOPEE_CART'
Cart.prototype.moute = function () {
	var _a
	var _this = this
	var oldItems = JSON.parse(
		(_a = window.localStorage.getItem(Cart.LOCAL_STORAGE_KEY)) !== null &&
			_a !== void 0
			? _a
			: '[]'
	)
	oldItems.forEach(function (item) {
		_this.addToCart(item.id, item.quantity)
	})
	this.updateTotalInfo()
	this.updateCartItemIndex()

	this.btnRemoveCartEl.addEventListener('click', function () {
		if (window.confirm('Xóa tất cả giỏ hàng chứ ?')) {
			_this.removeAllCartItem()
		}
	})
}
Cart.prototype.addToCart = function (id, quantity) {
	var cartItem = this.findCartItemById(id)
	if (cartItem !== undefined) {
		this.addQuantityToCartItem(cartItem, quantity)
	} else {
		var productData = this.productDatas.find(function (product) {
			return product.id === id
		})
		if (!productData) {
			return
		}
		this.addNewCartItem(productData, quantity)
	}
	this.updateTotalInfo()
}
Cart.prototype.addNewCartItem = function (productData, quantity) {
	var cartItem = new CartItem(
		productData,
		quantity,
		this.onCartItemUpdate.bind(this),
		this.remove.bind(this)
	)
	this.cartItems.push(cartItem)
	this.el.insertBefore(cartItem.el, this.el.lastElementChild)
	this.updateCartItemIndex()
}
Cart.prototype.addQuantityToCartItem = function (cartItem, additionalQuanity) {
	cartItem.addQuantity(additionalQuanity)
}
Cart.prototype.remove = function (cartItem) {
	this.cartItems = this.cartItems.filter(function (item) {
		return item !== cartItem
	})
	this.updateTotalInfo()
	this.updateCartItemIndex()
}
Cart.prototype.removeAllCartItem = function () {
	this.cartItems.forEach(function (item) {
		item.remove()
	})
	this.cartItems = []
	this.updateTotalInfo()
}
Cart.prototype.updateCartItemIndex = function () {
	this.cartItems.forEach(function (item, index) {
		item.setIndex(index + 1)
	})
}
Cart.prototype.updateTotalInfo = function () {
	this.saveLocalStorage()
	this.updateTotalPrice()
	this.updateTotalQuantity()
	if (this.totalQuantity === 0) {
		this.tableEl.style.display = 'none'
		this.btnRemoveCartEl.style.display = 'none'
		this.cartMessageEl.style.display = ''
	} else {
		this.tableEl.style.display = ''
		this.btnRemoveCartEl.style.display = ''
		this.cartMessageEl.style.display = 'none'
	}
}
Cart.prototype.updateTotalPrice = function () {
	this.totalPrice = this.cartItems.reduce(function (prev, cur) {
		return prev + cur.getTotalPrice()
	}, 0)
	this.totalPriceEl.innerText = this.totalPrice.toFixed(2)
}
Cart.prototype.updateTotalQuantity = function () {
	this.totalQuantity = this.cartItems.reduce(function (prev, cur) {
		return prev + cur.getQuantity()
	}, 0)
	this.totalQuantityEl.innerText = String(this.totalQuantity)
}
Cart.prototype.onCartItemUpdate = function () {
	this.saveLocalStorage()
	this.updateTotalPrice()
	this.updateTotalQuantity()
}
Cart.prototype.findCartItemById = function (id) {
	return this.cartItems.find(function (item) {
		return item.id === id
	})
}
Cart.prototype.saveLocalStorage = function () {
	window.localStorage.setItem(
		Cart.LOCAL_STORAGE_KEY,
		JSON.stringify(this.getItemData())
	)
}
Cart.prototype.getItemData = function () {
	return this.cartItems.map(function (item) {
		return {
			id: item.id,
			quantity: item.getQuantity()
		}
	})
}

Cart.getInnerHTML = function () {
	return `
            <tr>
                <td colspan="3">Tổng</td>
                <td class="product-total-price" ></td>
                <td class="product-quantity" colspan="2"></td>
            </tr>
        `
}

export function CartItem(
	productData,
	quantity,
	notifyChangeQuantity,
	notiffyRemove
) {
	this.id = productData.id
	this.el = document.createElement('tr')
	this.el.innerHTML = CartItem.getInnerHTML()
	this.quantityEl = this.el.querySelector('.product-quantity input')
	this.priceEl = this.el.querySelector('.product-price')
	this.totalPriceEl = this.el.querySelector('.product-total-price')
	this.removeBtnEl = this.el.querySelector('.product-action button')
	this.emitter = {
		changeQuantity: notifyChangeQuantity,
		remove: notiffyRemove
	}
	this.currentQuantity = quantity
	this.moute(productData, quantity)
}
CartItem.prototype.moute = function (productData, quantity) {
	this.quantityEl.value = String(quantity)
	this.el.querySelector('.product-name').textContent = productData.name
	this.el.querySelector('.product-price').textContent = String(
		productData.price
	)
	this.el.querySelector('.product-total-price').textContent = String(
		this.getTotalPrice()
	)
	var _this = this
	this.removeBtnEl.addEventListener('click', function () {
		if (window.confirm('Xóa chứ ?')) {
			_this.remove(true)
		}
	})
	this.quantityEl.addEventListener('change', this.updateQuantity.bind(this))
	this.quantityEl.addEventListener('blur', this.setQuantity.bind(this))
}
CartItem.prototype.remove = function (notify) {
	this.el.remove()
	if (notify) {
		this.emitter.remove(this)
	}
}
CartItem.prototype.updateQuantity = function () {
	var newQuantity = this.getQuantity()
	if (this.currentQuantity !== newQuantity) {
		this.currentQuantity = newQuantity
		this.emitter.changeQuantity()
		this.updateInterface()
	}
}
CartItem.prototype.addQuantity = function (number) {
	this.currentQuantity += number
	this.updateInterface()
}
CartItem.prototype.updateInterface = function () {
	this.setQuantity()
	this.setTotalPrice()
}
CartItem.prototype.setIndex = function (index) {
	this.el.querySelector('.product-id').textContent = String(index)
}
CartItem.prototype.getTotalPrice = function () {
	return this.getPrice() * this.getQuantity()
}
CartItem.prototype.setTotalPrice = function () {
	this.totalPriceEl.innerText = this.getTotalPrice().toFixed(2)
}
CartItem.prototype.getQuantity = function () {
	var value = Number(this.quantityEl.value)
	var quantity = isNaN(value) ? 1 : Math.max(1, Math.floor(value))
	return quantity
}
CartItem.prototype.setQuantity = function () {
	this.quantityEl.value = String(this.currentQuantity)
}
CartItem.prototype.getPrice = function () {
	return Number(this.priceEl.textContent)
}
CartItem.getInnerHTML = function () {
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
