Array.prototype.push2 = function (...items) {
	for (var item of items) {
		this[this.length] = item
	}

	return this.length
}

var arr = [1, 2, 3, 4, 5]

console.log(arr.push2(1, 2, 3))
console.log(arr)
