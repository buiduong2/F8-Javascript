import { shuffleArray } from "./util.js";
export class PagePlayQuestion {
    constructor(playPlage, question, currentQuestion, totalQuestion) {
        this.playPage = playPlage;
        this.question = question;
        shuffleArray(this.question.answers);
        this.starTime = Number.MAX_VALUE;
        this.answer = [];
        this.contentEl = this.createContentEl(question, currentQuestion, totalQuestion);
        this.audioGetPoint = document.querySelector("#get-point-effect");
        this.liveTime = 10 * 1000;
    }
    render() {
        return new Promise(resolve => {
            this.addHandler();
            this.playPage.contentEl.appendChild(this.contentEl);
            this.timeoutId = setTimeout(() => {
                this.contentEl.classList.add("in");
                const { animationDuration, animationDelay } = window.getComputedStyle(this.contentEl);
                this.timeoutId = setTimeout(() => {
                    this.starTime = Date.now();
                    resolve();
                    this.timeoutId = setTimeout(() => {
                        this.submitAnswer();
                    }, this.liveTime);
                }, (parseFloat(animationDuration) + parseFloat(animationDelay)) * 1000);
            }, 1);
        });
    }
    remove() {
        const outTimeInterval = 1000;
        clearTimeout(this.timeoutId);
        return new Promise(resolve => {
            this.removeHandler();
            this.contentEl.classList.add("out");
            setTimeout(() => {
                this.contentEl.remove();
                resolve();
            }, outTimeInterval);
        });
    }
    submitAnswer() {
        clearTimeout(this.timeoutId);
        this.removeHandler();
        this.playPage.submitAnswer(this.answer, Date.now() - this.starTime);
    }
    createContentEl(question, currentQuestion, totalQuestion) {
        const el = document.createElement("article");
        el.className = 'question-wrapper';
        el.innerHTML = `

                    <div class="question">
                        <p class="question-number">
                            ${currentQuestion}/${totalQuestion}
                        </p>
                        <p class="question-content">
                            ${question.content}
                        </p>
                    </div>

                    <div class="answer">
                    </div>
            `;
        el.querySelector(".answer").appendChild(this.createAnswerEl());
        return el;
    }
}
export class QuestionPick extends PagePlayQuestion {
    constructor(playPlage, question, currentQuestion, totalQuestion) {
        super(playPlage, question, currentQuestion, totalQuestion);
        this.totalAnswer = this.question.correctAnswers.length;
    }
    pickAnwser(el) {
        this.audioGetPoint.play();
        const id = el.dataset.id;
        if (!id)
            throw new Error("Answer Btn must have id");
        const indexOfId = this.answer.indexOf(id);
        if (indexOfId === -1) {
            this.answer.push(id);
            el.classList.add("chose");
        }
        else {
            el.classList.remove('chose');
            this.answer.splice(indexOfId);
        }
        if (this.totalAnswer === this.answer.length) {
            this.submitAnswer();
        }
    }
    showAnswer() {
        const correctAnswers = this.question.correctAnswers;
        const btns = Array.from(this.contentEl.querySelectorAll(".answer-item"));
        const pickedAnswers = btns.filter(btn => this.answer.includes(btn.dataset.id || ""));
        const correctBtns = btns.filter(btn => correctAnswers.includes(btn.dataset.id || ""));
        pickedAnswers.forEach(btn => {
            btn.classList.add("incorrect");
        });
        correctBtns.forEach(btn => {
            btn.classList.remove("incorrect");
            btn.classList.add("correct");
        });
    }
    addHandler() {
        Array.from(this.contentEl.querySelectorAll(".answer-item"))
            .forEach(ansEl => {
            ansEl.onclick = (e) => {
                e.preventDefault();
                this.pickAnwser(ansEl);
            };
        });
    }
    removeHandler() {
        const btns = Array.from(this.contentEl.querySelectorAll(".answer-item"));
        btns.forEach(btn => {
            btn.onclick = null;
        });
    }
    createAnswerEl() {
        const el = document.createElement("ul");
        el.className = 'answer-list';
        el.innerHTML = this.question.answers.map(ans => {
            return `
                <li class="answer-item" data-id="${ans.id}">
                    <button class="btn">${ans.content}</button>
                </li>
            `;
        }).join("");
        return el;
    }
}
export class QuestionInput extends PagePlayQuestion {
    constructor(playPlage, question, currentQuestion, totalQuestion) {
        super(playPlage, question, currentQuestion, totalQuestion);
        this.formEl = this.contentEl.querySelector(".answer-form");
    }
    showAnswer() {
        if (this.question.correctAnswers.includes(this.answer[0])) {
            this.formEl.classList.add("correct");
        }
        else {
            this.formEl.classList.add("incorrect");
        }
    }
    createAnswerEl() {
        const el = document.createElement("form");
        el.className = 'answer-form';
        el.innerHTML = `
            <input class="answer-input" type="text" name="answer"  required placeholder="Gõ câu trả lời của bạn">
        `;
        return el;
    }
    addHandler() {
        this.formEl.onsubmit = (e) => {
            e.preventDefault();
            const answer = new FormData(this.formEl).get("answer")?.toString();
            if (answer) {
                this.answer.push(answer);
                this.submitAnswer();
            }
        };
    }
    removeHandler() {
        this.formEl.onsubmit = (e) => {
            e.preventDefault();
        };
    }
}
