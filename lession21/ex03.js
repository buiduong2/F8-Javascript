function groupByType(arr) {
	var types = []
	var result = []

	for (var i = 0; i < arr.length; i++) {
		var value = arr[i]
		var type = getType(value)
		var typeIndex = types.indexOf(type)
		if (typeIndex === -1) {
			types.push(type)
			result.push([value])
		} else {
			result[typeIndex].push(value)
		}
	}

	return result

	function getType(value) {
		var type = typeof value
		if (type === 'number') {
			type = isNaN(value) ? 'NaN' : type
		} else if (type === 'object') {
			type = Array.isArray(value) ? 'array' : 'object'
		}
		return type
	}
}

console.log(
	groupByType(
		flat([
			['a', 1, true],
			['b', 2, false],
			function () {},
			{ a: 1 },
			NaN,
			{ b: 2 }
		])
	)
)
