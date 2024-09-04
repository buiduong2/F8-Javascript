import { store } from "../index.js";
export class PostEditor extends HTMLElement {
    constructor() {
        super();
        this.isFirstRender = true;
        this.formEl = this;
        this.btnLoadingEl = this;
        this.btnSubmitEl = this;
        this.cancelBtnEl = this;
        this.openFormBtnEl = this;
        this.inputDateEl = this;
    }
    addEventHandle() {
        let isFetching = false;
        this.inputDateEl.addEventListener("blur", e => {
            const value = this.inputDateEl.value;
            const pickedDate = new Date(value);
            console.log(new Date(this.inputDateEl.min));
            if (pickedDate < new Date(this.inputDateEl.min)) {
                setTimeout(() => this.inputDateEl.value = this.inputDateEl.min, 1000);
                store.addNotification("warn", "Published Date not valid.\n Choose current Date by default");
            }
        });
        this.formEl.onsubmit = async (e) => {
            e.preventDefault();
            if (isFetching) {
                return;
            }
            isFetching = true;
            this.btnLoadingEl.style.display = "";
            this.btnSubmitEl.style.display = "none";
            const postReq = Object.fromEntries(new FormData(this.formEl));
            try {
                let isValidData = true;
                for (const element of Object.values(postReq)) {
                    if (element.trim().length === 0) {
                        isValidData = false;
                        break;
                    }
                }
                if (isValidData) {
                    await this.onPostEditorSubmit?.(postReq);
                    this.formEl.reset();
                }
                else {
                    store.addNotification("warning", "All input field is required");
                }
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.btnLoadingEl.style.display = "none";
                this.btnSubmitEl.style.display = "";
                isFetching = false;
            }
        };
        this.openFormBtnEl.addEventListener("click", e => {
            e.preventDefault();
            this.formEl.style.display = "";
            this.openFormBtnEl.style.display = "none";
        });
        this.cancelBtnEl.addEventListener("click", e => {
            e.preventDefault();
            this.formEl.style.display = "none";
            this.openFormBtnEl.style.display = "block";
            this.formEl.reset();
        });
    }
    connectedCallback() {
        if (this.isFirstRender) {
            this.innerHTML = innerHTML;
            this.formEl = this.querySelector("form");
            this.btnLoadingEl = this.querySelector(".btn-load");
            this.btnSubmitEl = this.querySelector(".btn-submit");
            this.cancelBtnEl = this.querySelector(".btn-cancel");
            this.openFormBtnEl = this.querySelector(".btn-open");
            this.inputDateEl = this.querySelector(".input-date");
            this.formEl.style.display = "none";
            this.addEventHandle();
            this.isFirstRender = false;
        }
    }
}
const currentDate = new Date();
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() + 1);
currentDate.setHours(currentDate.getHours() + 7);
maxDate.setHours(currentDate.getHours() + 7);
const innerHTML = `
    <div class="col-full push-top" >
        <div>
            <button class="btn-open btn-blue">Create a post</button>
        </div>
        <form action="#">
            <div class="form-group">
                <label for="email">Title</label>
                <input id="title" name="title" type="name" class="form-input" placeholder="Enter the post title.." required>
            </div>
            <div class="form-group">
                <label for="email">Content</label>
                <textarea id="text" rows="10" class="form-input" name="content" placeholder="Enter the content of your post...." required></textarea>
            </div>
            <div class="form-group">
                <label for="email">Set Time To Post</label>
                <br>
                <span class="text-small text-faded">If you try to select a time before the current time then the post will be sent immediately</span>
                <br>
                <input type="datetime-local"
                    style="max-width:400px"
                    class="form-input input-date" 
                    name='publishedAt' 
                    value="${currentDate.toISOString().substring(0, 16)}"
                    min="${currentDate.toISOString().substring(0, 16)}"
                    max="${maxDate.toISOString().substring(0, 16)}" 
                />
            </div>
            <div class="form-actions">
                <button class='btn-ghost btn-cancel'>Cancel</button>
                <button class="btn-submit btn-blue">Submit</button>
                <button class="btn-load btn-blue" disabled style="display:none">
                    <i class="fa fa-spinner fa-spin"></i>Loading
                </button>
            </div>
        </form>
    </div>
`;
