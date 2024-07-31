import { F8 } from "./F8.js";
F8.component('hello-world', {
    data: () => ({
        count: 3,
        message: "Hello World",
        colors: ['green', 'black', 'violet', 'blueviolet', 'aqua']
    }),
    template: `
        <h1>Hello World</h1>
        <h2>Count: {{ count }}</h2>
        <div>
            <button v-on:click="count++">Plus Count</button>
            <button v-on:click="count--">Minus Count</button>
        </div>

        <h2> Message: {{message}}</h2>
        <input type="text">
        <button v-on:click="message = document.querySelector('input').value">Change Message</button>

        <h2>Hover And Click</h2>
        <div style="background-color: blue; width: 100px; height: 100px;"
            v-on:click="this.style.backgroundColor = 'blue'"
            v-on:mouseover="$event.target.style.backgroundColor = colors[Math.floor(Math.random() * 5)]">
        </div>
    `
});
// console.log(/{{}}/)
