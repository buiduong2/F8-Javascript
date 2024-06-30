export function TodoFrom(el, todoList) {
	this.el = el
	this.todoList = todoList
	this.inputEl = this.el.querySelector('input')
	this.submitEl = this.el.querySelector('button[type="submit"]')
	this.moute()
}

TodoFrom.prototype.moute = function () {
	var _this = this
	this.el.onsubmit = function (e) {
		e.preventDefault()
		_this.addTodo()
		_this.inputEl.blur()
	}
}
TodoFrom.prototype.addTodo = function () {
	if (this.inputEl.value !== '') {
		this.todoList.addTodo(this.inputEl.value)
		this.inputEl.value = ''
		return true
	}
	return false
}
TodoFrom.prototype.clearInput = function () {
	this.inputEl.value = ''
}
