import { QuizzApp } from "./App.js";
import { QuizzPage } from "./PageAbstract.js";
import type { PropSchema } from "./PageAbstract.js";

export class EndPage extends QuizzPage<EndPageProp> {

    contentEl: HTMLElement;

    constructor(app: QuizzApp, prop: EndPageProp) {
        super(app, prop);
        this.contentEl = EndPage.getContentEl(prop);
    }

    render(): void {
        this.app.mainContentEl.appendChild(this.contentEl);
        setTimeout(() => {
            this.contentEl.classList.add("in")
        }, 1);
    }

    remove(): Promise<void> {
        return new Promise(resolve => {
            this.contentEl.classList.add("out");
            const fadeDuration = parseFloat(window.getComputedStyle(this.contentEl).transitionDuration) * 1000;
            setTimeout(() => {
                this.contentEl.remove();
                resolve();
            }, fadeDuration + 200);
        })
    }

    getPropSchema(): PropSchema {
        return {
            playerName: { type: "string" },
            scoreStatistic: {
                type: "object",
                schema: {
                    number: { type: "number" },
                    correctCount: { type: "number" },
                    incorrectCount: { type: "number" },
                    playTime: { type: "number" },
                    maxStreak: { type: "number" }
                }
            }
        }
    }


    static getContentEl(prop: EndPageProp): HTMLElement {
        const el = document.createElement("section");
        el.className = 'game-end-state';
        el.innerHTML = `
                <h2 class="game-end-title">Bạn là Ace hãy tiếp tục tỏa sáng</h2>

                <div class="correct-progress">
                    <div class="progress-current">
                        <div class="progress-percent"></div>
                    </div>
                </div>

                <div class="score-info">
                    <p class="score-title">Điểm số:</p>
                    <p class="score-number">${prop.scoreStatistic.number}</p>
                    <div class="icon-wrapper"><i class="fa-solid fa-coins"></i></div>
                </div>

                <div class="statistic-list">
                    <div class="row gy-3">
                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--correct"></div>
                                <p class="statistic-value">${prop.scoreStatistic.correctCount}</p>
                                <p class="statistic-label">Câu đúng</p>
                            </article>

                        </div>
                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--incorrect"></div>
                                <p class="statistic-value">${prop.scoreStatistic.incorrectCount}</p>
                                <p class="statistic-label">Sai</p>
                            </article>
                        </div>

                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--time"></div>
                                <p class="statistic-value">${prop.scoreStatistic.playTime.toFixed(2)} m</p>
                                <p class="statistic-label">Thời gian</p>
                            </article>
                        </div>
                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--streak"></div>
                                <p class="statistic-value">${prop.scoreStatistic.maxStreak}</p>
                                <p class="statistic-label">Vệt</p>
                            </article>
                        </div>
                    </div>
                </div>
        `
        return el;
    }

}


export type EndPageProp = {
    playerName: string,
    scoreStatistic: {
        number: number,
        correctCount: number,
        incorrectCount: number,
        playTime: number,
        maxStreak: number
    }
}
