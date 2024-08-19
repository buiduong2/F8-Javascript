import { QuizzApp } from "./App.js";
import { counterUp } from "./util.js";

console.log('hello world');


window.addEventListener("DOMContentLoaded", () => {

    const appEl = document.querySelector("#app") as HTMLElement;
    console.log(appEl);
    new QuizzApp(appEl)
})