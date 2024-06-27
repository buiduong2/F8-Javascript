import Component from "./Component.js";
export class Tab extends Component {
    constructor(el, tabAction, tabContent) {
        super(el);
        this.tabAction = tabAction;
        this.tabContent = tabContent;
    }
    onTabActionItemChange(tabActionItem) {
        var tabId = tabActionItem.id;
        this.tabContent.changeTabContentItem(tabId);
    }
}
