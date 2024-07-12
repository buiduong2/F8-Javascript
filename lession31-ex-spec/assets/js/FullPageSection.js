import { Slide } from './Slide.js'
import { debounce, F8 } from './utils.js'

export function FullPage() {
	var el = document.getElementById('fullPage')
	var currentIndex = 0
	var btnSlideEls = new Array(el.children.length)
		.fill(null)
		.map(function () {
			return document.createElement('li')
		})
		.map(function (el) {
			el.className = 'side-bar-item'
			el.innerHTML = '<a href="#"><i class="fa-solid fa-circle"></i></a>'
			return el
		})
	var innerEl = FullPage.createInnerElement(el)
	el.append(innerEl)
	Slide.call(this, btnSlideEls, innerEl, currentIndex)
    this.__proto__.__proto__ = Slide.prototype
	this.el = el
	this.dragDirection = 'y'
	this.moute()
}

FullPage.prototype.moute = function () {
	var asideEl = F8.createElement({
		tagName: 'aside',
		attrs: { className: 'side-bar' },
		children: [
			{
				tagName: 'nav',
				attrs: { className: 'side-bar-wrapper' },
				children: [
					{
						tagName: 'ul',
						attrs: { className: 'side-bar' },
						children: this.btnSlideEls
					}
				]
			}
		]
	})
	this.el.insertAdjacentElement('beforebegin', asideEl)
	this.btnSlideEls[0].classList.add('active')
	this.__proto__.__proto__.moute.call(this)
	var _this = this
	var debouncedChangeSlide = debounce(
		this.changeSlide.bind(this),
		this.scrollSpeed
	)
	this.el.addEventListener('wheel', function (e) {
		e.preventDefault()
		e.stopPropagation()
		if (e.deltaY > 0) {
			debouncedChangeSlide(_this.currentIndex + 1)
		} else {
			debouncedChangeSlide(_this.currentIndex - 1)
		}
	})
	document.addEventListener('keyup', function (e) {
		if (e.key == 'ArrowUp') {
			debouncedChangeSlide(_this.currentIndex - 1)
		} else if (e.key === 'ArrowDown') {
			debouncedChangeSlide(_this.currentIndex + 1)
		}
	})
}
FullPage.createInnerElement = function (parent) {
	var innerEl = document.createElement('div')
	innerEl.classList.add('fullPage-inner')
	Array.from(parent.childNodes).forEach(function (node) {
		innerEl.append(node)
	})
	return innerEl
}
