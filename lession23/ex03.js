import { getError as getErrorMessage, errors } from './src/ex01.js'

//Update Errors Rule
delete errors.name.min
delete errors.email.unique
delete errors.password.same
errors.name['min-5'] = 'Họ tên phải từ ${0} ký tự'
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
	var validateInfos = validate(user)
	if (validateInfos) {
		return { type: 'Error', data: validateInfos }
	} else {
		user.role = 'User'
		data.push(user)
		return { type: 'Accept', data: data }
	}
}

export function handleLogin(email, password) {
	var loginInfo = { email: email, password: password }
	var validateInfos = validate(loginInfo)
	if (validateInfos.length !== 0) {
		return { type: 'Error', data: validateInfos }
	}
	var userData = getUserByEmailAndPassword(email, password)
	if (userData) {
		return { type: 'Aceept', data: userData }
	} else {
		return {
			type: 'UnAccept',
			data: 'Thông tin đăng nhập không chính xác'
		}
	}
}

function validate(obj) {
	var fields = getErrorField(obj)
	var errorMsgs = fields.map(function (field) {
		return getErrorMessage(field.field)
	})
	errorMsgs = errorMsgs.map(function (errorMsg, index) {
		return resolveMessage(errorMsg, fields[index].options)
	})
	return errorMsgs
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
					errorFields.push({
						options: options,
						field: isValid
					})
					break
				}
			}
		}
	}

	return errorFields
}

function resolveMessage(msg, options) {
	if (!options.length) {
		return msg
	}
	if (msg.includes('${')) {
		while (msg.includes('${')) {
			var indexStart = msg.indexOf('${')
			var indexEnd = msg.indexOf('}', indexStart)
			var optionIndex = msg.slice(indexStart + 2, indexEnd)
			msg =
				msg.slice(0, indexStart) +
				options[optionIndex] +
				msg.slice(indexEnd + 1)
		}
	}

	return msg
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
