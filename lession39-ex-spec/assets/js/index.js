import { Vue } from "./Vue.js";
Vue.create({
    selector: "#app",
    data() {
        return {
            message: "Hello World",
            show: true,
            numbers: [1, 2, 3, 4],
            persons: [
                {
                    id: 1,
                    name: "Duong"
                },
                {
                    id: 2,
                    name: "Duong2"
                },
                {
                    id: 3,
                    name: "Duong3"
                }
            ]
        };
    },
    methods: {
        logPersons() {
            console.log(this.persons);
        },
        addPerson() {
            this.persons.push({ id: Math.floor(Math.random() * 10), name: "Duong" });
        }
    }
});
