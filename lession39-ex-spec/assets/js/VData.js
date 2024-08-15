export class VDataTree {
    root;
    constructor(rootEl, data) {
        this.root = new VDataNode(rootEl, data);
    }
    getDataByElement(element) {
        let node = this.root;
        let combined = {};
        do {
            Object.defineProperties(combined, Object.getOwnPropertyDescriptors(node.getData()));
            node = node.getChilByElement(element);
        } while (node);
        return combined;
    }
    addNode(element, refName, target, prop) {
        let node = this.root;
        let curr = node;
        while (curr) {
            node = curr;
            curr = curr.getChilByElement(element);
        }
        const newNode = new VDataNode(element, {});
        newNode.setRef(refName, target, prop);
        node.addChild(newNode);
        return newNode;
    }
    deleteNode(element) {
        let parent = this.root;
        let node = this.root;
        let curr = node;
        while (curr) {
            parent = node;
            node = curr;
            curr = curr.getChilByElement(element);
        }
        parent.removeChild(element);
    }
}
export class VDataNode {
    ref;
    el;
    data;
    children;
    constructor(element, data) {
        this.children = new Map();
        this.el = element;
        this.ref = {};
        this.data = data;
    }
    getData() {
        const combined = {};
        Object.defineProperties(combined, Object.getOwnPropertyDescriptors(this.data));
        Object.defineProperties(combined, Object.getOwnPropertyDescriptors(this.ref));
        return combined;
    }
    setRef(refName, target, prop) {
        this.ref[refName] = null;
        Object.defineProperty(this.ref, refName, {
            get() {
                return target[prop];
            },
            set(value) {
                target[prop] = value;
                return true;
            }
        });
    }
    isNodeElementAncestorOf(element) {
        return this.el.contains(element);
    }
    containsElement(element) {
        return this.el === element;
    }
    getChilByElement(element) {
        for (const el of this.children.keys()) {
            if (el.contains(element) || el === element) {
                return this.children.get(el);
            }
        }
        return undefined;
    }
    addChild(node) {
        this.children.set(node.el, node);
    }
    removeChild(element) {
        this.children.delete(element);
    }
}
