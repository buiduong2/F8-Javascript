import { Component } from './Component.js'

/**Modal BEGIN */
export function Modal(el, flagOpen) {
	Component.call(this, el)
	this.overlayEl = document.querySelector('.modal-overlay')
	this.contentEl = document.querySelector('.modal-content')
	this.closeBtnEl = document.querySelector('.modal-close-btn')
	this.flagOpen = flagOpen
	var _this = this
	Object.defineProperty(this.flagOpen, 'value', {
		set(value) {
			_this.changeOpenFlag(value)
			return value
		}
	})
}

Modal.prototype = Object.create(Component.prototype)

Modal.prototype.mount = function () {
	Component.prototype.mount.call(this)
	var _this = this
	this.closeBtnEl.onclick = function () {
		_this.flagOpen.value = false
	}
	this.overlayEl.onclick = function () {
		_this.flagOpen.value = false
	}
}

Modal.prototype.changeOpenFlag = function (value) {
	if (value) {
		this.el.style.display = 'block'
	} else {
		this.el.style.display = 'none'
		this.destroy()
	}
}
/**Modal END */
