import type { SubClassType } from "../types/type.ts";

export abstract class PageAbstract extends HTMLElement {

    static intancesMap = new Map<SubClassType<PageAbstract>, PageAbstract>();

    public static getIntance<T extends PageAbstract>(ctor: SubClassType<T>): PageAbstract {
        if (!this.intancesMap.has(ctor)) {
            const tagName = ("view" + "-" + ctor.name).toLowerCase();
            PageAbstract.intancesMap.set(ctor, document.createElement(tagName) as PageAbstract)
        }
        return this.intancesMap.get(ctor) as PageAbstract;
    }

    public static getNewIntance<T extends PageAbstract>(ctor: SubClassType<T>): PageAbstract {
        const tagName = ("view" + "-" + ctor.name).toLowerCase();
        return document.createElement(tagName) as PageAbstract;
    }


    connectedCallback() {
        this.style.width = "100%";
        addInOutTrasition(this, "view-enter");
    }

    beforeDisconnected(): Promise<void> {
        return addInOutTrasition(this, "view-leave");
    }

    abstract beforeRender(): Promise<void>;

}



export function addInOutTrasition(el: HTMLElement, prefix: string): Promise<void> {
    return new Promise(resolve => {
        el.classList.add(`${prefix}-from`);
        el.classList.add(`${prefix}-active`)
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
    })
}