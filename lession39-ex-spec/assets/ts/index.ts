import { Vue } from "./Vue.js"
Vue.create({
    selector: "#app",

    data(): VueDataReturn {
        return {
            activeModal: false,
            showCompltedList: false,
            isFormFetching: false,
            currentModalAction: "ADD",
            currentEditTodoId: 0,
            modalTextEl: null,
            todos: [],
            pendingTodos: [],
            completedTodos: [],
        }
    },

    methods: {

        handleFilterTodo(keyword: string) {
            //TODO: my Vue Not Implemented
            this.filterTodo(this.pendingTodos, keyword, (todo: Todo) => !todo.completed);
            this.filterTodo(this.completedTodos, keyword, (todo: Todo) => todo.completed);
        },

        filterTodo(todoList: Todo[], keyword: string, predicate: (todo: Todo) => boolean) {
            keyword = keyword.toLowerCase();
            while (todoList.length !== 0) {
                todoList.pop();
            }

            this.todos.filter(predicate)
                .filter((todo: Todo) => todo.content.toLowerCase().includes(keyword))
                .forEach((todo: Todo) => todoList.push(todo));

        },
        async handleSubmitFormModal(e) {
            e.preventDefault();
            if (this.isFormFetching) return;
            try {
                this.isFormFetching = true;
                const content = this.modalTextEl.value;
                const loadingEl = document.querySelector(".modal .btn-save") as HTMLElement;

                switch (this.currentModalAction) {
                    case "ADD":
                        await this.addTodo(content, loadingEl);
                        break;
                    case "EDIT":
                        await this.editTodo(content, loadingEl)
                        break;
                    default:
                        break;
                }

                this.activeModal = false;
            } catch (error) {
                console.log(error);
            } finally {
                this.modalTextEl.value = "";
                this.isFormFetching = false;
            }
        },
        async addTodo(content: string, loadingEl: HTMLElement) {
            const todo = await fetchAddTodo(content, loadingEl)
            this.todos.push(todo);
            this.pendingTodos.push(todo);
        },
        async editTodo(newContent: string, loadingEl: HTMLElement) {
            await fetchEditContentTodoById(this.currentEditTodoId, newContent, loadingEl);
            const editingTodo = this.todos.find((todo: any) => todo.id === this.currentEditTodoId);
            editingTodo.content = newContent;
        },
        async toggleTodo(todo: Todo, loadingEl: HTMLElement) {
            const editedTodo = await fetchToggleCompletedTodoById(todo.id || 0, !todo.completed, loadingEl);
            const index = this.todos.findIndex((t: Todo) => editedTodo.id === t.id);
            this.todos[index] = editedTodo;
            let ownTodoList;
            let otherTodoList;
            if (editedTodo.completed) {
                ownTodoList = this.pendingTodos;
                otherTodoList = this.completedTodos;
            } else {
                ownTodoList = this.completedTodos;
                otherTodoList = this.pendingTodos;
            }
            const pendingIndex = ownTodoList.findIndex((t: Todo) => editedTodo.id === t.id);
            ownTodoList.splice(pendingIndex, 1);
            otherTodoList.push(editedTodo);
        },
        async deleteTodo(todo: Todo, loadingEl: HTMLElement) {
            await fetchDeleteTodoById((todo.id as number), loadingEl);

            const ownTodoList = todo.completed ? this.completedTodos : this.pendingTodos;
            const index = this.todos.findIndex((t: Todo) => t === todo);
            const ownIndex = ownTodoList.findIndex((t: Todo) => t === todo);

            this.todos.splice(index, 1);
            ownTodoList.splice(ownIndex, 1);

        },
        openModalToAddTodo() {
            this.currentModalAction = "ADD"
            this.activeModal = true;
        },
        openModalToEditTodo(todo: Todo) {
            const content = todo.content;
            this.currentEditTodoId = todo.id;
            this.currentModalAction = "EDIT";
            this.activeModal = true;
            this.modalTextEl.value = content;
        }
    },

    async mouted() {
        const loader = document.querySelector(".global-loader") as HTMLElement;
        loader.classList.add("loading");
        this.modalTextEl = document.querySelector(".modal-form .form-input") as HTMLInputElement
        const res = await fetch('http://localhost:3000/todos');
        if (!res.ok) return;
        const todos: Todo[] = await res.json();
        this.todos = todos;
        this.pendingTodos = todos.filter(todo => !todo.completed);
        this.completedTodos = todos.filter(todo => todo.completed);
        loader.classList.remove("loading");
    },



});
type FetchOption = { method: string, id?: number, data?: { content?: string, completed?: boolean } }

const TODO_API = 'http://localhost:3000/todos';

async function fetchAddTodo(content: string, loadingEl: HTMLElement): Promise<Todo> {
    return await fetchTodoGeneric({ method: "POST", data: { content } }, loadingEl);

}

async function fetchEditContentTodoById(id: number, content: string, loadingEl: HTMLElement): Promise<Todo> {
    return await fetchTodoGeneric({ method: "PATCH", id, data: { content } }, loadingEl);

}

async function fetchToggleCompletedTodoById(id: number, completed: boolean, loadingEl: HTMLElement): Promise<Todo> {
    return await fetchTodoGeneric({ method: "PATCH", id, data: { completed } }, loadingEl);
}

async function fetchDeleteTodoById(id: number, loadingEl: HTMLElement): Promise<void> {
    return await fetchTodoGeneric({ method: "DELETE", id }, loadingEl);
}


async function fetchTodoGeneric({ method, data, id }: FetchOption, loadingEl: HTMLElement): Promise<any> {
    const options: any = {};
    options.method = method || "GET";
    if (data) {
        options.headers = {
            "Content-Type": "application/json"
        }
        options.body = JSON.stringify(data)
    }

    const url = TODO_API + (id ? `/${id}` : "");

    loadingEl.classList.add("loading", "loader-wrapper");
    const oldContent = loadingEl.innerHTML;
    loadingEl.innerHTML = "<span class='loader'></span>"
    let error;
    try {
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(String(res.status));
        return await res.json();
    } catch (error) {
        error = error;
        alert(error);
    } finally {
        loadingEl.innerHTML = oldContent;
        loadingEl.classList.remove("loading", "loader-wrapper");
        if (error) {
            throw error
        }
    }
}


type Todo = {
    id?: number,
    content: string,
    completed: boolean
}

type VueDataReturn = {
    [key: string]: any,
    todos: Todo[],
    pendingTodos: Todo[],
    completedTodos: Todo[],
}