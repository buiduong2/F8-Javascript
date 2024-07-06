export class AudioWrapper {
    constructor(el) {
        this.el = el;
        this.actionBtn = document.querySelector(".player-actions .player-btn");
        this.moute();
    }
    moute() {
        var _this = this;
        this.actionBtn.addEventListener("click", function () {
            if (_this.el.paused) {
                _this.el.play();
            }
            else {
                _this.el.pause();
            }
        });
        this.el.addEventListener("play", function () {
            _this.actionBtn.classList.replace('fa-play', 'fa-pause');
        });
        this.el.addEventListener("pause", function () {
            _this.actionBtn.classList.replace('fa-pause', 'fa-play');
        });
        this.el.addEventListener("timeupdate", function () {
            var _a;
            (_a = _this.onTimeUpdate) === null || _a === void 0 ? void 0 : _a.call(_this, this.currentTime);
        });
    }
}
