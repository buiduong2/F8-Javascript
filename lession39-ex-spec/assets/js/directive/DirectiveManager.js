import { VForDirectiveProvider, VOnDirectiveProvider, VShowDirectiveProvider, VTextDirectiveProvider } from "./DirectiveProvider.js";
export class DirectiveManager {
    constructor(data, reactiveTrie) {
        this.dependencyMap = new Map();
        this.providers = [
            new VTextDirectiveProvider(data, this),
            new VShowDirectiveProvider(data, this),
            new VOnDirectiveProvider(data, this),
            new VForDirectiveProvider(data, this),
        ];
        this.data = data;
        this.currentElement = null;
        this.reactiveTrie = reactiveTrie;
        reactiveTrie.onDataChange = elements => elements.forEach(element => this.applyDirective(element));
    }
    setData(data) {
        this.data = data;
        this.providers.forEach(provider => provider.data = this.data);
    }
    setProviders(providers) {
        this.providers = providers;
    }
    processElement(element) {
        this.levelTraversalNode(element, this.applyDirective.bind(this));
    }
    applyDirective(element) {
        const data = this.data.getDataByElement(element) || {};
        this.providers.forEach(provider => {
            if (provider.isNeedTrack()) {
                this.reactiveTrie.setCurrentElement(element);
            }
            provider.applyDirective(element, data);
            this.reactiveTrie.setCurrentElement(undefined);
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
