import { Vue } from "../Vue.js";
import { DirectiveManager } from "./DirectiveManager.js";

export abstract class DirectiveProvider {
    data: Vue['data'];
    manager: DirectiveManager;

    constructor(data: Vue['data'], manager: DirectiveManager) {
        this.data = data;
        this.manager = manager;
    }

    public applyDirective(element: Element, data: any): void {
        Array.from(element.attributes)
            .filter(attr => this.predicate(attr))
            .forEach(attr => {
                this.handle(element, attr, data);
            })
    }

    public abstract isNeedTrack(): boolean;

    protected abstract predicate(attr: Attr): boolean;

    protected abstract handle(element: Element, attr: Attr, data: any): void;
}

export class VTextDirectiveProvider extends DirectiveProvider {
    public isNeedTrack(): boolean {
        return true;
    }
    protected predicate(attr: Attr): boolean {
        return attr.name === 'v-text';
    }

    protected handle(element: Element, attr: Attr, data: any): void {
        const attrValue = attr.value;
        const func = Function("data", `with (data)  return ${attrValue}`);
        const content = func(data);
        element.textContent = String(content);
    }

}

export class VShowDirectiveProvider extends DirectiveProvider {
    public isNeedTrack(): boolean {
        return true;
    }
    protected predicate(attr: Attr): boolean {
        return attr.name === 'v-show';
    }
    protected handle(element: Element, attr: Attr, data: any): void {
        const attrValue = attr.value;

        const func = Function("data", `with (data)  return ${attrValue}`);
        const flag = Boolean(func(data));
        if (flag) {
            (element as HTMLElement).style.display = ""
        } else {
            (element as HTMLElement).style.display = "none"
        }
    }

}

export class VOnDirectiveProvider extends DirectiveProvider {

    public isNeedTrack(): boolean {
        return false;
    }

    protected predicate(attr: Attr): boolean {
        return attr.name.startsWith("v-on:");
    }
    protected handle(element: Element, attr: Attr, data: any): void {
        const actionName: string = attr.name.substring("v-on:".length);
        const expression = attr.value;

        const func = Function("data", "event", `with (data)  { ${expression}}`);
        element.addEventListener(actionName, (e) => {
            func.call(element, data, e);
        });
    }

}

export class VForDirectiveProvider extends DirectiveProvider {

    public applyDirective(parent: Element, data: any): void {
        const templateEl = parent.firstElementChild;
        if (!(templateEl instanceof HTMLTemplateElement)) return;

        const attr = templateEl.attributes.getNamedItem("v-for");
        if (!attr) return;

        if (templateEl.content.childElementCount !== 1) throw new Error("Template must have only Child")

        const clone = templateEl.content.firstElementChild as Element;
        const [itemName, listName] = this.getItemNameAndListName(attr);
        if (!(templateEl as any)['$processed']) {
            (templateEl as any)['$processed'] = true;
            this.handleNewElement(parent, [itemName, listName], data, clone);
        } else {
            this.handleUpdateElement(parent, [itemName, listName], data, clone);
        }

    }

    public isNeedTrack(): boolean {
        return true;
    }
    protected predicate(attr: Attr): boolean {
        return attr.name === 'v-for'
    }
    protected handle(element: Element, attr: Attr, data: any): void {
        // method not Impleted
    }

    private handleNewElement(parent: Element, [itemName, listName]: string[], data: any, clone: Element): void {
        for (const key in data[listName]) {
            let node = clone.cloneNode(true) as any;
            parent.appendChild(node);
            this.data.addNode(node, itemName, data[listName], key);
        }

    }

    private handleUpdateElement(parent: Element, [itemName, listName]: string[], data: any, clone: Element): void {
        const list = data[listName];
        if (list.length === parent.childElementCount - 1) {
            return;
        } else if (list.length < parent.childElementCount - 1) {
            while (parent.childElementCount - 1 !== list.length) {
                if (!parent.lastElementChild) break;
                this.data.deleteNode(parent.lastElementChild);
                parent.lastElementChild.remove();
                this.manager.untrackDependency(`${listName}.${parent.childElementCount - 1}`);
            }
        } else {
            while (parent.childElementCount - 1 !== list.length) {
                let node = clone.cloneNode(true) as any;
                this.data.addNode(node, itemName, data[listName], String(parent.childElementCount - 1));
                parent.appendChild(node);
                this.manager.processElement(node);
            }
        }

    }

    private getItemNameAndListName(attr: Attr): string[] {
        return attr.value.split(" in ").map(name => name.trim());
    }

}

export class VKeyDirectiveProvider extends DirectiveProvider {
    public isNeedTrack(): boolean {
        return true;
    }
    protected predicate(attr: Attr): boolean {
        return attr.name === 'v-key'
    }
    protected handle(element: Element, attr: Attr, data: any): void {
        const attrValue = attr.value;
        const func = Function("data", `with (data)  return ${attrValue}`);
        const keyValue = func(data);
        (element as any)['$key'] = keyValue;
    }

}