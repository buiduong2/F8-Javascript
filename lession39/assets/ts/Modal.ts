export class Modal {
    el: HTMLElement;

    private static intance: Modal;
    private inputEl: HTMLInputElement;
    private formEl: HTMLFormElement;
    private handleSubmitForm?: (inputText: string) => Promise<void>;


    private constructor() {
        this.el = document.querySelector(".modal") as HTMLElement;
        this.inputEl = this.el.querySelector(".form-input") as HTMLInputElement;
        this.formEl = this.el.querySelector(".modal-form") as HTMLFormElement;
        this.moute();
    }

    private moute(): void {
        const cancelBtn = this.el.querySelector(".btn-cancel") as HTMLButtonElement;
        const overlayEl = this.el.querySelector(".overlay") as HTMLElement;
        this.formEl.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                await this.handleSubmitForm?.(this.inputEl.value);
                this.inputEl.value = "";
                this.hiddenModal();
            } catch (error) {
                alert(error);
            }

        })

        cancelBtn.addEventListener("click", () => this.hiddenModal());
        overlayEl.addEventListener("click", () => this.hiddenModal());
    }

    private hiddenModal(): void {
        this.el.style.display = "";
        this.inputEl.value = "";
    }

    public active(handleSubmitForm: Modal['handleSubmitForm'], inputValue: string = ""): void {
        this.el.style.display = "block";
        this.handleSubmitForm = handleSubmitForm;
        this.inputEl.value = inputValue;
    }

    public static getIntance(): Modal {
        if (!this.intance) {
            this.intance = new Modal();
        }
        return this.intance;
    }


}