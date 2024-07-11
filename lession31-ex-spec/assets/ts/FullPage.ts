import { debounce } from "./utils.js";

export class FullPage {
    el: HTMLElement;
    innerEl: HTMLElement;
    currentIndex: number;
    scrollSpeed: number;
    btnSlideEls: HTMLElement[];

    constructor(el: HTMLElement) {
        this.el = el;
        this.innerEl = FullPage.createInnerElement(el);
        this.el.append(this.innerEl);
        this.scrollSpeed = parseFloat(window.getComputedStyle(this.innerEl).transitionDuration) * 1000;
        this.btnSlideEls = Array.from(document.querySelectorAll(".side-bar .side-bar-item"));

        this.currentIndex = 0;
        this.moute();
    }

    moute() {
        var _this = this;

        var debouncedChangeSlide = debounce(this.changeSlide.bind(this), this.scrollSpeed);

        this.btnSlideEls.forEach(function (btn, index) {
            btn.addEventListener("click", function () {
                _this.changeSlide(index);
            })
        })
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
            _this.innerEl.style.transition = "none"
            var initialClientY = e.clientY;
            var handlerDrag = function (e2: MouseEvent) {
                _this.innerEl.style.transform = `translateY(calc(${-_this.currentIndex * 100}vh - ${initialClientY - e2.clientY}px))`;
            }

            var handlerRemoveDrag = function (e2: MouseEvent) {
                _this.innerEl.style.transition = ""
                var step = _this.computeChangeSlide(initialClientY - e2.clientY);
                _this.changeSlide(_this.currentIndex + step);
                document.removeEventListener("mousemove", handlerDrag);
                document.removeEventListener("mouseup", handlerRemoveDrag);
            }

            document.addEventListener("mousemove", handlerDrag);

            document.addEventListener("mouseup", handlerRemoveDrag);
        })
    }

    static createInnerElement(parent: HTMLElement): HTMLElement {
        var innerEl = document.createElement("div");
        innerEl.classList.add("fullPage-inner")
        Array.from(parent.childNodes).forEach(function (node) {
            innerEl.append(node);
        },);

        return innerEl;
    }

    changeSlide(index: number) {
        var totalEle = this.innerEl.childElementCount;
        if (index > totalEle - 1) {
            index = totalEle - 1;
        } else if (index < 0) {
            index = 0;
        }
        this.setStateAfterChangeSlide(index);
        this.innerEl.style.transform = `translateY(${-index * 100}vh)`;
    }

    computeChangeSlide(moveSpace: number): number {
        var viewHeight = window.innerHeight;

        if (moveSpace < 0 && Math.abs(moveSpace) > (viewHeight / 4)) {
            return -1;
        } else if (moveSpace > 0 && Math.abs(moveSpace) > (viewHeight / 4)) {
            return 1;
        } else {
            return 0;
        }
    }

    setStateAfterChangeSlide(index: number) {
        this.btnSlideEls[this.currentIndex].classList.remove('active')
        this.currentIndex = index;
        this.btnSlideEls[this.currentIndex].classList.add('active');

    }
}