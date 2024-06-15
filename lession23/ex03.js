import { getError as getErrorMessage } from './ex01.js'
/**
 * Rule cuar Resgister
 */
export var registerRules = {
	name: {
		required: 'Vui lòng nhập họ tên',
		'min-5': 'Họ tên phải từ ${1} ký tự'
	},
	email: {
		required: 'Vui lòng nhập địa chỉ email',
		email: 'Định dạng email: ${value} không hợp lệ',
		'unique-email-data': 'Email: ${value} đã có người sử dụng'
	},
	password: {
		required: 'Vui lòng nhập mật khẩu',
		'same-password': 'Mật khẩu phải khớp với mật khẩu nhập lại'
	}
}
/**
 * Rule của Login
 */
export var loginRules = {
	email: {
		required: 'Vui lòng nhập địa chỉ email',
		email: 'Định dạng email: "${value}" không hợp lệ'
	},
	password: {
		required: 'Vui lòng nhập mật khẩu'
	}
}

/**
 * Định nghĩa các Validator có trách nhiệm kiểm tra tính hợp lệ
 * return true là hợp lệ và ngược lại
 */
export var validators = {
	required: function (value) {
		return !!value.trim()
	},
	min: function (value, size) {
		if (typeof value === 'string') {
			return value.length >= size
		} else {
			return true
		}
	},
	email: function (value) {
		if (typeof value === 'string') {
			var indexOfAt = value.indexOf('@')
			return indexOfAt > 0 && indexOfAt < value.length
		}
		return true
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

export var data = []

/**
 * hàm trả về đối tượng User vừa tạo đồng thời thêm user vào dữ liệu
 * @param {string} name
 * @param {string} password
 * @param {string} email
 * @returns {User}
 */
function createUser(name, password, email) {
	var user = { name: name, password: password, email: email, role: 'user' }
	data.push(user)
	return user
}
/**
 *
 * @param {string} name
 * @param {string} password
 * @param {string} email
 * @returns {type: 'Errror' | 'Accept' | 'UnAccept', data: User | String[]} Trả về các kiểu dữ liệu tương ứng
 * Khi type = Error tương ứng với việc validation thất bại.
 * Type = Accept hoạt động OK .
 * UnAccept: hoạt động ok nhưng xác thực thất bại
 */
export function handleRegister(name, password, email) {
	var user = { name: name, password: password, email: email }
	var validateInfos = validate(user, registerRules)
	if (validateInfos.isValid) {
		return { type: 'Error', data: validateInfos.errorMsgs }
	} else {
		var user = createUser(name, password, email)
		return { type: 'Accept', data: user }
	}
}
/**
 * Giống hàm bên trên
 * @param {string} email
 * @param {string} password
 * @returns {}
 */
export function handleLogin(email, password) {
	var loginInfo = { email: email, password: password }
	var validateInfo = validate(loginInfo, loginRules)
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
/**
 *
 * @param {Object} obj đối tượng cần xác thực
 * @param {ValidationRule} errors : các định nghĩa rule tương ứng
 * @returns {ValidationInfo: {isValid: boolean, errorMsgs: string[]}} : trả về thông tin validate gồm hợp lệ hay ko.
 *  và các tin nhắn tương ứng
 */
function validate(obj, errors) {
	var fields = getErrorField(obj, errors)
	var errorMsgs = fields.map(function (field) {
		return getErrorMessage(field.field, errors)
	})
	errorMsgs = errorMsgs.map(function (errorMsg, index) {
		return resolveMessage(errorMsg, fields[index].options)
	})
	return {
		isValid: errorMsgs.length !== 0,
		errorMsgs: errorMsgs
	}
}
/**
 * Tiến hành Kiểm tra tính hợp lệ
 * @param {Object} userInfo
 * @param {ValidationRule} errors
 * @returns {ErrorField[]} : trả về các field bị error. gồm thông tin định nghĩa trong ValidationRule và fieldName bị InValid
 */
export function getErrorField(userInfo, errors) {
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

/**
 *  THay đổi các biểu thức thành các giá trị động. VD: This length's field must be greater than ${1} -> 5
 * @param {string} msg
 * @param {string[]} options VD 'min-5' :[value, '5']
 * @returns  {string} trả về message được phân tích cú pháp
 */
export function resolveMessage(msg, options) {
	if (!options.length) {
		return msg
	}
	var expressValue = '${value}'
	if (msg.includes(expressValue)) {
		msg = msg.replaceAll(expressValue, options[0])
	}
	for (var i = 1; i < options.length; i++) {
		msg = msg.replaceAll(`\${${i}}`, options[i])
	}
	return msg
}

/**
 * Nhận về nói lưu trữ dữ liệu tiến hành so sánh
 * @param {string} name
 * @returns {Object[]}
 */
function getCollection(name) {
	if (name === 'data') {
		return data
	}
	return []
}
/**
 * Tìm kiếm user theo email và password
 * @param {string} email
 * @param {string} password
 * @returns {User | undefined}
 */
function getUserByEmailAndPassword(email, password) {
	return data.find(function (user) {
		return user.email === email && user.password === password
	})
}
