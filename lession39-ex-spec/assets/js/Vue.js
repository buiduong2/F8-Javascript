import { DirectiveManager } from "./directive/DirectiveManager.js";
import { ReactiveTrie } from "./reactive/ReactiveTrie.js";
import { VDataTree } from "./VData.js";
export class Vue {
    constructor({ selector, data, methods }) {
        this.rootEl = document.querySelector(selector);
        this.data = new VDataTree(this.rootEl);
        const reactiveTrie = new ReactiveTrie();
        this.directiveManager = new DirectiveManager(this.data, reactiveTrie);
        const reactiveData = reactiveTrie.createReactiveData(data());
        this.data.setData(reactiveData);
        this.data.setMethods(methods);
    }
    moute() {
        this.processHtml();
    }
    processHtml() {
        this.directiveManager.processElement(this.rootEl);
    }
    static create(createOption) {
        const intance = new Vue(createOption);
        intance.moute();
    }
}
