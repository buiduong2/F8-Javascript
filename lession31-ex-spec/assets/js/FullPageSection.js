import { Slide } from "./Slide.js";
import { debounce } from "./utils.js";
export class FullPage extends Slide {
    constructor() {
        var el = document.getElementById("fullPage");
        var currentIndex = 0;
        var btnSlideEls = Array.from(document.querySelectorAll(".side-bar .side-bar-item"));
        var innerEl = FullPage.createInnerElement(el);
        el.append(innerEl);
        super(btnSlideEls, innerEl, currentIndex);
        this.el = el;
        this.moute();
    }
    moute() {
        super.moute();
        var _this = this;
        var debouncedChangeSlide = debounce(this.changeSlide.bind(this), this.scrollSpeed);
        this.el.addEventListener("wheel", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.deltaY > 0) {
                debouncedChangeSlide(_this.currentIndex + 1);
            }
            else {
                debouncedChangeSlide(_this.currentIndex - 1);
            }
        });
        document.addEventListener("keyup", function (e) {
            if (e.key == 'ArrowUp') {
                debouncedChangeSlide(_this.currentIndex - 1);
            }
            else if (e.key === 'ArrowDown') {
                debouncedChangeSlide(_this.currentIndex + 1);
            }
        });
    }
    getDragDirection() {
        return "y";
    }
    static createInnerElement(parent) {
        var innerEl = document.createElement("div");
        innerEl.classList.add("fullPage-inner");
        Array.from(parent.childNodes).forEach(function (node) {
            innerEl.append(node);
        });
        return innerEl;
    }
}
