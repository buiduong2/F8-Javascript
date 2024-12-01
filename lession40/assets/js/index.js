'use strict'
const API_URL = 'https://rv6ny5-8080.csb.app/posts?'

const postListEl = document.querySelector('.post-list')
const postListEnd = document.querySelector('.post-list-end')
const loaderEl = document.querySelector('.loader')
addInfinityScrollEvent()
function addInfinityScrollEvent() {
	const pageQuery = {
		_page: 1,
		_limit: 4
	}
	let postCount = 0
	let isFetching = false
	const overserver = new IntersectionObserver(
		entries => {
			entries.forEach(async entry => {
				if (entry.isIntersecting) {
					if (isFetching) return
					try {
						isFetching = true
						loaderEl.classList.add('loading')
						const { res, postLength } = await fetchPosts(pageQuery)
						postCount = postCount + postLength
						const totalCount = parseInt(
							res.headers.get('x-total-count') || '0'
						)
						if (postCount < totalCount) {
							pageQuery._page++
						} else {
							showToast('All Post has been successfully loaded')
							overserver.unobserve(postListEnd)
						}
					} catch (error) {
						showToast(
							'An error occurred on the server. Please try again later. ' +
								String(error)
						)
						overserver.observe(postListEnd)
					} finally {
						isFetching = false
						loaderEl.classList.remove('loading')
					}
				}
			})
		},
		{
			root: null,
			rootMargin: '0px',
			threshold: 0.9
		}
	)
	overserver.observe(postListEnd)
}
async function fetchPosts(query) {
	const searchParam = new URLSearchParams(query)
	const res = await fetch(
		API_URL + searchParam.toString()
	)
	if (!res.ok) {
		throw new Error('Server Error')
	}
	const posts = await res.json()
	const fragment = document.createDocumentFragment()
	posts.map(createPost).forEach(el => fragment.appendChild(el))
	postListEl.appendChild(fragment)
	return { res, postLength: posts.length }
}
function createPost(post) {
	const user = post.user
	const el = document.createElement('div')
	el.classList.add('post')
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
	return el
}
function showToast(msg) {
	const toastPrototype = document.querySelector('.toast')
	const clone = toastPrototype.cloneNode(true)
	toastPrototype.insertAdjacentElement('afterend', clone)
	clone.querySelector('.toast-body').innerText = msg
	const toast = bootstrap.Toast.getOrCreateInstance(clone)
	toast.show()
	clone.addEventListener('hidden.bs.toast', function (e) {
		clone.remove()
	})
}
