function getMinMissingPositiveIntegers(arr) {
	arr.sort(function (a, b) {
		return a - b
	})

	var i = 0
	while (i < arr.length && arr[i] <= 0) {
		i++
	}

	var result = 1

	while (i < arr.length) {
		if (result != arr[i]) {
			return result
		}
		result++
		i++
	}
	return result
}

console.log(getMinMissingPositiveIntegers([1, 2, 0]))
console.log(getMinMissingPositiveIntegers([3, 4, -1, 1]))
console.log(getMinMissingPositiveIntegers([7, 8, 9, 11, 12]))
