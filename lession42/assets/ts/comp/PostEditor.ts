import { PostReq, PostRes } from "../types/type";

export class PostEditor extends HTMLElement {

    isFirstRender: boolean;
    formEl: HTMLFormElement;
    btnSubmitEl: HTMLButtonElement;
    btnLoadingEl: HTMLButtonElement;
    onPostEditorSubmit?: (postReq: PostReq) => Promise<void>;

    constructor() {
        super();
        this.isFirstRender = true;
        this.formEl = this as any;
        this.btnLoadingEl = this as any;
        this.btnSubmitEl = this as any;
    }


    addEventHandle() {
        let isFetching = false;

        this.formEl.onsubmit = async e => {
            e.preventDefault();
            const content = new FormData(this.formEl).get("content")?.toString();
            if (!content) return
            isFetching = true;
            this.btnLoadingEl.style.display = "";
            this.btnSubmitEl.style.display = "none";

            const postReq: PostReq = {
                content,
                title: "Post From Blog của Dương"
            }

            try {
                await this.onPostEditorSubmit?.(postReq);
                this.formEl.reset();
            } catch (error) {
                console.log(error);
            } finally {
                this.btnLoadingEl.style.display = "none";
                this.btnSubmitEl.style.display = "";
                isFetching = false;
            }
        }

    }

    connectedCallback() {
        if (this.isFirstRender) {
            this.innerHTML = innerHTML;
            this.formEl = this.querySelector("form") as HTMLFormElement;
            this.btnLoadingEl = this.querySelector(".btn-load") as HTMLButtonElement;
            this.btnSubmitEl = this.querySelector(".btn-submit") as HTMLButtonElement;
            this.addEventHandle();
            this.isFirstRender = false;
        }
    }
}

const innerHTML = `
    <div class="col-full">
        <form novalidate="" action="#">
            <div class="form-group">
                <textarea id="text" rows="10" class="form-input" name="content" required></textarea>
            </div>
            <div class="form-actions">
                <button class="btn-submit btn-blue">Submit</button>
                <button class="btn-load btn-blue" disabled style="display:none">
                    <i class="fa fa-spinner fa-spin"></i>Loading
                </button>
            </div>
        </form>
    </div>

`