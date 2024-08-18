import { PlayPage } from "./PagePlay.js";
export class QuizzApp {
    el;
    mainContentEl;
    currentPage;
    totalQuestion;
    constructor(el) {
        this.el = el;
        this.mainContentEl = this.el.querySelector(".main-content");
        this.totalQuestion = 10;
        const data = {
            playerName: "Duong",
            totalQuestion: 10,
            scoreStatistic: {
                number: 10000,
                correctCount: 10,
                incorrectCount: 0,
                playTime: 10,
                maxStreck: 10
            }
        };
        this.currentPage = new PlayPage(this, data);
        this.init();
    }
    init() {
        this.currentPage.render();
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
