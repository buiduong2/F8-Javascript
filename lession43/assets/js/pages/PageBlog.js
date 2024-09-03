import { PageAbstract } from "./PageAbstract.js";
import { store } from "../index.js";
import { detailedFromNow } from "../utils/utils.js";
export class PageBlog extends PageAbstract {
    constructor() {
        super();
        this.isFirstRender = true;
        this.currentPage = 1;
        this.indicatorEl = this;
        this.postListEl = this;
        this.appInfinityEl = this;
        this.postEditorEl = this;
    }
    async addCreatePostHandler() {
        const addPost = async (postReq) => {
            const post = await store.createPost(postReq);
            store.posts.unshift(post);
            if (post.content.length > 100) {
                post.content = post.content.slice(0, 100) + " ...";
            }
            const postItemEl = document.createElement("post-item");
            postItemEl.renderData(store.posts, 0);
            this.postListEl.insertAdjacentElement("afterbegin", postItemEl);
            return postItemEl;
        };
        this.postEditorEl.onPostEditorSubmit = async (postReq) => {
            const publishedAt = postReq.publishedAt;
            delete postReq.publishedAt;
            if (publishedAt && new Date(publishedAt).getTime() > Date.now()) {
                const publishedAtDate = new Date(publishedAt);
                const dateDetailedFromNow = detailedFromNow(publishedAt);
                const localDateTimeStr = publishedAtDate.toLocaleDateString() + " at " + publishedAtDate.toLocaleTimeString();
                store.addNotification("info", `Your post will be published on ${localDateTimeStr} \n (In ${dateDetailedFromNow})`);
                const delay = Date.parse(publishedAt) - Date.now();
                setTimeout(async () => {
                    addPost(postReq);
                }, Math.max(0, delay));
                return;
            }
            const postItemEl = await addPost(postReq);
            window.scrollTo({
                behavior: "smooth",
                top: postItemEl.offsetTop - 100
            });
        };
    }
    async fetchPosts() {
        const posts = await store.getPosts(this.currentPage);
        if (posts.length === 0) {
            this.appInfinityEl.remove();
            return;
        }
        posts.forEach(post => {
            if (post.content.length > 100) {
                post.content = post.content.slice(0, 100) + " ...";
            }
        });
        const oldLength = store.posts.length;
        store.posts.push(...posts);
        let delay = 0;
        for (let i = oldLength; i < store.posts.length; i++) {
            setTimeout(() => {
                const postItemEl = document.createElement("post-item");
                postItemEl.renderData(store.posts, i);
                this.postListEl.insertBefore(postItemEl, this.indicatorEl);
            }, delay);
            delay += 300;
        }
    }
    addInfinityScrollHandle() {
        let isFetching = false;
        this.appInfinityEl.addEventListener("visibile", async (e) => {
            if (!isFetching) {
                try {
                    isFetching = true;
                    this.indicatorEl.style.display = "";
                    await this.fetchPosts();
                    this.currentPage++;
                }
                catch (error) {
                    console.error(error);
                }
                finally {
                    this.indicatorEl.style.display = "none";
                    isFetching = false;
                }
            }
        });
    }
    async beforeRender() {
        if (this.isFirstRender) {
            this.innerHTML = innerHTML;
            this.indicatorEl = this.querySelector(".loading-indicator");
            this.postListEl = this.querySelector(".post-list");
            this.appInfinityEl = this.querySelector("app-infinity-scroll");
            this.postEditorEl = this.querySelector("post-editor");
            this.addCreatePostHandler();
            this.addInfinityScrollHandle();
        }
        this.isFirstRender = false;
    }
}
const innerHTML = `
    <div class="col-large push-top">
        <ul class="breadcrumbs">
            <li><app-link v-to="{name: 'Blog'}" ><i class="fa fa-home fa-btn"></i>Home</app-link></li>
        </ul>

        <h1>Blog Của Dương</h1>

        <p>
            By <a href="#" class="link-unstyled">Robin</a>, 2 hours ago.
            <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">3 replies by 3
                contributors</span>
        </p>
        <app-auth v-auth="guest">
            <div class="text-center">
                <app-link v-to="{name: 'Login'}"> Sign In</app-link> 
                or <app-link v-to="{name: 'Register'}">Register</app-link> to reply. 
            </div>
        </app-auth>
        <app-auth v-auth="auth">
            <post-editor></post-editor>
        </app-auth>
        <div class="post-list"> 
            <div class='loading-indicator'>
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>        
        </div>
        <app-infinity-scroll></app-infinity-scroll>
    </div>
`;
