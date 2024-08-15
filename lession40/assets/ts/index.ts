const postListEl = document.querySelector(".post-list") as HTMLElement;
const postListEnd = document.querySelector(".post-list-end") as HTMLElement;
const loaderEl = document.querySelector(".loader") as HTMLElement;

addInfinityScrollEvent()
function addInfinityScrollEvent() {
    const pageQuery = {
        _page: 1,
        _limit: 4,
    }
    let postCount = 0;
    let isFetching = false;
    const overserver = new IntersectionObserver((entries) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                if (isFetching) return;
                try {
                    isFetching = true;
                    loaderEl.classList.add("loading");

                    const { res, postLength } = await fetchPosts(pageQuery)
                    postCount = postCount + postLength;
                    const totalCount = parseInt(res.headers.get('x-total-count') || '0')
                    if (postCount < totalCount) {
                        pageQuery._page++;
                    } else {
                        overserver.unobserve(postListEnd);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    isFetching = false;
                    loaderEl.classList.remove("loading");
                }

            }
        })
    },
        {
            root: null,
            rootMargin: '0px',
            threshold: 0.9
        })

    overserver.observe(postListEnd);
}

async function fetchPosts(query: any) {
    const searchParam = new URLSearchParams(query as any);
    const res = await fetch('http://localhost:3000/posts?' + searchParam.toString());

    const posts: any[] = await res.json();
    posts.map(createPost).forEach(el => postListEl.appendChild(el));
    return { res, postLength: posts.length };
}

function createPost(post: any): HTMLElement {
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
                `
    return el;
}
