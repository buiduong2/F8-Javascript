import { Data } from "./F8";

export abstract class Component extends HTMLElement {

    data: Data;
    map: Map<string, Set<TextNodeManager>>;

    constructor() {
        super();
        this.data = {};
        this.map = new Map();
    }

    abstract getTemplate(): string;

    abstract getData(): Data;

    compileNode(node: Node) {

        if (node.nodeType === Node.TEXT_NODE && node.textContent?.length) {
            this.applyMustacheExpression(node as Text);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            this.applyVOnDirective(node as Element);
        }

        Array.from(node.childNodes).forEach(this.compileNode.bind(this));
    }

    //  parse {{ expression }} to String
    applyMustacheExpression(node: Text) {
        const textNodeManager = new TextNodeManager(node as Text, this.data);
        const mustacheVariableKeys = textNodeManager.getMustacheVariableKeys();
        textNodeManager.compileTextContent();

        for (const key of mustacheVariableKeys) {
            if (!this.map.has(key)) {
                // map giống giống Object, Set giống giống array
                this.map.set(key, new Set());
            }
            this.map.get(key)?.add(textNodeManager);
        }
    }

    // Add Behavior listner for attribute v-on:[action] . etc: v-on:click, v-on:dbclick
    applyVOnDirective(element: Element) {
        const _this = this;
        if (element.attributes.length) {
            Array.from(element.attributes)
                .filter(function (attr) {
                    return attr.name.startsWith("v-on:");
                }).forEach(function (attr) {
                    const action = attr.name.slice(5);
                    const value = attr.value;
                    const func = new Function('data', '$event', `with (data) {( ${value} )}`);
                    element.addEventListener(action, func.bind(element, _this.data));
                })
        }

    }

    applyData(data: Data): void {
        const _this = this;
        for (const key in data) {
            let value = data[key];
            Object.defineProperty(this.data, key, {
                set: function (newValue) {
                    value = newValue;
                    _this.notifyChangeData(key);
                },

                get: function () {
                    return value;
                }
            })
        }
    }

    notifyChangeData(p: string) {
        this.map.get(p)?.forEach(function (nodeManager) {
            nodeManager.compileTextContent();
        })
    }

    connectedCallback() {
        this.innerHTML = this.getTemplate();
        this.applyData(this.getData());
        this.compileNode(this);
    }
}


class TextNodeManager {

    node: Text
    template: string;
    mustacheMatches: string[];
    data: Data;

    constructor(node: Text, data: Data) {
        this.node = node;
        this.template = this.node.textContent ?? "";
        this.data = data;
        this.mustacheMatches = node.textContent?.match(/{{.+?}}/g) ?? []
    }

    compileTextContent(): void {
        let content = this.template;
        for (const match of this.mustacheMatches) {
            let value;
            let key;
            let properties;

            if (match.includes("[")) {
                //Handle Bracket Accessor
                properties = match.match(/\[.+?\]/g)?.map(function (property) {
                    return property.slice(1, property.length - 1);
                }) || [];
                key = match.substring(2, match.indexOf("[")).trim();
            } else {
                //Handle Dot Accessor
                [key, ...properties] = match.slice(2, match.length - 2).trim().split(".");
            }
            value = this.data[key]
            while (properties.length) {
                value = value[(properties.shift() as string)];
            }
            content = content.replaceAll(match, value);
        }
        this.node.textContent = content;
    }

    getMustacheVariableKeys(): string[] {
        return this.mustacheMatches.map(function (match) {
            return match.slice(2, match.length - 2).trim().split(".")[0];
        })
    }


} 