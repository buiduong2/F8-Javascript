function drawChessBoard() {
	var isWhite = true
	var s = ''

	for (var i = 1; i <= 8; i++) {
		for (var j = 1; j <= 8; j++) {
			s += isWhite ? '⬜' : '⬛'
			isWhite = !isWhite
		}
		isWhite = !isWhite
		s += '\n'
	}
	return s
}

drawChessBoard()