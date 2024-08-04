import { AttributeManagerConcrete } from "./AttributeManager.js";
import { TreeData } from "./TreeData.js";
export class ComponentAbstraction extends HTMLElement {
    constructor() {
        super();
        this.attributeManager = new AttributeManagerConcrete(this);
        this.treeData = new TreeData(this, this.getData());
    }
    findDirectParentNode(node) {
        var parent = this;
        var closerParent = null;
        do {
            closerParent = Array.from(parent.children).find(child => {
                return child.contains(node);
            });
            if (closerParent) {
                parent = closerParent;
            }
        } while (closerParent);
    }
    processChildrenElement(node) {
        this.attributeManager.handle(node, this.treeData);
        var children = Array.from(node.children);
        children.forEach(this.processChildrenElement.bind(this));
    }
    connectedCallback() {
        this.processChildrenElement(this);
    }
}
var F8 = {
    create(tagName, callback) {
        class Component extends ComponentAbstraction {
            getData() {
                return callback();
            }
        }
        customElements.define(tagName, Component);
    }
};
export { F8 };
