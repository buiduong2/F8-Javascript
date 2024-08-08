export class Modal {

    static intance;

    constructor() {
        this.el = document.querySelector(".modal");
        this.inputEl = this.el.querySelector(".form-input");
        this.formEl = this.el.querySelector(".modal-form");
        this.moute();
    }

    moute() {
        const cancelBtn = this.el.querySelector(".btn-cancel");
        const overlayEl = this.el.querySelector(".overlay");
        this.formEl.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                await this.handleSubmitForm?.(this.inputEl.value);
                this.inputEl.value = "";
                this.hiddenModal();
            }
            catch (error) {
                alert(error);
            }
        });
        cancelBtn.addEventListener("click", () => this.hiddenModal());
        overlayEl.addEventListener("click", () => this.hiddenModal());
    }

    hiddenModal() {
        this.el.style.display = "";
        this.inputEl.value = "";
    }

    active(handleSubmitForm, inputValue = "") {
        this.el.style.display = "block";
        this.handleSubmitForm = handleSubmitForm;
        this.inputEl.value = inputValue;
    }
    
    static getIntance() {
        if (!this.intance) {
            this.intance = new Modal();
        }
        return this.intance;
    }
}
