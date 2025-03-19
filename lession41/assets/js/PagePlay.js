import { QuizzPage } from "./PageAbstract.js";
import { EndPage } from "./PageEnd.js";
import { QuestionInput, QuestionPick } from "./PagePlayQuestion.js";
import { checkArrayStringEqual, counterUp, shuffleArray, sleep } from "./util.js";
import { PreparePage } from "./PagePrepare.js";
const SERVER_API = `https://c6phfn-8080.csb.app/questions/`;
export class PlayPage extends QuizzPage {
    constructor(app, prop) {
        super(app, prop);
        this.navEl = PlayPage.createNavEl();
        this.footerEl = PlayPage.createFooterEl(prop.playerName);
        this.messageEl = PlayPage.createMessageEl();
        this.contentEl = PlayPage.createContentEl();
        this.audioIncorrect = document.querySelector("#incorrect-sound-effect");
        this.audioCorrect = document.querySelector("#correct-sound-effect");
        this.audioBgm = document.querySelector("#playgame-bgm");
        this.statsView = new GameStatsManager(this.navEl, prop.totalQuestion, 4);
        this.feedbackView = new FeedbackManager(this.messageEl);
        this.stats = {
            correctCount: 0,
            incorrectCount: 0,
            maxStreak: 0,
            startTime: Date.now()
        };
        const questions = [];
        this.questions = questions;
        this.currentQuestNumber = 0;
        this.totalQuestNumber = 10;
        this.questionIds = new Array(this.totalQuestNumber).fill(0).map((value, index) => index + 1);
        shuffleArray(this.questionIds);
    }
    render() {
        this.app.mainContentEl.insertAdjacentElement("beforebegin", this.navEl);
        this.app.mainContentEl.insertAdjacentElement("afterend", this.footerEl);
        this.app.mainContentEl.appendChild(this.contentEl);
        this.app.mainContentEl.insertAdjacentElement("afterend", this.messageEl);
        const goHomeBtn = this.navEl.querySelector(".go-home");
        goHomeBtn.onclick = (e) => {
            goHomeBtn.onclick = e => e.preventDefault();
            e.preventDefault();
            this.goNextPage(this.prop, PreparePage);
        };
        setTimeout(() => {
            this.navEl.classList.add("in");
            this.footerEl.classList.add("in");
            this.contentEl.classList.add("in");
        }, 0);
        this.audioBgm.play();
        this.renderNextQuestion();
    }
    remove() {
        const fadeDuration = 1200;
        this.audioBgm.pause();
        return new Promise(resolve => {
            this.navEl.classList.add("out");
            this.footerEl.classList.add("out");
            this.contentEl.classList.add("out");
            setTimeout(() => {
                this.currentQuestion?.remove();
                this.navEl.remove();
                this.footerEl.remove();
                this.contentEl.remove();
                this.messageEl.remove();
                resolve();
            }, fadeDuration);
        });
    }
    async submitAnswer(answers, playedTime) {
        const correctAnswers = this.questions[this.currentQuestNumber].correctAnswers;
        if (checkArrayStringEqual(correctAnswers, answers)) {
            this.handleCorrectAnwser(playedTime);
        }
        else {
            this.handleIncorrectAnwser();
        }
        this.statsView.stopTimeoutProgress();
        await sleep(2000);
        this.currentQuestNumber++;
        this.feedbackView.hideMsg();
        if (this.currentQuestNumber < this.totalQuestNumber) {
            this.renderNextQuestion();
        }
        else {
            this.currentQuestion?.remove();
            this.finishGameSession();
        }
    }
    handleCorrectAnwser(playedTime) {
        if (!this.currentQuestion)
            throw new Error("Current Question is NULL");
        this.audioCorrect.play();
        this.statsView.increaseScoreNumber(this.calcScore(playedTime));
        this.statsView.increaseStreak();
        this.feedbackView.showCorrectMsg();
        this.currentQuestion.showAnswer();
        this.stats.correctCount++;
        this.stats.maxStreak = Math.max(this.statsView.currentStreak, this.stats.maxStreak);
    }
    handleIncorrectAnwser() {
        if (!this.currentQuestion)
            throw new Error("Current Question is NULL");
        this.audioIncorrect.play();
        this.statsView.resetStreak();
        this.feedbackView.showIncorrectMsg();
        this.currentQuestion.showAnswer();
        this.stats.incorrectCount++;
    }
    calcScore(playedTime) {
        playedTime = Math.max(0, playedTime);
        const scorePerSeconds = 100;
        const scorePerStreak = 100;
        const timeScore = Math.floor(1000 - playedTime / 1000 * scorePerSeconds);
        const streakScore = Math.floor(Math.min(this.statsView.currentStreak, 4) * scorePerStreak);
        let total = timeScore + streakScore;
        return { total, info: { time: timeScore, streak: streakScore } };
    }
    async renderNextQuestion() {
        if (this.currentQuestNumber + 1 > this.questions.length) {
            await this.prepareNextQuestion();
            this.renderNextQuestion();
            return;
        }
        const nextQuestion = this.createQuestionPage(this.questions[this.currentQuestNumber], this.currentQuestNumber + 1, 10);
        if (this.currentQuestion) {
            await this.currentQuestion.remove();
        }
        nextQuestion.render()
            .then(async () => {
            this.statsView.resetTimeout();
            await sleep(100);
            this.statsView.beginTimeoutProgress();
        });
        this.statsView.increaseCurrentQuestion();
        this.currentQuestion = nextQuestion;
        this.prepareNextQuestion();
    }
    async prepareNextQuestion() {
        const nextQuestionsId = this.questionIds[this.questions.length];
        if (!nextQuestionsId)
            return;
        try {
            const res = await fetch(SERVER_API + nextQuestionsId);
            if (!res.ok)
                throw new Error(res.statusText);
            const question = await res.json();
            this.questions.push(question);
        }
        catch (error) {
            alert(error);
        }
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
    createQuestionPage(question, currentQuestion, totalQuestion) {
        switch (question.type) {
            case "pick":
                return new QuestionPick(this, question, currentQuestion, totalQuestion);
            case "input":
                return new QuestionInput(this, question, currentQuestion, totalQuestion);
            default:
                break;
        }
        throw new Error("Question type was not implemented");
    }
    static createNavEl() {
        const navEl = document.createElement("nav");
        navEl.className = 'section-nav';
        navEl.innerHTML = `
                <div class='timeout-progress'>
                    <div class="current"></div>
                </div>
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
                <ul class="score-factory">
                </ul>
                
        `;
        return navEl;
    }
    static createFooterEl(playerName) {
        const footerEl = document.createElement("footer");
        footerEl.className = 'footer-section';
        footerEl.innerHTML = `
                <div class="img-wrapper"><img src="./assets/img/Joker.(Persona.5).600.1923854.jpg" alt=""></div>
                <p class="user-info">${playerName}</p>
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
        return contentEl;
    }
}
class GameStatsManager {
    constructor(el, totalQuestion, maxStreak) {
        this.currentQuestion = 0;
        this.totalQuestion = totalQuestion;
        this.currentStreak = 0;
        this.maxStreak = maxStreak;
        this.score = 0;
        this.el = el;
        this.currentQuestionEl = el.querySelector(".current-question");
        this.streakEl = el.querySelector(".streak");
        this.scoreEl = el.querySelector(".point .current");
        this.scoreFactoryEl = el.querySelector(".score-factory");
        this.timeoutProgressEl = el.querySelector(".timeout-progress .current");
        this.moute();
    }
    moute() {
        this.currentQuestionEl.querySelector(".total").textContent = String(this.totalQuestion);
        this.currentQuestionEl.querySelector(".current").textContent = String(this.currentQuestion);
        this.resetStreak();
        this.scoreEl.textContent = String(this.score);
    }
    beginTimeoutProgress() {
        this.timeoutProgressEl.style.transitionDuration = '10s';
        this.timeoutProgressEl.style.width = "0%";
    }
    stopTimeoutProgress() {
        this.timeoutProgressEl.style.transitionDuration = '0s';
        this.timeoutProgressEl.style.width = window.getComputedStyle(this.timeoutProgressEl).width;
    }
    resetTimeout() {
        this.timeoutProgressEl.style.transitionDuration = '0s';
        this.timeoutProgressEl.style.width = "100%";
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
    increaseScoreNumber({ total, info }) {
        let prevScore = this.score;
        this.score += total;
        counterUp((score) => {
            this.scoreEl.textContent = String(Math.floor(score));
        }, prevScore, this.score, 1000).start();
        this.showIncreaseScoreStep(info);
    }
    showIncreaseScoreStep(info) {
        const ulEl = document.createElement("ul");
        ulEl.className = 'score-item';
        const fragment = document.createDocumentFragment();
        Object.entries(info).forEach((([key, value]) => {
            const liEl = document.createElement("li");
            liEl.className = key;
            liEl.innerText = "+" + value.toFixed(0);
            fragment.appendChild(liEl);
        }));
        ulEl.appendChild(fragment);
        this.scoreFactoryEl.appendChild(ulEl);
        const { transitionDuration, transitionDelay } = window.getComputedStyle(ulEl);
        const liveTime = transitionDuration
            .split(",")
            .reduce((max, curr) => Math.max(max, parseFloat(curr) * 1000), 0)
            + parseFloat(transitionDelay) * 1000;
        ulEl.classList.add("active");
        setTimeout(() => {
            ulEl.remove();
        }, liveTime);
    }
}
class FeedbackManager {
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
