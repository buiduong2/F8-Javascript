function generateArray(n, min, max) {
	var arr = []
	for (var i = 0; i < n; i++) {
		arr.push(Math.round(Math.random() * (max - min)) + min)
	}

	return arr
}
