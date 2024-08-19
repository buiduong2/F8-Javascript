import { PlayPage } from "./PagePlay";

export abstract class PagePlayQuestion {
    playPage: PlayPage;
    question: QuestionType;
    starTime: number;
    liveTime: number;
    timeoutId: number | undefined;
    answer: string[];
    contentEl: HTMLElement;
    audioGetPoint: HTMLAudioElement;

    constructor(playPlage: PlayPage, question: QuestionType, currentQuestion: number, totalQuestion: number) {
        this.playPage = playPlage;
        this.question = question;
        this.starTime = Number.MAX_VALUE;
        this.answer = [];
        this.contentEl = this.createContentEl(question, currentQuestion, totalQuestion);
        this.audioGetPoint = document.querySelector("#get-point-effect") as HTMLAudioElement;
        this.liveTime = 10 * 1000;
    }


    render(): Promise<void> {
        return new Promise(resolve => {
            this.addHandler();
            this.playPage.contentEl.appendChild(this.contentEl);
            setTimeout(() => {
                this.contentEl.classList.add("in");
                const { animationDuration, animationDelay } = window.getComputedStyle(this.contentEl);
                setTimeout(() => {
                    this.starTime = Date.now();
                    resolve();
                    this.timeoutId = setTimeout(() => {
                        this.submitAnswer();
                    }, this.liveTime);
                }, (parseFloat(animationDuration) + parseFloat(animationDelay)) * 1000);
            }, 1);
        })
    }

    remove(): Promise<void> {
        const outTimeInterval = 1000;
        clearTimeout(this.timeoutId);
        return new Promise(resolve => {
            this.removeHandler();
            this.contentEl.classList.add("out");

            setTimeout(() => {
                this.contentEl.remove();
                resolve();
            }, outTimeInterval);
        })

    }

    submitAnswer() {
        clearTimeout(this.timeoutId);
        this.removeHandler();
        this.playPage.submitAnswer(this.answer, Date.now() - this.starTime);
    }

    abstract showAnswer(): void;

    createContentEl(question: QuestionType, currentQuestion: number, totalQuestion: number): HTMLElement {
        const el = document.createElement("article");
        el.className = 'question-wrapper'
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
        (el.querySelector(".answer") as HTMLElement).appendChild(this.createAnswerEl());
        return el;
    }

    abstract createAnswerEl(): HTMLElement;
    abstract addHandler(): void;
    abstract removeHandler(): void;

}

export class QuestionPick extends PagePlayQuestion {

    totalAnswer: number;

    constructor(playPlage: PlayPage, question: QuestionType, currentQuestion: number, totalQuestion: number) {
        super(playPlage, question, currentQuestion, totalQuestion);
        this.totalAnswer = this.question.correctAnswers.length;
    }

    pickAnwser(el: HTMLElement) {
        this.audioGetPoint.play();
        const id = el.dataset.id;
        if (!id) throw new Error("Answer Btn must have id");

        const indexOfId = this.answer.indexOf(id);
        if (indexOfId === -1) {
            this.answer.push(id);
            el.classList.add("chose");
        } else {
            el.classList.remove('chose');
            this.answer.splice(indexOfId);
        }

        if (this.totalAnswer === this.answer.length) {
            this.submitAnswer();
        }
    }

    showAnswer(): void {
        const correctAnswers: string[] = this.question.correctAnswers;

        const btns = Array.from(this.contentEl.querySelectorAll(".answer-item"));
        const pickedAnswers = btns.filter(btn => this.answer.includes((btn as HTMLElement).dataset.id || ""));
        const correctBtns = btns.filter(btn => correctAnswers.includes((btn as HTMLElement).dataset.id || ""));

        pickedAnswers.forEach(btn => {
            btn.classList.add("incorrect");
        })
        correctBtns.forEach(btn => {
            btn.classList.remove("incorrect");
            btn.classList.add("correct");
        })
    }


    addHandler(): void {
        Array.from(this.contentEl.querySelectorAll(".answer-item"))
            .forEach(ansEl => {
                (ansEl as HTMLElement).onclick = (e) => {
                    e.preventDefault();
                    this.pickAnwser(ansEl as HTMLElement);
                }
            })

    }
    removeHandler(): void {
        const btns = Array.from(this.contentEl.querySelectorAll(".answer-item"));
        btns.forEach(btn => {
            (btn as HTMLElement).onclick = null;
        })
    }
    createAnswerEl(): HTMLElement {
        const el = document.createElement("ul");
        el.className = 'answer-list'
        el.innerHTML = this.question.answers.map(ans => {
            return `
                <li class="answer-item" data-id="${ans.id}">
                    <button class="btn">${ans.content}</button>
                </li>
            `
        }).join("");

        return el;
    }

}


export class QuestionInput extends PagePlayQuestion {

    formEl: HTMLFormElement;


    constructor(playPlage: PlayPage, question: QuestionType, currentQuestion: number, totalQuestion: number) {
        super(playPlage, question, currentQuestion, totalQuestion);
        this.formEl = this.contentEl.querySelector(".answer-form") as HTMLFormElement;
    }

    showAnswer(): void {
        if (this.question.correctAnswers.includes(this.answer[0])) {
            this.formEl.classList.add("correct");
        } else {
            this.formEl.classList.add("incorrect");
        }
    }
    createAnswerEl(): HTMLElement {
        const el = document.createElement("form");

        el.className = 'answer-form';
        el.innerHTML = `
            <input class="answer-input" type="text" name="answer"  required placeholder="Gõ câu trả lời của bạn">
        `
        return el;

    }
    addHandler(): void {
        this.formEl.onsubmit = (e) => {
            e.preventDefault();
            const answer = new FormData(this.formEl).get("answer")?.toString();
            if (answer) {
                this.answer.push(answer);
                this.submitAnswer();
            }
        }
    }
    removeHandler(): void {
        this.formEl.onsubmit = (e) => {
            e.preventDefault();
        }
    }



}

export type QuestionType = {
    content: string;
    correctAnswers: string[];
    type: "pick" | "input";
    answers: Answer[]
}

export type Answer = {
    id: number;
    content: string;
}

