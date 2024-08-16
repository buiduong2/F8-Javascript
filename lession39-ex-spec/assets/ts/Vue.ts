import { DirectiveManager } from "./directive/DirectiveManager.js";
import { ReactiveTrie } from "./reactive/ReactiveTrie.js"
import { VDataTree } from "./VData.js";

export class Vue {

    rootEl: HTMLElement;
    directiveManager: DirectiveManager;
    data: VDataTree;
    cycleCallback: Cyclecallback;


    constructor({ selector, data, methods, mouted }: CreateOption) {
        this.rootEl = document.querySelector(selector) as HTMLElement;
        this.data = new VDataTree(this.rootEl);
        const reactiveTrie = new ReactiveTrie();
        this.directiveManager = new DirectiveManager(this.data, reactiveTrie);

        const reactiveData = reactiveTrie.createReactiveData(data());
        this.data.setData(reactiveData);
        this.data.setMethods(methods);

        this.cycleCallback = {
            mouted
        }
    }

    moute() {
        this.processHtml();
        this.cycleCallback.mouted?.call(this.data.getDataByElement(this.rootEl));
    }

    processHtml() {
        this.directiveManager.processElement(this.rootEl);
    }

    public static create(createOption: CreateOption) {
        const intance = new Vue(createOption);
        intance.moute();
    }
}

export default Vue;

type CreateOption = {
    selector: string,
    data: () => { [key: string]: any };
    methods?: { [key: string]: (this: ThisArg, ...args: any[]) => any };
    mouted?: (this: ThisArg) => void;

}

type Cyclecallback = {
    mouted?: () => void
}

type DataType = ReturnType<CreateOption['data']>
type MethodsType = CreateOption['methods'];

type ThisArg = DataType & MethodsType;