import Component from "./Component.js";
export class TabContent extends Component {
    constructor(el, tabContentItems) {
        super(el);
        this.tabContentItem = tabContentItems;
        this.currentTabContentItem = this.tabContentItem[0];
    }
    changeTabContentItem(tabId) {
        var current = this.currentTabContentItem;
        var next = this.tabContentItem.find(function (item) {
            return item.id === tabId;
        });
        if (next && next !== current) {
            this.currentTabContentItem = next;
            current.removeActive();
            next.active();
        }
    }
}
export class TabContentItem extends Component {
    constructor(el) {
        super(el);
        this.id = Number(el.dataset.id);
    }
    active() {
        this.el.classList.add("active");
    }
    removeActive() {
        this.el.classList.remove("active");
        this.destroy();
    }
}
