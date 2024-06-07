function flat(arr) {
	if (arr.length === 0) {
		return []
	}

	var result = []
	var next = arr
	var indexStack = []
	var arrStack = []

	do {
		if (Array.isArray(next)) {
			if (next.length === 0) {
				next = undefined
				continue
			}
			arrStack.push(next)
			indexStack.push(0)
			next = next[0]
		} else {
			if (next !== undefined) {
				result.push(next)
			}
			indexStack[indexStack.length - 1]++
			if (peek(indexStack) > peek(arrStack).length - 1) {
				indexStack.pop()
				arrStack.pop()
				next = undefined
			} else {
				next = peek(arrStack)[peek(indexStack)]
			}
		}
	} while (arrStack.length !== 0 && indexStack.length !== 0)

	return result
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
console.log(flat([1, 2, [3], [4], [5, 6], [7, 8, [9, [10, [11, [12]]]]]]))
