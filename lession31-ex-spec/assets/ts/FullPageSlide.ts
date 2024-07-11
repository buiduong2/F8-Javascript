import { Slide } from "./Slide.js";

export class FullPageSlide extends Slide {

    innerEl: HTMLElement;

    constructor(parentEl: HTMLElement) {
        super([], document.createElement("div"), 0);
        this.innerEl = document.createElement("div");
        this.moute(parentEl);
    }
    moute(parentEl: HTMLElement) {
   
        var slideEls = Array.from(parentEl.querySelectorAll(".slide"));
        var slideWrapper = document.createElement("div");
        var btnWrapperEl = document.createElement("ul");
        this.btnSlideEls = this.createBtnEls(slideEls.length);

        this.btnSlideEls[0].classList.add("active")
        slideWrapper.classList.add("slide-wrapper");
        this.innerEl.classList.add("slide-inner");
        btnWrapperEl.classList.add("slide-bar");

        parentEl.append(slideWrapper);
        slideWrapper.append(this.innerEl, btnWrapperEl);
        btnWrapperEl.append(...this.btnSlideEls);
        this.innerEl.append(...slideEls);


        //ADd event
        super.moute();
    }

    createBtnEls(length: number): HTMLElement[] {
        var btnEls = new Array(length)
            .fill(null)
            .map(function () {
                var el = document.createElement("li");
                el.classList.add("slide-bar-item")
                el.innerHTML = '<i class="fa-solid fa-circle"></i>'
                return el;
            });


        return btnEls;
    }

    setInnerStyleWhenSlideChange(index: number): void {
        this.innerEl.style.transform = `translateX(${-index * 100}vh)`;
    }
}