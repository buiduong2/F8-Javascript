import { PostEditor } from "./comp/PostEditor.js";
import { PostItem } from "./comp/PostItem.js";
import { TheNavBar } from "./comp/TheNavBar.js";
import { PageBlog } from "./pages/PageBlog.js";
import { PageLogin } from "./pages/PageLogin.js";
import { PageProfile } from "./pages/PageProfile.js";
import { PageRegister } from "./pages/PageRegister.js";
import { PageBlogDetail } from "./pages/PageBlogDetail.js";
import { AppAuth } from "./utils/AppAuth.js";
import { AppInfinityScroll } from "./utils/AppInfinityScroll.js";
import { AppLink } from "./utils/AppLink.js";
import { AppNotification } from "./utils/AppNotification.js";
import { AppAvatarImg } from "./utils/AppAvatarImg.js";
import { Router } from "./utils/Router.js";
import { Store } from "./app.js";
import { HttpClient } from "./utils/HttpClient.js";
const appEl = document.querySelector("#app");
export const API_SERVER = 'https://api-auth-two.vercel.app';
export const httpClient = new HttpClient(API_SERVER);
export const store = new Store();
const routes = [
    {
        name: "Blog",
        path: "/",
        ctor: PageBlog,
        props: false,
        meta: {}
    },
    {
        name: "BlogDetail",
        path: "/blog",
        ctor: PageBlogDetail,
        props: true,
        dynamic: true
    },
    {
        name: "Register",
        ctor: PageRegister,
        props: true,
        path: "/regirester",
        meta: {
            auth: "guest"
        },
    },
    {
        name: "Login",
        path: "/sign-in",
        ctor: PageLogin,
        props: true,
        meta: {
            auth: "guest"
        },
    },
    {
        name: "Me",
        path: "/@me",
        ctor: PageProfile,
        props: true,
        meta: {
            auth: "auth"
        }
    },
    {
        name: "Profile",
        path: "/profile",
        ctor: PageProfile,
        props: true,
        dynamic: true,
    }
];
async function loadUserInfo() {
    await store.loadUserInfoFromToken();
    Router.createRouter(routes, appEl);
}
customElements.define('app-infinity-scroll', AppInfinityScroll);
customElements.define('the-nav-bar', TheNavBar);
customElements.define('app-link', AppLink);
customElements.define('app-auth', AppAuth);
customElements.define('post-item', PostItem);
customElements.define('post-editor', PostEditor);
customElements.define('app-notification', AppNotification);
customElements.define('app-avatar-img', AppAvatarImg);
loadUserInfo();
