var n = 3

function sequentialSum(n) {
	var result = 0

	for (var i = 1; i <= n; i++) {
		result += i * (i + 1)
	}

	return result
}