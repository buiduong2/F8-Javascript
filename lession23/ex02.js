const customers = [
	{ name: 'Nguyễn Văn A', age: 11, address: 'Ha Noi' },
	{ name: 'Nguyễn Văn B', age: 2, address: 'Hai Phong' },
	{ name: 'Nguyễn Văn C', age: 12, address: 'TP.HCM' }
]
console.log(createCustomers(customers))

/**
 * A function which return a object with 3 property name,age,address
 * @param {String} name
 * @param {Number} age
 * @param {String} address
 * @returns {Object} Customer to be create
 */
function Customer(name, age, address) {
	this.name = name
	this.age = age
	this.address = address
}

export function createCustomers(customers) {
	if (!Array.isArray(customers)) {
		return []
	}

	return customers
		.map(function (customer) {
			return new Customer(customer.name, customer.age, customer.address)
		})
		.map(function (customer) {
			customer.shortName = getShortName(customer)
			return customer
		})
		.sort(function (customerA, customerB) {
			return customerA.age - customerB.age
		})
}

export function getShortName(customer) {
	var nameParts = customer.name.split(' ').filter(function (part) {
		return part.trim().length > 0
	})

	if (nameParts.length < 3) {
		return nameParts.join(' ')
	} else {
		return nameParts[0] + ' ' + nameParts[nameParts.length - 1]
	}
}
