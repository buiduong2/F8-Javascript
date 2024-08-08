import { TodoList } from "./TodoList.js";
const promise = fetch('http://localhost:3000/todos');
promise.then(response => {
    if (response.ok) {
        return response.json();
    }
    alert("Lỗi gì đấy");
}).then(data => {
    new TodoList(document.querySelector(".app"), data);
});
