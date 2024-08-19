import { QuizzPage } from "./PageAbstract.js";
import { PlayPage } from "./PagePlay.js";
export class CountDownPage extends QuizzPage {
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

    constructor(app, prop) {
        super(app, prop);
        this.contentEl = CountDownPage.createContentEl();
        this.audioBegin = document.querySelector("#begin-sound-effect");
    }

    addCountDownInfo() {
        const countDownItems = this.contentEl.querySelectorAll(".count-down-item");
        Array.from(countDownItems).forEach((item, index) => {
            item.style.display = "none";
            setTimeout(() => {
                item.style.display = "";
            }, index * 1000);
        });
    }

    render() {
        this.addCountDownInfo();
        this.audioBegin.play().catch(() => {
            this.app.mainContentEl.appendChild(this.contentEl);
            setTimeout(() => {
                this.goNextPage(this.prop, PlayPage);
            }, 3000);
        });
        this.audioBegin.addEventListener("play", () => {
            this.app.mainContentEl.appendChild(this.contentEl);
        });
        this.audioBegin.addEventListener("ended", () => {
            this.goNextPage(this.prop, PlayPage);
        });
    }

    remove() {
        this.contentEl.remove();
        return Promise.resolve();
    }
    
    static createContentEl() {
        const el = document.createElement("div");
        el.className = "count-down-state";
        el.innerHTML = `
                <div class="count-down-item">1</div>
                <div class="count-down-item">2</div>
                <div class="count-down-item">3</div>
                <div class="count-down-item">BẮT ĐẦU !</div>
        `;
        return el;
    }
}
