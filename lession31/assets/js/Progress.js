export function Progress(el, audioEl, state) {
	this.progressBarEl = el
	this.progressEl = el.querySelector('.progress')
	this.progressThumbEl = el.querySelector('.progress-thumb')
	this.currentTimeEl = document.querySelector('.progress-current')
	this.durationTimeEl = document.querySelector('.progress-duration')
	this.progressPointEl = document.querySelector('.progress-point')
	this.audioEl = audioEl
	this.duration = audioEl.duration
	this.current = audioEl.currentTime
	this.state = state
	this.isChangingCurrent = false
	this.moute()
}
Progress.prototype.addValidate = function () {
	var _this = this
	function validateSecond(fn) {
		return function (second) {
			if (second > _this.duration) {
				second = _this.duration
			} else if (second < 0) {
				second = 0
			}
			return fn(second)
		}
	}
	function validateTime(fn) {
		return function (e) {
			var time = fn(e)
			if (time > _this.duration) {
				time = _this.duration
			} else if (time < 0) {
				time = 0
			}
			return time
		}
	}
	this.getCurrentTime = validateTime(this.getCurrentTime.bind(this))
	this.setCurrentProgressBar = validateSecond(
		this.setCurrentProgressBar.bind(this)
	)
	this.setCurrentProgressPoint = validateSecond(
		this.setCurrentProgressPoint.bind(this)
	)
}
Progress.prototype.moute = function () {
	this.addValidate()
	this.durationTimeEl.innerText = this.computeTime(this.duration)
	var _this = this
	this.audioEl.addEventListener('timeupdate', function () {
		_this.changeCurrentTime(_this.audioEl.currentTime)
	})
	this.setCurrentProgressBar(this.current)
	this.addChangeCurrentBehavior()
	this.addHoverShowCurrentPointBahavior()
}
Progress.prototype.addChangeCurrentBehavior = function () {
	var _this = this
	var hasBeenDragged = false
	var hasBeenClick = false
	var handler = function (e) {
		e.preventDefault()
		if (e.type === 'mousemove') {
			hasBeenDragged = true
		} else if (e.type === 'mousedown') {
			hasBeenClick = true
		}
		_this.current = _this.getCurrentTime(e)
		_this.setCurrentProgressBar(_this.current)
		_this.setCurrentProgressPoint(_this.current)
		_this.progressPointEl.style.visibility = 'visible'
	}
	var removeHandler = function (e) {
		e.preventDefault()
		_this.progressPointEl.style.visibility = ''
		document.removeEventListener('mousemove', handler)
		document.removeEventListener('mouseup', removeHandler)
	}
	this.progressBarEl.addEventListener('mousedown', function (e) {
		_this.isChangingCurrent = true
		handler(e)
		document.addEventListener('mousemove', handler)
		document.addEventListener('mouseup', removeHandler)
	})
	document.addEventListener('mouseup', function (e) {
		if (hasBeenDragged) {
			_this.changeSate('AfterDragChange')
		} else if (hasBeenClick) {
			_this.changeSate('AfterStepChange')
		}
		hasBeenDragged = false
		hasBeenClick = false
		_this.isChangingCurrent = false
	})
}
Progress.prototype.addHoverShowCurrentPointBahavior = function () {
	var _this = this
	this.progressBarEl.addEventListener('mousemove', function (e) {
		var second = _this.getCurrentTime(e)
		_this.setCurrentProgressPoint(second)
	})
}
Progress.prototype.changeSate = function (state) {
	this.state.getHandler(state)(this.current)
}
Progress.prototype.getCurrentTime = function (e) {
	var offsetLeft = this.progressBarEl.offsetLeft
	var rate = (e.clientX - offsetLeft) / this.progressBarEl.offsetWidth
	return rate * this.duration
}
Progress.prototype.computeTime = function (second) {
	var min = Math.floor(second / 60)
	var remainSecond = Math.floor(second - min * 60)
	return `${String(min).padStart(2, '0')}:${String(remainSecond).padStart(
		2,
		'0'
	)}`
}
Progress.prototype.changeCurrentTime = function (currentTime) {
	if (this.isChangingCurrent) return
	this.current = currentTime
	this.setCurrentProgressBar(this.current)
}
Progress.prototype.setCurrentProgressBar = function (second) {
	this.currentTimeEl.innerText = this.computeTime(second)
	this.currentTimeEl.innerText = this.computeTime(second)
	this.progressEl.style.width = `${(second / this.duration) * 100}%`
}
Progress.prototype.setCurrentProgressPoint = function (second) {
	this.progressPointEl.style.left = `${(second / this.duration) * 100}%`
	this.progressPointEl.innerText = this.computeTime(second)
}

export function AudioProgressState(el) {
	this.handleAfterStepChange = function (number) {
		el.currentTime = number
	}
	this.handleBeforeChange = function (number) {}
	this.handleAfterDragChange = function (number) {
		el.currentTime = number
	}
}
AudioProgressState.prototype.getHandler = function (state) {
	switch (state) {
		case 'AfterStepChange':
			return this.handleAfterStepChange
		case 'BeforeChange':
			return this.handleBeforeChange
		case 'AfterDragChange':
			return this.handleAfterDragChange
		default:
			throw new Error('Operation not supported')
	}
}
