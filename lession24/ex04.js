Array.prototype.reduce2 = function (callback, initial) {
	if (this.length === 0) {
		return initial
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
