export class ReactiveNode {
    private children: Map<string, ReactiveNode>;
    private elements: Set<Element>;

    constructor() {
        this.elements = new Set();
        this.children = new Map();
    }

    public addElement(element: Element) {
        this.elements.add(element);
    }

    public getElement(): Element[] {
        return Array.from(this.elements);
    }

    public containsKey(key: string): boolean {
        return this.children.has(key);
    }

    public getChild(key: string): ReactiveNode | undefined {
        return this.children.get(key);
    }

    public addChild(key: string): void {
        this.children.set(key, new ReactiveNode());
    }

    public removeChild(key: string): void {
        this.children.delete(key);
    }


}