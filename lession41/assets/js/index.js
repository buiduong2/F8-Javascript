import { QuizzApp } from "./App.js";
window.addEventListener("DOMContentLoaded", () => {
    const appEl = document.querySelector("#app");
    new QuizzApp(appEl);
});
