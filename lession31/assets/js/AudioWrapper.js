export class AudioWrapper {
    constructor(el) {
        this.el = el;
        this.actionBtn = document.querySelector(".player-actions .player-btn");
        this.moute();
    }
    moute() {
        var _this = this;
        this.actionBtn.addEventListener("click", function () {
            if (_this.el.ended) {
                _this.el.currentTime = 0;
            }
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
        this.el.addEventListener("ended", function () {
            _this.el.currentTime = 0;
        });
    }
}
