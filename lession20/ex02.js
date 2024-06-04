function avgPrime(arr) {
	var primies = []
	var sum = 0

	for (var i = 0; i < arr.length; i++) {
		if (primies.includes(arr[i]) || isPrime(arr[i])) {
			primies.push(arr[i])
			sum += arr[i]
		}
	}

	return primies.length === 0 ? 0 : sum / primies.length
}

function isPrime(n) {
	if (n <= 1) {
		return false
	}
	if (n < 3) {
		return true
	}

	var sqrt = Math.ceil(Math.sqrt(n))

	for (var i = 2; i <= sqrt; i++) {
		if (n % i === 0) {
			return false
		}
	}

	return true
}
