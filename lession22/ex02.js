export function mergeTwoSortedArray(arr1, arr2) {
	var mergeArr = []

	var i = 0
	var j = 0
	while (i < arr1.length && j < arr2.length) {
		if (arr1[i] < arr2[j]) {
			mergeArr.push(arr1[i])
			i++
		} else {
			mergeArr.push(arr2[j])
			j++
		}
	}

	if (i < arr1.length) {
		mergeArr = mergeArr.concat(arr1.slice(i))
	} else if (j < arr2.length) {
		mergeArr = mergeArr.concat(arr2.slice(j))
	}

	return mergeArr
}
export function getMedian(arr1, arr2) {
	var arr = mergeTwoSortedArray(arr1, arr2)

	if (arr.length % 2 !== 0) {
		var mid = Math.floor(arr.length / 2)
		return arr[mid]
	} else {
		var left = arr.length / 2 - 1
		var right = left + 1
		return (arr[left] + arr[right]) / 2
	}
}
