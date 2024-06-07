function flat(arr) {
	if (arr.length === 0) {
		return []
	}

	var result = []
	var current = arr
	var indexStack = []
	var arrStack = []

	do {
		if (Array.isArray(current)) {
			if (current.length === 0) {
				current = undefined
				continue
			}
			arrStack.push(current)
			indexStack.push(0)
			current = current[0]
		} else {
			if (current !== undefined) {
				result.push(current)
			}
			if (peek(indexStack) === peek(arrStack).length - 1) {
				indexStack.pop()
				arrStack.pop()
				current = undefined
			} else {
				indexStack[indexStack.length - 1]++
				current = peek(arrStack)[peek(indexStack)]
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