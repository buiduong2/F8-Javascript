import { DirectiveManager } from "./directive/DirectiveManager.js";
import { ReactiveTrie } from "./reactive/ReactiveTrie.js"
import { VDataTree } from "./VData.js";

export class Vue {

    rootEl: HTMLElement;
    directiveManager: DirectiveManager;
    data: VDataTree;


    constructor({ selector, data, methods }: CreateOption) {
        this.rootEl = document.querySelector(selector) as HTMLElement;
        this.data = new VDataTree(this.rootEl);
        const reactiveTrie = new ReactiveTrie();
        this.directiveManager = new DirectiveManager(this.data, reactiveTrie);

        const reactiveData = reactiveTrie.createReactiveData(data());
        this.data.setData(reactiveData);
        this.data.setMethods(methods);
    }

    moute() {
        this.processHtml();
    }

    processHtml() {
        this.directiveManager.processElement(this.rootEl);
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