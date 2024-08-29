import { Router } from "../utils/Router.js";
import { applyTransitionClasses, showFromNow, escapeHTML } from "../utils/utils.js";
export class PostItem extends HTMLElement {
    renderData(collections, index) {
        const post = collections[Number(index)];
        post.userId.name = escapeHTML(post.userId.name);
        this.innerHTML = `
            <div class="post">
                <div class="user-info">
                    <app-link v-to="{name: 'Profile', params: {id: '${post.userId._id}'}}" href="#" class="user-name">
                        ${post.userId.name}
                    </app-link>
                    <app-link v-to="{name: 'Profile', params: {id: '${post.userId._id}'}}" >
                        <app-avatar-img v-src=" " v-userName="${post.userId.name}" class="avatar-large">    
                    </app-link >
                </div>
                <div class="post-content">
                    <div class="col-full">
                        <div>
                            <app-link v-to="{name: 'BlogDetail', params: {id: '${post._id}'}}">
                                <h3>
                                    ${post.title}
                                </h3>
                            </app-link>
                            <hr>
                            <p>${post.content}</p>

                            
                        </div>
                    </div>
                    <a href="#" class="link-unstyled" title="Make a change" style="margin-left: auto; padding-left: 10px;">
                        <svg class="svg-inline--fa fa-pencil"
                            aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pencil" role="img"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path class="" fill="currentColor"
                                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z">
                            </path>
                        </svg>
                    </a>
                </div>
                <div class="post-date text-faded">
                    <app-link 
                        v-to="{name: 'BlogDetail', params: {id: '${post._id}'}}"
                        class="read-more-btn"
                        style="margin-right:20px"
                     >Read More</app-link>
                    <span class="ml-5" title="${new Date(post.createdAt).toString()}">${showFromNow(post.createdAt)}</span>
                </div>
            </div>
        `;
    }
    connectedCallback() {
        applyTransitionClasses(this, "post-item-enter");
        const readMore = this.querySelector(".read-more-btn");
        if (!Router.getIntance().prop.id) {
            readMore.style.display = "";
        }
        else {
            readMore.style.display = "none";
        }
    }
}
