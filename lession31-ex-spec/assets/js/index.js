import { FullPage } from "./FullPageSection.js";
import { FullPageSlide } from "./FullPageSlide.js";
var fullPageEl = document.querySelector("#fullPage");
var sideBarEl = document.querySelector(".side-bar");
var slideParent = Array.from(document.querySelectorAll(".section")).find(function (el) {
    return Array.from(el.children).every(function (child) {
        return child.classList.contains("slide");
    });
});
if (slideParent) {
    var slide = new FullPageSlide(slideParent);
}
var fullPage = new FullPage();
