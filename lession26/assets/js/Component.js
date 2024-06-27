export function Component(el, children, parent) {
	this.el = el
	this.children = children
	this.parent = parent
}

Component.prototype.mount = function () {
	this.chidren?.forEach(function (child) {
		child.mount()
	})
}

Component.prototype.destroy = function () {
	this.chidren?.forEach(function (child) {
		child.destroy()
	})
}

Component.prototype.emit = function (eventName, value) {
	this.parent?.listen(eventName, value)
}

Component.prototype.listen = function (eventName, value) {
	this[eventName]?.(value)
}
