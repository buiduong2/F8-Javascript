import { PageAuthForm } from "./PageAuthForm.js";
import { httpClient } from "../index.js";
import { Router } from "../utils/Router.js";
import { store } from "../index.js";
export class PageLogin extends PageAuthForm {
    getInnerHTML() {
        return innerHTML;
    }
    async handleFormSubmit(authReq) {
        try {
            const data = await httpClient.login(authReq);
            if (data.code === 200) {
                const authRes = data.data;
                store.addNotification("success", "Login Successful");
                store.updateAuthFromLogin(authRes);
                Router.getIntance().push({ name: "Blog" });
            }
            else if (data.code >= 400) {
                store.addNotification("warning", data.message);
            }
            else {
                throw new Error("Some Type Of Response doesn't implemted Yet");
            }
        }
        catch (error) {
            store.addNotification("error", error.message);
        }
    }
}
const innerHTML = `
<div class="flex-grid justify-center">
        <div class="col-2">

            <form action="" class="card card-form">
                <h1 class="text-center">Login</h1>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" name="email" type="email" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" type="password" name="password" class="form-input" required>
                </div>

                <div class="push-top">
                    <button type="submit" class="btn-submit btn-blue btn-block">Log in</button>
                    <button class="btn-load btn-blue btn-block" disabled style="display:none">
                        <i class="fa fa-spinner fa-spin"></i>Loading
                    </button>
                </div>

                <div class="form-actions text-right">
                    <app-link v-to="{name: 'Register', meta:{redirect: 'Login'} }">Create an account?</app-link>
                </div>
            </form>

            <div class="push-top text-center">
                <button class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign in with Google</button>

            </div>
        </div>
    </div>
`;
