import { TodoFrom } from "./TodoForm.js";
import { TodoList } from "./TodoList.js";
import { TodoItem } from "./TodoItem.js";
import { Drag } from "./Drag.js";
var headerEl = document.querySelector("header");
var todoListEl = document.querySelector(".todo-list");
var todoList = new TodoList(todoListEl, TodoItem);
var todoForm = new TodoFrom(headerEl, todoList);
if (confirm("Bạn có muôn sử dụng chức năng Drag And Drop không. \nCode kiểu bẩn nên nhiều Bug trải nghiệm ko tốt ?")) {
    todoList.onCreatedTodo = function (todoListEl) {
        var drag = new Drag(todoListEl);
        drag.onDragSuccess = todoList.reRenderTodoAfterSort.bind(todoList);
    };
}
todoList.addTodo("Toi di tim toi 1");
todoList.addTodo("Toi di tim toi 2");
todoList.addTodo("Toi di tim toi 3");
