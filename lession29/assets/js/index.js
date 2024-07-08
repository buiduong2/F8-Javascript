import { AudioWrapper } from './AudioWrapper.js'
import { Progress, AudioProgressState } from './Progress.js'
window.addEventListener('load', function () {
	var progressEl = document.querySelector('.progress-bar')
	var audioEl = document.querySelector('audio')
	var audio = new AudioWrapper(audioEl)
	var progressState = new AudioProgressState(audioEl)
	var progress = new Progress(
		progressEl,
		audioEl.duration,
		audioEl.currentTime,
		progressState
	)
	audio.onTimeUpdate = progress.changeCurrentTime.bind(progress)
})
