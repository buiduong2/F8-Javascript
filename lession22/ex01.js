export function getMinSymmetryPrime(n) {
	if (n < 0) {
		return 2
	}

	var digits = String(n).split('').map(Number)
	var result = getGreaterNearestSymmmetry(digits)
	while (!isPrime(result)) {
		digits = increase1UnitFromIndex(digits, digits.length - 1)
		result = getGreaterNearestSymmmetry(digits)
	}
	return result
}

export function getGreaterNearestSymmmetry(digits) {
	var left = 0
	var right = digits.length - 1

	while (left < right) {
		if (digits[left] > digits[right]) {
			digits[right] = digits[left]
		} else if (digits[left] < digits[right]) {
			increase1UnitFromIndex(digits, right - 1)
			left = 0
			right = digits.length - 1
			continue
		}
		left++
		right--
	}
	return Number(digits.join(''))
}

export function increase1UnitFromIndex(digits, right) {
	while (right >= 0 && digits[right] === 9) {
		right--
	}

	if (right === -1) {
		right = 1
		digits.unshift(1)
	} else {
		digits[right]++
		right++
	}

	while (right <= digits.length - 1) {
		digits[right] = 0
		right++
	}

	return digits
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
