function drawChessBoard() {
	var isWhite = true
	document.write('❌')
	for (var i = 1; i <= 8; i++) {
		document.write(getRowSymbol(i))
	}
	document.write('❌')
	document.write('<br>')
	for (var i = 1; i <= 8; i++) {
		document.write(getRowSymbol(i))
		for (var j = 1; j <= 8; j++) {
			if (isWhite) {
				document.write('⬜')
			} else {
				document.write('⬛')
			}
			isWhite = !isWhite
		}
		isWhite = !isWhite
		document.write(getRowSymbol(i))
		document.write('<br>')
	}
	document.write('❌')
	for (var i = 1; i <= 8; i++) {
		document.write(getRowSymbol(i))
	}
	document.write('❌')
}

drawChessBoard()

function getRowSymbol(n) {
	switch (n) {
		case 1:
			return '1️⃣'
		case 2:
			return '2️⃣'
		case 3:
			return '3️⃣'
		case 4:
			return '4️⃣'
		case 5:
			return '5️⃣'
		case 6:
			return '6️⃣'
		case 7:
			return '7️⃣'
		case 8:
			return '8️⃣'

		default:
			break
	}
}