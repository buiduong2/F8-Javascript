import { DirectiveManager } from "./directive/DirectiveManager.js";
import { VDataTree } from "./VData.js";
export class Vue {
    rootEl;
    directiveManager;
    data;
    constructor({ selector, data, methods }) {
        this.rootEl = document.querySelector(selector);
        this.directiveManager = new DirectiveManager(new VDataTree(this.rootEl, null));
        const reactiveData = this.createReactiveData(data());
        this.data = new VDataTree(this.rootEl, reactiveData);
        this.directiveManager.setData(this.data);
    }
    moute() {
        this.processHtml();
    }
    processHtml() {
        this.directiveManager.processElement(this.rootEl);
    }
    createReactiveData(data) {
        return this.createProxyData(data);
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
                        _this.directiveManager.untrackDepdencyArr(prefix, oldLength, newLength);
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
                        _this.directiveManager.trackDependency(`${prefix}.${prop}`);
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
                        _this.directiveManager.applyChange(`${prefix}`);
                        return value;
                    }
                    if (isNaN(parseInt(prop)))
                        return Reflect.set(target, prop, newValue, receiver);
                    // Cố gắng sửa đổi giá tị in-place của array
                    if (isProxy(newValue)) {
                        newValue = Object.assign({}, newValue);
                    }
                    newValue = _this.createNestedReactive(newValue, `${prefix}.${prop}`);
                    const isSuccess = Reflect.set(target, prop, newValue, receiver);
                    _this.directiveManager.applyChange(`${prefix}.${prop}`);
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
                _this.directiveManager.trackDependency(`${prefix}.${prop}`);
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, newValue, receiver) {
                if (typeof prop !== 'string')
                    return Reflect.set(target, prop, newValue, receiver);
                if (isProxy(newValue)) {
                    newValue = Object.assign({}, newValue);
                }
                newValue = _this.createNestedReactive(newValue, `${prefix}.${prop}`);
                Reflect.set(target, prop, newValue, receiver);
                _this.directiveManager.applyChange(`${prefix}.${prop}`);
                return true;
            },
        });
    }
    createProxyData(data) {
        const _this = this;
        const newObj = {};
        for (const key in data) {
            let value = data[key];
            Object.defineProperty(newObj, key, {
                get() {
                    _this.directiveManager.trackDependency(key);
                    return value;
                },
                set(newValue) {
                    value = newValue;
                    _this.directiveManager.applyChange(key);
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
    static create(createOption) {
        const intance = new Vue(createOption);
        intance.moute();
    }
}
function isProxy(obj) {
    return !!obj.__isProxy;
}
