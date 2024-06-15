import { test, expect } from "@jest/globals";
import { getShortName, createCustomers } from "../ex02";
import type { Customer } from "../type"
test('TEST getShortName ', () => {
    expect(getShortName({ name: 'Bui Duc Duong', age: 1, address: '' })).toBe('Bui Duong')
    expect(getShortName({ name: 'Bui', age: 1, address: '' })).toBe('Bui')
    expect(getShortName({ name: 'Bui Duc', age: 1, address: '' })).toBe('Bui Duc')
    expect(getShortName({ name: '   Bui    Duc   ', age: 1, address: '' })).toBe('Bui Duc')
    expect(getShortName({ name: '   Bui       ', age: 1, address: '' })).toBe('Bui')
    expect(getShortName({ name: '   Bui    Duc Duong   ', age: 1, address: '' })).toBe('Bui Duong')
})

test('Test createCustomers', () => {
    var input = [
        { name: 'Nguyễn Văn A', age: 11, address: 'Ha Noi' },
        { name: 'Nguyễn Văn B', age: 2, address: 'Hai Phong' },
        { name: 'Nguyễn Văn C', age: 12, address: 'TP.HCM' },
        { name: '   Bui    Duc Duong   ', age: 1, address: '' },
        { name: '   Bui       ', age: 1, address: '' },
        { name: '   Bui      Duc ', age: 1, address: '' }
    ]

    var output = createCustomers(input)
    console.log(output)

    expect(output).toHaveLength(output.length)
    expect(isCustomerSorted(output)).toBe(true)
    expect(isAllCustomerHaveShortName(output)).toBe(true)
})

function isCustomerSorted(arr: Customer[]) {
    for (var i = 1; i < arr.length; i++) {
        console.log(arr[i].age - arr[i - 1].age)
        if (arr[i].age - arr[i - 1].age < 0) {
            return false
        }
    }
    return true
}

function isAllCustomerHaveShortName(arr: Customer[]): boolean {
    return arr.every(customer => !!(customer.shortName?.trim()))
}