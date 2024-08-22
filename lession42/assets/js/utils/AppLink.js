import { Router } from "./Router.js";
export class AppLink extends HTMLElement {
    constructor() {
        super();
        this.aEl = document.createElement("a");
        this.ignoreAttributesName = ["v-to"];
    }
    addHandler() {
        const route = Function(`return ${this.getAttribute("v-to")} `).call(null);
        this.aEl.onclick = (e) => {
            e.preventDefault();
            Router.getIntance().push(route);
        };
    }
    copyAttribute() {
        this.aEl.innerHTML = this.innerHTML;
        Array.from(this.attributes).forEach(attr => {
            if (this.ignoreAttributesName.includes(attr.name))
                return;
            this.aEl.setAttribute(attr.name, attr.value);
        });
    }
    connectedCallback() {
        this.copyAttribute();
        this.addHandler();
        this.replaceWith(this.aEl);
    }
    disconnectedCallback() {
    }
}
