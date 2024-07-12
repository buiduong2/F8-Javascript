import { Slide } from "./Slide.js";
import { debounce } from "./utils.js";
export class FullPageSlide extends Slide {
    constructor(parentEl) {
        super([], document.createElement("div"), 0);
        this.innerEl = document.createElement("div");
        this.parentEl = parentEl;
        this.btnNextEl = document.createElement("button");
        this.btnPrevEl = document.createElement("button");
        console.log(this.scrollSpeed);
        this.moute();
    }
    moute() {
        var slideEls = Array.from(this.parentEl.querySelectorAll(".slide"));
        var slideWrapper = document.createElement("div");
        var btnWrapperEl = document.createElement("ul");
        var actionWrapperEl = document.createElement("div");
        this.btnSlideEls = this.createBtnEls(slideEls.length);
        this.btnSlideEls[0].classList.add("active");
        slideWrapper.classList.add("slide-wrapper");
        this.innerEl.classList.add("slide-inner");
        btnWrapperEl.classList.add("slide-bar");
        actionWrapperEl.classList.add("slide-btn-list");
        this.btnNextEl.className = "btn btn--next";
        this.btnPrevEl.className = "btn btn--prev";
        this.btnNextEl.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        this.btnPrevEl.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        this.parentEl.append(slideWrapper);
        slideWrapper.append(this.innerEl, btnWrapperEl, actionWrapperEl);
        btnWrapperEl.append(...this.btnSlideEls);
        actionWrapperEl.append(this.btnPrevEl, this.btnNextEl);
        this.innerEl.append(...slideEls);
        //ADd event
        super.moute();
        var _this = this;
        var debouncedChangeSlide = debounce(this.changeSlide.bind(this), this.scrollSpeed);
        document.addEventListener("keyup", function (e) {
            if (_this.parentEl.classList.contains("active")) {
                if (e.key == 'ArrowLeft') {
                    debouncedChangeSlide(_this.currentIndex - 1);
                }
                else if (e.key === 'ArrowRight') {
                    debouncedChangeSlide(_this.currentIndex + 1);
                }
            }
        });
        this.btnNextEl.addEventListener("click", function () {
            debouncedChangeSlide(_this.currentIndex + 1);
        });
        this.btnPrevEl.addEventListener("click", function () {
            debouncedChangeSlide(_this.currentIndex - 1);
        });
    }
    getDragDirection() {
        return "x";
    }
    createBtnEls(length) {
        var btnEls = new Array(length)
            .fill(null)
            .map(function () {
            var el = document.createElement("li");
            el.classList.add("slide-bar-item");
            el.innerHTML = '<i class="fa-solid fa-circle"></i>';
            return el;
        });
        return btnEls;
    }
}
