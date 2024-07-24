import { lyric as lyricData } from "./lyricData.js";
export class LyricResolver {
    constructor(auditoEl) {
        this.songData = {
            song: "Let her go",
            singer: "Passenger"
        };
        this.lyric = lyricData.data.sentences.map(function (data) {
            return data.words;
        });
        this.search = new BinarySearchWord();
        this.lyricEl = document.querySelector(".lyric-section .section-content");
        this.audioEl = auditoEl;
        this.delayChangeLine = parseFloat(window.getComputedStyle(this.lyricEl.children[0]).transitionDuration) * 1000;
        this.moute();
    }
    moute() {
        var sentenceIte = this.sentencesIterator();
        this.displaySongData();
        var currentIndex = 0;
        this.audioEl.addEventListener("timeupdate", () => {
            var currentTime = this.audioEl.currentTime * 1000;
            if (sentenceIte.hasNext() && sentenceIte.peekNext()[0].startTime - 1000 < currentTime) {
                if (currentIndex == 0) {
                    this.setDisplayLine(sentenceIte.next(), 0);
                    this.setDisplayLine(sentenceIte.next(), 1);
                    currentIndex += 2;
                }
                else {
                    this.setDisplayLine(sentenceIte.next(), currentIndex % 2);
                    currentIndex++;
                }
                if (this.isMusicOnlyTime(sentenceIte.peekCur(), sentenceIte.peekNext())) {
                    setTimeout(() => {
                        this.displaySongData();
                        currentIndex = 0;
                    }, 3000);
                }
            }
        });
        this.audioEl.addEventListener("seeked", () => {
            var currentTime = this.audioEl.currentTime * 1000;
            var index = this.search.search(this.lyric, currentTime);
            var cur = sentenceIte.setIndex(index);
            if (cur[0].startTime >= currentTime) {
                sentenceIte.setIndex(index - 1);
            }
            this.setDisplayLine(sentenceIte.next(), 0);
            this.setDisplayLine(sentenceIte.next(), 1);
            currentIndex = 2;
            this.fillColor(currentTime);
        });
        var animationFrameId;
        var animationFrame = () => {
            this.fillColor(this.audioEl.currentTime * 1000);
            animationFrameId = window.requestAnimationFrame(animationFrame);
        };
        this.audioEl.addEventListener("play", () => {
            animationFrame();
        });
        this.audioEl.addEventListener("pause", () => {
            cancelAnimationFrame(animationFrameId);
        });
    }
    fillColor(currentTime) {
        Array.from(this.lyricEl.querySelectorAll(".word")).forEach((wordEl) => {
            if (!wordEl.parentElement) {
                return;
            }
            var startTime = Number(wordEl.getAttribute("data-starTime"));
            var endTime = Number(wordEl.getAttribute("data-endTime"));
            if (endTime < currentTime) {
                wordEl.parentElement.style.width = `100%`;
            }
            else if (startTime <= currentTime && currentTime <= endTime) {
                wordEl.parentElement.style.width = `${(currentTime - startTime) / (endTime - startTime) * 100}%`;
            }
        });
    }
    findIndexByTime(time) {
        return this.search.search(this.lyric, time);
    }
    displaySongData() {
        this.lyricEl.innerHTML = `
            <p>Ca sĩ: ${this.songData.singer} </p>
            <p>Bài hát: ${this.songData.song}</p> 
        `;
    }
    setDisplayLine(words, index) {
        this.lyricEl.children[index].classList.add("removing");
        setTimeout(() => {
            this.lyricEl.children[index].classList.remove("removing");
            this.lyricEl.children[index].innerHTML = this.getWordInnerHTML(words);
            this.fixedWidthWord();
        }, this.delayChangeLine);
    }
    isMusicOnlyTime(cur, next) {
        if (!next) {
            return true;
        }
        return cur[cur.length - 1].endTime + 10000 < next[0].startTime;
    }
    getWordInnerHTML(words) {
        return words.map(word => `<span class="word-outer">
                ${word.data} 
               <span class="word-middle">
                    <span class="word" data-starTime="${word.startTime}" data-endTime="${word.endTime}">
                        ${word.data}
                    </span>
               </span>
            </span>`).join(" ");
    }
    fixedWidthWord() {
        Array.from(this.lyricEl.querySelectorAll(".word-outer")).forEach((parent) => {
            var width = parent.offsetWidth;
            var wordEl = parent.querySelector(".word");
            wordEl.style.width = width + 1 + "px";
        });
    }
    sentencesIterator() {
        return new SentencesIterator(this.lyric);
    }
    wordsIterator(words) {
        return new WordIterator(words);
    }
}
class IteratorConcrete {
    hasNext() {
        return this.currentIndex + 1 < this.arr.length;
    }
    peekNext() {
        return this.arr[this.currentIndex + 1];
    }
    next() {
        this.currentIndex++;
        return this.arr[this.currentIndex];
    }
    peekCur() {
        return this.arr[this.currentIndex];
    }
    getIndex() {
        return this.currentIndex;
    }
    setIndex(index) {
        this.currentIndex = index;
        return this.arr[this.currentIndex];
    }
}
class WordIterator extends IteratorConcrete {
    constructor(words) {
        super();
        this.currentIndex = 0;
        this.arr = words;
    }
}
class SentencesIterator extends IteratorConcrete {
    constructor(wordss) {
        super();
        this.arr = wordss;
        this.currentIndex = -1;
    }
}
export class BinarySearch {
    constructor(compare, func) {
        this.compare = compare;
        this.func = func;
    }
    search(arr, t) {
        if (arr.length === 0) {
            return -1;
        }
        var l = 0;
        var r = arr.length - 1;
        while (l < r) {
            var m = Math.floor((l + r) / 2);
            var compareVal = this.compare(this.func(arr[m]), t);
            if (compareVal === 0) {
                r = m;
            }
            else if (compareVal < 0) {
                l = m + 1;
            }
            else {
                r = m - 1;
            }
        }
        return l;
    }
}
export class BinarySearchWord extends BinarySearch {
    constructor() {
        var comapre = function (o1, o2) {
            return o1 - o2;
        };
        var func = function (words) {
            return words[0].startTime;
        };
        super(comapre, func);
    }
}
