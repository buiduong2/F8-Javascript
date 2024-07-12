import { Slide } from './Slide.js'
import { debounce, F8 } from './utils.js'
export function FullPageSlide(parentEl) {
	Slide.call(this, [], document.createElement('div'), 0)
	this.__proto__.__proto__ = Slide.prototype
	this.parentEl = parentEl
	this.btnNextEl = document.createElement('button')
	this.btnPrevEl = document.createElement('button')
	this.dragDirection = 'x'
	this.moute()
}
FullPageSlide.prototype.moute = function () {
	this.createElement()
	//ADd event
	this.__proto__.__proto__.moute.call(this)
	var _this = this
	var debouncedChangeSlide = debounce(
		this.changeSlide.bind(this),
		this.scrollSpeed
	)
	document.addEventListener('keyup', function (e) {
		if (_this.parentEl.classList.contains('active')) {
			if (e.key == 'ArrowLeft') {
				debouncedChangeSlide(_this.currentIndex - 1)
			} else if (e.key === 'ArrowRight') {
				debouncedChangeSlide(_this.currentIndex + 1)
			}
		}
	})
	this.btnNextEl.addEventListener('click', function () {
		debouncedChangeSlide(_this.currentIndex + 1)
	})
	this.btnPrevEl.addEventListener('click', function () {
		debouncedChangeSlide(_this.currentIndex - 1)
	})
}
FullPageSlide.prototype.createElement = function () {
	var slideEls = Array.from(this.parentEl.querySelectorAll('.slide'))
	this.btnSlideEls = this.createBtnEls(slideEls.length)
	var slideWrapper = F8.createElement({
		tagName: 'div',
		attrs: { className: 'slide-wrapper' },
		children: [
			{
				el: this.innerEl,
				attrs: { className: 'slide-inner' },
				children: slideEls
			},
			{
				tagName: 'ul',
				attrs: { className: 'slide-bar' },
				children: this.btnSlideEls
			},
			{
				tagName: 'div',
				attrs: { className: 'slide-btn-list' },
				children: [
					{
						el: this.btnPrevEl,
						attrs: { className: 'btn btn--next' },
						children: [
							{
								tagName: 'i',
								attrs: {
									className: 'fa-solid fa-chevron-right'
								},
								children: ['']
							}
						]
					},
					{
						el: this.btnNextEl,
						attrs: { className: 'btn btn--prev' },
						children: [
							{
								tagName: 'i',
								attrs: {
									className: 'fa-solid fa-chevron-left'
								},
								children: ['']
							}
						]
					}
				]
			}
		]
	})
	this.btnSlideEls[0].classList.add('active')
	this.parentEl.append(slideWrapper)
}
FullPageSlide.prototype.createBtnEls = function (length) {
	var btnEls = new Array(length).fill(null).map(function () {
		var el = document.createElement('li')
		el.classList.add('slide-bar-item')
		el.innerHTML = '<i class="fa-solid fa-circle"></i>'
		return el
	})
	return btnEls
}
