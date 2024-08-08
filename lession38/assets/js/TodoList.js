import { TodoItem } from './TodoItem.js'
import { Modal } from './Modal.js'
import { API_TODO } from './index.js'

const loaderEl = document.querySelector('.loader')

export class TodoList {
	constructor(appEl, data) {
		this.appEl = appEl
		this.pendingEl = appEl.querySelector('.todo-list--pending')
		this.completedEl = appEl.querySelector('.todo-list--completed')
		this.countCompletedEl = appEl.querySelector('.todo-complete-count')
		this.searchInputEl = appEl.querySelector('.action-search .form-input')
		this.todoItems = data.map(todoData => new TodoItem(todoData, this))
		this.moute()
	}

	moute() {
		this.countCompletedEl.textContent = '0'
		this.todoItems.forEach(item => {
			if (item.isComplete()) {
				this.appendToCompletedList(item)
			} else {
				this.appendToPendingList(item)
			}
		})
		this.updateCompeledTodoCount()

		const showCompletedTodoBtnEl = this.appEl.querySelector(
			'.btn-show-complete-todo'
		)
		const addTodoBtnEl = this.appEl.querySelector('.btn-add-todo')

		this.searchInputEl.addEventListener('input', e => {
			e.preventDefault()
			this.searchTodo()
		})
		showCompletedTodoBtnEl.addEventListener('click', () => {
			this.completedEl.classList.toggle('active')
			showCompletedTodoBtnEl.classList.toggle('active')
		})
		addTodoBtnEl.addEventListener('click', () => this.handleAddTodo())
	}

	appendToPendingList(todoItem) {
		this.pendingEl.appendChild(todoItem.el)
	}

	appendToCompletedList(todoItem) {
		this.completedEl.appendChild(todoItem.el)
	}

	updateCompeledTodoCount() {
		let count = this.todoItems.filter(
			todo => todo.isComplete() && todo.isVisible()
		).length
		this.countCompletedEl.textContent = String(count)
	}

	searchTodo() {
		this.todoItems.forEach(todo => this.filteringTodoItem(todo))
		this.updateCompeledTodoCount()
	}

	filteringTodoItem(todoItem) {
		const keyword = this.searchInputEl.value
		const isSearching = keyword.length !== 0
		if (isSearching) {
			if (todoItem.contains(keyword)) {
				todoItem.show()
				todoItem.highlight(keyword)
			} else {
				todoItem.removeHighlight()
				todoItem.hidden()
			}
		} else {
			todoItem.removeHighlight()
			todoItem.show()
		}
	}

	handleAddTodo() {
		Modal.getIntance().active(async content => {
			if (!content.trim())
				throw new Error('Todo Content must not be null')
			const res = await this.fetchTodo({
				method: 'POST',
				data: { content, completed: false }
			})

			if (!res.ok) throw new Error('Server ERROR')

			const todoData = await res.json()
			this.addTodo(todoData)
		})
	}

	handleEditTodo(todoItem) {
		Modal.getIntance().active(async content => {
			if (!content) throw new Error('Todo Content must not be null')

			const res = await this.fetchTodo({
				id: todoItem.getId(),
				method: 'PATCH',
				data: { content }
			})

			if (!res.ok) throw new Error('Server ERROR')

			const todoData = await res.json()
			this.editTodo(todoItem, todoData)
		}, todoItem.getContent())
	}

	async handleMarkCompleteTodo(todoItem) {
		const res = await this.fetchTodo({
			id: todoItem.getId(),
			method: 'PATCH',
			data: { completed: !todoItem.isComplete() }
		})
		if (!res.ok) throw new Error('Server ERROR')

		const newTodoData = await res.json()
		this.editTodo(todoItem, newTodoData)
		if (newTodoData.completed) {
			this.appendToCompletedList(todoItem)
		} else {
			this.appendToPendingList(todoItem)
		}
	}

	async handleDeleteTodo(todoItem) {
		const res = await this.fetchTodo({
			id: todoItem.getId(),
			method: 'DELETE'
		})
		if (!res.ok) throw new Error('error')
		this.removeTodo(todoItem)
	}

	async fetchTodo({ id, method, data }) {
		loaderEl.classList.add('active')

		let url = API_TODO
		if (id) {
			url += '/' + id
		}
		const options = {}
		if (data) {
			const headers = new Headers()
			headers.append('Content-Type', 'application/json')

			options.body = JSON.stringify(data)
			options.headers = headers
		}
		if (method) {
			options.method = method
		}
		try {
			const res = await fetch(url, options)
			return res
		} catch (error) {
			throw error
		} finally {
			loaderEl.classList.remove('active')
		}
	}

	addTodo(todoData) {
		const newTodo = new TodoItem(todoData, this)
		this.todoItems.push(newTodo)
		this.appendToPendingList(newTodo)
		this.filteringTodoItem(newTodo)
	}

	editTodo(todoItem, todoData) {
		todoItem.setData(todoData)
		this.filteringTodoItem(todoItem)
		this.updateCompeledTodoCount()
	}

	removeTodo(todoItem) {
		this.todoItems = this.todoItems.filter(todo => todo !== todoItem)
		todoItem.remove()
		this.updateCompeledTodoCount()
	}
}
