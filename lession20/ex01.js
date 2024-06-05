function findMinMax(arr) {
	var min = 0
	var max = 0

	var minIndexs = []
	var maxIndexs = []

	for (var i = 0; i < arr.length; i++) {
		if (arr[min] > arr[i]) {
			min = i
			minIndexs = [i]
		} else if (arr[min] === arr[i]) {
			minIndexs[minIndexs.length] = i
		}

		if (arr[max] < arr[i]) {
			max = i
			maxIndexs = [i]
		} else if (arr[max] === arr[i]) {
			maxIndexs[maxIndexs.length] = i
		}
	}

	return [
		[maxIndexs, arr[max]],
		[minIndexs, arr[min]]
	]
}
