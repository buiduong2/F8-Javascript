import { VOnAttributeProvider, VDataAttributeProvider, VShowAttributeProvider, VTextAttributeProvider, VForAttributeProvider, VForDataAttributeProvider } from "./AttributeProvider.js";
export class AttributeManagerConcrete {
    constructor(component) {
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
    handle(node, data) {
        var attributes = Array.from(node.attributes).filter(attr => attr.name.startsWith("v-"));
        if (attributes.length) {
            this.providers.forEach(provider => {
                if (provider.support(attributes)) {
                    provider.handler(node, data, attributes, this);
                }
            });
        }
    }
    handleModified(node) {
        this.component.processChildrenElement(node);
    }
}
