Array.prototype.filter2 = function (callback, thisArg) {
	if (typeof callback !== 'function') {
		throw new TypeError('Callback Must be a function')
	}
	if (thisArg !== undefined) {
		callback = callback.bind(thisArg)
	}

	var filterdArr = []

	for (var index in this) {
		if (callback(this[index], Number(index), this)) {
			filterdArr.push(this[index])
		}
	}

	return filterdArr
}

var arr = [1, 2, 3, 4, 5]

var result = arr.filter2(function (item) {
	return item % 2 === 0
})

console.log(result)
