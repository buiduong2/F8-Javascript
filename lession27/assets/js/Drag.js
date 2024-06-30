export function Drag(el) {
	this.el = el
	this.placeHolderEl = document.querySelector('.dragplace-holder')
	this.itemDatas = []
	this.moute()
}

Drag.prototype.moute = function () {
	this.el.style.position = 'relative'
	this.itemDatas = this.getInfoItemData()
	this.mouteItems()
	this.itemDatas.forEach(this.addDragBehaviorItem.bind(this))
}

Drag.prototype.getInfoItemData = function () {
	var itemDatas = Array.from(this.el.querySelectorAll('.drag-item'))
		.map(function (item, index) {
			var el = item
			var rect = el.getBoundingClientRect()
			return {
				id: Number(el.dataset.id),
				originY: el.offsetTop,
				x: el.offsetLeft,
				y: el.offsetTop,
				minY: rect.top,
				maxY: 0,
				height: el.offsetHeight,
				clientX: rect.left,
				clientY: rect.top,
				ref: el
			}
		})
		.map(function (el) {
			var btnEl = el.ref.querySelector('.drag-btn')
			var btn = {
				ref: btnEl
			}
			return { el: el, btn }
		})
	var els = itemDatas.map(item => item.el)
	for (var i = 0; i < els.length; i++) {
		els[i].maxY =
			i + 1 < els.length ? els[i + 1].clientY : els[i].clientY + els[i].y
	}
	return itemDatas
}

Drag.prototype.mouteItems = function () {
	this.itemDatas.forEach(function (item) {
		var el = item.el.ref
		var itemCurrentWidth = el.offsetWidth
		el.style.position = 'relative'
		el.style.width = itemCurrentWidth + 'px'
	})
}

Drag.prototype.addDragBehaviorItem = function (item) {
	var _this = this
	var el = item.el.ref
	var btnEl = item.btn.ref
	var move = false
	btnEl.onmousedown = function (e1) {
		_this.setBeginDrag(item)
		var clientX = item.el.clientX
		var clientY = item.el.clientY
		var top = isNaN(parseInt(el.style.top)) ? 0 : parseInt(el.style.top)
		document.onmousemove = function (e2) {
			el.style.left = e2.clientX - clientX - e1.offsetX + 'px'
			el.style.top = e2.clientY - clientY - e1.offsetY + top + 'px'
			_this.itemDatas
				.filter(item => item !== _this.currentDrag)
				.forEach(function (item) {
					if (
						e2.clientY <= item.el.maxY &&
						e2.clientY >= item.el.minY
					) {
						if (!move) {
							_this.changePlaceHolderPositionAndItem(item)
							move = true
						} else {
							move = false
						}
					}
				})
			document.onmouseup = function () {
				var _a
				if (!_this.currentDrag || !_this.placeHolderEl) return
				var top1 = _this.currentDrag.el.y
				var top2 = _this.currentDrag.el.originY
				_this.currentDrag.el.ref.style.top = `${-top2 + top1}px`
				_this.currentDrag.el.ref.style.left = `${_this.currentDrag.el.x}px`
				document.onmousemove = null
				_this.setEndDrag()
				;(_a = _this.onDragSuccess) === null || _a === void 0
					? void 0
					: _a.call(_this, _this.getElSortedByPosition())
			}
		}
	}
}

Drag.prototype.setBeginDrag = function (item) {
	item.el.ref.classList.add('dragging')
	this.prevItemEl = this.mapPrevItemEl(item)
	this.setRectPlaceHolder(item)
	this.setPlaceHolderPosition(item)
	this.currentDrag = item
}

Drag.prototype.setEndDrag = function () {
	if (this.currentDrag) {
		this.currentDrag.el.ref.classList.remove('dragging')
	}
	this.currentDrag = undefined
	this.prevItemEl = undefined
	this.placeHolderEl.style.display = 'none'
	this.placeHolderEl.classList.remove('dragging')
}

Drag.prototype.setPlaceHolderPosition = function (item) {
	this.placeHolderEl.style.top = item.el.clientY + 'px'
	this.placeHolderEl.style.left = item.el.clientX + 'px'
}

Drag.prototype.setRectPlaceHolder = function (item) {
	var _this = this
	this.placeHolderEl.style.display = 'block'
	this.placeHolderEl.style.width = item.el.ref.offsetWidth + 'px'
	this.placeHolderEl.style.height = item.el.ref.offsetHeight + 'px'
	setTimeout(function () {
		_this.placeHolderEl.classList.add('dragging')
	}, 0)
}

Drag.prototype.changePlaceHolderPositionAndItem = function (item) {
	if (!this.currentDrag || !this.prevItemEl) {
		throw new Error('Loi')
	}
	var top1 = this.prevItemEl.clientY
	var top2 = item.el.clientY
	item.el.ref.style.top = `calc(${item.el.ref.style.top || 0 + 'px'} +  ${
		top1 - top2
	}px)`
	this.setPlaceHolderPosition(item)
	var temp = Object.assign({}, this.prevItemEl)
	this.prevItemEl = this.mapPrevItemEl(item)
	item.el = Object.assign(Object.assign({}, temp), {
		id: item.el.id,
		ref: item.el.ref,
		originY: item.el.originY
	})
	this.currentDrag.el = Object.assign(Object.assign({}, this.prevItemEl), {
		id: this.currentDrag.el.id,
		ref: this.currentDrag.el.ref,
		originY: this.currentDrag.el.originY
	})
}
Drag.prototype.getElSortedByPosition = function () {
	return this.itemDatas
		.map(function (item) {
			return {
				id: item.el.id,
				clientY: item.el.ref.getBoundingClientRect().top
			}
		})
		.sort(function (a, b) {
			return a.clientY - b.clientY
		})
		.map(function (el) {
			return el.id
		})
}
Drag.prototype.mapPrevItemEl = function (item) {
	return {
		x: item.el.x,
		y: item.el.y,
		minY: item.el.minY,
		maxY: item.el.maxY,
		height: item.el.height,
		clientX: item.el.clientX,
		clientY: item.el.clientY
	}
}
