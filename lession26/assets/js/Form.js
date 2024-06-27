import { TabContentItem } from './Tab.js'
import { Component } from './Component.js'

export function Form(el, formGroups) {
	TabContentItem.call(this, el)
	this.formGroups = formGroups
}

Form.prototype = Object.create(TabContentItem.prototype)

Form.prototype.mount = function () {
	TabContentItem.prototype.mount.call(this)
	var _this = this
	this.el.onsubmit = function (e) {
		e.preventDefault()
		if (_this.validate()) {
			_this.onsubmit?.(_this.collectData())
		}
	}
}

Form.prototype.validate = function () {
	return this.formGroups.every(function (group) {
		return group.validate()
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
