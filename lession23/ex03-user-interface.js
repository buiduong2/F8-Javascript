import { handleLogin, handleRegister, data } from './ex03.js'
data.push({
	name: 'Bui Duong',
	password: '123',
	email: 'Duong@mgial.com',
	role: 'User'
})
render()
document.querySelector('#btn').addEventListener('click', function () {
	clickBtn()
	render()
})
function clickBtn() {
	var isLogin =
		prompt('Điền vào \nRegister:  để đăng ký \n Login: Để đăng nhập \n ') ||
		''
	if (isLogin.toUpperCase() === 'LOGIN') {
		var email = prompt('Điềm vào Email') || ''
		var password = prompt('Điên vào Password') || ''
		var authResult = handleLogin(email, password)
		if (authResult.type === 'Accept') {
			var user = authResult.data
			alert(JSON.stringify(user))
		} else {
			var message = authResult.data.join('\n')
			alert('Đăng nhập thất bại: \n' + message)
		}
	} else if (isLogin.toLocaleUpperCase() === 'REGISTER') {
		var email = prompt('Điềm vào Email') || ''
		var password = prompt('Điên vào Password') || ''
		var name = prompt('Điền vào đày đủ họ tên của bạn') || ''
		var authResult = handleRegister(name, password, email)
		if (authResult.type === 'Accept') {
			var user = authResult.data
			alert(JSON.stringify(user))
		} else {
			var message = authResult.data.join('\n')
			alert('Đăng kí thất bại: \n' + message)
		}
	}
}
function render() {
	var str = data
		.map(function (data) {
			return JSON.stringify(data)
		})
		.join('\n')
	document.querySelector('#app').innerHTML = `<pre> ${str}</pre>`
}
