import { QuizzPage } from "./PageAbstract.js";
import { CountDownPage } from "./PageCountDown.js";
export class PreparePage extends QuizzPage {
    getPropSchema() {
        return {
            totalQuestion: {
                type: "number"
            }
        };
    }

    constructor(app, prop) {
        super(app, prop);
        this.contentEl = PreparePage.createContentEl();
        this.fadeDuration = 250;
    }

    addFormHandle() {
        const formEl = this.contentEl.querySelector("form");
        const btnEl = this.contentEl.querySelector("button");
        const audioClickEffect = document.querySelector("#get-point-effect");
        btnEl.addEventListener("click", () => {
            audioClickEffect.play();
        });
        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = new FormData(formEl).get("name")?.toString();
            if (name) {
                this.app.goNextPage({ totalQuestion: this.prop.totalQuestion, playerName: name }, CountDownPage);
            }
        });
    }

    render() {
        this.contentEl.style.transitionDuration = this.fadeDuration + "ms";
        this.addFormHandle();
        this.app.mainContentEl.append(this.contentEl);
        setTimeout(() => {
            this.contentEl.classList.add("in");
        }, 0);
    }

    remove() {
        return new Promise((resolve, reject) => {
            this.contentEl.classList.add("out");
            setTimeout(() => {
                this.contentEl.remove();
                resolve();
            }, this.fadeDuration + 200);
        });
    }
    
    static createContentEl() {
        const el = document.createElement("div");
        el.className = "main-menu-state position-relative";
        el.innerHTML = `
            <div class="position-absolute top-50 start-50 translate-middle w-25 bg-dark rounded-3 p-3 ">
                <form action="#" method="POST" class="">
                    <label class="form-label text-white-50 mb-3">Chào mừng đến với Quizz Game.</label>
                    <input type="text" class="form-control fs-5" name="name" placeholder="Điền tên của bạn" required>

                    <button class="mt-3 btn btn-success fs-4 w-100 fw-semibold ">Bắt đầu</button>
                </form>
            </div>
        `;
        return el;
    }
}
