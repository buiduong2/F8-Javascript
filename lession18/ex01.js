function getNFibonnacies(n) {
	var arr = []

	getFibonaciN(n - 1,arr)

	var result = '1, 1'
	for (var i = 2; i < arr.length; i++) {
		if (arr[i]) {
			result += ', ' + i
		}
	}

	return result
}
function getFibonaciN(n, arr) {
	if (n === 0) {
		return 1
	}

	if (n === 1) {
		return 1
	}

	var temp = getFibonaciN(n - 1, arr) + getFibonaciN(n - 2, arr)
	arr[temp] = true
	return temp
}
