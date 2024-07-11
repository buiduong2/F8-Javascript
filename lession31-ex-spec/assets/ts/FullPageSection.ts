import { Slide } from "./Slide.js";
import { debounce } from "./utils.js";

export class FullPage extends Slide {

    el: HTMLElement;
    scrollSpeed: number;

    constructor() {
        var el = document.getElementById("fullPage") as HTMLElement;
        var currentIndex = 0;
        var btnSlideEls = Array.from(document.querySelectorAll(".side-bar .side-bar-item")) as HTMLElement[];
        var innerEl = FullPage.createInnerElement(el);
        super(btnSlideEls, innerEl, currentIndex);

        this.el = el;
        this.el.append(this.innerEl);
        this.scrollSpeed = parseFloat(window.getComputedStyle(this.innerEl).transitionDuration) * 1000;

        this.moute();
    }

    moute() {
        var _this = this;
        Array.from(this.innerEl.children).forEach(function (child, index) {
            child.setAttribute("tabindex", String(index));
        })

        var debouncedChangeSlide = debounce(this.changeSlide.bind(this), this.scrollSpeed);

        this.el.addEventListener("wheel", function (e: WheelEvent) {
            e.preventDefault()
            e.stopPropagation();
            if (e.deltaY > 0) {
                debouncedChangeSlide(_this.currentIndex + 1);
            } else {
                debouncedChangeSlide(_this.currentIndex - 1);
            }
        });

        document.addEventListener("keyup", function (e) {
            if (e.key == 'ArrowUp') {
                debouncedChangeSlide(_this.currentIndex - 1);
            } else if (e.key === 'ArrowDown') {
                debouncedChangeSlide(_this.currentIndex + 1);
            }
        })

        this.innerEl.addEventListener("mousedown", function (e) {
            _this.innerEl.classList.add("dragging")
            var initialClientY = e.clientY;
            var handlerDrag = function (e2: MouseEvent) {
                _this.innerEl.style.transform = `translateY(calc(${-_this.currentIndex * 100}vh - ${initialClientY - e2.clientY}px))`;
            }

            var handlerRemoveDrag = function (e2: MouseEvent) {
                _this.innerEl.classList.remove("dragging");
                var step = _this.computeChangeSlide(initialClientY - e2.clientY);
                _this.changeSlide(_this.currentIndex + step);
                document.removeEventListener("mousemove", handlerDrag);
                document.removeEventListener("mouseup", handlerRemoveDrag);
            }

            document.addEventListener("mousemove", handlerDrag);

            document.addEventListener("mouseup", handlerRemoveDrag);
        })
    }

    setInnerStyleWhenSlideChange(index: number): void {
        this.innerEl.style.transform = `translateY(${-index * 100}vh)`;
    }

    static createInnerElement(parent: HTMLElement): HTMLElement {
        var innerEl = document.createElement("div");
        innerEl.classList.add("fullPage-inner")
        Array.from(parent.childNodes).forEach(function (node) {
            innerEl.append(node);
        },);

        return innerEl;
    }

}
