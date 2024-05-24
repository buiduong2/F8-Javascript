function drawTriangular(numOfRow) {
	var count = 1
	for (var i = 0; i < numOfRow; i++) {
		for (var j = 0; j <= i; j++) {
			document.write(count + ' ')
			count++
		}
		document.write('<br>')
	}
}

drawTriangular(5)
