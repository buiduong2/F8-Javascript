import { store } from "../index.js";
import { Router } from "../utils/Router.js";
import { PageAbstract } from "./PageAbstract.js";
import { escapeHTML } from "../utils/utils.js";
export class PageProfile extends PageAbstract {
    constructor() {
        super();
    }
    setHTML(user, pageOwner) {
        user.name = escapeHTML(user.name);
        this.innerHTML =
            `
        <div class="flex-grid">
            <div class="col-3 push-top">

                <div class="profile-card">

                    <p class="text-center">
                        <app-avatar-img  v-src="${user.avatar} " v-userName="${user.name}" class="avatar-xlarge">
                    </p>

                    <h1 class="title">${user.name}</h1>

                    <p class="text-lead">${user.role}</p>

                    <p class="text-justify">
                        No bio specified.
                    </p>

                    <span class="online">${user.name} is online</span>


                    <div class="stats">
                        <span>116 posts</span>
                        <span>73 threads</span>
                    </div>

                    <hr>

                    <p class="text-large text-center"><i class="fa fa-globe"></i> <a href="#">batman.com</a></p>

                </div>

                <p class="text-xsmall text-faded text-center">Member since ${user.createdAt}, last visited ${user.updatedAt}</p>

                <div class="text-center">
                    <hr>
                    ${pageOwner ? '<a href="edit-profile.html" class="btn-green btn-small">Edit Profile</a>' : ''}
                </div>

            </div>

            <div class="col-7 push-top">

                <div class="profile-header">
                    <span class="text-lead">
                        ${user.name}'s recent activity
                    </span>
                    <a href="#">See only started threads?</a>
                </div>

                <hr>
                <div class="post-list"> 
        
                </div>
            </div>
      </div>
        `;
    }
    setDefaultHTML() {
        this.innerHTML = `
            <div class='loading-indicator'>
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>     
        `;
    }
    addPost(userRes) {
        const postListEl = this.querySelector(".post-list");
        const posts = userRes.blogs.map(blog => {
            return {
                ...blog,
                timeUp: blog.createdAt,
                userId: {
                    _id: userRes._id,
                    name: userRes.name
                },
            };
        });
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < userRes.blogs.length; i++) {
            const postItemEl = document.createElement("post-item");
            postItemEl.renderData(posts, i);
            fragment.appendChild(postItemEl);
        }
        postListEl.appendChild(fragment);
    }
    async beforeRender() {
        const { id } = Router.getIntance().prop;
        this.setDefaultHTML();
        let isPageOwner = false;
        let userInfo;
        if (id) {
            userInfo = await store.getUserInfo(id);
        }
        else {
            userInfo = await store.getAuthInfo();
        }
        this.setHTML(userInfo, isPageOwner);
        this.addPost(userInfo);
    }
}
