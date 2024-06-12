export function getMedian(arr1, arr2) {
	var sumLength = arr1.length + arr2.length
	if (sumLength === 0) {
		return 0
	}

	var mid = Math.floor(sumLength / 2) //MidRight or center
	var prev
	var cur

	var i = 0
	var j = 0

	while (i + j <= mid && i < arr1.length && j < arr2.length) {
		prev = cur
		if (arr1[i] < arr2[j]) {
			cur = arr1[i]
			i++
		} else {
			cur = arr2[j]
			j++
		}
	}

	while (i + j <= mid && i < arr1.length) {
		prev = cur
		cur = arr1[i]
		i++
	}

	while (i + j <= mid && j < arr2.length) {
		prev = cur
		cur = arr2[j]
		j++
	}

	if (sumLength % 2 === 0) {
		return (prev + cur) / 2
	} else {
		return cur
	}
}
