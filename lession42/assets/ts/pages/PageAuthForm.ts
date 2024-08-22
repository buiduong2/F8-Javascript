import { PageAbstract } from "./PageAbstract.js"

export abstract class PageAuthForm extends PageAbstract {

    isFirstRender: boolean;
    formEl: HTMLFormElement;
    btnLoadEl: HTMLElement;
    btnSubmitEl: HTMLElement;

    constructor() {
        super();
        this.isFirstRender = true;
        const dummyEl = document.createElement("div");
        this.formEl = dummyEl as any;
        this.btnLoadEl = dummyEl;
        this.btnSubmitEl = dummyEl;
    }

    abstract handleFormSubmit(formData: any): Promise<void>;

    abstract getInnerHTML(): string;

    async beforeRender(): Promise<void> {
        if (this.isFirstRender) {
            this.innerHTML = this.getInnerHTML();
            this.formEl = this.querySelector("form") as HTMLFormElement;
            this.btnSubmitEl = this.querySelector(".btn-submit") as HTMLButtonElement;
            this.btnLoadEl = this.querySelector(".btn-load") as HTMLButtonElement;

            let isFetching = false;
            this.formEl.onsubmit = async e => {
                e.preventDefault();
                isFetching = true;
                this.btnLoadEl.style.display = "";
                this.btnSubmitEl.style.display = "none";
                const authReq = Object.fromEntries(new FormData(this.formEl) as any);

                try {
                    await this.handleFormSubmit(authReq);
                } catch (error) {
                    console.warn("Error on Submit form");
                } finally {
                    this.btnLoadEl.style.display = "none";
                    this.btnSubmitEl.style.display = "";
                    isFetching = false;
                }
            }
        }
        this.isFirstRender = false;
    }

    disconnectedCallback() {
        this.formEl.reset();
    }
}