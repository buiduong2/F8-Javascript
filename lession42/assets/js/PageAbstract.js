export class PageAbstract {
    static getIntance(ctor) {
        if (!this.intancesMap.has(ctor)) {
            this.intancesMap.set(ctor, new ctor());
        }
        return this.intancesMap.get(ctor);
    }
}
PageAbstract.intancesMap = new Map();
