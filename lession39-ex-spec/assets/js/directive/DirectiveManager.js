import { VForDirectiveProvider, VOnDirectiveProvider, VShowDirectiveProvider, VTextDirectiveProvider } from "./DirectiveProvider.js";
export class DirectiveManager {
    providers;
    dependencyMap;
    data;
    currentElement;
    constructor(data) {
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
    setData(data) {
        this.data = data;
        this.providers.forEach(provider => provider.data = this.data);
    }
    setProviders(providers) {
        this.providers = providers;
    }
    trackDependency(path) {
        if (this.currentElement) {
            this.addDependency(path, this.currentElement);
        }
    }
    untrackDependency(path) {
        for (const [key] of this.dependencyMap.entries()) {
            if (key.startsWith(path)) {
                this.dependencyMap.delete(key);
            }
        }
    }
    untrackDepdencyArr(path, oldLength, newLength) {
        for (let i = newLength; i <= oldLength; i++) {
            const prefix = `${path}.${i}`;
            this.untrackDependency(prefix);
        }
    }
    addDependency(path, element) {
        if (!this.dependencyMap.has(path)) {
            this.dependencyMap.set(path, new Set());
        }
        this.dependencyMap.get(path)?.add(element);
    }
    applyChange(path) {
        this.dependencyMap.get(path)?.forEach(element => this.applyDirective(element));
    }
    processElement(element) {
        this.levelTraversalNode(element, this.applyDirective.bind(this));
    }
    applyDirective(element) {
        const data = this.data.getDataByElement(element) || {};
        this.providers.forEach(provider => {
            if (provider.isNeedTrack()) {
                this.currentElement = element;
            }
            provider.applyDirective(element, data);
            this.currentElement = null;
        });
    }
    levelTraversalNode(element, callback) {
        if (element == null) {
            return;
        }
        callback(element);
        this.levelTraversalNode(element.nextElementSibling, callback);
        this.levelTraversalNode(element.firstElementChild, callback);
    }
}
