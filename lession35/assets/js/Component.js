export class Component extends HTMLElement {
    constructor() {
        super();
        this.data = {};
        this.map = new Map();
    }
    compileNode(node) {
        var _a;
        if (node.nodeType === Node.TEXT_NODE && ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.length)) {
            this.applyMustacheExpression(node);
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            this.applyVOnDirective(node);
        }
        Array.from(node.childNodes).forEach(this.compileNode.bind(this));
    }
    //  parse {{ expression }} to String
    applyMustacheExpression(node) {
        var _a;
        const textNodeManager = new TextNodeManager(node, this.data);
        const mustacheVariableKeys = textNodeManager.getMustacheVariableKeys();
        textNodeManager.compileTextContent();
        for (const key of mustacheVariableKeys) {
            if (!this.map.has(key)) {
                // map giống giống Object, Set giống giống array
                this.map.set(key, new Set());
            }
            (_a = this.map.get(key)) === null || _a === void 0 ? void 0 : _a.add(textNodeManager);
        }
    }
    // Add Behavior listner for attribute v-on:[action] . etc: v-on:click, v-on:dbclick
    applyVOnDirective(element) {
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
            });
        }
    }
    applyData(data) {
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
            });
        }
    }
    notifyChangeData(p) {
        var _a;
        (_a = this.map.get(p)) === null || _a === void 0 ? void 0 : _a.forEach(function (nodeManager) {
            nodeManager.compileTextContent();
        });
    }
    connectedCallback() {
        this.innerHTML = this.getTemplate();
        this.applyData(this.getData());
        this.compileNode(this);
    }
}
class TextNodeManager {
    constructor(node, data) {
        var _a, _b, _c;
        this.node = node;
        this.template = (_a = this.node.textContent) !== null && _a !== void 0 ? _a : "";
        this.data = data;
        this.mustacheMatches = (_c = (_b = node.textContent) === null || _b === void 0 ? void 0 : _b.match(/{{.+?}}/g)) !== null && _c !== void 0 ? _c : [];
    }
    compileTextContent() {
        var _a;
        let content = this.template;
        for (const match of this.mustacheMatches) {
            let value;
            let key;
            let properties;
            if (match.includes("[")) {
                //Handle Bracket Accessor
                properties = ((_a = match.match(/\[.+?\]/g)) === null || _a === void 0 ? void 0 : _a.map(function (property) {
                    return property.slice(1, property.length - 1);
                })) || [];
                key = match.substring(2, match.indexOf("[")).trim();
            }
            else {
                //Handle Dot Accessor
                [key, ...properties] = match.slice(2, match.length - 2).trim().split(".");
            }
            value = this.data[key];
            while (properties.length) {
                value = value[properties.shift()];
            }
            content = content.replaceAll(match, value);
        }
        this.node.textContent = content;
    }
    getMustacheVariableKeys() {
        return this.mustacheMatches.map(function (match) {
            return match.slice(2, match.length - 2).trim().split(".")[0];
        });
    }
}
