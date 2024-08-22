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
        addInOutTrasition(this, "view-enter");
    }
    beforeDisconnected() {
        return addInOutTrasition(this, "view-leave");
    }
}
PageAbstract.intancesMap = new Map();
export function addInOutTrasition(el, prefix) {
    return new Promise(resolve => {
        el.classList.add(`${prefix}-from`);
        el.classList.add(`${prefix}-active`);
        const { transitionDelay, transitionDuration } = window.getComputedStyle(el);
        setTimeout(() => {
            el.classList.add(`${prefix}-to`);
            el.classList.remove(`${prefix}-from`);
        }, 100);
        const trantitionTime = parseFloat(transitionDelay) + parseFloat(transitionDuration);
        setTimeout(() => {
            el.classList.remove(`${prefix}-active`, `${prefix}-to`);
            resolve();
        }, trantitionTime * 1000);
    });
}
