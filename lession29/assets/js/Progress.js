export class Progress {
    constructor(el, duration, current = 0) {
        this.progressBarEl = el;
        this.progressEl = el.querySelector(".progress");
        this.progressThumbEl = el.querySelector(".progress-thumb");
        this.currentTimeEl = document.querySelector(".progress-current");
        this.durationTimeEl = document.querySelector(".progress-duration");
        this.progressPointEl = document.querySelector(".progress-point");
        this.duration = duration;
        this.current = current;
        this.moute();
    }
    addValidate() {
        var _this = this;
        function validateSecond(fn) {
            return function (second) {
                if (second > _this.duration) {
                    second = _this.duration;
                }
                else if (second < 0) {
                    second = 0;
                }
                return fn(second);
            };
        }
        function validateTime(fn) {
            return function (e) {
                var time = fn(e);
                if (time > _this.duration) {
                    time = _this.duration;
                }
                else if (time < 0) {
                    time = 0;
                }
                return time;
            };
        }
        this.getCurrentTime = validateTime(this.getCurrentTime.bind(this));
        this.setCurrentProgressBar = validateSecond(this.setCurrentProgressBar.bind(this));
        this.setCurrentProgressPoint = validateSecond(this.setCurrentProgressPoint.bind(this));
    }
    moute() {
        this.addValidate();
        this.durationTimeEl.innerText = this.computeTime(this.duration);
        this.setCurrentProgressBar(this.current);
        this.addChangeCurrentBehavior();
        this.addHoverShowCurrentPointBahavior();
    }
    addChangeCurrentBehavior() {
        var _this = this;
        var handler = function (e) {
            e.preventDefault();
            _this.current = _this.getCurrentTime(e);
            _this.setCurrentProgressBar(_this.current);
            _this.setCurrentProgressPoint(_this.current);
            _this.progressPointEl.style.visibility = "visible";
        };
        var removeHandler = function (e) {
            e.preventDefault();
            _this.progressPointEl.style.visibility = "";
            document.removeEventListener("mousemove", handler);
            document.removeEventListener("mouseup", removeHandler);
        };
        this.progressBarEl.addEventListener("mousedown", function (e) {
            handler(e);
            document.addEventListener("mousemove", handler);
            document.addEventListener("mouseup", removeHandler);
        });
    }
    addHoverShowCurrentPointBahavior() {
        var _this = this;
        this.progressBarEl.addEventListener("mousemove", function (e) {
            var second = _this.getCurrentTime(e);
            _this.setCurrentProgressPoint(second);
        });
    }
    getCurrentTime(e) {
        var offsetLeft = this.progressBarEl.offsetLeft;
        var rate = (e.clientX - offsetLeft) / this.progressBarEl.offsetWidth;
        return rate * this.duration;
    }
    computeTime(second) {
        var min = Math.floor(second / 60);
        var remainSecond = Math.floor(second - min * 60);
        return `${String(min).padStart(2, '0')}:${String(remainSecond).padStart(2, '0')}`;
    }
    changeCurrentTime(currentTime) {
        this.current = currentTime;
        this.setCurrentProgressBar(this.current);
    }
    setCurrentProgressBar(second) {
        this.currentTimeEl.innerText = this.computeTime(second);
        this.currentTimeEl.innerText = this.computeTime(second);
        this.progressEl.style.width = `${(second / this.duration) * 100}%`;
    }
    setCurrentProgressPoint(second) {
        this.progressPointEl.style.left = `${(second / this.duration) * 100}%`;
        this.progressPointEl.innerText = this.computeTime(second);
    }
}
