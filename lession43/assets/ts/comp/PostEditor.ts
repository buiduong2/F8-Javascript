import { store } from "../index.js";
import { PostReq } from "../types/type";

export class PostEditor extends HTMLElement {

    isFirstRender: boolean;
    formEl: HTMLFormElement;
    btnSubmitEl: HTMLButtonElement;
    btnLoadingEl: HTMLButtonElement;
    cancelBtnEl: HTMLButtonElement;
    openFormBtnEl: HTMLButtonElement;
    inputDateEl: HTMLInputElement;
    onPostEditorSubmit?: (postReq: PostReq) => Promise<void>;

    constructor() {
        super();
        this.isFirstRender = true;
        this.formEl = this as any;
        this.btnLoadingEl = this as any;
        this.btnSubmitEl = this as any;
        this.cancelBtnEl = this as any;
        this.openFormBtnEl = this as any;
        this.inputDateEl = this as any;
    }


    addEventHandle() {
        let isFetching = false;
        this.inputDateEl.addEventListener("blur", e => {
            const value = this.inputDateEl.value;
            const pickedDate = new Date(value);
            console.log(new Date(this.inputDateEl.min as string))
            if (pickedDate < new Date(this.inputDateEl.min as string)) {
                this.inputDateEl.value = this.inputDateEl.min;
                store.addNotification("warn", "Published Date not valid.\n Choose current Date by default")
            }
        })



        this.formEl.onsubmit = async e => {
            e.preventDefault();
            if (isFetching) {
                return;
            }
            isFetching = true;
            this.btnLoadingEl.style.display = "";
            this.btnSubmitEl.style.display = "none";

            const postReq = Object.fromEntries(new FormData(this.formEl) as any) as PostReq;

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
                } else {
                    store.addNotification("warning", "All input field is required");
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.btnLoadingEl.style.display = "none";
                this.btnSubmitEl.style.display = "";
                isFetching = false;
            }
        }


        this.openFormBtnEl.addEventListener("click", e => {
            e.preventDefault();
            this.formEl.style.display = "";
            this.openFormBtnEl.style.display = "none"
        })
        this.cancelBtnEl.addEventListener("click", e => {
            e.preventDefault();
            this.formEl.style.display = "none";
            this.openFormBtnEl.style.display = "block"
            this.formEl.reset();
        })


    }

    connectedCallback() {
        if (this.isFirstRender) {
            this.innerHTML = innerHTML;
            this.formEl = this.querySelector("form") as HTMLFormElement;
            this.btnLoadingEl = this.querySelector(".btn-load") as HTMLButtonElement;
            this.btnSubmitEl = this.querySelector(".btn-submit") as HTMLButtonElement;
            this.cancelBtnEl = this.querySelector(".btn-cancel") as HTMLButtonElement;
            this.openFormBtnEl = this.querySelector(".btn-open") as HTMLButtonElement;
            this.inputDateEl = this.querySelector(".input-date") as HTMLInputElement;
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
`