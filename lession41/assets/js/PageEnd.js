import { QuizzPage } from "./PageAbstract.js";
import { counterUp, sleep } from "./util.js";
export class EndPage extends QuizzPage {
    constructor(app, prop) {
        super(app, prop);
        this.contentEl = EndPage.getContentEl(prop);
        this.audioBgm = document.querySelector("#victory-bgm");
    }

    async render() {
        this.app.mainContentEl.appendChild(this.contentEl);
        setTimeout(() => {
            this.contentEl.classList.add("in");
        }, 1);
        this.audioBgm.play();
        try {
            await this.counterUpAllSore(true);
        }
        catch (error) {
            this.counterUpAllSore(false);
        }
    }

    appendFireWord() {
        const firework = document.createElement("div");
        firework.innerHTML = `
            <div class="pyro active">
                <div class="before"></div>
                <div class="after"></div>
            </div>
        `;
        this.contentEl.appendChild(firework);
    }

    async counterUpAllSore(withSound) {
        const scoreNumberEl = this.contentEl.querySelector(".score-number");
        const correctCountEl = this.contentEl.querySelector(".correct-count");
        const incorrectCountEl = this.contentEl.querySelector(".incorrect-count");
        const playTimeEl = this.contentEl.querySelector(".play-time");
        const maxStreakCountEl = this.contentEl.querySelector(".max-streak-count");
        const percentProgressEl = this.contentEl.querySelector(".progress-current");
        const audioGiftEffectEl = document.querySelector("#treasure-chest-sound-effect");
        const { correctCount: correct, incorrectCount: incorrect } = this.prop.scoreStatistic;
        const percent = correct / (correct + incorrect) * 100;

        let percentCount = counterUp((percent) => {
            const percentStr = percent.toFixed(0);
            percentProgressEl.querySelector(".percent-count").textContent = percentStr;
            percentProgressEl.style.width = percentStr + "%";
        }, 0, percent, 2000);

        let scoreCount = counterUp((score) => {
            scoreNumberEl.textContent = String(Math.floor(score));
        }, 0, this.prop.scoreStatistic.number, 2000);

        let correctCount = counterUp((correctCount) => {
            correctCountEl.textContent = String(Math.floor(correctCount));
        }, 0, this.prop.scoreStatistic.correctCount, 1000);
        
        let incorrectCount = counterUp((incorrectCount) => {
            incorrectCountEl.textContent = String(Math.floor(incorrectCount));
        }, 0, this.prop.scoreStatistic.incorrectCount, 1000);

        let playTime = counterUp((playTime) => {
            playTimeEl.textContent = playTime.toFixed(2);
        }, 0, this.prop.scoreStatistic.playTime, 1000);

        let maxStreakCount = counterUp((maxStreak) => {
            maxStreakCountEl.textContent = String(Math.floor(maxStreak));
        }, 0, this.prop.scoreStatistic.maxStreak, 1000);

        let index = 0;
        const countEls = [percentCount, scoreCount, correctCount, incorrectCount, playTime, maxStreakCount];
        const skipCountUp = () => {
            countEls[index].stop();
            index++;
            if (index >= countEls.length) {
                this.appendFireWord();
                document.removeEventListener("click", skipCountUp);
            }
        };

        document.addEventListener("click", skipCountUp);
        
        countEls.reduce(async (prev, curr) => {
            return prev.then(async () => {
                await sleep(1000);
                if (withSound) {
                    audioGiftEffectEl.play();
                }
                await curr.start();
            });
        }, Promise.resolve()).then(() => {
            this.appendFireWord();
            document.removeEventListener("click", skipCountUp);
        });
    }

    remove() {
        this.audioBgm.pause();
        return new Promise(resolve => {
            this.contentEl.classList.add("out");
            const fadeDuration = parseFloat(window.getComputedStyle(this.contentEl).transitionDuration) * 1000;
            setTimeout(() => {
                this.contentEl.remove();
                resolve();
            }, fadeDuration + 200);
        });
    }

    getPropSchema() {
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
        };
    }

    static getContentEl(prop) {
        const el = document.createElement("section");
        el.className = 'game-end-state';
        el.innerHTML = `
                <h2 class="game-end-title">${prop.playerName} là Ace hãy tiếp tục tỏa sáng</h2>

                <div class="correct-progress">
                    <div class="progress-current">
                        <div class="progress-percent"><span class='percent-count'>0</span>%</div>
                    </div>
                </div>

                <div class="score-info">
                    <p class="score-title">Điểm số:</p>
                    <p class="score-number">0</p>
                    <div class="icon-wrapper"><i class="fa-solid fa-coins"></i></div>
                </div>

                <div class="statistic-list">
                    <div class="row gy-3">
                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--correct"></div>
                                <p class="statistic-value"><span class="correct-count">0</span></p>
                                <p class="statistic-label">Câu đúng</p>
                            </article>

                        </div>
                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--incorrect"></div>
                                <p class="statistic-value"><span class="incorrect-count">0</class="incorrect-count"></p>
                                <p class="statistic-label">Sai</p>
                            </article>
                        </div>

                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--time"></div>
                                <p class="statistic-value"><span class="play-time">0</span> m</p>
                                <p class="statistic-label">Thời gian</p>
                            </article>
                        </div>
                        <div class="col-6">
                            <article class="statistic-item">
                                <div class="bg-image bg-image--streak"></div>
                                <p class="statistic-value"><span class="max-streak-count">0</span></p>
                                <p class="statistic-label">Vệt</p>
                            </article>
                        </div>
                    </div>
                </div>
        `;
        return el;
    }
}
