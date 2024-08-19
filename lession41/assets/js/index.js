import { QuizzApp } from "./App.js";
console.log('hello world');
window.addEventListener("DOMContentLoaded", () => {
    const appEl = document.querySelector("#app");
    console.log(appEl);
    new QuizzApp(appEl);
});
