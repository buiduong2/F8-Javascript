import { AudioWrapper } from "./AudioWrapper.js";
import { LyricResolver } from "./LyricResolver.js";
import { AudioProgressState, Progress } from "./Progress.js";
window.addEventListener("load", function () {
    var progressEl = document.querySelector(".progress-bar");
    var audioEl = document.querySelector("audio");
    var progressState = new AudioProgressState(audioEl);
    var progress = new Progress(progressEl, audioEl, progressState);
    new AudioWrapper(audioEl);
    new LyricResolver(audioEl);

});
document.addEventListener("DOMContentLoaded", function () {
    var btnShowLyric = document.querySelector(".btn-show-lyric");
    var lyricSectionEl = document.querySelector(".lyric-section");
    var btnCloseLyricSection = document.querySelector(".lyric-section .btn-close");
    btnShowLyric.addEventListener("click", function () {
        lyricSectionEl.classList.add("active");
    });
    btnCloseLyricSection.addEventListener("click", function () {
        lyricSectionEl.classList.remove("active");
    });
});
