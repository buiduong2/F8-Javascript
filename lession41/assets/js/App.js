import { PreparePage } from "./PagePrepare.js";
export class QuizzApp {
    constructor(el) {
        this.el = el;
        this.mainContentEl = this.el.querySelector(".main-content");
        this.totalQuestion = 10;
        const data = {
            playerName: "Duong",
            totalQuestion: 10,
            scoreStatistic: {
                number: 10000,
                correctCount: 8,
                incorrectCount: 2,
                playTime: 10,
                maxStreak: 10
            }
        };
        this.currentPage = new PreparePage(this, data);
        this.init();
    }
    init() {
        this.currentPage.render();
        const bgmAudios = Array.from(document.querySelectorAll(".bgm"));
        const soundEffectAudios = Array.from(document.querySelectorAll(".sound-effect"));
        bgmAudios.forEach(audio => {
            audio.volume = 0.3;
        });
        soundEffectAudios.forEach(audio => audio.volume = 1);
    }
    goNextPage(data, nextPageCon) {
        this.currentPage.remove()
            .then(() => {
            const nextPage = new nextPageCon(this, data);
            this.currentPage = nextPage;
            this.currentPage.render();
        });
    }
}
