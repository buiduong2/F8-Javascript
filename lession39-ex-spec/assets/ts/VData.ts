export class VDataTree {
    private root: VDataNode;

    constructor(rootEl: Element, data: NodeData) {
        this.root = new VDataNode(rootEl, data);
    }

    public getDataByElement(element: Element): Object {
        let node: VDataNode | undefined = this.root;
        let combined = {};
        do {
            Object.defineProperties(combined, Object.getOwnPropertyDescriptors(node.getData()));
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

        const newNode = new VDataNode(element, {});
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
}

export class VDataNode {
    private ref: any;
    private el: Element;
    private data: Object;

    private children: Map<Element, VDataNode>;

    constructor(element: Element, data: Object) {
        this.children = new Map();
        this.el = element;
        this.ref = {};
        this.data = data;
    }

    public getData(): any {


        const combined = {};
        Object.defineProperties(combined, Object.getOwnPropertyDescriptors(this.data));
        Object.defineProperties(combined, Object.getOwnPropertyDescriptors(this.ref));

        return combined;
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

type NodeData = any;