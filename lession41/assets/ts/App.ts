import type { PageContructor } from "./PageAbstract.js";
import { QuizzPage } from "./PageAbstract.js";
import { PlayPage } from "./PagePlay.js";

export class QuizzApp {
    el: HTMLElement;
    mainContentEl: HTMLElement;

    currentPage: QuizzPage<any>;

    totalQuestion: number;

    constructor(el: HTMLElement) {
        this.el = el;
        this.mainContentEl = this.el.querySelector(".main-content") as HTMLElement;
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
        }
        
        this.currentPage = new PlayPage(this, data);
        this.init();
    }

    public init(): void {
        this.currentPage.render();
    }

    public goNextPage(data: any, nextPageCon: PageContructor): void {
        this.currentPage.remove()
            .then(() => {
                const nextPage = new nextPageCon(this, data);
                this.currentPage = nextPage;
                this.currentPage.render();
            });

    }
}


