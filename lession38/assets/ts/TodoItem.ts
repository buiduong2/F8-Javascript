import { TodoList } from "./TodoList.js";

export class TodoItem {

    private static readonly innerHTML: string =
        `
        <li class="todo-item">
            <span class="todo-content">Complete Mark.</span>
            <div class="todo-item-action-list">
                <button class="todo-item-action btn btn-delete">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                <button class="todo-item-action btn btn-edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="todo-item-action btn btn-mark-complete">
                    <i class="fa-solid fa-check-to-slot"></i>
                </button>
            </div>
        </li>
        `;

    private data: TodoData
    public el: HTMLLIElement;
    private todoList: TodoList;
    private contentEl: HTMLElement;



    constructor(data: TodoData, todoList: TodoList) {
        this.el = document.createElement("li");
        this.el.innerHTML = TodoItem.innerHTML;
        this.contentEl = this.el.querySelector(".todo-content") as HTMLElement;

        this.data = data;
        this.todoList = todoList;
        this.moute();
    }

    moute() {
        this.contentEl.textContent = this.data.content;

        const btnEditEl = this.el.querySelector(".btn-edit") as HTMLButtonElement;
        const btnDeleteEl = this.el.querySelector(".btn-delete") as HTMLButtonElement;
        const btnMarkComplete = this.el.querySelector(".btn-mark-complete") as HTMLButtonElement;

        btnEditEl.addEventListener("click", () => this.todoList.handleEditTodo(this));
        btnDeleteEl.addEventListener("click", () => this.todoList.handleDeleteTodo(this));
        btnMarkComplete.addEventListener("click", () => this.todoList.handleMarkCompleteTodo(this));
    }

    setData(newData: TodoData): void {
        this.data = newData;
        this.contentEl.textContent = this.data.content;
    }

    hidden() {
        this.el.style.display = "none";
    }

    show() {
        this.el.style.display = ""
    }

    contains(keyword: string): boolean {
        return Boolean(this.contentEl.textContent?.includes(keyword));
    }

    highlight(keyword: string): void {
        if (!this.contentEl.textContent) return;
        this.contentEl.innerHTML = this.contentEl.textContent.replaceAll(keyword, `<span class='highlight'>${keyword}</span>`);
    }

    removeHighlight() {
        this.contentEl.innerHTML = this.contentEl.textContent || "";
    }

    remove(): void {
        this.el.remove();
    }

    isVisible() {
        return window.getComputedStyle(this.el).display != "none"
    }

    isComplete(): boolean {
        return this.data.completed;
    }

    getContent(): string {
        return this.data.content;
    }

    getId(): number {
        return this.data.id;
    }
}

export type TodoData = {
    id: number,
    content: string,
    completed: boolean,
}