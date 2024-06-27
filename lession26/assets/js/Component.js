export default class Component {
    constructor(el) {
        this.el = el;
    }
    init() {
        var _a;
        (_a = this.chidren) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            child.init();
        });
    }
    mount() {
        var _a;
        (_a = this.chidren) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            child.mount();
        });
    }
    destroy() {
        var _a;
        (_a = this.chidren) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            child.destroy();
        });
    }
    refresh() {
        var _a;
        (_a = this.chidren) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            child.refresh();
        });
    }
    emit(eventName, value) {
        var _a;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.listen(eventName, value);
    }
    listen(eventName, value) {
        var _a, _b;
        (_b = (_a = this)[eventName]) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    }
}
