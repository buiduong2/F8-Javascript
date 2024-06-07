function flat2(arr) {
	var arrString = arr.toString()

	return arrString.split(',').map(function (str) {
		return Number(str)
	})
}
var arr = [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]]
console.log(flat3(arr))
console.log(flat2(arr))

function flat3(arr) {
	var indexOfArray = arr.findIndex(function (value) {
		return Array.isArray(value)
	})

	if (indexOfArray !== -1) {
		var result = arr
			.slice(0, indexOfArray)
			.concat(
				flat3(arr[indexOfArray]),
				flat3(arr.slice(indexOfArray + 1))
			)
		return result
	}
	return arr
}
