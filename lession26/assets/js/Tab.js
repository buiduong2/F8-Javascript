import { Component } from './Component.js'

export function Tab(el, tabAction, tabContent) {
	Component.call(this, el)
	this.tabAction = tabAction
	this.tabContent = tabContent
}
Tab.prototype = Object.create(Component.prototype)

Tab.prototype.onTabActionItemChange = function (tabActionItem) {
	var tabId = tabActionItem.id
	this.tabContent.changeTabContentItem(tabId)
}

export function TabAction(el, tabActionItems) {
	Component.call(this, el)
	this.tabActionItems = tabActionItems
	this.currentTabActionItem = tabActionItems[0]
}

TabAction.prototype = Object.create(Component.prototype)

TabAction.prototype.onTabActionItemClick = function (tabActionItem) {
	var current = this.currentTabActionItem
	var next = tabActionItem
	if (current === next) return
	this.currentTabActionItem = tabActionItem
	next.active()
	current.removeActive()
	this.emit('onTabActionItemChange', next)
}

TabAction.prototype.destroy = function () {
	Component.prototype.destroy.call(this)
	this.onTabActionItemClick(this.tabActionItems[0])
}

export function TabActionItem(el) {
	Component.call(this, el)
	this.id = Number(el.dataset.id)
	this.ACTIVE_CLASS = 'active'
}

TabActionItem.prototype = Object.create(Component.prototype)

TabActionItem.prototype.active = function () {
	this.el.classList.add(this.ACTIVE_CLASS)
}

TabActionItem.prototype.removeActive = function () {
	this.el.classList.remove(this.ACTIVE_CLASS)
}

TabActionItem.prototype.mount = function () {
	Component.prototype.mount.call(this)
	var _this = this
	this.el.onclick = function () {
		_this.emit('onTabActionItemClick', _this)
	}
}

export function TabContent(el, tabContentItems) {
	Component.call(this, el)
	this.tabContentItem = tabContentItems
	this.currentTabContentItem = this.tabContentItem[0]
}

TabContent.prototype = Object.create(Component.prototype)

TabContent.prototype.changeTabContentItem = function (tabId) {
	var current = this.currentTabContentItem
	var next = this.tabContentItem.find(function (item) {
		return item.id === tabId
	})
	if (next && next !== current) {
		this.currentTabContentItem = next
		current.removeActive()
		next.active()
	}
}

export function TabContentItem(el) {
	Component.call(this, el)
	this.id = Number(el.dataset.id)
}

TabContentItem.prototype = Object.create(Component.prototype)

TabContentItem.prototype.active = function () {
	this.el.classList.add('active')
}

TabContentItem.prototype.removeActive = function () {
	this.el.classList.remove('active')
	this.destroy()
}
