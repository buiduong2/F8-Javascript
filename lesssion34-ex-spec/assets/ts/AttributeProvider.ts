import { AttributeManager } from "./AttributeManager.js";
import { TreeData, TreeNode } from "./TreeData.js";
import { objDiff } from "./util.js";

export abstract class AttributeProvider {

    handler(node: Element, treeData: TreeData, attributes: Attr[], manager: AttributeManager) {
        var attribute = attributes.find(this.getPredicate.bind(this));
        if (!attribute) throw new Error("Error on code");
        this.handlerPrivate(node, treeData, attribute, manager);

    }

    abstract handlerPrivate(node: Element, treeData: TreeData, attribute: Attr, manager: AttributeManager): void;

    abstract getPredicate(attr: Attr): boolean;

    support(attrs: Attr[]): boolean {
        return attrs.some(this.getPredicate.bind(this));
    }
}

export class VDataAttributeProvider extends AttributeProvider {

    getPredicate(attr: Attr) {
        return attr.name === "v-data";
    }

    handlerPrivate(node: Element, treeData: TreeData, attribute: Attr): void {
        var attributeValue = attribute.value;
        var attributeData = Function(`return ${attributeValue}`).call({})
        treeData.setData(node, attributeData);
    }

}

export class VShowAttributeProvider extends AttributeProvider {

    getPredicate(attr: Attr) {
        return attr.name === "v-show";
    }

    handlerPrivate(node: Element, treeData: TreeData, attribute: Attr): void {

        var data = treeData.getDataByNode(node);
        var params = Object.keys(data);
        var args = Object.values(data);
        var functionBody = `return ${attribute.value}`;
        var func = new Function(...params, functionBody);

        if (node instanceof HTMLElement) {
            var isShow = func(...args);
            node.style.display = isShow ? "block" : "none";
        }

    }

}

export class VOnAttributeProvider extends AttributeProvider {
    private readonly prefix = "v-on:";

    getPredicate(attr: Attr): boolean {
        return attr.name.startsWith(this.prefix);
    }

    handlerPrivate(node: Element, treeData: TreeData, attribute: Attr, manager: AttributeManager): void {
        var action: string = "on" + attribute.name.slice(this.prefix.length);
        (node as any)[action] = function (e: Event) {
            // Cần thiết phải lấy ra data mới nhất bởi vì chúng ta toàn tạo ra bản Clone mà // nếu ko lấy cái mới nhất sẽ bị lỗi
            var data = treeData.getDataByNode(node);
            var dataClone = JSON.parse(JSON.stringify(data));
            var parameters = Object.keys(dataClone);
            var args = Object.values(dataClone);
            var functionBody = `${attribute.value}; return {${parameters.join(",")}}`;
            var func = new Function(...parameters, functionBody);
            //
            var modifledData = func(...args);
            var diff = objDiff(data, modifledData);
            var impactedParent = treeData.alterData(node, diff);
            manager.handleModified(impactedParent);
        }
    }

}

export class VTextAttributeProvider extends AttributeProvider {

    handlerPrivate(node: Element, treeData: TreeData, attribute: Attr, manager: AttributeManager): void {
        var keyData = attribute.value;
        var data: any = treeData.getDataByNode(node);
        var func = new Function(...Object.keys(data), `return ${keyData}`);

        (node as HTMLElement).innerHTML = func(...Object.values(data));
    }

    getPredicate(attr: Attr): boolean {
        return attr.name === 'v-text';
    }
}

export class VForAttributeProvider extends AttributeProvider {

    handlerPrivate(node: Element, treeData: TreeData, attribute: Attr, manager: AttributeManager): void {
        if (!(node instanceof HTMLTemplateElement)) throw new Error("Node must be Template")
        if (node.content.children.length !== 1) throw new Error("Template must have a wrapper for many Childen")
        if (node.parentElement == null) throw new Error("For Each must have a parent");

        var parent = node.parentElement;
        this.deleteAllChildrenExceptTemplate(parent);
        treeData.deleteChildrenTreeNodeByNode(parent);

        var attributeValue = attribute.value;
        var [ele, listKey] = attributeValue.split(" in ")

        var data: any = treeData.getDataByNode(node);

        for (const index in data[listKey]) {
            var clone = node.content.children[0].cloneNode(true);
            var elementData = data[listKey][index];
            (clone as Element).setAttribute("v-data", `{${ele}:${JSON.stringify(elementData)}, '$index': ${index} }`);
            (clone as Element).setAttribute("v-for-data", `{${String(listKey)}:['${ele}', ${index}]}`);
            parent.appendChild(clone);
            manager.handleModified(clone as Element);
        }

    }


    deleteAllChildrenExceptTemplate(parent: Element) {
        Array.from(parent.children).forEach(element => {
            if (!(element instanceof HTMLTemplateElement)) {
                element.remove();
            }
        })
    }

    getPredicate(attr: Attr): boolean {
        return attr.name === 'v-for'
    }
}

export class VForDataAttributeProvider extends AttributeProvider {

    handlerPrivate(node: Element, treeData: TreeData, attribute: Attr, manager: AttributeManager): void {
        var data = Function(`return ${attribute.value}`).call(null);
        var treeNode = treeData.searchDirectParentOrNodeSelf(node) as TreeNode;
        var parentTree = treeNode.parent;

        for (var listName in data) {
            var curr = parentTree;
            while (curr && !(listName in curr.data)) {
                curr = curr?.parent;
            }
            if (curr) {
                var index = data[listName][1];
                var dataKey = data[listName][0];
                (curr.data as any)[listName][index] = (treeNode.data as any)[dataKey];
            }
        }
    }

    getPredicate(attr: Attr): boolean {
        return attr.name === 'v-for-data'
    }

}