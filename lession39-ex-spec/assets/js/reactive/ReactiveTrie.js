import { ReactiveNode } from "./ReactiveNode.js";
export class ReactiveTrie {
    constructor() {
        this.reactiveRoot = new ReactiveNode();
        this.onDataChange = function (elements) {
        };
    }
    setCurrentElement(element) {
        this.currentElement = element;
    }
    addListener(path, element) {
        const strs = path.split(".");
        let node = this.reactiveRoot;
        for (let index = 0; index < strs.length; index++) {
            const key = strs[index];
            if (!node.containsKey(key)) {
                node.addChild(key);
            }
            node = node.getChild(key);
        }
        node.addElement(element);
    }
    getNode(path) {
        const strs = path.split(".");
        let node = this.reactiveRoot;
        for (let index = 0; index < strs.length; index++) {
            const key = strs[index];
            if (!node.containsKey(key)) {
                return undefined;
            }
            node = node.getChild(key);
        }
        return node;
    }
    removeNode(path) {
        const strs = path.split(".");
        let node = this.reactiveRoot;
        for (let index = 0; index < strs.length - 1; index++) {
            const key = strs[index];
            if (!node.containsKey(key)) {
                return;
            }
            node = node.getChild(key);
        }
        node.removeChild(strs[strs.length - 1]);
    }
    createReactiveData(data) {
        const _this = this;
        const newObj = {};
        for (const key in data) {
            let value = data[key];
            Object.defineProperty(newObj, key, {
                get() {
                    _this.trackDependency(key);
                    return value;
                },
                set(newValue) {
                    value = newValue;
                    _this.applyChange(key);
                    return true;
                }
            });
        }
        for (const key in data) {
            if (typeof data[key] === 'object') {
                newObj[key] = this.createNestedReactive(data[key], key);
            }
        }
        return newObj;
    }
    createNestedReactive(data, prefix) {
        const _this = this;
        // Handle Các method của array có dạng thay đổi số lượng phần tử
        // Có vẻ cách làm của chúng ta vì Arrray tự động cập nhật lại index. 
        // Nên các index ngoài cũng sẽ bị vứt. nên ta cũng vứt các index ngoài cùng luôn ko cần thiết phải sửa lại
        // shift pop  splice
        if (typeof data === 'function' && data === Array.prototype[data.name]) {
            return new Proxy(data, {
                apply(target, thisArg, argArray) {
                    const oldLength = thisArg.length;
                    const value = Reflect.apply(target, thisArg, argArray);
                    const newLength = thisArg.length;
                    if (oldLength !== newLength) {
                        _this.untrackDepdencyArr(prefix, oldLength, newLength);
                    }
                    return value;
                },
            });
        }
        // Kiểu dữ liệu nguyên thủy thì thôi
        if (typeof data !== 'object')
            return data;
        for (const key in data) {
            data[key] = this.createNestedReactive(data[key], prefix + "." + key);
        }
        if (Array.isArray(data)) {
            const reduceArrayMethods = new Set(['pop', 'splice', 'shift', 'push']);
            return new Proxy(data, {
                get(target, prop, receiver) {
                    if (prop === "__isProxy")
                        return true;
                    if (typeof prop !== 'string')
                        return Reflect.get(target, prop, receiver);
                    if (!isNaN(parseInt(prop))) {
                        _this.trackDependency(`${prefix}.${prop}`);
                    }
                    else if (reduceArrayMethods.has(prop)) {
                        return _this.createNestedReactive(data[prop], prefix);
                    }
                    return Reflect.get(target, prop, receiver);
                },
                set(target, prop, newValue, receiver) {
                    if (typeof prop !== 'string')
                        return Reflect.set(target, prop, newValue, receiver);
                    if (prop === 'length') {
                        //cố gắng sửa đổi số lượng phần tử Array
                        const value = Reflect.set(target, prop, newValue, receiver);
                        _this.applyChange(`${prefix}`);
                        return value;
                    }
                    if (isNaN(parseInt(prop)))
                        return Reflect.set(target, prop, newValue, receiver);
                    // Cố gắng sửa đổi giá tị in-place của array
                    if (_this.isProxy(newValue)) {
                        newValue = Object.assign({}, newValue);
                    }
                    newValue = _this.createNestedReactive(newValue, `${prefix}.${prop}`);
                    const isSuccess = Reflect.set(target, prop, newValue, receiver);
                    _this.applyChange(`${prefix}.${prop}`);
                    return isSuccess;
                },
            });
        }
        return new Proxy(data, {
            get(target, prop, receiver) {
                if (prop === "__isProxy")
                    return true;
                if (typeof prop !== 'string')
                    return Reflect.get(target, prop, receiver);
                _this.trackDependency(`${prefix}.${prop}`);
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, newValue, receiver) {
                if (typeof prop !== 'string')
                    return Reflect.set(target, prop, newValue, receiver);
                if (_this.isProxy(newValue)) {
                    newValue = Object.assign({}, newValue);
                }
                newValue = _this.createNestedReactive(newValue, `${prefix}.${prop}`);
                Reflect.set(target, prop, newValue, receiver);
                _this.applyChange(`${prefix}.${prop}`);
                return true;
            },
        });
    }
    isProxy(obj) {
        return !!obj.__isProxy;
    }
    trackDependency(path) {
        if (this.currentElement) {
            this.addListener(path, this.currentElement);
        }
    }
    untrackDependency(path) {
        this.removeNode(path);
    }
    untrackDepdencyArr(path, oldLength, newLength) {
        for (let i = newLength; i <= oldLength; i++) {
            this.removeNode(`${path}.${i}`);
        }
    }
    applyChange(path) {
        const elements = this.getNode(path)?.getElement();
        if (elements) {
            this.onDataChange(elements);
        }
    }
}
