const customers = [
	{ name: 'Nguyễn Văn A', age: 11, address: 'Ha Noi' },
	{ name: 'Nguyễn Văn B', age: 2, address: 'Hai Phong' },
	{ name: 'Nguyễn Văn C', age: 12, address: 'TP.HCM' }
]

console.log(createCustomers(customers))
/**
 * Hàm tạo Customer
 * @param {string} name
 * @param {number} age
 * @param {string} address
 * @returns {Customer}
 */
function Customer(name, age, address) {
	return {
		name: name,
		age: age,
		address: address
	}
}
/**
 * Hàm tạo nhiều customer ?? kết quả trả về Cusomter tăng đần theo tuổi. Ngoài ra có thêm property shortname
 * @param {Object[]} customers
 * @returns {Customer[]}
 */
export function createCustomers(customers) {
	if (!Array.isArray(customers)) {
		return []
	}
	return customers
		.map(function (customer) {
			return Customer(customer.name, customer.age, customer.address)
		})
		.map(function (customer) {
			customer.shortName = getShortName(customer)
			return customer
		})
		.sort(function (customerA, customerB) {
			return customerA.age - customerB.age
		})
}

/**
 *- Hàm nhận về shortName
 * @param {Customer} customer
 * @returns {string} Trả về shortName
 */
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
