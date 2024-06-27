import Component from "./Component.js";
export class Modal extends Component {
    constructor(el, flagOpen) {
        super(el);
        this.overlayEl = document.querySelector(".modal-overlay");
        this.contentEl = document.querySelector(".modal-content");
        this.closeBtnEl = document.querySelector(".modal-close-btn");
        this.flagOpen = flagOpen;
        var _this = this;
        Object.defineProperty(this.flagOpen, 'value', {
            set(value) {
                _this.changeOpenFlag(value);
                return value;
            }
        });
    }
    mount() {
        super.mount();
        var _this = this;
        this.closeBtnEl.onclick = function () {
            _this.flagOpen.value = false;
        };
        this.overlayEl.onclick = function () {
            _this.flagOpen.value = false;
        };
    }
    changeOpenFlag(value) {
        if (value) {
            this.el.style.display = "block";
        }
        else {
            this.el.style.display = "none";
            this.destroy();
        }
    }
}
