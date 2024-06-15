import { Customer } from "./type"

const customers: Customer[] = [
    { name: 'Nguyễn Văn A', age: 11, address: 'Ha Noi' },
    { name: 'Nguyễn Văn B', age: 2, address: 'Hai Phong' },
    { name: 'Nguyễn Văn C', age: 12, address: 'TP.HCM' }
]


function Customer(name: string, age: number, address: string): Customer {
    return {
        name: name,
        age: age,
        address: address
    }
}

export function createCustomers(customers: Customer[] | any) {
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

export function getShortName(customer: Customer): string {
    var nameParts = customer.name.split(' ').filter(function (part) {
        return part.trim().length > 0
    })

    if (nameParts.length < 3) {
        return nameParts.join(' ')
    } else {
        return nameParts[0] + ' ' + nameParts[nameParts.length - 1]
    }
}
