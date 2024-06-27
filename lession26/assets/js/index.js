import { Form, FormGroup, FormPasswordGroup } from './Form.js'
import { Modal } from './Modal.js'
import { Tab, TabAction, TabActionItem, TabContent } from './Tab.js'
import { Validation } from './Validation.js'

var formLoginContraints = {
	email: [{ rule: 'required' }, { rule: 'email' }],
	password: [
		{ rule: 'required' },
		{ rule: 'between', options: { min: 6, max: 20 } }
	]
}
var formRegisterContraints = {
	fullname: [{ rule: 'required' }],
	email: [{ rule: 'required' }, { rule: 'email' }],
	password: [
		{ rule: 'required' },
		{ rule: 'between', options: { min: 6, max: 20 } }
	]
}
var validation = new Validation()
var formLogin = getForm('form', formLoginContraints)
var formRegister = getForm('form:last-of-type', formRegisterContraints)
var modal = getModal()
var tabContent = getTabContent([formLogin, formRegister])
var tabAction = getTabAction()
var tab = getTab(tabAction, tabContent)

formRegister.onsubmit = function (data, form) {
	form.msgEl.innerText = 'Đăng kí Thành công\n' + JSON.stringify(data)
	form.msgEl.classList.add('success')
	return true
}

formLogin.onsubmit = function (data, form) {
	form.msgEl.innerText = 'Lỗi TEST TEST\n'
	form.msgEl.classList.add('error')
	return false
}

var hierarchy = {
	ref: modal,
	children: [
		{
			ref: tab,
			children: [
				{
					ref: tabAction,
					children: tabAction.tabActionItems.map(item => ({
						ref: item
					}))
				},
				{
					ref: tabContent,
					children: [
						{
							ref: formLogin,
							children: formLogin.formGroups.map(item => ({
								ref: item
							}))
						},
						{
							ref: formRegister,
							children: formRegister.formGroups.map(item => ({
								ref: item
							}))
						}
					]
				}
			]
		}
	]
}
makeRelation(hierarchy)
hierarchy.ref.mount()
function makeRelation(hierarchy, parent) {
	var current = hierarchy.ref
	var children = hierarchy.children

	current.parent = parent
	current.chidren = children?.map(function (child) {
		return child.ref
	})
	hierarchy.children?.forEach(function (child) {
		makeRelation(child, current)
	})
}
function getForm(selector, formConstraint) {
	var formEl = document.querySelector(selector)
	var formGroups = []
	formEl.querySelectorAll('.form-group').forEach(function (node) {
		var name = node.querySelector('input').name
		var formGroup
		if (name === 'password') {
			formGroup = new FormPasswordGroup(node, formConstraint[name])
		} else {
			formGroup = new FormGroup(node, formConstraint[name])
		}
		formGroup.validation = validation
		formGroups.push(formGroup)
	})
	return new Form(formEl, formGroups)
}
function getTabContent(tabContentItems) {
	var tabContentEl = document.querySelector('.tab-content')
	return new TabContent(tabContentEl, tabContentItems)
}
function getTabAction() {
	var tabActionEl = document.querySelector('.tab-list')
	var tabActionItemEls = tabActionEl.querySelectorAll('.tab-item')
	var tabActionItems = Array.from(tabActionItemEls).map(function (item) {
		return new TabActionItem(item)
	})
	return new TabAction(tabActionEl, tabActionItems)
}
function getTab(tabAction, tabContent) {
	var tabEl = document.querySelector('.modal')
	return new Tab(tabEl, tabAction, tabContent)
}
function getModal() {
	var flagOpen = { value: false }
	var modalEl = document.querySelector('.modal')
	var btnCloseEl = document.querySelector('.modal-open-btn')
	var modal = new Modal(modalEl, flagOpen)
	flagOpen = modal.flagOpen
	btnCloseEl.onclick = function () {
		flagOpen.value = true
	}
	document.onkeyup = function (e) {
		if (e.key === 'Escape') {
			modal.flagOpen.value = false
		}
	}
	return modal
}
