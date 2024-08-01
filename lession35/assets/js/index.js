import { F8 } from './F8.js'
F8.component('hello-world', {
	data: () => ({
		count: 3,
		message: 'Hello World'
	}),
	template: `
        <h2> Message: {{message}}</h2>
        <h2>Count: {{ count }}</h2>
        <div>
            <button v-on:click="count++">Plus Count</button>
            <button v-on:click="count--">Minus Count</button>
        </div>
        <button v-on:dblclick="message = 'Hello F8'">Change Message</button>
    `
})
