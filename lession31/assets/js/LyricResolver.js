import { lyric } from './lyricData.js'
export function LyricResolver(auditoEl) {
	this.songData = {
		song: 'Let her go',
		singer: 'Passenger'
	}
	this.lyric = [[]]
	this.search = new BinarySearchWord()
	this.parentEl = document.querySelector('.lyric-section .section-content')
	this.audioEl = auditoEl
	this.moute()
}
LyricResolver.prototype.moute = function () {
	this.lyric = this.chunkWords(2, lyric)
	var ite = this.iterator()
	var _this = this
	var next = ite.next()
	this.audioEl.addEventListener('timeupdate', function () {
		var curentTime = _this.audioEl.currentTime * 1000
		if (next && next[0].getStartTime() < curentTime) {
			_this.parentEl.innerHTML = _this.getLyricHTML(next)
			next = ite.next()
		}
	})
	this.audioEl.addEventListener('seeked', function () {
		var index = _this.findIndexByTime(this.currentTime * 1000)
		var cur = ite.setIndex(Math.max(index - 1, 0))
		_this.parentEl.innerHTML = _this.getLyricHTML(cur)
		next = ite.next()
	})
}
LyricResolver.prototype.getLyricHTML = function (wordss) {
	return wordss
		.map(function (words) {
			return '<p>' + words.toTextContent() + '</p>'
		})
		.join(' ')
}
LyricResolver.prototype.findIndexByTime = function (time) {
	return this.search.search(this.lyric, time)
}
LyricResolver.prototype.isMusicOnelyTime = function (interval) {
	return interval > 10000
}
LyricResolver.prototype.isPhraseBreak = function (interval) {
	return interval > 2000
}
LyricResolver.prototype.chunkWords = function (size, lyric) {
	var firstWords = lyric.data.sentences[0].words
	var firstData = this.createMusicOnlyWords(
		0,
		firstWords[firstWords.length - 1].endTime
	)
	var last = firstData[firstData.length - 1]
	var currentItems = []
	var newData = [firstData, currentItems]
	var count = 0
	for (const ws of lyric.data.sentences) {
		var cur = new Words(ws)
		count++
		var interval = last.getTimeBetweenOtherBegin(cur)
		var needCreateNewArr = false
		if (this.isMusicOnelyTime(interval)) {
			var songData = this.createMusicOnlyWords(
				last.getEndTime(),
				cur.getStartTime()
			)
			newData.push(songData)
			needCreateNewArr = true
		} else if (count > size || this.isPhraseBreak(interval)) {
			needCreateNewArr = true
		}
		if (needCreateNewArr) {
			needCreateNewArr = false
			currentItems = [cur]
			newData.push(currentItems)
			count = 1
		} else {
			currentItems.push(cur)
		}
		last = cur
	}
	if (
		this.isMusicOnelyTime(this.audioEl.duration * 1000 - last.getEndTime())
	) {
		newData.push(
			this.createMusicOnlyWords(
				last.getEndTime(),
				this.audioEl.duration * 1000
			)
		)
	}
	return newData
}
LyricResolver.prototype.createMusicOnlyWords = function (startTime, endTime) {
	return [
		new Words({
			words: [
				{
					startTime: startTime,
					endTime: endTime,
					data: `Bài Hát: ${this.songData.song}`
				}
			]
		}),
		new Words({
			words: [
				{
					startTime: startTime,
					endTime: endTime,
					data: `Ca sĩ: ${this.songData.singer}`
				}
			]
		})
	]
}
LyricResolver.prototype.iterator = function () {
	return new LyricResolverIterator(this.lyric)
}

export function Words(words) {
	this.words = words
}
Words.prototype.getStartTime = function () {
	return this.words.words[0].startTime
}
Words.prototype.getEndTime = function () {
	return this.words.words[this.words.words.length - 1].endTime
}
Words.prototype.getTimeBetweenOtherBegin = function (other) {
	return Math.abs(this.getEndTime() - other.getStartTime())
}
Words.prototype.toTextContent = function () {
	return this.words.words
		.map(function (word) {
			return word.data
		})
		.join(' ')
}

function LyricResolverIterator(wordss) {
	this.wordss = wordss
	this.currentIndex = -1
}
LyricResolverIterator.prototype.hasNext = function () {
	return this.currentIndex + 1 < this.wordss.length
}
LyricResolverIterator.prototype.next = function () {
	this.currentIndex++
	return this.wordss[this.currentIndex]
}
LyricResolverIterator.prototype.setIndex = function (index) {
	this.currentIndex = index
	return this.wordss[this.currentIndex]
}

export function BinarySearch(compare, func) {
	this.compare = compare
	this.func = func
}
BinarySearch.prototype.search = function (arr, t) {
	if (arr.length === 0) {
		return -1
	}
	var l = 0
	var r = arr.length - 1
	while (l < r) {
		var m = Math.floor((l + r) / 2)
		var compareVal = this.compare(this.func(arr[m]), t)
		if (compareVal === 0) {
			r = m
		} else if (compareVal < 0) {
			l = m + 1
		} else {
			r = m - 1
		}
	}
	return l
}

export function BinarySearchWord() {
	var comapre = function (o1, o2) {
		return o1 - o2
	}
	var func = function (wordss) {
		return wordss[0].getStartTime()
	}
	BinarySearch.call(this, comapre, func)
	this.__proto__.__proto__ = BinarySearch.prototype
}
