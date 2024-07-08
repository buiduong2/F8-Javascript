"use strict";
var carouselInnerEl = document.querySelector(".carousel .carousel-inner");
var slideItemEls = document.querySelectorAll(".carousel .item");
var nextBtnEl = document.querySelector(".carousel .carousel-nav .next");
var prevBtnEl = document.querySelector(".carousel .carousel-nav .prev");
var carouselBtnListEl = document.querySelector(".carousel .carousel-button-list");
var itemCount = slideItemEls.length;
var clientWidth = carouselInnerEl.clientWidth;
carouselBtnListEl.innerHTML = '<button class="btn"></button>'.repeat(itemCount);
var itemDatas = Array.from(carouselInnerEl.children)
    .map(function (item, index) {
    return {
        id: index,
        el: item,
        translateX: clientWidth * index * -1
    };
});
var slideBtns = Array.from(carouselBtnListEl.children)
    .map(function (btn, index) {
    return {
        id: index,
        el: btn
    };
});
var currentIndex = 0;
setActiveState();
function setActiveState() {
    slideBtns[currentIndex].el.classList.toggle("active");
    carouselInnerEl.style.translate = itemDatas[currentIndex].translateX + "px";
    if (currentIndex === 0) {
        prevBtnEl.disabled = true;
    }
    else if (currentIndex === itemCount - 1) {
        nextBtnEl.disabled = true;
    }
    else {
        prevBtnEl.disabled = false;
        nextBtnEl.disabled = false;
    }
}
function removeActiveState() {
    slideBtns[currentIndex].el.classList.remove("active");
}
function changeSlide(index, force) {
    if (index === currentIndex && !force)
        return;
    if (index < 0) {
        index = 0;
    }
    else if (index >= itemCount) {
        index = itemCount - 1;
    }
    removeActiveState();
    currentIndex = index;
    setActiveState();
}
nextBtnEl.onclick = function () {
    changeSlide(currentIndex + 1);
};
prevBtnEl.onclick = function () {
    changeSlide(currentIndex - 1);
};
slideBtns.forEach(function (btn, index) {
    btn.el.onclick = function () {
        changeSlide(index);
    };
});
carouselInnerEl.onmousedown = function (mouseDwEv) {
    mouseDwEv.preventDefault();
    addDragCssCarouselInner();
    var currentTranslateX = itemDatas[currentIndex].translateX;
    var offsetXMouseDown = mouseDwEv.offsetX;
    carouselInnerEl.onmousemove = function (mouseMoveEv) {
        mouseMoveEv.preventDefault();
        carouselInnerEl.style.translate = (offsetXMouseDown - mouseMoveEv.clientX) * -1 + currentTranslateX + "px";
    };
    document.onmouseup = function (mouseUpEv) {
        removeDragCssCarouselInner();
        carouselInnerEl.onmousemove = null;
        var space = mouseDwEv.clientX - mouseUpEv.clientX;
        if (Math.abs(space) > clientWidth / 3) {
            if (space < 0) {
                changeSlide(currentIndex - 1);
            }
            else {
                changeSlide(currentIndex + 1);
            }
        }
        else {
            changeSlide(currentIndex, true);
        }
        document.onmouseup = null;
    };
};
function addDragCssCarouselInner() {
    var css = {
        cusor: "all-scroll",
        transition: "none"
    };
    Object.assign(carouselInnerEl.style, css);
}
function removeDragCssCarouselInner() {
    var css = {
        cusor: null,
        transition: null
    };
    Object.assign(carouselInnerEl.style, css);
}
