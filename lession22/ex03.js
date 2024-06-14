export function getMinMissingPositiveIntegers(arr) {
	arr.sort(function (a, b) {
		return a - b
	})

	var i = 0
	while (i < arr.length && arr[i] <= 0) {
		i++
	}

	if (arr[i] != 1) {
		return 1
	}

	while (i + 1 < arr.length) {
		if (arr[i + 1] === arr[i] || arr[i + 1] === arr[i] + 1) {
			i++
		} else {
			return arr[i] + 1
		}
	}
	return arr[arr.length - 1] + 1
}

console.log(getMinMissingPositiveIntegers([1, 1, 1, 1, 2, 3, 5])) //4
console.log(getMinMissingPositiveIntegers([-1, 1, 4, 5])) //4
console.log(getMinMissingPositiveIntegers([-1, 1, 2, 3])) //4
console.log(getMinMissingPositiveIntegers([0, 2, 3, 4])) //1
console.log(getMinMissingPositiveIntegers([2, 3, 4])) //1
console.log(getMinMissingPositiveIntegers([-3, -2, 3, 4])) //1
console.log(getMinMissingPositiveIntegers([-3, 1, 2, 3, 3, 4])) //5
