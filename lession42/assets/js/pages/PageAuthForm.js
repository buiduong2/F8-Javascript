import { PageAbstract } from "./PageAbstract.js";
export class PageAuthForm extends PageAbstract {
    constructor() {
        super();
        this.isFirstRender = true;
        const dummyEl = document.createElement("div");
        this.formEl = dummyEl;
        this.btnLoadEl = dummyEl;
        this.btnSubmitEl = dummyEl;
    }
    async beforeRender() {
        if (this.isFirstRender) {
            this.innerHTML = this.getInnerHTML();
            this.formEl = this.querySelector("form");
            this.btnSubmitEl = this.querySelector(".btn-submit");
            this.btnLoadEl = this.querySelector(".btn-load");
            let isFetching = false;
            this.formEl.onsubmit = async (e) => {
                e.preventDefault();
                isFetching = true;
                this.btnLoadEl.style.display = "";
                this.btnSubmitEl.style.display = "none";
                const authReq = Object.fromEntries(new FormData(this.formEl));
                try {
                    await this.handleFormSubmit(authReq);
                }
                catch (error) {
                    console.warn("Error on Submit form");
                }
                finally {
                    this.btnLoadEl.style.display = "none";
                    this.btnSubmitEl.style.display = "";
                    isFetching = false;
                }
            };
        }
        this.isFirstRender = false;
    }
    disconnectedCallback() {
        this.formEl.reset();
    }
}
