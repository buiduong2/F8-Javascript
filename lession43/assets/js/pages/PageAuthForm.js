import { store } from "../index.js";
import { PageAbstract } from "./PageAbstract.js";
export class PageAuthForm extends PageAbstract {
    constructor() {
        super();
        this.isFirstRender = true;
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
                    let isValidData = true;
                    for (const element of Object.values(authReq)) {
                        if (element.trim().length === 0) {
                            isValidData = false;
                            break;
                        }
                    }
                    if (isValidData) {
                        await this.handleFormSubmit(authReq);
                    }
                    else {
                        store.addNotification("info", "All input are required");
                    }
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
