import { test, expect } from "@jest/globals";
import { getError, errors } from "../ex01";
test("Test GetError word complete", () => {
    expect(getError("name")).toBe(errors.name.required)
    expect(getError("name.min")).toBe(errors.name.min)
    expect(getError("name.required")).toBe(errors.name.required)
    expect(getError("name.required")).not.toBe(errors.name.min)

})

test("Test GetError Should Error", () => {
    //Test Error 
    expect(getError("test.required")).toBe("Application error: This rule is not support: test")
    expect(getError("name.test")).toBe("Application error: This rule is not support: name.test")
})
