import { getError as getErrorMessage, errors } from './ex01.js'

//Update Errors Rule
delete errors.name.min
delete errors.email.unique
delete errors.password.same
errors.name['min-5'] = 'Họ tên phải từ 5 ký tự'
errors.email['unique-email-data'] = 'Email đã có người sử dụng'
errors.password['same-password'] = 'Mật khẩu phải khớp với mật khẩu nhập lại'

var validators = {
	required: function (value) {
		return !!value.trim()
	},
	min: function (value, size) {
		return value.length >= size
	},
	email: function (value) {
		var indexOfAt = value.indexOf('@')
		return indexOfAt > 0 && indexOfAt < value.length
	},
	unique: function (value, field, collectionName) {
		var collection = getCollection(collectionName)
		if (Array.isArray(collection)) {
			return !collection.some(function (item) {
				return item[field] === value
			})
		}

		return true
	},
	same: function (value, otherField) {
		//this was bound in getErrorField() function
		return value === this[otherField]
	}
}

var data = []

console.log(handleRegister('DuongDuc', 'Bui', '123@gmail.com'))

function User(name, password, email) {
	this.name = name
	this.password = password
	this.email = email
}

export function handleRegister(name, password, email) {
	var user = new User(name, password, email)
	var fields = getErrorField(user)
	var isValid = fields.length === 0
	if (!isValid) {
		return fields.map(getErrorMessage).join('\n')
	} else {
		data.push(user)
	}
	return data
}

export function handleLogin(email, password) {
	var loginInfo = { email: email, password: password }
	var fields = getErrorField(loginInfo)
	var isValid = fields.length === 0
	if (!isValid) {
		return fields.map(getErrorMessage).join('\n')
	} else {
		var userData = getUserByEmailAndPassword(email, password)
		if (userData) {
			return userData
		} else {
			return 'Thông tin đăng nhập không chính xác'
		}
	}
}

/**
 *
 * @param {User} userInfo
 */
function getErrorField(userInfo) {
	var entries = Object.entries(userInfo)
	var errorFields = []
	for (var index in entries) {
		var key = entries[index][0]
		var value = entries[index][1]
		if (errors[key]) {
			var ruleNames = Object.keys(errors[key])

			for (var index in ruleNames) {
				var options = ruleNames[index].split('-')
				var validatorName = options.shift()
				var validator = validators[validatorName]
				var isValid = validator.bind(userInfo)(value, ...options)
				if (!isValid) {
					errorFields.push(`${key}.${ruleNames[index]}`)
					break
				}
			}
		}
	}

	return errorFields
}

function getCollection(name) {
	if (name === 'data') {
		return data
	}
	return []
}

function getUserByEmailAndPassword(email, password) {
	return data.find(function (user) {
		return user.email === email && user.password === password
	})
}
