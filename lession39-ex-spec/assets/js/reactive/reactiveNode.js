export class ReactiveNode {
    children;
    elements;
    constructor() {
        this.elements = new Set();
        this.children = new Map();
    }
    addElement(element) {
        this.elements.add(element);
    }
    getElement() {
        return Array.from(this.elements);
    }
    containsKey(key) {
        return this.children.has(key);
    }
    getChild(key) {
        return this.children.get(key);
    }
    addChild(key) {
        this.children.set(key, new ReactiveNode());
    }
    removeChild(key) {
        this.children.delete(key);
    }
}
