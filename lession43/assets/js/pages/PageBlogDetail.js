import { PageAbstract } from "./PageAbstract.js";
import { Router } from "../utils/Router.js";
import { store } from "../index.js";
export class PageBlogDetail extends PageAbstract {
    async beforeRender() {
        const { id } = Router.getIntance().prop;
        this.innerHTML =
            `
            <div class="col-large push-top">
                <ul class="breadcrumbs">
                    <li><app-link v-to="{name: 'Blog'}"><i class="fa fa-home fa-btn"></i>Home</app-link></li>
                    <li><a href="category.html">Blog Details</a></li>
                </ul>
        
                <h1 class='page-title'>Trang bài viết chi tiết </h1>
                <div class="post-list"> 
                    <div class='loading-indicator'>
                        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>      
                </div>
            </div>
        `;
        if (!id)
            throw new Error("must Have Id");
        const post = await store.getPostById(id);
        const postItem = document.createElement("post-item");
        postItem.renderData([post], 0);
        const loading = this.querySelector(".loading-indicator");
        loading.replaceWith(postItem);
    }
}
