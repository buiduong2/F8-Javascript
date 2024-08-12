import { TodoItem } from "./TodoItem.js";
import { Modal } from "./Modal.js";
import type { TodoData } from "./TodoItem.js";

export class TodoList {
    pendingEl: HTMLElement;
    completedEl: HTMLElement;
    countCompletedEl: HTMLElement;
    searchInputEl: HTMLInputElement;
    appEl: HTMLElement;
    todoItems: TodoItem[];

    constructor(appEl: HTMLElement, data: TodoData[]) {
        this.appEl = appEl;
        this.pendingEl = appEl.querySelector(".todo-list--pending") as HTMLElement;
        this.completedEl = appEl.querySelector(".todo-list--completed") as HTMLElement;
        this.countCompletedEl = appEl.querySelector(".todo-complete-count") as HTMLElement;
        this.searchInputEl = appEl.querySelector(".action-search .form-input") as HTMLInputElement;
        this.todoItems = data.map(todoData => new TodoItem(todoData, this));
        this.moute();
    }

    private moute(): void {
        this.countCompletedEl.textContent = "0";
        this.todoItems.forEach(item => {
            if (item.isComplete()) {
                this.appendToCompletedList(item);
            } else {
                this.appendToPendingList(item);
            }
        })
        this.updateCompeledTodoCount();

        const showCompletedTodoBtnEl = this.appEl.querySelector(".btn-show-complete-todo") as HTMLButtonElement;
        const addTodoBtnEl = this.appEl.querySelector(".btn-add-todo") as HTMLElement;

        this.searchInputEl.addEventListener("input", (e) => {
            e.preventDefault();
            this.searchTodo();
        })

        showCompletedTodoBtnEl.addEventListener("click", () => {
            this.completedEl.classList.toggle('active');
            showCompletedTodoBtnEl.classList.toggle('active');
        })

        addTodoBtnEl.addEventListener("click", () => this.handleAddTodo());
    }

    private appendToPendingList(todoItem: TodoItem): void {
        this.pendingEl.appendChild(todoItem.el);
    }

    private appendToCompletedList(todoItem: TodoItem): void {
        this.completedEl.appendChild(todoItem.el);
    }

    private updateCompeledTodoCount(): void {
        let count = this.todoItems
            .filter(todo => todo.isComplete() && todo.isVisible())
            .length
        this.countCompletedEl.textContent = String(count);
    }

    private searchTodo(): void {
        this.todoItems.forEach(todo => this.filteringTodoItem(todo));
        this.updateCompeledTodoCount();
    }

    private filteringTodoItem(todoItem: TodoItem): void {
        const keyword: string = this.searchInputEl.value;
        const isSearching = keyword.length !== 0;

        if (isSearching) {
            if (todoItem.contains(keyword)) {
                todoItem.show();
                todoItem.highlight(keyword);
            } else {
                todoItem.hidden();
            }
        } else {
            todoItem.removeHighlight();
            todoItem.show();
        }
    }

    private handleAddTodo(): void {
        Modal.getIntance().active(async (content: string) => {
            if (!content.trim()) throw new Error("Todo Content must not be null")
            const body = JSON.stringify({ content, completed: false });
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const res = await fetch('http://localhost:3000/todos', {
                method: "POST", body, headers
            })

            if (!res.ok) throw new Error("Server ERROR");

            const todoData: TodoData = await res.json();

            this.addTodo(todoData);
        })

    }

    public handleEditTodo(todoItem: TodoItem): void {
        Modal.getIntance().active(async (content: string) => {
            if (!content) throw new Error("Todo Content must not be null")
            const body = JSON.stringify({ content });
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const res = await fetch(`http://localhost:3000/todos/${todoItem.getId()}`, {
                method: "PATCH", body, headers
            })

            if (!res.ok) throw new Error("Server ERROR");

            const todoData = await res.json();

            this.editTodo(todoItem, todoData)
        }, todoItem.getContent())
    }

    public async handleMarkCompleteTodo(todoItem: TodoItem) {
        const body = JSON.stringify({ completed: !todoItem.isComplete() });
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const res = await fetch(`http://localhost:3000/todos/${todoItem.getId()}`, {
            method: "PATCH", body, headers
        })

        const newTodoData: TodoData = await res.json();
        this.editTodo(todoItem, newTodoData);
        if (newTodoData.completed) {
            this.appendToCompletedList(todoItem);
        } else {
            this.appendToPendingList(todoItem);
        }
    }


    public async handleDeleteTodo(todoItem: TodoItem): Promise<void> {
        const res = await fetch(`http://localhost:3000/todos/${todoItem.getId()}`, {
            method: "DELETE"
        })

        if (!res.ok) throw new Error("error");

        this.removeTodo(todoItem);
    }


    private addTodo(todoData: TodoData): void {
        const newTodo = new TodoItem(todoData, this);
        this.appendToPendingList(newTodo);
        this.filteringTodoItem(newTodo);
    }

    private editTodo(todoItem: TodoItem, todoData: TodoData) {
        todoItem.setData(todoData);
        this.filteringTodoItem(todoItem);
        this.updateCompeledTodoCount();
    }

    private removeTodo(todoItem: TodoItem) {
        this.todoItems = this.todoItems.filter(todo => todo !== todoItem);
        todoItem.remove();
        this.updateCompeledTodoCount();
    }


}

type TodoReq = {
    content?: string,
    completed?: boolean;
}