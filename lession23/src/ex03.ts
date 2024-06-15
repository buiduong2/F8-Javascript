import { getError as getErrorMessage } from './ex01'
import type { User, ValidatorOption, AuthResponse, InvalidField, ValidateRule, ValidateDetail } from './type'
//Update Errors Rule

export var errors: ValidateRule = {
    name: {
        required: 'Vui lòng nhập họ tên',
        'min-5': 'Họ tên phải từ ${1} ký tự'
    },
    email: {
        required: 'Vui lòng nhập địa chỉ email',
        email: 'Định dạng email: ${value} không hợp lệ',
        "unique-email-data": 'Email: ${value} đã có người sử dụng',
    },
    password: {
        required: 'Vui lòng nhập mật khẩu',
        "same-password": 'Mật khẩu phải khớp với mật khẩu nhập lại'
    }
}
export var validators: ValidatorOption = {
    required: function (this: any, value: string): boolean {
        return !!value.trim()
    },
    min: function (this: any, value: string | any, size: number): boolean {
        if (typeof value === 'string') {
            return value.length >= size
        } else {
            return true
        }
    },
    email: function (this: any, value: string | undefined): boolean {
        if (typeof value === 'string') {
            var indexOfAt = value.indexOf('@')
            return indexOfAt > 0 && indexOfAt < value.length
        }
        return true
    },
    unique: function (this: any, value: string, field: string, collectionName: string): boolean {
        var collection = getCollection(collectionName)
        if (Array.isArray(collection)) {
            return !collection.some(function (item) {
                return item[field] === value
            })
        }

        return true
    },
    same: function (this: any, value: string, otherField: string): boolean {
        //this was bound in getErrorField() function
        return value === this[otherField]
    }
}

export var data: User[] = []


function createUser(name: string, password: string, email: string): User {
    var user: User = { name: name, password: password, email: email, role: "user" }
    data.push(user)
    return user;

}

export function handleRegister(name: string, password: string, email: string): AuthResponse {
    var user: User = { name: name, password: password, email: email }
    var validateInfos = validate(user)
    if (validateInfos.isValid) {
        return { type: 'Error', data: validateInfos.errorMsgs }
    } else {
        var user = createUser(name, password, email)
        return { type: 'Accept', data: user }
    }
}

export function handleLogin(email: string, password: string): AuthResponse {
    var loginInfo = { email: email, password: password }
    var validateInfo = validate(loginInfo)
    if (validateInfo.isValid) {
        return { type: 'Error', data: validateInfo.errorMsgs }
    }
    var userData = getUserByEmailAndPassword(email, password)
    if (userData) {
        return { type: 'Accept', data: userData }
    } else {
        return {
            type: 'UnAccept',
            data: ['Thông tin đăng nhập không chính xác']
        }
    }
}

function validate(obj: Object): ValidateDetail {
    var fields = getErrorField(obj)
    var errorMsgs = fields.map(function (field) {
        return getErrorMessage(field.field)
    })
    errorMsgs = errorMsgs.map(function (errorMsg, index) {
        return resolveMessage(errorMsg, fields[index].options)
    })
    return {
        isValid: errorMsgs.length !== 0,
        errorMsgs: errorMsgs
    }
}


export function getErrorField(userInfo: Object): InvalidField[] {
    var entries = Object.entries(userInfo)
    var errorFields: InvalidField[] = []
    for (var index in entries) {
        var key = entries[index][0]
        var value = entries[index][1]
        if (errors[key]) {
            var ruleNames = Object.keys(errors[key])

            for (var index in ruleNames) {
                var options = ruleNames[index].split('-')
                var validatorName = (options.shift() as string)
                var validator = validators[validatorName]
                var isValid = validator.bind(userInfo)(value, ...options)
                if (!isValid) {
                    options.unshift(value)
                    errorFields.push({
                        options: options,
                        field: `${key}.${ruleNames[index]}`
                    })
                    break
                }
            }
        }
    }

    return errorFields
}

export function resolveMessage(msg: string, options: string[]): string {
    if (!options.length) {
        return msg
    }

    var expressValue = "${value}"

    if (msg.includes(expressValue)) {
        msg = msg.replaceAll(expressValue, options[0]);
    }

    for (var i = 1; i < options.length; i++) {
        msg = msg.replaceAll(`\${${i}}`, options[i])
    }

    return msg
}

function getCollection(name: string): any[] {
    if (name === 'data') {
        return data
    }
    return []
}

function getUserByEmailAndPassword(email: string, password: string): User | undefined {
    return data.find(function (user) {
        return user.email === email && user.password === password
    })
}
