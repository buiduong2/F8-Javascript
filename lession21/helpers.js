function generateArray(n) {
	var result = []
	for (var i = 0; i < n; i++) {
		result.push(Math.floor(Math.random() * 10))
	}
	return result
}

function generateArrayMultipleType(n) {
	var values = [function () {}, { id: 1 }, NaN, true, false]

	var arr = generateArray(n + 10)

	for (var i = 0; i < n; i++) {
		var random = Math.floor(Math.random() * 10)
		if (random > 3 && random <= 6) {
			arr[randomIndex(arr)] = values[randomIndex(values)]
		} else if (random > 6) {
			arr[randomIndex(arr)] = String(arr[randomIndex(arr)])
		}
	}
	return arr
}

function generateNestedArray(n, maxLevel, currenLevel) {
	var arr = generateArray(n)
	for (var i = 0; i < arr.length; i++) {
		var random = Math.round(Math.random() * 10)
		if (random > 7 && currenLevel < maxLevel) {
			arr[i] = generateNestedArray(3, maxLevel, currenLevel + 1)
		}
	}
	return arr
}

function randomIndex(arr) {
	return Math.round(Math.random() * (arr.length - 1))
}

function printArray(arr) {
	return '[ ' + printArrayInner(arr) + ' ]'

	function printArrayInner(arr) {
		var indexOfArray = arr.findIndex(function (value) {
			return Array.isArray(value)
		})
		if (indexOfArray !== -1) {
			var result =
				arrayToString(arr.slice(0, indexOfArray)) +
				' [ ' +
				printArrayInner(arr[indexOfArray])
			if (indexOfArray !== arr.length) {
				result += ' ] ' + printArrayInner(arr.slice(indexOfArray + 1))
			}

			return result
		}
		return arrayToString(arr)
	}

	function arrayToString(arr) {
		var result = ''
		for (var i = 0; i < arr.length; i++) {
			var type = typeof arr[i]

			result += `<span class="${type}">${arr[i]}</span> 
			${i === arr.length - 1 ? ' ' : ', '}
			`
		}
		return result
	}
}

// console.log(printArray([0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]]))
// console.log(printArray(generateNestedArray(10, 3, 1)))
