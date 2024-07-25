class FormatAction {
	constructor(selector, commandId, contentEl) {
		this.btnEl = document.querySelector(selector)
		this.commandId = commandId
		this.contentEl = contentEl
	}
	addEventListener() {
		this.btnEl.addEventListener(
			this.getEventType(),
			this.eventHandler.bind(this)
		)
	}
}

class FormatBtn extends FormatAction {
	getEventType() {
		return 'click'
	}
	addActiveState() {
		this.btnEl.classList.add('active')
	}
	removeActive() {
		this.btnEl.classList.remove('active')
	}
	toggleActive() {
		this.btnEl.classList.toggle('active')
	}
	eventHandler() {
		document.execCommand(this.commandId, false)
		this.contentEl.focus()
		this.btnEl.classList.toggle('active')
	}
}

class FormatColorBtn extends FormatAction {
	eventHandler() {
		document.execCommand(this.commandId, false, this.btnEl.value)
		this.contentEl.focus()
	}
	getEventType() {
		return 'input'
	}
	addActiveState(node) {
		if (!node) return
		this.btnEl.value = node.getAttribute('color') || '#000000'
	}
	removeActive() {
		this.btnEl.value = '#000000'
	}
	toggleActive() {
		return
	}
}
