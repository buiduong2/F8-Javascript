
import { QuizzApp } from "./App.js";
import { QuizzPage } from "./PageAbstract.js";
import { CountDownPage } from "./PageCountDown.js";
import type { PropSchema } from "./PageAbstract.js";


export class PreparePage extends QuizzPage<PreparePageProp> {
    getPropSchema(): PropSchema {
        return {
            totalQuestion: {
                type: "number"
            }
        }
    }

    contentEl: HTMLElement;
    fadeDuration: number

    constructor(app: QuizzApp, prop: any) {
        super(app, prop);
        this.contentEl = PreparePage.createContentEl();
        this.fadeDuration = 250;
    }


    addFormHandle() {

        const formEl = this.contentEl.querySelector("form") as HTMLFormElement;
        const btnEl = this.contentEl.querySelector("button") as HTMLButtonElement;
        const audioClickEffect = document.querySelector("#get-point-effect") as HTMLAudioElement
        btnEl.addEventListener("click", () => {
            audioClickEffect.play()
        })

        formEl.onsubmit = (e) => {
            formEl.onsubmit = e => e.preventDefault();
            console.log("Submit");
            e.preventDefault();
            const name = new FormData(formEl).get("name")?.toString();
            if (name) {
                this.app.goNextPage({ totalQuestion: this.prop.totalQuestion, playerName: name }, CountDownPage);
            }

        }
    }


    render(): void {
        this.contentEl.style.transitionDuration = this.fadeDuration + "ms";
        this.addFormHandle();
        this.app.mainContentEl.append(this.contentEl);
        setTimeout(() => {
            this.contentEl.classList.add("in")
        }, 0);
    }

    remove(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.contentEl.classList.add("out");
            setTimeout(() => {
                this.contentEl.remove();
                resolve();
            }, this.fadeDuration + 200);
        });
    }

    static createContentEl(): HTMLElement {
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


type PreparePageProp = {
    totalQuestion: number;
}