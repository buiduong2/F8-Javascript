function getUniqueElementArray(arr) {
	var newArr = []
	for (var i = 0; i < arr.length; i++) {
		if (!includes(newArr, arr[i])) {
			newArr.push(arr[i])
		}
	}

	return newArr
}
