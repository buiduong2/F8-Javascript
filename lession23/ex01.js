export var errors = {
	name: {
		required: 'Vui lòng nhập họ tên',
		min: 'Họ tên phải từ 5 ký tự'
	},
	email: {
		required: 'Vui lòng nhập địa chỉ email',
		email: 'Định dạng email không hợp lệ',
		unique: 'Email đã có người sử dụng'
	},
	password: {
		required: 'Vui lòng nhập mật khẩu',
		same: 'Mật khẩu phải khớp với mật khẩu nhập lại'
	}
}
/**
 * Truyền vào tên field và nhận về về massge tương ứng được định nghĩa trong ValidationRule[]
 * @param {string} field ex: name.required
 * @param {ValidationRule[]} otherErrors : Định nghĩa các Rule cho từng field name
 * @returns {string}
 */
export function getError(field, otherErrors) {
	errors = otherErrors || errors
	var fields = field.split('.')
	var errorMsg
	var currentError = errors
	for (var i = 0; i < fields.length; i++) {
		if (fields[i] in currentError) {
			errorMsg = currentError[fields[i]]
			currentError = errorMsg
		} else {
			var errorField = ''
			while (i >= 0) {
				errorField = `${fields[i]}.` + errorField
				i--
			}
			return (
				'Application error: This rule is not support: ' +
				errorField.substring(0, errorField.length - 1)
			)
		}
	}
	if (typeof errorMsg === 'object') {
		return errorMsg.required
	} else {
		return errorMsg
	}
}
// console.log(getError('email.required'))
