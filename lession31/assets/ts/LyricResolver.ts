import { lyric as lyricData } from "./lyricData.js";

export class LyricResolver {
    lyric: Sentences;
    search: Search<Words, number>;
    lyricEl: HTMLElement;
    audioEl: HTMLAudioElement;
    songData: SongData;
    delayChangeLine: number;

    constructor(auditoEl: HTMLAudioElement) {
        this.songData = {
            song: "Let her go",
            singer: "Passenger"
        }
        this.lyric = lyricData.data.sentences.map(function (data) {
            return data.words;
        });
        this.search = new BinarySearchWord();
        this.lyricEl = document.querySelector(".lyric-section .section-content") as HTMLElement;
        this.audioEl = auditoEl;
        this.delayChangeLine = parseFloat(window.getComputedStyle(this.lyricEl.children[0]).transitionDuration) * 1000;
        this.moute();
    }

    moute(): void {

        var sentenceIte = this.sentencesIterator();
        this.displaySongData();
        var currentIndex = 0;
        var showData = false;


        this.audioEl.addEventListener("timeupdate", () => {
            var currentTime = this.audioEl.currentTime * 1000;
            if (sentenceIte.hasNext() && sentenceIte.peekNext()[0].startTime - 1000 < currentTime) {
                if (currentIndex == 0) {
                    this.setDisplayLine(sentenceIte.next(), 0);
                    this.setDisplayLine(sentenceIte.next(), 1);
                    currentIndex += 2;
                } else {
                    this.setDisplayLine(sentenceIte.next(), currentIndex % 2);
                    currentIndex++;
                }


                if (this.isMusicOnlyTime(sentenceIte.peekCur(), sentenceIte.peekNext())) {
                    setTimeout(() => {
                        this.displaySongData();
                        console.log('123')
                        currentIndex = 0;
                    }, 3000);
                }
            }
        })


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
        })

        var animationFrameId: number;

        var animationFrame = () => {

            this.fillColor(this.audioEl.currentTime * 1000);

            animationFrameId = window.requestAnimationFrame(animationFrame);
        }

        this.audioEl.addEventListener("play", () => {
            animationFrame();
        })

        this.audioEl.addEventListener("pause", () => {
            cancelAnimationFrame(animationFrameId);
        })
    }

    fillColor(currentTime: number) {
        Array.from(this.lyricEl.querySelectorAll(".word")).forEach((wordEl) => {
            if (!wordEl.parentElement) {
                return;
            }
            var startTime = Number(wordEl.getAttribute("data-starTime"));
            var endTime = Number(wordEl.getAttribute("data-endTime"));
            if (endTime < currentTime) {
                wordEl.parentElement.style.width = `100%`;
            } else if (startTime <= currentTime && currentTime <= endTime) {
                wordEl.parentElement.style.width = `${(currentTime - startTime) / (endTime - startTime) * 100}%`
            }
        })

    }

    findIndexByTime(time: number): number {
        return this.search.search(this.lyric, time);
    }

    displaySongData(): void {
        this.lyricEl.innerHTML = `
            <p>Ca sĩ: ${this.songData.singer} </p>
            <p>Bài hát: ${this.songData.song}</p> 
        `
    }

    setDisplayLine(words: Words, index: number): void {
        this.lyricEl.children[index].classList.add("removing");

        setTimeout(() => {
            this.lyricEl.children[index].classList.remove("removing");
            this.lyricEl.children[index].innerHTML = this.getWordInnerHTML(words);
            this.fixedWidthWord();
        }, this.delayChangeLine);
    }


    isMusicOnlyTime(cur: Words, next: Words): boolean {
        if (!next) {
            return true;
        }
        return cur[cur.length - 1].endTime + 10000 < next[0].startTime;
    }

    getWordInnerHTML(words: Words): string {
        return words.map(word =>
            `<span class="word-outer">
                ${word.data} 
               <span class="word-middle">
                    <span class="word" data-starTime="${word.startTime}" data-endTime="${word.endTime}">
                        ${word.data}
                    </span>
               </span>
            </span>`).join(" ")
    }

    fixedWidthWord() {
        Array.from(this.lyricEl.querySelectorAll(".word-outer")).forEach((parent) => {
            var width = (parent as HTMLElement).offsetWidth;

            var wordEl = parent.querySelector(".word") as HTMLElement;
            wordEl.style.width = width + 1 + "px";
        })
    }

    sentencesIterator(): SentencesIterator {
        return new SentencesIterator(this.lyric);
    }

    wordsIterator(words: Words): WordIterator {
        return new WordIterator(words);
    }


}

abstract class IteratorConcrete<T> implements Iterator<T> {

    abstract currentIndex: number;
    abstract arr: T[];

    hasNext(): boolean {
        return this.currentIndex + 1 < this.arr.length
    }

    peekNext(): T {
        return this.arr[this.currentIndex + 1];
    }

    next(): T {
        this.currentIndex++;
        return this.arr[this.currentIndex];
    }

    peekCur(): T {
        return this.arr[this.currentIndex];
    }

    getIndex(): number {
        return this.currentIndex;
    }

    setIndex(index: number): T {
        this.currentIndex = index;
        return this.arr[this.currentIndex];
    }
}

class WordIterator extends IteratorConcrete<Word> {

    currentIndex: number;
    arr: Words;

    constructor(words: Words) {
        super();
        this.currentIndex = 0;
        this.arr = words;
    }

}

class SentencesIterator extends IteratorConcrete<Words> {
    arr: Sentences;
    currentIndex: number;

    constructor(wordss: Sentences) {
        super();
        this.arr = wordss;
        this.currentIndex = -1;
    }
}

export class BinarySearch<A, T> implements Search<A, T> {

    compare: (o1: A, o2: T) => number;


    constructor(compare: (o1: A, o2: T) => number) {
        this.compare = compare;
    }


    search(arr: A[], t: T): number {
        if (arr.length === 0) {
            return -1;
        }

        var l = 0;
        var r = arr.length - 1;
        while (l < r) {
            var m = Math.floor((l + r) / 2);
            var compareVal: number = this.compare(arr[m], t);
            if (compareVal === 0) {
                r = m;
            } else if (compareVal < 0) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }
        return l;
    }
}

export class BinarySearchWord extends BinarySearch<Words, number> {
    constructor() {
        var comapre = function (word: Words, currentTime: number): number {
            var starTime = word[0].startTime;
            var endTime = word[word.length - 1].endTime;
            if (starTime <= currentTime && currentTime <= endTime) {
                return 0;
            } else {
                return currentTime - starTime;
            }
        }

        super(comapre);
    }
}

interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
    setIndex(index: number): void;
    getIndex(): number;

}

interface Search<A, T> {
    search(arr: A[], t: T): number;
}

type Sentences = Words[]

type Words = Word[]

type Word = {
    startTime: number,
    endTime: number,
    data: string
}

type SongData = {
    song: string,
    singer: string;

}