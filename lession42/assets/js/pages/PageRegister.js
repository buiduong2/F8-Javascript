import { PageAuthForm } from "./PageAuthForm.js";
import { store } from "../index.js";
import { Router } from "../utils/Router.js";
export class PageRegister extends PageAuthForm {
    async handleFormSubmit(registerReq) {
        const successful = await store.register(registerReq);
        if (!successful)
            throw new Error("Error");
        Router.getIntance().push({ name: "Login" });
    }
    getInnerHTML() {
        return innerHTML;
    }
}
const innerHTML = `
        <div class="flex-grid justify-center">
            <div class="col-2">

                <form action="" class="card card-form">
                    <h1 class="text-center">Register</h1>

                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input id="name" name="name" type="text" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input id="password" name="password" type="password" class="form-input" required>
                    </div>


                    <div class="form-actions">
                        <button type="submit" class="btn-submit btn-blue btn-block">Register</button>
                        <button class="btn-load btn-blue btn-block" disabled style="display:none">
                            <i class="fa fa-spinner fa-spin"></i>Loading
                        </button>
                    </div>

                </form>
                <div class="text-center push-top">
                    <button class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign up with Google</button>
                </div>
          </div>
      </div>
`;
