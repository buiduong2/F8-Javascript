export class PostEditor extends HTMLElement {
    constructor() {
        super();
        this.isFirstRender = true;
        this.formEl = this;
        this.btnLoadingEl = this;
        this.btnSubmitEl = this;
    }
    addEventHandle() {
        let isFetching = false;
        this.formEl.onsubmit = async (e) => {
            e.preventDefault();
            const content = new FormData(this.formEl).get("content")?.toString();
            if (!content)
                return;
            isFetching = true;
            this.btnLoadingEl.style.display = "";
            this.btnSubmitEl.style.display = "none";
            const postReq = {
                content,
                title: "Post From Blog của Dương"
            };
            try {
                await this.onPostEditorSubmit?.(postReq);
                this.formEl.reset();
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
    }
    connectedCallback() {
        if (this.isFirstRender) {
            this.innerHTML = innerHTML;
            this.formEl = this.querySelector("form");
            this.btnLoadingEl = this.querySelector(".btn-load");
            this.btnSubmitEl = this.querySelector(".btn-submit");
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

`;
