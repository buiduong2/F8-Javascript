function flat(arr) {
	var stackIndex = [0]
	var stackArr = [arr]
	var n = arr.length;
	var flatedArr = []

	while (stackArr.length !== 0) {
		var i = stackIndex[stackIndex.length - 1]
		arr = stackArr[stackArr.length - 1]
		while (i < arr.length) {
			if (Array.isArray(arr[i]) && stackArr.length <= n) {
				stackArr.push(arr[i])
				stackIndex[stackIndex.length - 1] = i + 1
				stackIndex.push(0)
				arr = arr[i]
				i = 0
			} else {
				flatedArr.push(arr[i])
				i++
			}
		}
		stackArr.pop()
		stackIndex.pop()
	}
	return flatedArr
}

/**
 * Get last Element of array
 * @param {*} arr
 * @returns
 */
function peek(arr) {
	return arr[arr.length - 1]
}

// console.log(flat([0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, [], 12]]]]))
