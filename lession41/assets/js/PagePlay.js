import { QuizzPage } from "./PageAbstract.js";
import { EndPage } from "./PageEnd.js";
export class PlayPage extends QuizzPage {
    navEl;
    footerEl;
    messageEl;
    contentEl;
    statsView;
    feedbackView;
    stats;
    constructor(app, prop) {
        super(app, prop);
        this.navEl = PlayPage.createNavEl();
        this.footerEl = PlayPage.createFooterEl();
        this.messageEl = PlayPage.createMessageEl();
        this.contentEl = PlayPage.createContentEl();
        this.statsView = new GameStatsManager(this.navEl, prop.totalQuestion, 4);
        this.feedbackView = new FeedbackManager(this.messageEl);
        this.stats = {
            correctCount: 0,
            incorrectCount: 0,
            maxStreak: 0,
            startTime: Date.now()
        };
        setTimeout(() => {
            this.finishGameSession();
        }, 1000);
    }
    render() {
        this.app.mainContentEl.insertAdjacentElement("beforebegin", this.navEl);
        this.app.mainContentEl.insertAdjacentElement("afterend", this.footerEl);
        this.app.mainContentEl.appendChild(this.contentEl);
        this.app.mainContentEl.insertAdjacentElement("afterend", this.messageEl);
        setTimeout(() => {
            this.navEl.classList.add("in");
            this.footerEl.classList.add("in");
            this.contentEl.classList.add("in");
        }, 0);
    }
    remove() {
        const fadeDuration = 1200;
        return new Promise(resolve => {
            this.navEl.classList.add("out");
            this.footerEl.classList.add("out");
            this.contentEl.classList.add("out");
            setTimeout(() => {
                this.navEl.remove();
                this.footerEl.remove();
                this.contentEl.remove();
                this.messageEl.remove();
                resolve();
            }, fadeDuration);
        });
    }
    finishGameSession() {
        const data = {
            ...this.prop,
            scoreStatistic: {
                number: this.statsView.score,
                correctCount: this.stats.correctCount,
                incorrectCount: this.stats.incorrectCount,
                playTime: (Date.now() - this.stats.startTime) / (1000 * 60),
                maxStreak: this.stats.maxStreak
            }
        };
        this.goNextPage(data, EndPage);
    }
    getPropSchema() {
        return {
            playerName: {
                type: "string"
            },
            totalQuestion: {
                type: "number"
            }
        };
    }
    static createNavEl() {
        const navEl = document.createElement("nav");
        navEl.className = 'section-nav';
        navEl.innerHTML = `
                <ul class="game-info-list-left">
                    <li class="current-question btn btn-secondary"><span class="current">2</span>/<span
                            class="total">10</span></li>
                    <li class="streak">
                        <p class="streak-title">Streak</p>
                        <div class="streak-progress">
                            <div class="current"></div>
                        </div>

                        <div class="streak-separator"></div>
                        <div class="streak-separator"></div>
                        <div class="streak-separator"></div>

                        <span class="streak-number"><span class="current">1</span> <i class="fa-solid fa-fire"></i></span>
                    </li>
                </ul>

                <ul class="game-info-list-right">
                    <li class="btn btn-secondary point"> <span class="current">1</span> <i class="fa-solid fa-coins"></i></li>
                    <li class="go-home btn btn-danger"><a href="#">Home</a></li>
                </ul>
        `;
        return navEl;
    }
    static createFooterEl() {
        const footerEl = document.createElement("footer");
        footerEl.className = 'footer-section';
        footerEl.innerHTML = `
                <div class="img-wrapper"><img src="./assets/img/Joker.(Persona.5).600.1923854.jpg" alt=""></div>
                <p class="user-info">Bùi Đức Dương</p>
            `;
        return footerEl;
    }
    static createMessageEl() {
        const messageEl = document.createElement("div");
        messageEl.className = 'message-wrapper';
        messageEl.innerHTML = `
                <p class="message message--correct"> <i class="fa-regular fa-circle-check"></i> Đúng</p>
                <p class="message message--incorrect"> <i class="fa-regular fa-circle-xmark"></i> Sai</p>
        `;
        return messageEl;
    }
    static createContentEl() {
        const contentEl = document.createElement("section");
        contentEl.className = 'game-playing-state';
        contentEl.innerHTML = `
                <article class="question-wrapper current">
                    <div class="question">
                        <p class="question-number">
                            2/16
                        </p>
                        <p class="question-content">
                            Trong các tập hợp số nguyên sau, tập hợp nào có các số nguyên được sắp xếp theo thứ tự tăng
                            dần
                        </p>
                    </div>

                    <div class="answer">
                        <ul class="answer-list">
                            <li class="answer-item">
                                <button class="btn ">{ -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                            <li class="answer-item">
                                <button class="btn "> { -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                            <li class="answer-item">
                                <button class="btn "> { -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                            <li class="answer-item">
                                <button class="btn"> { -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                        </ul>
                        <div class="pyro">
                            <div class="before"></div>
                            <div class="after"></div>
                        </div>

                    </div>

                </article>

                <article class="question-wrapper pending">
                    <div class="question">
                        <p class="question-number">
                            2/16
                        </p>
                        <p class="question-content">
                            Trong các tập hợp số nguyên sau, tập hợp nào có các số nguyên được sắp xếp theo thứ tự tăng
                            dần
                        </p>
                    </div>

                    <div class="answer">
                        <ul class="answer-list">
                            <li class="answer-item">
                                <button class="btn ">{ -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                            <li class="answer-item">
                                <button class="btn "> { -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                            <li class="answer-item">
                                <button class="btn "> { -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                            <li class="answer-item">
                                <button class="btn"> { -17; -2; 0; 1; 2; 5 } </button>
                            </li>
                        </ul>
                        <div class="pyro">
                            <div class="before"></div>
                            <div class="after"></div>
                        </div>

                    </div>

                </article>
        `;
        return contentEl;
    }
}
class GameStatsManager {
    currentQuestion;
    totalQuestion;
    currentStreak;
    maxStreak;
    score;
    el;
    currentQuestionEl;
    streakEl;
    scoreEl;
    constructor(el, totalQuestion, maxStreak) {
        this.currentQuestion = 1;
        this.totalQuestion = totalQuestion;
        this.currentStreak = 0;
        this.maxStreak = maxStreak;
        this.score = 0;
        this.el = el;
        this.currentQuestionEl = el.querySelector(".current-question");
        this.streakEl = el.querySelector(".streak");
        this.scoreEl = el.querySelector(".point .current");
        this.moute();
    }
    moute() {
        this.currentQuestionEl.querySelector(".total").textContent = String(this.totalQuestion);
        this.currentQuestionEl.querySelector(".current").textContent = String(this.currentQuestion);
        this.resetStreak();
        this.scoreEl.textContent = String(this.score);
    }
    increaseStreak() {
        this.currentStreak++;
        if (this.currentStreak <= this.maxStreak) {
            const progressEl = this.streakEl.querySelector(".streak-progress .current");
            const transitionDuration = parseFloat(window.getComputedStyle(progressEl).transitionDuration) * 1000;
            progressEl.classList.add("active");
            progressEl.style.width = ((this.currentStreak / this.maxStreak) * 100) + "%";
            setTimeout(() => {
                progressEl.classList.remove("active");
            }, transitionDuration + 200);
        }
        const progressNumber = this.streakEl.querySelector(".streak-number .current");
        progressNumber.textContent = String(this.currentStreak);
        if (this.currentStreak >= this.maxStreak) {
            this.streakEl.classList.add("max");
        }
    }
    resetStreak() {
        this.currentStreak = 0;
        const progressBar = this.streakEl.querySelector(".streak-progress .current");
        progressBar.style.width = "0%";
        const progressNumber = this.streakEl.querySelector(".streak-number .current");
        progressNumber.textContent = String(this.currentStreak);
        this.streakEl.classList.remove("max");
    }
    increaseCurrentQuestion() {
        if (this.currentQuestion === this.totalQuestion) {
            return;
        }
        this.currentQuestion++;
        this.currentQuestionEl.querySelector(".current").textContent = String(this.currentQuestion);
    }
    increaseScoreNumber(number) {
        let prevScore = this.score;
        this.score += number;
        const intervalId = setInterval(() => {
            prevScore += 100;
            if (prevScore >= this.score) {
                this.scoreEl.textContent = String(this.score);
                clearTimeout(intervalId);
                return;
            }
            this.scoreEl.textContent = String(prevScore);
        }, 200);
    }
}
class FeedbackManager {
    msgWrapperEl;
    constructor(msgWrapperEl) {
        this.msgWrapperEl = msgWrapperEl;
    }
    showCorrectMsg() {
        this.msgWrapperEl.classList.add("correct");
        this.msgWrapperEl.classList.add("active");
    }
    showIncorrectMsg() {
        this.msgWrapperEl.classList.add("incorrect");
        this.msgWrapperEl.classList.add("active");
    }
    hideMsg() {
        this.msgWrapperEl.classList.remove("active");
        setTimeout(() => {
            this.msgWrapperEl.classList.remove("correct", "incorrect");
        }, 500);
    }
}
