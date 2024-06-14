export function getMinMissingPositiveIntegers(arr) {
	arr.sort(function (a, b) {
		return a - b
	})

	var i = 0
	while (i < arr.length && arr[i] <= 0) {
		i++
	}

	var result = 1

	while (i < arr.length) {
		if (arr[i] === result) {
			i++
			result++
		} else if (arr[i] === result - 1) {
			i++
		} else {
			return result
		}
	}
	return result
}

console.log(getMinMissingPositiveIntegers([1, 1, 1, 1, 2, 3, 5])) //4
