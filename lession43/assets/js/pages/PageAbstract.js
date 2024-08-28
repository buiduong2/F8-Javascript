import { applyTransitionClasses } from "../utils/utils.js";
export class PageAbstract extends HTMLElement {
    static getIntance(ctor) {
        if (!this.intancesMap.has(ctor)) {
            const tagName = ("view" + "-" + ctor.name).toLowerCase();
            PageAbstract.intancesMap.set(ctor, document.createElement(tagName));
        }
        return this.intancesMap.get(ctor);
    }
    static getNewIntance(ctor) {
        const tagName = ("view" + "-" + ctor.name).toLowerCase();
        return document.createElement(tagName);
    }
    connectedCallback() {
        this.style.width = "100%";
        applyTransitionClasses(this, "view-enter");
    }
    beforeDisconnected() {
        return applyTransitionClasses(this, "view-leave");
    }
}
PageAbstract.intancesMap = new Map();
