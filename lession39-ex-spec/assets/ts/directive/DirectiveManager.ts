import { ReactiveTrie } from "../reactive/ReactiveTrie.js";
import { VDataTree } from "../VData.js";
import { DirectiveProvider, VBindClassDirevtiveProvider, VForDirectiveProvider, VOnDirectiveProvider, VShowDirectiveProvider, VTextDirectiveProvider } from "./DirectiveProvider.js";

export class DirectiveManager {
    providers: DirectiveProvider[];
    dependencyMap: Map<string, Set<Element>>
    data: VDataTree;
    currentElement: Element | null;
    reactiveTrie: ReactiveTrie;

    constructor(data: VDataTree, reactiveTrie: ReactiveTrie) {
        this.dependencyMap = new Map();
        this.providers = [
            new VTextDirectiveProvider(data, this),
            new VBindClassDirevtiveProvider(data, this),
            new VShowDirectiveProvider(data, this),
            new VOnDirectiveProvider(data, this),
            new VForDirectiveProvider(data, this),
        ];
        this.data = data;
        this.currentElement = null;
        this.reactiveTrie = reactiveTrie;
        reactiveTrie.onDataChange = elements => elements.forEach(element => this.updateElement(element));
    }

    public setData(data: VDataTree) {
        this.data = data;
        this.providers.forEach(provider => provider.data = this.data);
    }

    public setProviders(providers: DirectiveProvider[]) {
        this.providers = providers;
    }

    public processElement(element: Element) {
        this.levelTraversalNode(element, this.applyDirective.bind(this));
    }

    public updateElement(element: Element) {
        const data = this.data.getDataByElement(element) || {};
        this.providers.forEach(provider => {
            if (provider.isNeedTrack()) {
                this.reactiveTrie.setCurrentElement(element);
                provider.applyDirective(element, data)
            }
            this.reactiveTrie.setCurrentElement(undefined);
        });
    }

    private applyDirective(element: Element): void {
        const data = this.data.getDataByElement(element) || {};
        this.providers.forEach(provider => {
            if (provider.isNeedTrack()) {
                this.reactiveTrie.setCurrentElement(element);
            }
            provider.applyDirective(element, data)
            this.reactiveTrie.setCurrentElement(undefined);
        });
    }

    private levelTraversalNode(element: Element | null, callback: (element: Element) => void) {
        if (element == null) {
            return;
        }
        callback(element);

        this.levelTraversalNode(element.nextElementSibling, callback);
        this.levelTraversalNode(element.firstElementChild, callback);
    }


}