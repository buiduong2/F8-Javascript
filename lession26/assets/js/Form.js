import { TabContentItem } from './Tab.js'
import { Component } from './Component.js'

/**Form BEGIN */
export function Form(el, formGroups,onsubmitSuccess) {
	TabContentItem.call(this, el)
	this.formGroups = formGroups
	this.buttonEl = el.querySelector('button[type="submit"]')
	this.msgEl = el.querySelector('.form-message')
	this.PENDING_ICON = `<i class="fa-solid fa-spinner"></i>`
	this.BTN_DEFAULT_TITLE = this.buttonEl.innerText
	this.onsubmit = onsubmitSuccess;
}

Form.prototype = Object.create(TabContentItem.prototype)

Form.prototype.mount = function () {
	TabContentItem.prototype.mount.call(this)
	var _this = this
	this.el.onsubmit = function (e) {
		e.preventDefault()
		_this.beginLoading()
		var isValid = _this.validate()
		if (isValid) {
			setTimeout(function () {
				_this.onsubmit?.(_this.collectData(), _this)
				_this.endLoading()
			}, 500)
		} else {
			_this.endLoading()
		}
	}
}

Form.prototype.destroy = function () {
	TabContentItem.prototype.destroy.call(this)
	this.msgEl.classList.remove('success')
	this.msgEl.classList.remove('error')
	this.buttonEl.innerHTML = this.BTN_DEFAULT_TITLE
}

Form.prototype.beginLoading = function () {
	this.buttonEl.innerHTML = this.PENDING_ICON
}

Form.prototype.endLoading = function () {
	this.buttonEl.innerHTML = this.BTN_DEFAULT_TITLE
}

Form.prototype.validate = function () {
	return this.formGroups
		.map(function (group) {
			return group.validate()
		})
		.every(function (isInValid) {
			return isInValid
		})
}

Form.prototype.collectData = function () {
	return this.formGroups
		.map(function (group) {
			return group.inputEl
		})
		.reduce(function (res, inputEl) {
			res[inputEl.name] = inputEl.value
			return res
		}, {})
}

/**Form END */

/**FormGroup BEGIN */
export function FormGroup(el, contraints) {
	Component.call(this, el)
	this.inputEl = el.querySelector('input')
	this.msgEl = el.querySelector('p')
	this.constraints = contraints
	var _this = this
	this.constraints
		.map(function (contraint) {
			if (!contraint.options) {
				contraint.options = {}
			}
			return contraint.options
		})
		.forEach(function (options) {
			options.label = options.label ?? _this.inputEl.name
		})
}
FormGroup.prototype = Object.create(Component.prototype)
FormGroup.prototype.validate = function () {
	if (this.validation && this.constraints) {
		var message = this.validation.validate(
			this.inputEl.value,
			this.constraints
		)
		if (message) {
			this.showError(message)
			return false
		} else {
			this.clearError()
		}
	}
	return true
}
FormGroup.prototype.showError = function (message) {
	this.el.classList.add('error')
	this.msgEl.innerText = message
}

FormGroup.prototype.clearError = function () {
	this.el.classList.remove('error')
	this.msgEl.innerText = ''
}

FormGroup.prototype.mount = function () {
	Component.prototype.mount.call(this)
	var _this = this
	this.inputEl.oninput = function () {
		_this.validate()
	}
	this.inputEl.onblur = function () {
		_this.validate()
	}
}

FormGroup.prototype.destroy = function () {
	Component.prototype.destroy.call(this)
	this.clearError()
	this.inputEl.value = ''
}
/**FormGroup END */

/**FormPasswordGroup BEGIN */
export function FormPasswordGroup(el, constraints) {
	FormGroup.call(this, el, constraints)
	this.showPasswordBtnEl = el.querySelector('button')
	this.showPasswordIconEl = el.querySelector('button > *')
	this.showPassword = false
	var _this = this
	Object.defineProperty(this, 'isShowPassword', {
		set: function (value) {
			_this.showPassword = value
			this.changeIsShowPassword()
			return value
		},
		get: function () {
			return _this.showPassword
		}
	})
}

FormPasswordGroup.prototype = Object.create(FormGroup.prototype)

FormPasswordGroup.prototype.mount = function () {
	FormGroup.prototype.mount.call(this)
	var _this = this
	this.showPasswordBtnEl.onclick = function (e) {
		e.preventDefault()
		_this.isShowPassword = !_this.isShowPassword
	}
}

FormPasswordGroup.prototype.destroy = function () {
	FormGroup.prototype.destroy.call(this)
	this.isShowPassword = false
}

FormPasswordGroup.prototype.changeIsShowPassword = function () {
	if (this.showPassword) {
		this.inputEl.type = 'text'
		this.showPasswordIconEl.classList.replace('fa-eye', 'fa-eye-slash')
	} else {
		this.inputEl.type = 'password'
		this.showPasswordIconEl.classList.replace('fa-eye-slash', 'fa-eye')
	}
}
/**FormPasswordGroup END */
