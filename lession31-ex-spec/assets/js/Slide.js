import { dragManager } from './utils.js'
export function Slide(btnSlideEls, innerEL, currentIndex) {
	this.btnSlideEls = btnSlideEls
	this.innerEl = innerEL

	this.currentIndex = currentIndex
	this.scrollSpeed = 0
}
Slide.prototype.moute = function () {
	var _this = this
	this.scrollSpeed =
		parseFloat(window.getComputedStyle(this.innerEl).transitionDuration) *
		1000
	this.btnSlideEls.forEach(function (btn, index) {
		btn.addEventListener('click', function () {
			_this.changeSlide(index)
		})
	})
	if (_this.dragDirection === 'x') {
		this.addDragBehavior('vw', 'clientX', 'translateX')
	} else {
		this.addDragBehavior('vh', 'clientY', 'translateY')
	}
}
Slide.prototype.addDragBehavior = function (unitView, client, translate) {
	var _this = this
	this.innerEl.addEventListener('mousedown', function (e) {
		_this.innerEl.classList.add('dragging')
		var initialClient = e[client]
		var handlerDrag = function (e2) {
			e2.stopPropagation()
			_this.innerEl.style.transform = `${translate}(calc(${
				-_this.currentIndex * 100
			}${unitView} - ${initialClient - e2[client]}px))`
		}
		var cancelDragAbleInstance = {
			cancelDrag: function () {
				_this.innerEl.classList.remove('dragging')
				document.removeEventListener('mousemove', handlerDrag)
				document.removeEventListener('mouseup', handlerRemoveDrag)
			},
			getInitialClient: function () {
				return initialClient
			}
		}
		if (client === 'clientX') {
			dragManager.addDragHorizontalIntance(cancelDragAbleInstance)
		} else {
			dragManager.addDragVertitalIntance(cancelDragAbleInstance)
		}
		var handlerRemoveDrag = function (e2) {
			_this.innerEl.classList.remove('dragging')
			var step = _this.computeChangeSlide(initialClient - e2[client])
			_this.changeSlide(_this.currentIndex + step)
			document.removeEventListener('mousemove', handlerDrag)
			document.removeEventListener('mouseup', handlerRemoveDrag)
			dragManager.clearIntance()
		}
		document.addEventListener('mousemove', handlerDrag)
		document.addEventListener('mouseup', handlerRemoveDrag)
	})
}
Slide.prototype.changeSlide = function (index) {
	var totalEle = this.innerEl.childElementCount
	if (index > totalEle - 1) {
		index = totalEle - 1
	} else if (index < 0) {
		index = 0
	}
	this.setStateAfterChangeSlide(index)
	if (this.dragDirection === 'y') {
		this.innerEl.style.transform = `translateY(${-index * 100}vh)`
	} else {
		this.innerEl.style.transform = `translateX(${-index * 100}vw)`
	}
}
Slide.prototype.computeChangeSlide = function (moveSpace) {
	var viewHeight = window.innerHeight
	if (moveSpace < 0 && Math.abs(moveSpace) > viewHeight / 4) {
		return -1
	} else if (moveSpace > 0 && Math.abs(moveSpace) > viewHeight / 4) {
		return 1
	} else {
		return 0
	}
}
Slide.prototype.setStateAfterChangeSlide = function (index) {
	this.btnSlideEls[this.currentIndex].classList.remove('active')
	this.innerEl.children[this.currentIndex].classList.remove('active')
	this.currentIndex = index
	this.btnSlideEls[this.currentIndex].classList.add('active')
	this.innerEl.children[this.currentIndex].classList.add('active')
}
