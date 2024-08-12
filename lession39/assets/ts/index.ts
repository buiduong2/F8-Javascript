
const TODO_API = 'https://k6thrk-8080.csb.app/todos';

const todoListCompletedEl = document.querySelector(".todo-list--completed") as HTMLUListElement;
const todoListPendingEl = document.querySelector(".todo-list--pending") as HTMLUListElement;
const modalEl = document.querySelector(".modal") as HTMLElement;
const inputModalEl = document.querySelector(".modal .form-input") as HTMLInputElement;
const searchInputEl = document.querySelector(".action-search .form-input") as HTMLInputElement;

const countCompletedWrapper = {
    el: document.querySelector(".todo-complete-count") as HTMLElement,
    increase() {
        this.el.textContent = String(Number(this.el.textContent) + 1);
    },
    decrease() {
        this.el.textContent = String(Number(this.el.textContent) - 1);
    },
    set(number: number) {
        this.el.textContent = String(number);
    }
};
let modalSubmitHandler: (content: string) => Promise<void>;

init();

function init() {

    addHandlerAppBtn();
    renderTodos();
    addHandlerModal();
}

function addHandlerAppBtn() {
    const btnAddTodos = document.querySelector(".btn-add-todo") as HTMLButtonElement;
    const btnShowCompletedTodos = document.querySelector(".btn-show-complete-todo") as HTMLButtonElement;

    btnAddTodos.addEventListener("click", () => {
        modalEl.classList.add("active");
        inputModalEl.value = "";
        modalSubmitHandler = async function (content: string) {
            await handleAddTodo(content);
            modalEl.classList.remove('active');
        }
    })

    btnShowCompletedTodos.addEventListener("click", () => {
        todoListCompletedEl.classList.toggle("active");
        btnShowCompletedTodos.classList.toggle("active");
    })

    searchInputEl.addEventListener("input", () => {
        const liEls = document.querySelectorAll(".todo-item");

        liEls.forEach(liEl => handleFilterTodo(liEl as HTMLElement))

        const todoCompletedCount = Array.from(todoListCompletedEl.children)
            .filter(todoEl => (todoEl as HTMLElement).style.display !== 'none')
            .length;

        countCompletedWrapper.set(todoCompletedCount);
    })


}

function addHandlerModal(): void {

    const overLayEl = modalEl.querySelector(".overlay") as HTMLElement;
    const modalForm = modalEl.querySelector(".modal-form") as HTMLFormElement;
    const cancelBtn = modalEl.querySelector(".btn-cancel") as HTMLButtonElement;

    overLayEl.addEventListener("click", () => {
        modalEl.classList.remove("active");
    })

    cancelBtn.addEventListener("click", () => {
        modalEl.classList.remove("active");
    })

    let fetching: boolean = false;
    modalForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (fetching) {
            return;
        }

        fetching = true;
        await modalSubmitHandler(inputModalEl.value);
        fetching = false;
    })
}

async function renderTodos(): Promise<void> {
    const todos: TodoData[] = await fetchAllTodos();
    todos.forEach(todo => {
        if (todo.completed) {
            todoListCompletedEl.appendChild(createTodoItem(todo));
        } else {
            todoListPendingEl.appendChild(createTodoItem(todo));
        }
    })
    countCompletedWrapper.set(todos.filter(todo => todo.completed).length);
}


function createTodoItem(todo: TodoData): HTMLLIElement {
    const el = document.createElement("li");
    el.innerHTML = `
            <span class="todo-content">${todo.content}</span>
            <div class="todo-item-action-list">
                <button 
                    onclick='handleDeleteTodo(${todo.id})' 
                    class="todo-item-action btn btn-delete"
                >
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                <button 
                    onclick='handleEditTodo(${todo.id})'
                    class="todo-item-action btn btn-edit"
                >
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button 
                    onclick='handleToggleCompletedTodo(${todo.id})'
                    class="todo-item-action btn btn-mark-complete"
                >
                    <i class="fa-solid fa-check-to-slot"></i>
                </button>
            </div>
    `
    el.className = "todo-item"
    el.dataset.id = String(todo.id);
    return el;
}

async function handleAddTodo(content: string): Promise<void> {
    if (content) {
        const todoData: TodoData = await fetchAddTodo(content);
        const liEl = createTodoItem(todoData);
        todoListPendingEl.appendChild(liEl);
        handleFilterTodo(liEl);
    }
}

async function handleFilterTodo(liEl: HTMLElement) {
    const contentEl = liEl.querySelector(".todo-content") as HTMLElement;
    const keyword = searchInputEl.value;
    if (keyword && contentEl.textContent?.includes(keyword)) {
        contentEl.innerHTML = contentEl.textContent.replaceAll(keyword, `<span class='highlight'>${keyword}</span>`);
        (liEl as HTMLElement).style.display = "";
    } else {
        if (keyword) {
            (liEl as HTMLElement).style.display = "none";
        } else {
            (liEl as HTMLElement).style.display = "";
        }
        contentEl.textContent = contentEl.textContent;
    }
}

async function handleEditTodo(id: number) {
    const liEl = document.querySelector(`.todo-item[data-id='${id}']`) as HTMLLIElement;
    const contentEl = liEl.querySelector(".todo-content") as HTMLElement;
    const oldContent = contentEl.textContent;
    modalEl.classList.add("active")
    inputModalEl.value = oldContent || "";

    modalSubmitHandler = async function (content: string) {
        if (oldContent === content) {
            return;
        } else {
            await fetchEditContentTodoById(id, content);
            contentEl.textContent = content;
        }
        modalEl.classList.remove('active');
    }

}

async function handleToggleCompletedTodo(id: number) {
    const liEl = document.querySelector(`.todo-item[data-id='${id}']`) as HTMLLIElement;
    let completed = false;
    if (todoListPendingEl.contains(liEl)) {
        completed = true;
    }

    await fetchToggleCompletedTodoById(id, completed);

    if (completed) {
        todoListCompletedEl.appendChild(liEl);
        countCompletedWrapper.increase();
    } else {
        todoListPendingEl.appendChild(liEl);
        countCompletedWrapper.decrease();
    }

}

async function handleDeleteTodo(id: number) {
    await fetchDeleteTodoById(id);

    const liEl = document.querySelector(`.todo-item[data-id='${id}']`) as HTMLLIElement;
    if (todoListCompletedEl.contains(liEl)) {
        countCompletedWrapper.decrease();
    }
    liEl.remove();
}


async function fetchAllTodos(): Promise<TodoData[]> {
    const loadingEl = document.querySelector(".global-loader") as HTMLElement;
    const data: TodoData[] = await fetchTodoGeneric({ method: "GET" }, loadingEl);
    return data;
}

async function fetchAddTodo(content: string): Promise<TodoData> {
    const loadingEl = modalEl.querySelector(".btn-save") as HTMLElement;;
    const data: TodoData = await fetchTodoGeneric({ method: "POST", data: { content } }, loadingEl);
    return data;

}

async function fetchEditContentTodoById(id: number, content: string): Promise<void> {
    const loadingEl = modalEl.querySelector(".btn-save") as HTMLElement;
    await fetchTodoGeneric({ method: "PATCH", id, data: { content } }, loadingEl);
}

async function fetchToggleCompletedTodoById(id: number, completed: boolean): Promise<void> {
    const loadingEl = document.querySelector(`.todo-item[data-id='${id}'] .btn-mark-complete`) as HTMLElement;
    await fetchTodoGeneric({ method: "PATCH", id, data: { completed } }, loadingEl);
}

async function fetchDeleteTodoById(id: number): Promise<void> {
    const loadingEl = document.querySelector(`.todo-item[data-id='${id}'] .btn-delete`) as HTMLElement;
    await fetchTodoGeneric({ method: "DELETE", id }, loadingEl);
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

type FetchOption = { method: string, id?: number, data?: { content?: string, completed?: boolean } }

type TodoData = {
    id: number,
    content: string,
    completed: boolean
}