function sum(...args) {
	var result = 0
	for (var i = 0; i < args.length; i++) {
		var num = Number(args[i])
		if (!isNaN(num)) {
			result += num
		} else {
			return `${args[i]}  is not a number'`
		}
	}
	return result
}
