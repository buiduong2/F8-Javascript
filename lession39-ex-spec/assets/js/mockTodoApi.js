const TODO_API_PATTERN = /\/todos(?:\/(\d+))?$/;
const STORAGE_KEY = "mini_reactive_todos";

const defaultTodos = [
    { id: 1, content: "Học JavaScript DOM", completed: false },
    { id: 2, content: "Làm Todo App", completed: false },
    { id: 3, content: "Ôn lại Fetch API", completed: true }
];

const realFetch = window.fetch.bind(window);

function loadTodos() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTodos));
        return [...defaultTodos];
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTodos));
        return [...defaultTodos];
    }
}

function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createJsonResponse(data, status = 200) {
    return Promise.resolve(
        new Response(JSON.stringify(data), {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        })
    );
}

window.fetch = async function mockFetch(input, options = {}) {
    const url = typeof input === "string" ? input : input.url;
    const match = String(url).match(TODO_API_PATTERN);

    if (!match) {
        return realFetch(input, options);
    }
    await sleep(300);

    const id = match[1] ? Number(match[1]) : null;
    const method = (options.method || "GET").toUpperCase();
    const todos = loadTodos();

    if (method === "GET") {
        return createJsonResponse(todos);
    }

    if (method === "POST") {
        const body = JSON.parse(options.body || "{}");

        const newTodo = {
            id: Date.now(),
            content: body.content || "",
            completed: Boolean(body.completed)
        };

        todos.push(newTodo);
        saveTodos(todos);

        return createJsonResponse(newTodo, 201);
    }

    if ((method === "PATCH" || method === "PUT") && id !== null) {
        const body = JSON.parse(options.body || "{}");
        const index = todos.findIndex(todo => todo.id === id);

        if (index === -1) {
            return createJsonResponse({ message: "Todo not found" }, 404);
        }

        todos[index] = {
            ...todos[index],
            ...body
        };

        saveTodos(todos);

        return createJsonResponse(todos[index]);
    }

    if (method === "DELETE" && id !== null) {
        const index = todos.findIndex(todo => todo.id === id);

        if (index === -1) {
            return createJsonResponse({ message: "Todo not found" }, 404);
        }

        const deletedTodo = todos.splice(index, 1)[0];
        saveTodos(todos);

        return createJsonResponse(deletedTodo);
    }

    return createJsonResponse({ message: "Unsupported request" }, 400);
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}