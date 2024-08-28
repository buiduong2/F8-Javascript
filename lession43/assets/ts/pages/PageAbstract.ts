import type { SubClassType } from "../types/type.ts";
import { applyTransitionClasses } from "../utils/utils.js"
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
        applyTransitionClasses(this, "view-enter");
    }

    beforeDisconnected(): Promise<void> {
        return applyTransitionClasses(this, "view-leave");
    }

    abstract beforeRender(): Promise<void>;

}


