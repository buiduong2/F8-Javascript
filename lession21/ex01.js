var arr1 = [1, 4, 3, 2, 2, 3, 1]
var arr2 = [5, 2, 6, 7, 1, 1, 3, 3, 3]

getIntersect(arr1, arr2)
function getIntersect(arr1, arr2) {
	var frequencies = [] //[ [number, arr1-value-count, arr2-value-count], [...] ]
	var arrIndex = 0

	arrIndex++
	arr1.forEach(function (number) {
		setFrequency(frequencies, number, arrIndex)
	})

	arrIndex++
	arr2.forEach(function (number) {
		setFrequency(frequencies, number, arrIndex)
	})

	var result = []

	frequencies.forEach(function (numbers) {
		if (numbers[1] && numbers[2]) {
			var min = Math.min(numbers[1], numbers[2])
			var value = numbers[0]

			while (min != 0) {
				min--
				result.push(value)
			}
		}
	})
	return result
}

/**
 * Điều tra tần xuất của một giá trị value xuất hiện trong Array
 * @param {Array} arr : Array lưu trữ frequencies
 * @param {number} value : giá trị kiêm tra tần xuất
 * @param {number} arrIndex :
 */
function setFrequency(arr, value, arrIndex) {
	var index = insertIndexAscendingArray(arr, value)

	var isNewValue = arr[index] && arr[index][0] !== value
	if (isNewValue) {
		shiftRight(arr, index)
	}

	if (!arr[index] || arr[index][0] !== value) {
		arr[index] = [value]
	}
	if (arr[index][arrIndex]) {
		arr[index][arrIndex]++
	} else {
		arr[index][arrIndex] = 1
	}
}

function insertIndexAscendingArray(arr, value) {
	var index = 0
	while (index < arr.length && arr[index][0] < value) {
		index++
	}
	return index
}

function shiftRight(arr, index) {
	var length = arr.length
	while (index < length) {
		arr[length] = arr[length - 1]
		length--
	}
}
