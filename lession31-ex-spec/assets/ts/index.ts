import { FullPage } from "./FullPageSection.js";
import { FullPageSlide } from "./FullPageSlide.js";

var fullPageEl = document.querySelector("#fullPage") as HTMLElement;
var sideBarEl = document.querySelector(".side-bar") as HTMLElement;
var slideParents = Array.from(document.querySelectorAll(".section")).filter(function (el) {
    return Array.from(el.children).every(function (child) {
        return child.classList.contains("slide");
    })
}) as HTMLElement[];

slideParents.forEach(function (parent) {
    new FullPageSlide(parent);
})

var fullPage = new FullPage();