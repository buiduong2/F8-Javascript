export function TodoList(el, todoItemConstructor) {
	this.el = el
	this.todoItems = []
	this.todoItemConstructor = todoItemConstructor
	this.itemId = 0
}

TodoList.prototype.addTodo = function (content) {
	this.itemId++
	var newTodoData = {
		id: this.itemId,
		content: content
	}
	this.todoItems.push(newTodoData)
	this.renderTodo()
}
TodoList.prototype.editTodoById = function (id, newContent) {
	var existedTodo = this.todoItems.find(function (todo) {
		return todo.id === id
	})
	if (existedTodo) {
		existedTodo.content = newContent
	}
	this.renderTodo()
}
TodoList.prototype.deleteTodoById = function (id) {
	this.todoItems = this.todoItems.filter(function (todo) {
		return todo.id !== id
	})
	this.renderTodo()
}
TodoList.prototype.getTodoById = function (id) {
	return this.todoItems.find(function (todo) {
		return todo.id === id
	})
}
TodoList.prototype.renderTodo = function () {
	var _a
	var _this = this
	this.el.innerHTML = this.todoItems
		.map(this.todoItemConstructor.prototype.getTodoInnerHTML)
		.join('')
	this.el.querySelectorAll('.todo-item').forEach(function (el) {
		var todo = el
		new _this.todoItemConstructor(
			todo,
			Number(todo.dataset.id),
			_this.deleteTodoById.bind(_this),
			_this.editTodoById.bind(_this)
		)
	})
	this.onCreatedTodo?.(this.el)
}
TodoList.prototype.reRenderTodoAfterSort = function (keySorted) {
	var _this = this
	var newTodoItems = keySorted
		.map(function (id) {
			return _this.getTodoById(id)
		})
		.filter(function (todo) {
			return todo !== undefined
		})
	this.todoItems = newTodoItems
	this.renderTodo()
}
