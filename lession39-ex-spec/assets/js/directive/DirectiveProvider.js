export class DirectiveProvider {
    constructor(data, manager) {
        this.data = data;
        this.manager = manager;
    }
    applyDirective(element, data) {
        Array.from(element.attributes)
            .filter(attr => this.predicate(attr))
            .forEach(attr => {
            this.handle(element, attr, data);
        });
    }
}
export class VTextDirectiveProvider extends DirectiveProvider {
    isNeedTrack() {
        return true;
    }
    predicate(attr) {
        return attr.name === 'v-text';
    }
    handle(element, attr, data) {
        const attrValue = attr.value;
        const func = Function("data", `with (data)  return ${attrValue}`);
        const content = func(data);
        element.textContent = String(content);
    }
}
export class VShowDirectiveProvider extends DirectiveProvider {
    isNeedTrack() {
        return true;
    }
    predicate(attr) {
        return attr.name === 'v-show';
    }
    handle(element, attr, data) {
        const attrValue = attr.value;
        const func = Function("data", `with (data)  return ${attrValue}`);
        const flag = Boolean(func(data));
        if (flag) {
            element.style.display = "";
        }
        else {
            element.style.display = "none";
        }
    }
}
export class VOnDirectiveProvider extends DirectiveProvider {
    isNeedTrack() {
        return false;
    }
    predicate(attr) {
        return attr.name.startsWith("v-on:");
    }
    handle(element, attr, data) {
        const actionName = attr.name.substring("v-on:".length);
        const expression = attr.value;
        const func = Function("data", "event", `with (data)  { ${expression}}`);
        element.addEventListener(actionName, (e) => {
            func.call(element, data, e);
        });
    }
}
export class VForDirectiveProvider extends DirectiveProvider {
    applyDirective(parent, data) {
        const templateEl = parent.firstElementChild;
        if (!(templateEl instanceof HTMLTemplateElement))
            return;
        const attr = templateEl.attributes.getNamedItem("v-for");
        if (!attr)
            return;
        if (templateEl.content.childElementCount !== 1)
            throw new Error("Template must have only Child");
        const clone = templateEl.content.firstElementChild;
        const [itemName, listName] = this.getItemNameAndListName(attr);
        if (!templateEl['$processed']) {
            templateEl['$processed'] = true;
            this.handleNewElement(parent, [itemName, listName], data, clone);
        }
        else {
            this.handleUpdateElement(parent, [itemName, listName], data, clone);
        }
    }
    isNeedTrack() {
        return true;
    }
    predicate(attr) {
        return attr.name === 'v-for';
    }
    handle(element, attr, data) {
        // method not Impleted
    }
    handleNewElement(parent, [itemName, listName], data, prototype) {
        for (const key in data[listName]) {
            let node = prototype.cloneNode(true);
            parent.appendChild(node);
            this.data.addNode(node, itemName, data[listName], key);
        }
    }
    handleUpdateElement(parent, [itemName, listName], data, prototype) {
        const list = data[listName];
        if (list.length === parent.childElementCount - 1) {
            return;
        }
        else if (list.length < parent.childElementCount - 1) {
            while (parent.childElementCount - 1 !== list.length) {
                if (!parent.lastElementChild)
                    break;
                this.data.deleteNode(parent.lastElementChild);
                parent.lastElementChild.remove();
            }
        }
        else {
            while (parent.childElementCount - 1 !== list.length) {
                let node = prototype.cloneNode(true);
                this.data.addNode(node, itemName, data[listName], String(parent.childElementCount - 1));
                parent.appendChild(node);
                this.manager.processElement(node);
            }
        }
    }
    getItemNameAndListName(attr) {
        return attr.value.split(" in ").map(name => name.trim());
    }
}
