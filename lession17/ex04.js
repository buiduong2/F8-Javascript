function isPrime(n) {
	if (n <= 0) {
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

var n = 10

if (n % 1 === 0) {
	if (isPrime(n)) {
		console.log('n = ' + n + ' là số nguyên tố')
	} else {
		console.log('n = ' + n + ' Không phải số nguyên tố')
	}
} else {
	console.log('n không phải số tự nhiên')
}
