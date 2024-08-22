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
    }
}
PageAbstract.intancesMap = new Map();
