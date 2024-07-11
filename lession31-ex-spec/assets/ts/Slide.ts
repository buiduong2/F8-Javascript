export abstract class Slide {

    btnSlideEls: HTMLElement[];
    innerEl: HTMLElement;
    currentIndex: number;

    constructor(btnSlideEls: HTMLElement[], innerEL: HTMLElement, currentIndex: number) {
        this.btnSlideEls = btnSlideEls;
        this.innerEl = innerEL;
        this.currentIndex = currentIndex;
    }

    abstract setInnerStyleWhenSlideChange(index: number): void;


    moute(...args: any) {
        var _this = this;
        this.btnSlideEls.forEach(function (btn, index) {
            btn.addEventListener("click", function () {
                _this.changeSlide(index);
            })
        })
    }

    changeSlide(index: number) {
        var totalEle = this.innerEl.childElementCount;
        if (index > totalEle - 1) {
            index = totalEle - 1;
        } else if (index < 0) {
            index = 0;
        }
        this.setStateAfterChangeSlide(index);
        this.setInnerStyleWhenSlideChange(index);
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
        this.btnSlideEls[this.currentIndex].classList.remove('active');
        this.innerEl.children[this.currentIndex].classList.remove("active");
        (this.innerEl.children[this.currentIndex] as HTMLElement).blur();

        this.currentIndex = index;
        this.btnSlideEls[this.currentIndex].classList.add('active');
        this.innerEl.children[this.currentIndex].classList.add("active");
        (this.innerEl.children[this.currentIndex] as HTMLElement).focus();
    }
}