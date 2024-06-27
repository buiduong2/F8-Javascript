import Component from "./Component.js";
export class TabAction extends Component {
    constructor(el, tabActionItems) {
        super(el);
        this.tabActionItems = tabActionItems;
        this.currentTabActionItem = tabActionItems[0];
    }
    onTabActionItemClick(tabActionItem) {
        var current = this.currentTabActionItem;
        var next = tabActionItem;
        if (current === next)
            return;
        this.currentTabActionItem = tabActionItem;
        next.active();
        current.removeActive();
        this.emit("onTabActionItemChange", next);
    }
    destroy() {
        super.destroy();
        this.onTabActionItemClick(this.tabActionItems[0]);
    }
}
export class TabActionItem extends Component {
    constructor(el) {
        super(el);
        this.id = Number(el.dataset.id);
        this.ACTIVE_CLASS = "active";
    }
    active() {
        this.el.classList.add(this.ACTIVE_CLASS);
    }
    removeActive() {
        this.el.classList.remove(this.ACTIVE_CLASS);
    }
    mount() {
        super.mount();
        var _this = this;
        this.el.onclick = function () {
            _this.emit("onTabActionItemClick", _this);
        };
    }
}
