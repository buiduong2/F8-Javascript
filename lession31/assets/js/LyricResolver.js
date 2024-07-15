import { lyric } from "./lyricData.js";
export class LyricResolver {
    constructor(auditoEl) {
        this.songData = {
            song: "Let her go",
            singer: "Passenger"
        };
        this.lyric = [[]];
        this.search = new BinarySearchWord();
        this.parentEl = document.querySelector(".lyric-section .section-content");
        this.audioEl = auditoEl;
        this.moute();
    }
    moute() {
        this.lyric = this.chunkWords(2, lyric);
        ;
        var ite = this.iterator();
        var _this = this;
        var next = ite.next();
        this.audioEl.addEventListener("timeupdate", function () {
            var curentTime = _this.audioEl.currentTime * 1000;
            if (next && next[0].getStartTime() < curentTime) {
                _this.parentEl.innerHTML = _this.getLyricHTML(next);
                next = ite.next();
            }
        });
        this.audioEl.addEventListener("seeked", function () {
            var index = _this.findIndexByTime(this.currentTime * 1000);
            var cur = ite.setIndex(Math.max(index - 1, 0));
            _this.parentEl.innerHTML = _this.getLyricHTML(cur);
            next = ite.next();
        });
    }
    getLyricHTML(wordss) {
        return wordss.map(function (words) {
            return "<p>" + words.toTextContent() + "</p>";
        }).join(" ");
    }
    findIndexByTime(time) {
        return this.search.search(this.lyric, time);
    }
    isMusicOnelyTime(interval) {
        return interval > 10000;
    }
    isPhraseBreak(interval) {
        return interval > 2000;
    }
    chunkWords(size, lyric) {
        var firstWords = lyric.data.sentences[0].words;
        var firstData = this.createMusicOnlyWords(0, firstWords[firstWords.length - 1].endTime);
        var last = firstData[firstData.length - 1];
        var currentItems = [];
        var newData = [firstData, currentItems];
        var count = 0;
        for (const ws of lyric.data.sentences) {
            var cur = new Words(ws);
            count++;
            var interval = last.getTimeBetweenOtherBegin(cur);
            var needCreateNewArr = false;
            if (this.isMusicOnelyTime(interval)) {
                var songData = this.createMusicOnlyWords(last.getEndTime(), cur.getStartTime());
                newData.push(songData);
                needCreateNewArr = true;
            }
            else if (count > size || this.isPhraseBreak(interval)) {
                needCreateNewArr = true;
            }
            if (needCreateNewArr) {
                needCreateNewArr = false;
                currentItems = [cur];
                newData.push(currentItems);
                count = 1;
            }
            else {
                currentItems.push(cur);
            }
            last = cur;
        }
        if (this.isMusicOnelyTime(this.audioEl.duration * 1000 - last.getEndTime())) {
            newData.push(this.createMusicOnlyWords(last.getEndTime(), this.audioEl.duration * 1000));
        }
        return newData;
    }
    createMusicOnlyWords(startTime, endTime) {
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
        ];
    }
    iterator() {
        return new LyricResolverIterator(this.lyric);
    }
}
export class Words {
    constructor(words) {
        this.words = words;
    }
    getStartTime() {
        return this.words.words[0].startTime;
    }
    getEndTime() {
        return this.words.words[this.words.words.length - 1].endTime;
    }
    getTimeBetweenOtherBegin(other) {
        return Math.abs(this.getEndTime() - other.getStartTime());
    }
    toTextContent() {
        return this.words.words.map(function (word) {
            return word.data;
        }).join(" ");
    }
}
class LyricResolverIterator {
    constructor(wordss) {
        this.wordss = wordss;
        this.currentIndex = -1;
    }
    hasNext() {
        return this.currentIndex + 1 < this.wordss.length;
    }
    next() {
        this.currentIndex++;
        return this.wordss[this.currentIndex];
    }
    setIndex(index) {
        this.currentIndex = index;
        return this.wordss[this.currentIndex];
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
        var func = function (wordss) {
            return wordss[0].getStartTime();
        };
        super(comapre, func);
    }
}
