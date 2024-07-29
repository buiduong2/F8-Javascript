import { AttributeProvider, VOnAttributeProvider, VDataAttributeProvider, VShowAttributeProvider, VTextAttributeProvider, VForAttributeProvider, VForDataAttributeProvider } from "./AttributeProvider.js";
import { ComponentAbstraction } from "./Component.js";
import { TreeData } from "./TreeData.js";

export interface AttributeManager {
    handle(node: Element, data: TreeData): void;
    handleModified(node: Element): void;
}

export class AttributeManagerConcrete implements AttributeManager {

    providers: AttributeProvider[]
    component: ComponentAbstraction;

    constructor(component: ComponentAbstraction) {
        this.providers = [
            new VDataAttributeProvider(),
            new VShowAttributeProvider(),
            new VOnAttributeProvider(),
            new VTextAttributeProvider(),
            new VForAttributeProvider(),
            new VForDataAttributeProvider()
        ];
        this.component = component;
    }

    handle(node: Element, data: TreeData): void {
        var attributes = Array.from(node.attributes).filter(attr => attr.name.startsWith("v-"));
        if (attributes.length) {
            this.providers.forEach(provider => {
                if (provider.support(attributes)) {
                    provider.handler(node, data, attributes, this);
                }
            });
        }
    }

    handleModified(node: Element) {
        this.component.processChildrenElement(node);
    }

}