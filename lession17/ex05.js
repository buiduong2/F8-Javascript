function drawTriangular(numOfRow) {
	if (numOfRow < 0) {
		return 0
	}
	var count = 1
	var s = ''
	for (var i = 0; i < numOfRow; i++) {
		for (var j = 0; j <= i; j++) {
			s += count + ' '
			count++
		}
		s += '\n'
	}

	return s
}
