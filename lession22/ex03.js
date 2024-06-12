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
		if (result != arr[i]) {
			return result
		}
		result++
		i++
	}
	return result
}
