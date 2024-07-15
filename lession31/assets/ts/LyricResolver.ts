import { lyric } from "./lyricData.js";

export class LyricResolver {
    lyric: Words[][];
    search: Search<Words[], number>;
    parentEl: HTMLElement;
    audioEl: HTMLAudioElement;
    songData: SongData;

    constructor(auditoEl: HTMLAudioElement) {
        this.songData = {
            song: "Let her go",
            singer: "Passenger"
        }
        this.lyric = [[]];
        this.search = new BinarySearchWord();
        this.parentEl = document.querySelector(".lyric-section .section-content") as HTMLElement;
        this.audioEl = auditoEl;
        this.moute();
    }

    moute(): void {
        this.lyric = this.chunkWords(2, lyric);;

        var ite = this.iterator();

        var _this = this;
        var next: Words[] = ite.next();
        this.audioEl.addEventListener("timeupdate", function () {
            var curentTime = _this.audioEl.currentTime * 1000;
            if (next && next[0].getStartTime() < curentTime) {
                _this.parentEl.innerHTML = _this.getLyricHTML(next)
                next = ite.next();
            }
        })


        this.audioEl.addEventListener("seeked", function () {
            var index = _this.findIndexByTime(this.currentTime * 1000);
            var cur = ite.setIndex(Math.max(index - 1, 0));
            _this.parentEl.innerHTML = _this.getLyricHTML(cur)
            next = ite.next();
        })
    }

    getLyricHTML(wordss: Words[]) {
        return wordss.map(function (words) {
            return "<p>" + words.toTextContent() + "</p>"
        }).join(" ")
    }

    findIndexByTime(time: number): number {
        return this.search.search(this.lyric, time);
    }

    isMusicOnlyTime(interval: number): boolean {
        return interval > 10000;
    }

    isPhraseBreak(interval: number): boolean {
        return interval > 2000;
    }

    chunkWords(size: number, lyric: any): Words[][] {
        var firstWords = lyric.data.sentences[0].words;
        var firstData: Words[] = this.createMusicOnlyWords(0, firstWords[firstWords.length - 1].endTime);
        var last = firstData[firstData.length - 1];

        var currentItems: Words[] = [];
        var newData: Words[][] = [firstData, currentItems];
        var count = 0;
        for (const ws of lyric.data.sentences) {
            var cur = new Words(ws);
            count++;
            var interval = last.getTimeBetweenOtherBegin(cur);
            var needCreateNewArr = false;

            if (this.isMusicOnlyTime(interval)) {
                var songData = this.createMusicOnlyWords(last.getEndTime(), cur.getStartTime());
                newData.push(songData);
                needCreateNewArr = true;
            } else if (count > size || this.isPhraseBreak(interval)) {
                needCreateNewArr = true;
            }

            if (needCreateNewArr) {
                needCreateNewArr = false;
                currentItems = [cur];
                newData.push(currentItems);
                count = 1;
            } else {
                currentItems.push(cur)
            }
            last = cur;

        }

        if (this.isMusicOnlyTime(this.audioEl.duration * 1000 - last.getEndTime())) {
            newData.push(this.createMusicOnlyWords(last.getEndTime(), this.audioEl.duration * 1000));
        }

        return newData;
    }

    createMusicOnlyWords(startTime: number, endTime: number): Words[] {
        return [
            new Words({
                words: [{
                    startTime: startTime,
                    endTime: endTime,
                    data: `Bài Hát: ${this.songData.song}`
                }]
            }),
            new Words({
                words: [{
                    startTime: startTime,
                    endTime: endTime,
                    data: `Ca sĩ: ${this.songData.singer}`
                }]
            })
        ]
    }

    iterator() {
        return new LyricResolverIterator(this.lyric);
    }
}

export class Words {

    words: WordsType;

    constructor(words: WordsType) {
        this.words = words;
    }

    getStartTime(): number {
        return this.words.words[0].startTime;
    }

    getEndTime(): number {
        return this.words.words[this.words.words.length - 1].endTime;
    }

    getTimeBetweenOtherBegin(other: Words): number {
        return Math.abs(this.getEndTime() - other.getStartTime());
    }

    toTextContent(): string {
        return this.words.words.map(function (word) {
            return word.data;
        }).join(" ");
    }
}

class LyricResolverIterator implements Iterator<Words[]> {
    wordss: Words[][];
    currentIndex: number;

    constructor(wordss: Words[][]) {
        this.wordss = wordss;
        this.currentIndex = -1;
    }
    hasNext(): boolean {
        return this.currentIndex + 1 < this.wordss.length
    }
    next(): Words[] {
        this.currentIndex++;
        return this.wordss[this.currentIndex];
    }
    setIndex(index: number): Words[] {
        this.currentIndex = index;
        return this.wordss[this.currentIndex];
    }
}



export class BinarySearch<A, T> implements Search<A, T> {

    compare: (o1: T, o2: T) => number;
    func: (a: A) => T;


    constructor(compare: (o1: T, o2: T) => number, func: (a: A) => T) {
        this.compare = compare;
        this.func = func;
    }


    search(arr: A[], t: T): number {
        if (arr.length === 0) {
            return -1;
        }

        var l = 0;
        var r = arr.length - 1;
        while (l < r) {
            var m = Math.floor((l + r) / 2);
            var compareVal: number = this.compare(this.func(arr[m]), t);
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

export class BinarySearchWord extends BinarySearch<Words[], number> {
    constructor() {
        var comapre = function (o1: number, o2: number) {
            return o1 - o2;
        }
        var func = function (wordss: Words[]): number {
            return wordss[0].getStartTime();
        }

        super(comapre, func);
    }
}

interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
    setIndex(index: number): void;

}

interface Search<A, T> {
    search(arr: A[], t: T): number;
}

type Sentences = {
    sentences: WordsType[]
}

export type WordsType = {
    words: Word[]
}
type Word = {
    startTime: number,
    endTime: number,
    data: string
}

type SongData = {
    song: string,
    singer: string;

}