import { test, expect } from "@jest/globals";
import { getErrorField, resolveMessage, validators, data } from "../ex03";

import { InvalidField, User } from "../type";

test("Test ErrorField", () => {
    var InvalidFields: InvalidField[] = [
        {
            options: ['D', '5'],
            field: 'name.min-5'
        },
        {
            options: ['2'],
            field: 'email.email'
        }
    ]
    var input: User = { name: 'D', password: "1", email: "2" }

    var output = getErrorField(input);
    expect(output).toStrictEqual(InvalidFields)

})


test("TEST resolveMessage", () => {
    // Test Options ${index}
    var output = resolveMessage("Họ tên phải từ ${1} ký tự", ['Duo', '5'])
    expect(output).toBe("Họ tên phải từ 5 ký tự")

    //Test option ${value}
    var output = resolveMessage("Họ tên: ${value} phải từ ${1} ký tự", ['Duo', '5'])
    expect(output).toBe("Họ tên: Duo phải từ 5 ký tự")

    //Test options = []
    var output = resolveMessage("Họ tên123", ['Duo'])
    expect(output).toBe("Họ tên123")
})

test("Test Rule", () => {
    expect(validators.required("value")).toBe(true)
    expect(validators.required("       a      ")).toBe(true)
    expect(validators.required("")).toBe(false)
    expect(validators.required("           ")).toBe(false)

    expect(validators.min("1", 2)).toBe(false)
    expect(validators.min("", 2)).toBe(false)

    expect(validators.email("asd@asd")).toBe(true)
    expect(validators.email("asdasd")).toBe(false)

    expect(validators.unique("123@123", "email", "data")).toBe(true)
    data.push({ name: "Duong", email: "123@123", password: '123' })
    expect(validators.unique("123@123", "email", "data")).toBe(false)
})

test("Test Login",() => {
    
})