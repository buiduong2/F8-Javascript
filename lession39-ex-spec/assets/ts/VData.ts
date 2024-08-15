export class VDataTree {
    private root: VDataNode;
    private data: any;
    private methods: any;

    constructor(rootEl: Element) {
        this.root = new VDataNode(rootEl);
        this.data = {};
        this.methods = {};
    }

    public setData(data: any): void {
        this.data = data;
    }

    public setMethods(methods: any): void {
        this.methods = methods;
    }

    public getDataByElement(element: Element): Object {
        let node: VDataNode | undefined = this.root;
        let combined = {};
        this.combineObj(combined, this.data);
        this.combineObj(combined, this.methods);
        do {
            this.combineObj(combined, node.getData());
            node = node.getChilByElement(element);
        } while (node);
        return combined;
    }

    public addNode(element: Element, refName: string, target: any, prop: string): VDataNode {
        let node: VDataNode = this.root;
        let curr: VDataNode | undefined = node;
        while (curr) {
            node = curr
            curr = curr.getChilByElement(element);
        }

        const newNode = new VDataNode(element);
        newNode.setRef(refName, target, prop);
        node.addChild(newNode);
        return newNode
    }

    public deleteNode(element: Element) {
        let parent = this.root;
        let node: VDataNode = this.root;
        let curr: VDataNode | undefined = node;
        while (curr) {
            parent = node;
            node = curr
            curr = curr.getChilByElement(element);
        }
        parent.removeChild(element);
    }

    private combineObj(obj1: any, obj2: any): any {
        return Object.defineProperties(obj1, Object.getOwnPropertyDescriptors(obj2));
    }
}

export class VDataNode {
    
    private ref: any;
    private el: Element;
    private children: Map<Element, VDataNode>;

    constructor(element: Element) {
        this.children = new Map();
        this.el = element;
        this.ref = {};
    }

    public getData(): any {
        return this.ref;
    }


    public setRef(refName: string, target: any, prop: string): void {
        this.ref[refName] = null;
        Object.defineProperty(this.ref, refName, {
            get() {
                return target[prop]
            },
            set(value) {
                target[prop] = value;
                return true;
            }
        })
    }

    public isNodeElementAncestorOf(element: Element): boolean {
        return this.el.contains(element);
    }

    public containsElement(element: Element): boolean {
        return this.el === element;
    }

    public getChilByElement(element: Element): VDataNode | undefined {
        for (const el of this.children.keys()) {
            if (el.contains(element) || el === element) {
                return this.children.get(el);
            }
        }

        return undefined;
    }

    public addChild(node: VDataNode) {
        this.children.set(node.el, node);
    }

    public removeChild(element: Element) {
        this.children.delete(element);
    }

}
