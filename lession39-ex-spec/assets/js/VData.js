export class VDataTree {
    root;
    data;
    methods;
    constructor(rootEl) {
        this.root = new VDataNode(rootEl);
        this.data = {};
        this.methods = {};
    }
    setData(data) {
        this.data = data;
    }
    setMethods(methods) {
        this.methods = methods;
    }
    getDataByElement(element) {
        let node = this.root;
        let combined = {};
        this.combineObj(combined, this.data);
        this.combineObj(combined, this.methods);
        do {
            this.combineObj(combined, node.getData());
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
        const newNode = new VDataNode(element);
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
    combineObj(obj1, obj2) {
        return Object.defineProperties(obj1, Object.getOwnPropertyDescriptors(obj2));
    }
}
export class VDataNode {
    ref;
    el;
    children;
    constructor(element) {
        this.children = new Map();
        this.el = element;
        this.ref = {};
    }
    getData() {
        return this.ref;
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
