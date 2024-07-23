var QUERY_STRING_DRAG_ITEM = '.list-item[draggable="true"]'
var QUERY_STRING_DRAG_ITEM_ID = '.list-item[draggable="true"] .drag-id'
var PREFIX_GROUP_ID = 'id-'
var CLASS_DRAGGING = 'dragging'

var ERROR_MSG_DRAG_OVER = 'Error: An item being dragged must be set'
var ERROR_MSG_DRAG_END =
	'Error: No item being dragged was assigned when drag action ended'
var ERROR_MSG_GET_ID_EL = `Error: Some draggable items do not have a tag with required classes:
			 drag-id ,a class with prefix ${PREFIX_GROUP_ID}`

var dragItems = document.querySelectorAll(QUERY_STRING_DRAG_ITEM)
var draggingItem = null

indexingAllDragElement()

dragItems.forEach(function (dragItem) {
	dragItem.addEventListener('dragstart', function (e) {
		draggingItem = this
		draggingItem.classList.add(CLASS_DRAGGING)
	})
	dragItem.addEventListener('dragover', function (e) {
		e.preventDefault()
		if (draggingItem === this) return
		if (!draggingItem) throw new Error(ERROR_MSG_DRAG_OVER)

		var insertPosition =
			draggingItem.offsetTop > this.offsetTop ? 'beforebegin' : 'afterend'
		this.insertAdjacentElement(insertPosition, draggingItem)
	})
	dragItem.addEventListener('dragend', function (e) {
		e.preventDefault()
		if (!draggingItem) throw new Error(ERROR_MSG_DRAG_END)

		draggingItem.classList.remove(CLASS_DRAGGING)
		draggingItem = null
		indexingAllDragElement()
	})
})

function getAllIdEl() {
	var idEls = Array.from(
		document.querySelectorAll(QUERY_STRING_DRAG_ITEM)
	).map(function (dragEl) {
		return dragEl.querySelector(QUERY_STRING_DRAG_ITEM_ID)
	})
	var isIdValid = idEls.every(function (id) {
		return (
			id &&
			Array.from(id.classList).some(function (className) {
				return className.startsWith(PREFIX_GROUP_ID)
			})
		)
	})
	if (!isIdValid) {
		throw new Error(ERROR_MSG_GET_ID_EL)
	}
	return idEls
}

function indexingAllDragElement() {
	var idEls = getAllIdEl()
	var idCount = {}
	idEls.forEach(function (el) {
		var groupId = Array.from(el.classList).find(function (className) {
			return className.startsWith(PREFIX_GROUP_ID)
		})
		if (!(groupId in idCount)) {
			idCount[groupId] = 0
		}
		idCount[groupId]++
		el.textContent = String(idCount[groupId])
	})
}
