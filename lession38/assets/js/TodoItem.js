export class TodoItem {
	static innerHTML = `
            <span class="todo-content">Complete Mark.</span>
            <div class="todo-item-action-list">
                <button class="todo-item-action btn btn-delete">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                <button class="todo-item-action btn btn-edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="todo-item-action btn btn-mark-complete">
                    <i class="fa-solid fa-check-to-slot"></i>
                </button>
            </div>
        `
	constructor(data, todoList) {
		this.el = document.createElement('li')
		this.el.className = 'todo-item'
		this.el.innerHTML = TodoItem.innerHTML
		this.contentEl = this.el.querySelector('.todo-content')
		this.data = data
		this.todoList = todoList
		this.moute()
	}

	moute() {
		this.contentEl.textContent = this.data.content
		const btnEditEl = this.el.querySelector('.btn-edit')
		const btnDeleteEl = this.el.querySelector('.btn-delete')
		const btnMarkComplete = this.el.querySelector('.btn-mark-complete')
		btnEditEl.addEventListener('click', () =>
			this.todoList.handleEditTodo(this)
		)
		btnDeleteEl.addEventListener('click', () =>
			this.todoList.handleDeleteTodo(this)
		)
		btnMarkComplete.addEventListener('click', () =>
			this.todoList.handleMarkCompleteTodo(this)
		)
	}

	setData(newData) {
		this.data = newData
		this.contentEl.textContent = this.data.content
	}

	hidden() {
		this.el.style.display = 'none'
	}

	show() {
		this.el.style.display = ''
	}

	contains(keyword) {
		return Boolean(this.contentEl.textContent?.includes(keyword))
	}

	highlight(keyword) {
		if (!this.contentEl.textContent) return
		this.contentEl.innerHTML = this.contentEl.textContent.replaceAll(
			keyword,
			`<span class='highlight'>${keyword}</span>`
		)
	}

	removeHighlight() {
		this.contentEl.innerHTML = this.contentEl.textContent || ''
	}

	remove() {
		this.el.remove()
	}

	isVisible() {
		return window.getComputedStyle(this.el).display != 'none'
	}

	isComplete() {
		return this.data.completed
	}

	getContent() {
		return this.data.content
	}

	getId() {
		return this.data.id
	}
}
