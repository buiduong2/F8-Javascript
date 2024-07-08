export function AudioWrapper(el) {
	this.el = el
	this.actionBtn = document.querySelector('.player-actions .player-btn')
	this.moute()
}
AudioWrapper.prototype.moute = function () {
	var _this = this
	this.actionBtn.addEventListener('click', function () {
		if (_this.el.paused) {
			_this.el.play()
		} else {
			_this.el.pause()
		}
	})
	this.el.addEventListener('play', function () {
		_this.actionBtn.classList.replace('fa-play', 'fa-pause')
	})
	this.el.addEventListener('pause', function () {
		_this.actionBtn.classList.replace('fa-pause', 'fa-play')
	})
	this.el.addEventListener('timeupdate', function () {
		_this.onTimeUpdate?.(this.currentTime)
	})
}
