import { Vue } from "./Vue.js";
Vue.create({
    selector: "#app",
    data() {
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
        };
    },
    methods: {
        handleFilterTodo(keyword) {
            //TODO: my Vue Not Implemented
            this.filterTodo(this.pendingTodos, keyword, (todo) => !todo.completed);
            this.filterTodo(this.completedTodos, keyword, (todo) => todo.completed);
        },
        filterTodo(todoList, keyword, predicate) {
            keyword = keyword.toLowerCase();
            while (todoList.length !== 0) {
                todoList.pop();
            }
            this.todos.filter(predicate)
                .filter((todo) => todo.content.toLowerCase().includes(keyword))
                .forEach((todo) => todoList.push(todo));
        },
        async handleSubmitFormModal(e) {
            e.preventDefault();
            if (this.isFormFetching)
                return;
            try {
                this.isFormFetching = true;
                const content = this.modalTextEl.value;
                const loadingEl = document.querySelector(".modal .btn-save");
                switch (this.currentModalAction) {
                    case "ADD":
                        await this.addTodo(content, loadingEl);
                        break;
                    case "EDIT":
                        await this.editTodo(content, loadingEl);
                        break;
                    default:
                        break;
                }
                this.activeModal = false;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.modalTextEl.value = "";
                this.isFormFetching = false;
            }
        },
        async addTodo(content, loadingEl) {
            const todo = await fetchAddTodo(content, loadingEl);
            this.todos.push(todo);
            this.pendingTodos.push(todo);
        },
        async editTodo(newContent, loadingEl) {
            await fetchEditContentTodoById(this.currentEditTodoId, newContent, loadingEl);
            const editingTodo = this.todos.find((todo) => todo.id === this.currentEditTodoId);
            editingTodo.content = newContent;
        },
        async toggleTodo(todo, loadingEl) {
            const editedTodo = await fetchToggleCompletedTodoById(todo.id || 0, !todo.completed, loadingEl);
            const index = this.todos.findIndex((t) => editedTodo.id === t.id);
            this.todos[index] = editedTodo;
            let ownTodoList;
            let otherTodoList;
            if (editedTodo.completed) {
                ownTodoList = this.pendingTodos;
                otherTodoList = this.completedTodos;
            }
            else {
                ownTodoList = this.completedTodos;
                otherTodoList = this.pendingTodos;
            }
            const pendingIndex = ownTodoList.findIndex((t) => editedTodo.id === t.id);
            ownTodoList.splice(pendingIndex, 1);
            otherTodoList.push(editedTodo);
        },
        async deleteTodo(todo, loadingEl) {
            await fetchDeleteTodoById(todo.id, loadingEl);
            const ownTodoList = todo.completed ? this.completedTodos : this.pendingTodos;
            const index = this.todos.findIndex((t) => t === todo);
            const ownIndex = ownTodoList.findIndex((t) => t === todo);
            this.todos.splice(index, 1);
            ownTodoList.splice(ownIndex, 1);
        },
        openModalToAddTodo() {
            this.currentModalAction = "ADD";
            this.activeModal = true;
        },
        openModalToEditTodo(todo) {
            const content = todo.content;
            this.currentEditTodoId = todo.id;
            this.currentModalAction = "EDIT";
            this.activeModal = true;
            this.modalTextEl.value = content;
        }
    },
    async mouted() {
        const loader = document.querySelector(".global-loader");
        loader.classList.add("loading");
        this.modalTextEl = document.querySelector(".modal-form .form-input");
        const res = await fetch('https://stvp8n-8080.csb.app/todos');
        if (!res.ok)
            return;
        const todos = await res.json();
        this.todos = todos;
        this.pendingTodos = todos.filter(todo => !todo.completed);
        this.completedTodos = todos.filter(todo => todo.completed);
        loader.classList.remove("loading");
    },
});
const TODO_API = 'https://stvp8n-8080.csb.app/todos';
async function fetchAddTodo(content, loadingEl) {
    return await fetchTodoGeneric({ method: "POST", data: { content } }, loadingEl);
}
async function fetchEditContentTodoById(id, content, loadingEl) {
    return await fetchTodoGeneric({ method: "PATCH", id, data: { content } }, loadingEl);
}
async function fetchToggleCompletedTodoById(id, completed, loadingEl) {
    return await fetchTodoGeneric({ method: "PATCH", id, data: { completed } }, loadingEl);
}
async function fetchDeleteTodoById(id, loadingEl) {
    return await fetchTodoGeneric({ method: "DELETE", id }, loadingEl);
}
async function fetchTodoGeneric({ method, data, id }, loadingEl) {
    const options = {};
    options.method = method || "GET";
    if (data) {
        options.headers = {
            "Content-Type": "application/json"
        };
        options.body = JSON.stringify(data);
    }
    const url = TODO_API + (id ? `/${id}` : "");
    loadingEl.classList.add("loading", "loader-wrapper");
    const oldContent = loadingEl.innerHTML;
    loadingEl.innerHTML = "<span class='loader'></span>";
    let error;
    try {
        const res = await fetch(url, options);
        if (!res.ok)
            throw new Error(String(res.status));
        return await res.json();
    }
    catch (error) {
        error = error;
        alert(error);
    }
    finally {
        loadingEl.innerHTML = oldContent;
        loadingEl.classList.remove("loading", "loader-wrapper");
        if (error) {
            throw error;
        }
    }
}
