Object.prototype.getCurrency = function (currency) {
	var strNum = String(this)

	for (var i = strNum.length - 3; i >= 0; i -= 3) {
		strNum = strNum.substring(0, i) + ',' + strNum.substring(i)
	}

	return strNum + ' ' + currency
}

console.log('12000000'.getCurrency('D'))
console.log('12000'.getCurrency('D'))
