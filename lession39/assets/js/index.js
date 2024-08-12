"use strict";
const TODO_API = 'https://k6thrk-8080.csb.app/todos';
const todoListCompletedEl = document.querySelector(".todo-list--completed");
const todoListPendingEl = document.querySelector(".todo-list--pending");
const modalEl = document.querySelector(".modal");
const inputModalEl = document.querySelector(".modal .form-input");
const searchInputEl = document.querySelector(".action-search .form-input");
const countCompletedWrapper = {
    el: document.querySelector(".todo-complete-count"),
    increase() {
        this.el.textContent = String(Number(this.el.textContent) + 1);
    },
    decrease() {
        this.el.textContent = String(Number(this.el.textContent) - 1);
    },
    set(number) {
        this.el.textContent = String(number);
    }
};
let modalSubmitHandler;
init();
function init() {
    addHandlerAppBtn();
    renderTodos();
    addHandlerModal();
}
function addHandlerAppBtn() {
    const btnAddTodos = document.querySelector(".btn-add-todo");
    const btnShowCompletedTodos = document.querySelector(".btn-show-complete-todo");
    btnAddTodos.addEventListener("click", () => {
        modalEl.classList.add("active");
        inputModalEl.value = "";
        modalSubmitHandler = async function (content) {
            await handleAddTodo(content);
            modalEl.classList.remove('active');
        };
    });
    btnShowCompletedTodos.addEventListener("click", () => {
        todoListCompletedEl.classList.toggle("active");
        btnShowCompletedTodos.classList.toggle("active");
    });
    searchInputEl.addEventListener("input", () => {
        const liEls = document.querySelectorAll(".todo-item");
        liEls.forEach(liEl => handleFilterTodo(liEl));
        const todoCompletedCount = Array.from(todoListCompletedEl.children)
            .filter(todoEl => todoEl.style.display !== 'none')
            .length;
        countCompletedWrapper.set(todoCompletedCount);
    });
}
function addHandlerModal() {
    const overLayEl = modalEl.querySelector(".overlay");
    const modalForm = modalEl.querySelector(".modal-form");
    const cancelBtn = modalEl.querySelector(".btn-cancel");
    overLayEl.addEventListener("click", () => {
        modalEl.classList.remove("active");
    });
    cancelBtn.addEventListener("click", () => {
        modalEl.classList.remove("active");
    });
    let fetching = false;
    modalForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (fetching) {
            return;
        }
        fetching = true;
        await modalSubmitHandler(inputModalEl.value);
        fetching = false;
    });
}
async function renderTodos() {
    const todos = await fetchAllTodos();
    todos.forEach(todo => {
        if (todo.completed) {
            todoListCompletedEl.appendChild(createTodoItem(todo));
        }
        else {
            todoListPendingEl.appendChild(createTodoItem(todo));
        }
    });
    countCompletedWrapper.set(todos.filter(todo => todo.completed).length);
}
function createTodoItem(todo) {
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
    `;
    el.className = "todo-item";
    el.dataset.id = String(todo.id);
    return el;
}
async function handleAddTodo(content) {
    if (content) {
        const todoData = await fetchAddTodo(content);
        const liEl = createTodoItem(todoData);
        todoListPendingEl.appendChild(liEl);
        handleFilterTodo(liEl);
    }
}
async function handleFilterTodo(liEl) {
    const contentEl = liEl.querySelector(".todo-content");
    const keyword = searchInputEl.value;
    if (keyword && contentEl.textContent?.includes(keyword)) {
        contentEl.innerHTML = contentEl.textContent.replaceAll(keyword, `<span class='highlight'>${keyword}</span>`);
        liEl.style.display = "";
    }
    else {
        if (keyword) {
            liEl.style.display = "none";
        }
        else {
            liEl.style.display = "";
        }
        contentEl.textContent = contentEl.textContent;
    }
}
async function handleEditTodo(id) {
    const liEl = document.querySelector(`.todo-item[data-id='${id}']`);
    const contentEl = liEl.querySelector(".todo-content");
    const oldContent = contentEl.textContent;
    modalEl.classList.add("active");
    inputModalEl.value = oldContent || "";
    modalSubmitHandler = async function (content) {
        if (oldContent === content) {
            return;
        }
        else {
            await fetchEditContentTodoById(id, content);
            contentEl.textContent = content;
        }
        modalEl.classList.remove('active');
    };
}
async function handleToggleCompletedTodo(id) {
    const liEl = document.querySelector(`.todo-item[data-id='${id}']`);
    let completed = false;
    if (todoListPendingEl.contains(liEl)) {
        completed = true;
    }
    await fetchToggleCompletedTodoById(id, completed);
    if (completed) {
        todoListCompletedEl.appendChild(liEl);
        countCompletedWrapper.increase();
    }
    else {
        todoListPendingEl.appendChild(liEl);
        countCompletedWrapper.decrease();
    }
}
async function handleDeleteTodo(id) {
    await fetchDeleteTodoById(id);
    const liEl = document.querySelector(`.todo-item[data-id='${id}']`);
    if (todoListCompletedEl.contains(liEl)) {
        countCompletedWrapper.decrease();
    }
    liEl.remove();
}
async function fetchAllTodos() {
    const loadingEl = document.querySelector(".global-loader");
    const data = await fetchTodoGeneric({ method: "GET" }, loadingEl);
    return data;
}
async function fetchAddTodo(content) {
    const loadingEl = modalEl.querySelector(".btn-save");
    ;
    const data = await fetchTodoGeneric({ method: "POST", data: { content } }, loadingEl);
    return data;
}
async function fetchEditContentTodoById(id, content) {
    const loadingEl = modalEl.querySelector(".btn-save");
    await fetchTodoGeneric({ method: "PATCH", id, data: { content } }, loadingEl);
}
async function fetchToggleCompletedTodoById(id, completed) {
    const loadingEl = document.querySelector(`.todo-item[data-id='${id}'] .btn-mark-complete`);
    await fetchTodoGeneric({ method: "PATCH", id, data: { completed } }, loadingEl);
}
async function fetchDeleteTodoById(id) {
    const loadingEl = document.querySelector(`.todo-item[data-id='${id}'] .btn-delete`);
    await fetchTodoGeneric({ method: "DELETE", id }, loadingEl);
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
