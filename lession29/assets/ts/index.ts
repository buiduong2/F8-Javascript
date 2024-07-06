import { Progress } from "./Progress.js";

var progressEl = document.querySelector(".progress-bar") as HTMLElement;
var progress = new Progress(progressEl, 200, 50);

