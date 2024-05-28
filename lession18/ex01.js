function getNFibonnacies(n) {
	if (n <= 0) {
		return ''
	}

	return getNFibonnacies(n - 1) + ' ' + getFibonaciN(n - 1)
}
function getFibonaciN(n) {
	if (n === 0) {
		return 1
	}

	if (n === 1) {
		return 1
	}

	var temp = getFibonaciN(n - 1) + getFibonaciN(n - 2)
	return temp
}
