import { DirectiveManager } from "./directive/DirectiveManager.js";
import { VDataTree } from "./VData.js";

export class Vue {

    rootEl: HTMLElement;
    directiveManager: DirectiveManager;
    data: VDataTree;


    constructor({ selector, data, methods }: CreateOption) {
        this.rootEl = document.querySelector(selector) as HTMLElement;
        this.directiveManager = new DirectiveManager(new VDataTree(this.rootEl, null));
        const reactiveData = this.createReactiveData(data());
        this.data = new VDataTree(this.rootEl, reactiveData);
        this.directiveManager.setData(this.data);
    }

    moute() {
        console.log("before Moute")
        this.processHtml();
        console.log("mouted")
    }

    processHtml() {
        this.directiveManager.processElement(this.rootEl);
    }

    private createReactiveData(data: any): any {
        return this.createProxyData(data);
    }

    private createNestedReactive(data: any, prefix: string): any {
        const _this = this;
        if (typeof data !== 'object') return data;
        for (const key in data) {
            data[key] = this.createNestedReactive(data[key], prefix + "." + key);
        }

        const reduceArrayMethods = new Set(['pop', 'splice', 'shift'])

        return new Proxy(data, {
            get(target, prop, receiver) {
                if (typeof prop !== 'string') return Reflect.get(target, prop, receiver);

                if (Array.isArray(target)) {
                    if (!isNaN(parseInt(prop))) {
                        _this.directiveManager.trackDependency(`${prefix}.${prop}`);
                    } else if (reduceArrayMethods.has(prop)) {
                        _this.directiveManager.untrackDependency(prop);

                    }
                } else {
                    _this.directiveManager.trackDependency(`${prefix}.${prop}`);
                }


                return Reflect.get(target, prop, receiver);
            },

            set(target, prop, newValue, receiver) {
                target[prop] = newValue;
                if (typeof prop === 'string') {
                    if (Array.isArray(target)) {
                        if (prop === 'length') {
                            _this.directiveManager.applyChange(`${prefix}`);
                        } else {

                            _this.directiveManager.applyChange(`${prefix}.${prop}`);
                        }
                    } else {
                        _this.directiveManager.applyChange(`${prefix}.${prop}`);
                    }
                }
                target[prop] = _this.createNestedReactive(newValue, prefix);
                return true;
            }
        })


    }

    private createProxyData(data: any): any {

        const _this = this;
        const newObj: any = {};
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
            })
        }



        for (const key in data) {
            if (typeof data[key] !== 'object') continue;
            newObj[key] = this.createNestedReactive(data[key], key);
        }

        return newObj;
    }

    public static create(createOption: CreateOption) {
        const intance = new Vue(createOption);
        intance.moute();
    }
}


type CreateOption = {
    selector: string,
    data: () => { [key: string]: any };
    methods: { [key: string]: (this: ThisArg, ...args: any[]) => any };
}

type DataType = ReturnType<CreateOption['data']>
type MethodsType = CreateOption['methods'];

type ThisArg = DataType & MethodsType;