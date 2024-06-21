Array.prototype.reduce2 = function (callback, initial) {
	if (this.length === 0) {
		throw new TypeError("arr's length === 0")
	}

	if (typeof callback !== 'function') {
		throw new TypeError('Callback must be a function')
	}
	
	var i
	var prev

	if (initial === undefined) {
		i = 1
		prev = this[0]
	} else {
		i = 0
		prev = initial
	}
	for (; i < this.length; i++) {
		prev = callback(prev, this[i], i, this)
	}

	return prev
}

export default {}
