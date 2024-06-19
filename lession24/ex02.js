Object.prototype.getCurrency = function getCurrency(currency) {
	if (!isFinite(Number(this)) || Array.isArray(this)) {
		return 'Error'
	}
	var strNum = String(this)
	var isNegative = false
	if (strNum[0] === '-') {
		isNegative = true
		strNum = strNum.substring(1)
	}

	var startIndex = strNum.lastIndexOf('.')
	if (startIndex === -1) {
		startIndex = strNum.length - 3
	} else {
		startIndex = startIndex - 3
	}

	for (var i = startIndex; i >= 1; i -= 3) {
		strNum = strNum.substring(0, i) + ',' + strNum.substring(i)
	}

	if (isNegative) {
		strNum = '-' + strNum
	}

	return strNum + ' ' + currency
}

export default {}
