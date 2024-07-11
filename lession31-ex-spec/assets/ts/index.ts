import { FullPage } from "./FullPage.js";

var fullPageEl = document.querySelector("#fullPage") as HTMLElement;
var sideBarEl = document.querySelector(".side-bar") as HTMLElement;

var fullPage = new FullPage(fullPageEl);