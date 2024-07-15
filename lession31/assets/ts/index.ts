import { AudioWrapper } from "./AudioWrapper.js";
import { LyricResolver } from "./LyricResolver.js";
import { AudioProgressState, Progress } from "./Progress.js";

window.addEventListener("load", function () {
    var progressEl = document.querySelector(".progress-bar") as HTMLElement;
    var audioEl = document.querySelector("audio") as HTMLAudioElement;
    var progressState = new AudioProgressState(audioEl);
    new Progress(progressEl, audioEl, progressState);
    new AudioWrapper(audioEl);
    new LyricResolver(audioEl);
})


document.addEventListener("DOMContentLoaded", function () {
    var btnShowLyric = document.querySelector(".btn-show-lyric") as HTMLElement;
    var lyricSectionEl = document.querySelector(".lyric-section") as HTMLElement;
    var btnCloseLyricSection = document.querySelector(".lyric-section .btn-close") as HTMLElement;
    btnShowLyric.addEventListener("click", function () {
        lyricSectionEl.classList.add("active");
    })

    btnCloseLyricSection.addEventListener("click", function () {
        lyricSectionEl.classList.remove("active");
    })
})