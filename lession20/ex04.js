function sort(arr) {
	for (var i = 0; i < arr.length; i++) {
		var min = i
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[min] > arr[j]) {
				min = j
			}
		}

		if (min !== i) {
			var temp = arr[i]
			arr[i] = arr[min]
			arr[min] = temp
		}
	}

	return arr
}

function insertNumberRightOrder(arr, number) {
	var index = arr.length

	while (index != 0 && arr[index - 1] > number) {
		arr[index] = arr[index - 1]
		index--
	}

	arr[index] = number

	return arr
}
