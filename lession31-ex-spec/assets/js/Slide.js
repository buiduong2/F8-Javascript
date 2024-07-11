export class Slide {
    constructor(btnSlideEls, innerEL, currentIndex) {
        this.btnSlideEls = btnSlideEls;
        this.innerEl = innerEL;
        this.currentIndex = currentIndex;
    }
    moute(...args) {
        var _this = this;
        this.btnSlideEls.forEach(function (btn, index) {
            btn.addEventListener("click", function () {
                _this.changeSlide(index);
            });
        });
    }
    changeSlide(index) {
        var totalEle = this.innerEl.childElementCount;
        if (index > totalEle - 1) {
            index = totalEle - 1;
        }
        else if (index < 0) {
            index = 0;
        }
        this.setStateAfterChangeSlide(index);
        this.setInnerStyleWhenSlideChange(index);
    }
    computeChangeSlide(moveSpace) {
        var viewHeight = window.innerHeight;
        if (moveSpace < 0 && Math.abs(moveSpace) > (viewHeight / 4)) {
            return -1;
        }
        else if (moveSpace > 0 && Math.abs(moveSpace) > (viewHeight / 4)) {
            return 1;
        }
        else {
            return 0;
        }
    }
    setStateAfterChangeSlide(index) {
        this.btnSlideEls[this.currentIndex].classList.remove('active');
        this.innerEl.children[this.currentIndex].classList.remove("active");
        this.innerEl.children[this.currentIndex].blur();
        this.currentIndex = index;
        this.btnSlideEls[this.currentIndex].classList.add('active');
        this.innerEl.children[this.currentIndex].classList.add("active");
        this.innerEl.children[this.currentIndex].focus();
    }
}
