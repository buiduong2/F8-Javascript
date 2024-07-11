import { FullPage } from "./FullPageSection.js";
import { FullPageSlide } from "./FullPageSlide.js";

var fullPageEl = document.querySelector("#fullPage") as HTMLElement;
var sideBarEl = document.querySelector(".side-bar") as HTMLElement;
var slideParent = Array.from(document.querySelectorAll(".section")).find(function (el) {
    return Array.from(el.children).every(function (child) {
        return child.classList.contains("slide");
    })
}) as HTMLElement;
if (slideParent) {
    var slide = new FullPageSlide(slideParent);
}
var fullPage = new FullPage();