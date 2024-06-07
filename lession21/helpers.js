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

function printArray(arr, level) {
	return `[ ${printArrayInner(arr, level)} ]`

	function printArrayInner(arr, level) {
		var indexOfArray = arr.findIndex(function (value) {
			return Array.isArray(value)
		})
		if (indexOfArray !== -1) {
			var result = ''
			if (indexOfArray !== 0) {
				result = `${arrayToString(arr.slice(0, indexOfArray), level)}, `
			}

			result += `[ ${printArrayInner(arr[indexOfArray], level + 1)} ] ,`
			if (indexOfArray !== arr.length) {
				result += printArrayInner(arr.slice(indexOfArray + 1), level)
			}

			return result
		}
		return arrayToString(arr, level)
	}

	function arrayToString(arr, level) {
		if (arr.length == 0) {
			return ''
		}
		var result = ''
		for (var i = 0; i < arr.length; i++) {
			var type = typeof arr[i]

			result += `<span class="${type}">${arr[i]}</span> 
			${i === arr.length - 1 ? ' ' : ', '}
			`
		}
		return `<span class="level-${level}"> ${result} </span>`
	}
}

// console.log(printArray([0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]]))
// console.log(printArray(generateNestedArray(10, 3, 1)))
