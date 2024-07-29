var counterEl = document.querySelector('.counter-number')
var btnEl = document.querySelector('button')
var count = 30
var prevTime = performance.now()

counterEl.innerHTML = String(count)
startCount()

function startCount() {
	if (count == 0) {
		setReadyBtn()
		return
	}
	var currTime = performance.now()
	if (currTime - prevTime > 1000) {
		prevTime = currTime
		count--
		counterEl.innerHTML = String(count)
	}
	requestAnimationFrame(startCount)
}

function setReadyBtn() {
	btnEl.disabled = false
	btnEl.addEventListener('click', function () {
		// base64: Decode encodedString to actual string
		window.location.href = atob('aHR0cHM6Ly9mdWxsc3RhY2suZWR1LnZuLw==')
	})
}
