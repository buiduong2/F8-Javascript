export function TodoItem(el, id, handleDelete, handleEdit) {
	this.el = el
	this.inputEl = el.querySelector('.todo-item-content')
	this.btnDeleteEl = el.querySelector('.todo--delete')
	this.btnEditEl = el.querySelector('.todo--edit')
	this.btnSaveEl = el.querySelector('.todo--save')
	this.id = id
	this.content = this.inputEl.value
	this.isEditing = false
	this.handleDelete = handleDelete
	this.handleEdit = handleEdit
	this.moute()
}
var messages = {
	escapeFormEdit: 'Lưu thay đổi không ?',
	backspaceFromEmpty: 'Bạn muốn xóa nó không '
}

TodoItem.prototype.moute = function () {
	var _this = this
	var acceptEdit = true
	this.inputEl.onfocus = function (e) {
		_this.toggleEditingState()
	}
	this.inputEl.onblur = function (e) {
		if (acceptEdit) {
			_this.handleEdit(_this.id, _this.inputEl.value)
			_this.content = _this.inputEl.value
		}
		_this.toggleEditingState()
	}
	this.inputEl.onkeydown = function (e) {
		if (e.key === 'Enter') {
			_this.handleEdit(_this.id, _this.inputEl.value)
			_this.content = _this.inputEl.value
		} else if (e.key === 'Escape') {
			acceptEdit = false
			if (_this.inputEl.value !== _this.content) {
				if (!confirm(messages.escapeFormEdit)) {
					_this.inputEl.value = _this.content
				}
			}
			_this.inputEl.blur()
			acceptEdit = true
		} else if (e.key === 'Backspace') {
			if (_this.inputEl.value === '') {
				if (confirm(messages.backspaceFromEmpty)) {
					_this.handleDelete(_this.id)
				} else {
					_this.inputEl.value = _this.content
				}
			}
		}
	}
	this.btnEditEl.onclick = function (e) {
		_this.inputEl.focus()
		_this.inputEl.setSelectionRange(0, _this.inputEl.value.length)
	}
	this.btnDeleteEl.onclick = function (e) {
		_this.handleDelete(_this.id)
	}
	this.btnSaveEl.onclick = function (e) {
		_this.handleEdit(_this.id, _this.inputEl.value)
	}
}
TodoItem.prototype.toggleEditingState = function () {
	this.isEditing = !this.isEditing
	this.btnDeleteEl.style.display = this.isEditing ? 'none' : 'block'
	this.btnEditEl.style.display = this.isEditing ? 'none' : 'block'
	this.btnSaveEl.style.display = this.isEditing ? 'block' : 'none'
}
TodoItem.prototype.getTodoInnerHTML = function (data) {
	return `
    <li class="todo-item drag-item" data-id="${data.id}">
        <div class="drag-btn"><i class="fa-solid fa-grip-lines"></i></div>
        <input type="text" class="todo-item-content" value="${data.content}" >

        <div class="todo-item-action grab-item">
            <button class="btn todo--edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn todo--delete"><i class="fa-solid fa-trash"></i></button>
            <button class="btn todo--save"> <i class="fa-solid fa-check"></i></button>
        </div>
    </li>    
    `
}
