function reverseNumber(n) {
	var isInteger = n % 1 !== 0
	if (isInteger) {
		return 'Invalid Input'
	}
	var isNegativeNumber = false
	var result = 0

	if (n < 0) {
		n *= -1
		isNegativeNumber = true
	}

	while (Math.ceil(n / 10) !== 0) {
		result += n % 10
		result *= 10
		n = Math.floor(n / 10)
	}

	result /= 10

	return isNegativeNumber ? result * -1 : result
}
