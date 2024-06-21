export function sum(...args) {
	var result = 0
	for (var i = 0; i < args.length; i++) {
		if (!isFinite(Number(args[i])) || Array.isArray(args[i])) {
			return `${args[i]}  is not a valid number`
		} else {
			result += Number(args[i])
		}
	}
	return result
}
