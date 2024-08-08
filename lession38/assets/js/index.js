import { TodoList } from './TodoList.js'
export const API_TODO = 'https://k6thrk-8080.csb.app/todos'
const promise = fetch(API_TODO)
const loaderEl = document.querySelector('.loader')
loaderEl.classList.add('active')
promise
	.then(response => {
		if (response.ok) {
			return response.json()
		}
		alert('Lỗi gì đấy')
	})
	.then(data => {
		new TodoList(document.querySelector('.app'), data)
	})
	.finally(() => {
		loaderEl.classList.remove('active')
	})
