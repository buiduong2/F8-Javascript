"use strict";
const postListEl = document.querySelector(".post-list");
const postListEnd = document.querySelector(".post-list-end");
const loaderEl = document.querySelector(".loader");
addInfinityScrollEvent();
function addInfinityScrollEvent() {
    const pageQuery = {
        _page: 1,
        _limit: 4,
    };
    let postCount = 0;
    let isFetching = false;
    const overserver = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
            if(isFetching) return;
            if (entry.isIntersecting) {
                try {
                    isFetching = true;
                    loaderEl.classList.add("loading");
                    const { res, postLength } = await fetchPosts(pageQuery);
                    postCount += postLength;
                    const totalCount = parseInt(res.headers.get('x-total-count') || '0');
                    if (postCount < totalCount) {
                        pageQuery._page++;
                    }
                    else {
                        console.log("done");
                        overserver.unobserve(postListEnd);
                    }
                }
                catch (error) {
                    console.log(error);
                }
                finally {
                    isFetching = false;
                    loaderEl.classList.remove("loading");
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.9
    });
    overserver.observe(postListEnd);
}
async function fetchPosts(query) {
    const searchParam = new URLSearchParams(query);
    const res = await fetch('https://stvp8n-8080.csb.app/posts?' + searchParam.toString());
    const posts = await res.json();
    posts.map(createPost).forEach(el => postListEl.appendChild(el));
    return { res, postLength: posts.length };
}
function createPost(post) {
    const user = post.user;
    const el = document.createElement("div");
    el.classList.add("post");
    el.innerHTML = `
                    <div class="user-info">
                        <a href="profile.html#profile-details" class="user-name">${user.name}</a>

                        <a href="profile.html#profile-details">
                            <img class="avatar-large" src="${user.avatar}" alt="">
                        </a>

                        <p class="desktop-only text-small">${user.postsCount} posts</p>

                        <p class="desktop-only text-small">${user.threadsCount} threads</p>

                        <span class="online desktop-only">online</span>

                    </div>

                    <div class="post-content">
                        <div>
                            ${post.text}
                        </div>
                    </div>



                    <div class="post-date text-faded">
                        ${post.publishedAt}
                    </div>

                    <div class="reactions">
                        <button class="btn-xsmall">+ <i class="fa fa-smile-o emoji"></i></button>
                    </div>
                `;
    return el;
}
