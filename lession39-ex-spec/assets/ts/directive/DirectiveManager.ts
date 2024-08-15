import { VDataTree } from "../VData.js";
import { DirectiveProvider, VForDirectiveProvider, VOnDirectiveProvider, VShowDirectiveProvider, VTextDirectiveProvider } from "./DirectiveProvider.js";

export class DirectiveManager {
    providers: DirectiveProvider[];
    dependencyMap: Map<string, Set<Element>>
    data: VDataTree;
    currentElement: Element | null;

    constructor(data: VDataTree) {
        this.dependencyMap = new Map();
        this.providers = [
            new VTextDirectiveProvider(data, this),
            new VShowDirectiveProvider(data, this),
            new VOnDirectiveProvider(data, this),
            new VForDirectiveProvider(data, this),
        ];
        this.data = data;
        this.currentElement = null;
    }

    public setData(data: VDataTree) {
        this.data = data;
        this.providers.forEach(provider => provider.data = this.data);
    }

    public setProviders(providers: DirectiveProvider[]) {
        this.providers = providers;
    }

    public trackDependency(path: string): void {
        if (this.currentElement) {

            this.addDependency(path, this.currentElement);
        }
    }

    public untrackDependency(path: string): void {
        for (const [key] of this.dependencyMap.entries()) {
            if (key.startsWith(path)) {
                this.dependencyMap.delete(key);
            }
        }
    }

    public untrackDepdencyArr(path: string, oldLength: number, newLength: number) {
        for (let i = newLength; i <= oldLength; i++) {
            const prefix = `${path}.${i}`;
            this.untrackDependency(prefix);
        }
    }

    public addDependency(path: string, element: Element) {
        if (!this.dependencyMap.has(path)) {
            this.dependencyMap.set(path, new Set());
        }
        this.dependencyMap.get(path)?.add(element);
    }

    public applyChange(path: string) {
        this.dependencyMap.get(path)?.forEach(element => this.applyDirective(element));
    }


    public processElement(element: Element) {
        this.levelTraversalNode(element, this.applyDirective.bind(this));
    }

    private applyDirective(element: Element): void {
        const data = this.data.getDataByElement(element) || {};
        this.providers.forEach(provider => {
            if (provider.isNeedTrack()) {
                this.currentElement = element;
            }
            provider.applyDirective(element, data)
            this.currentElement = null;
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