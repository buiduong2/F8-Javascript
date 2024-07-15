import { AudioWrapper } from "./AudioWrapper.js";
import { Progress, AudioProgressState } from "./Progress.js";
import { BinarySearch, LyricResolver } from "./LyricResolver.js";
window.addEventListener("load", function () {
    var progressEl = document.querySelector(".progress-bar");
    var audioEl = document.querySelector("audio");
    var progressState = new AudioProgressState(audioEl);
    var progress = new Progress(progressEl, audioEl.duration, audioEl.currentTime, progressState);
    new AudioWrapper(audioEl);
    new LyricResolver(audioEl);
    audioEl.addEventListener("timeupdate", function () {
        progress.changeCurrentTime(audioEl.currentTime);
    });
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
var binarySearch = new BinarySearch((o1, o2) => o1 - o2, o => o);
