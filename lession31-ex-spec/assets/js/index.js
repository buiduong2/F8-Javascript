import { FullPage } from "./FullPageSection.js";
import { FullPageSlide } from "./FullPageSlide.js";
var slideParents = Array.from(document.querySelectorAll(".section")).filter(function (el) {
    return Array.from(el.children).every(function (child) {
        return child.classList.contains("slide");
    });
});
slideParents.forEach(function (parent) {
    new FullPageSlide(parent);
});
new FullPage();
