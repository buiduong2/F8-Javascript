import type { PageContructor } from "./PageAbstract.js";
import { QuizzPage } from "./PageAbstract.js";
import { PreparePage } from "./PagePrepare.js";

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
                correctCount: 8,
                incorrectCount: 2,
                playTime: 10,
                maxStreak: 10
            }
        }

        this.currentPage = new PreparePage(this, data);
        this.init();
    }

    public init(): void {
        this.currentPage.render();
        const bgmAudios = Array.from(document.querySelectorAll(".bgm"));
        const soundEffectAudios = Array.from(document.querySelectorAll(".sound-effect"));

        bgmAudios.forEach(audio => {
            (audio as HTMLAudioElement).volume = 0.3;
        })
        soundEffectAudios.forEach(audio => (audio as HTMLAudioElement).volume = 1);
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


