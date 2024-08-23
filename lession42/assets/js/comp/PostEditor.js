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
    }
    addEventHandle() {
        let isFetching = false;
        this.formEl.onsubmit = async (e) => {
            e.preventDefault();
            isFetching = true;
            this.btnLoadingEl.style.display = "";
            this.btnSubmitEl.style.display = "none";
            console.log(this.btnSubmitEl);
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
            this.formEl.style.display = "none";
            this.addEventHandle();
            this.isFirstRender = false;
        }
    }
}
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
