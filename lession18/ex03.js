function convert3NumberToText(n, isLast3Number) {
	if (n === 0) {
		return ''
	}

	var result = ''
	var firstText = ''

	if (!isLast3Number && n !== 0) {
		if (n < 100) {
			firstText = 'Không trăm ' + firstText

			if (n < 10) {
				firstText = firstText + ' linh '
			}
		}
	}

	var decimal = 0
	var numberOfDigist = 0
	var lastDigist
	while (Math.ceil(n / 10) != 0) {
		numberOfDigist++
		decimal++
		var currentDigist = n % 10
		var nextDigist = Math.floor(n / 10) % 10
		var digitText = getDigistText(currentDigist, nextDigist, numberOfDigist)
		var decimalText = getDecimalText( currentDigist, lastDigist, numberOfDigist )

		result = digitText + ' ' + decimalText + ' ' + result

		n = Math.floor(n / 10)
		lastDigist = currentDigist
	}

	return firstText + ' ' + result
}

function convertNumberToText(n) {
	var result = ''
	var count = 0
	while (n !== 0) {
		var isLast3Number = n < 1000
		var text = convert3NumberToText(n % 1000, isLast3Number)
		var hightOrderDemcimal = getHighOrderDecimalText(count)

		if (!!text.trim()) {
			if (result) {
				//append comma like 1.000.000
				result = ', ' + result
			}
			result = text + ' ' + hightOrderDemcimal + ' ' + result
		}

		n = Math.floor(n / 1000)
		count++
		if (count > 3) {
			count = 1
		}
	}

	return result
}

function getDigistText(currentDigist, nextDigist, numberOfDigist) {
	switch (currentDigist) {
		case 0:
			if (numberOfDigist != 2 && numberOfDigist != 1) {
				return 'Không'
			}
			return ''
		case 1:
			if (nextDigist > 1 && numberOfDigist === 1) {
				return 'Mốt'
			}
			if (numberOfDigist === 2) {
				return 'Mười'
			}
			return 'Một'
		case 2:
			return 'Hai'
		case 3:
			return 'Ba'
		case 4:
			return 'Bốn'
		case 5:
			return 'Năm'
		case 6:
			return 'Sáu'
		case 7:
			return 'Bảy'
		case 8:
			return 'Tám'
		case 9:
			return 'Chín'
		default:
			console.log('error')
			break
	}
}

function getDecimalText(currentDigist, lastDigist, numberOfDigist) {
	switch (numberOfDigist) {
		case 1:
			return ''
		case 2:
			if (
				currentDigist === 1 ||
				(lastDigist === 0 && currentDigist === 0)
			) {
				return ''
			}
			if (currentDigist === 0 && lastDigist !== 0) {
				return 'linh'
			}
			return 'mươi'
		case 3:
			return 'trăm'
		default:
			console.log('error')
			break
	}
}

function getHighOrderDecimalText(n) {
	switch (n) {
		case 0:
			return ''
		case 1:
			return 'nghìn'
		case 2:
			return 'triệu'
		case 3:
			return 'tỷ'
		default:
			break
	}
}
