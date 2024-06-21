Object.prototype.getCurrency = function getCurrency(currency) {
	if (!isFinite(Number(this)) || Array.isArray(this)) {
		return 'Error'
	}
	var arrNums = String(Number(this)).split('')
	var isNegative = false
	if (arrNums[0] === '-') {
		isNegative = true
		arrNums.shift()
	}

	var startIndex = arrNums.lastIndexOf('.')
	if (startIndex === -1) {
		startIndex = arrNums.length - 3
	} else {
		startIndex = startIndex - 3
	}

	for (var i = startIndex; i >= 1; i -= 3) {
		arrNums.splice(i, 0, ',')
	}

	if (isNegative) {
		arrNums.unshift('-')
	}

	return arrNums.join('') + ' ' + currency
}

var num = -1234

console.log(num.getCurrency('d'))

export default {}
