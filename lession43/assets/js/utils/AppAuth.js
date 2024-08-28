import { store } from "../index.js";
export class AppAuth extends HTMLElement {
    constructor() {
        super();
        this.isFirstRender = true;
    }
    toggleElement() {
        const attr = this.getAttribute('v-auth');
        if (attr === 'guest' && store.isAuth) {
            this.style.display = "none";
        }
        else if (attr === "auth" && !store.isAuth) {
            this.style.display = 'none';
        }
        else {
            this.style.display = "";
        }
    }
    connectedCallback() {
        if (this.isFirstRender) {
            const attr = this.getAttribute('v-auth');
            if (!attr)
                throw new Error("App-Auth must have attribute v-auth");
            store.authListeners.push(this.toggleElement.bind(this));
            this.toggleElement();
        }
    }
    disconnectedCallback() {
    }
}
