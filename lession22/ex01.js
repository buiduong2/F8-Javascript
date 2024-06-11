console.log(getMinSymmetryPrime(13))
export function getMinSymmetryPrime(n) {
	if (n < 0) {
		return 2
	}

	if (isSymmetry(n) && isPrime(n)) {
		return n
	}

	if (n < 10) {
		var result = [2, 3, 5, 7, 11]
		return result.find(function (num) {
			return n < num
		})
	}
	var result
	var digits = toDigists(n)
	do {
		result = getGreaterNearestSymmmetry(digits)
	} while (!isPrime(result))
	return result
}

export function getGreaterNearestSymmmetry(digits) {
	var number = Number(digits.join(''))
	if (isSymmetry(number)) {
		if (number % 10 === 9) {
			digits = toDigists(number + 1)
		} else {
			digits[digits.length - 1]++
		}
	}

	var length = digits.length
	var left = 0
	var right = length - 1

	while (left < right) {
		if (digits[left] > digits[right]) {
			digits[right] = digits[left]
		} else if (digits[left] < digits[right]) {
			increase1UnitFromIndex(digits, right)
			left = 0
			right = length - 1
			continue
		}
		left++
		right--
	}
	return Number(digits.join(''))
}

export function increase1UnitFromIndex(digits, start) {
	var length = digits.length
	digits[start - 1]++
	while (start < length) {
		digits[start] = 0
		start++
	}
}

export function toDigists(n) {
	var arr = []

	while (n !== 0) {
		arr.unshift(n % 10)
		n = Math.floor(n / 10)
	}

	return arr
}

export function isPrime(n) {
	if (n < 2) {
		return false
	}

	if (n <= 3) {
		return true
	}

	var sqrt = Math.ceil(Math.sqrt(n)) + 1

	for (var i = 2; i < sqrt; i++) {
		if (n % i === 0) {
			return false
		}
	}
	return true
}

export function isSymmetry(n) {
	var strN = n + ''

	var left = 0
	var right = strN.length - 1
	while (left < right) {
		if (strN[left] != strN[right]) {
			return false
		}
		left++
		right--
	}
	return true
}
