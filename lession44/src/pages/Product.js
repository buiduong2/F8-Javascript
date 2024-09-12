import { getFilters, getProducts } from '../utils/api'
import { _router } from '../utils/router'
import { navigateTo } from '../utils/util'

export const Product = match => {
	const filters = getFilters()
	const productItems = getProducts()
	return `
    ${Filter(match, filters)}
    <div class="product-section w-4/5 shadow-lg bg-white rounded-sm ">
        <div class="product-seciton-action flex justify-between items-center p-3">
          <p>Trang 1-34 </p>
          <div class="flex gap-5 items-center">
            <p>Sắp xếp</p>
            <select class='sort-product border border-black p-1 rounded' name="sort" class="border-black border p-1">
              <option value="" active> Sắp xếp theo</option>
              <option value="price,desc"> Giá: Thấp đến cao</option>
              <option value="price,asc"> Giá: cao đến thấp</option>
              <option value="title,asc"> Tên: A-Z</option>
              <option value="title,desc"> Tên: Z-A</option>
            </select>
          </div>
        </div>

        <div class="product-list flex flex-wrap gap-y-1 mt-5">
            ${productItems.map(item => ProductItem(item)).join('')}
        </div>
    </div>

    `
}
const Filter = (match, filters) => {
	return `
    <aside class="filter bg-gray-300 w-1/5">
        ${filters
			.map(
				filter => `
        <div class="filter-item">
            <h2 class="p-3 bg-gray-800 text-white">${filter.title}</h2>
            <ul class="filter-list p-4 mb-3">
            ${filter.options
				.map(
					option => `
                <li class="filter-item">
                        <label class="cursor-pointer hover:text-blue-400">
                            <input class="mr-2 cursor-pointer" type="checkbox" value="${option.value}">
                            ${option.label}
                        </label>
                </li>
                    `
				)
				.join('')}
            </ul>
        </div>
        `
			)
			.join()}
        <div class="filter-item">
            <h2 class="p-3 bg-gray-800 text-white">TÌM KIẾM</h2>
            <div class="search-wrapper p-4 mb-3">
                <input class="search-input w-full p-2" placeholder="Nhập vào để tìm kiếm" type="text">
            </div>
        </div>
    </aside>
`
}

const ProductItem = item => {
	const product = {
		...item,
		url: '/san-pham/' + item.id,
		newPrice: (
			item.price -
			(item.price * item.discount) / 100
		).toLocaleString('en'),
		price: item.price.toLocaleString('en')
	}
	return `
		<article class="product w-1/4 flex flex-col justify-between hover:bg-white hover:shadow-lg p-3 relative">
			<div class="sale bg-red-600 text-white absolute right-0 top-0 text-center p-2
				after:block after:border-[30px] after:h-1/2 after:border-transparent after:border-t-red-600 after:absolute 
				after:top-full after:left-0 after:right-0"
			>
				<p class="text-xs">Giảm Giá</p>
				<p class="quantity font-bold">${product.discount}%</p>
			</div>
			<div class="product-header">
				<a class="cursor-pointer" href="${product.url}" data-navigo>
					<img src="${product.imgUrl}" alt="">
				</a>
			</div>
			<div class="product-body text-center">
				<a class="cursor-pointer hover:text-blue-500" href="${product.url}" data-navigo>
					<h3 class="title p-4 text-lg">${product.title}</h3>
				</a>
				<div class="price flex justify-center items-center gap-1">
				<div class="current text-orange-600 font-bold text-xl">${product.newPrice}đ</div>
				<div class="old line-through">${product.price}đ</div>
				</div>
			</div>

			<div class="product-footer mt-3 text-center">
				<button class="bg-orange-600 text-white p-4 hover:bg-orange-700">Thêm vào giỏ hàng</button>
			</div>
		</article>
    `
}

let isFirstRender = true

export function addHandler(match) {
	if (!isFirstRender) return

	addFilterHandler(match)
	addSearchFilterHandler(match)
	addSortHandler(match)
}

function addFilterHandler(match) {
	const params = match.params || {}
	const filterInputs = [...document.querySelectorAll('.filter input')]

	if (params.f) {
		filterInputs
			.filter(input => params.f.includes(input.value))
			.forEach(input => (input.checked = true))
	}

	filterInputs.forEach(input => {
		input.onchange = () => {
			let searchQuery = filterInputs
				.filter(input => input.checked)
				.map(input => `${input.value}`)
			const params = _router.lastResolved()?.[0].params || {}
			if (searchQuery.length) {
				params.f = searchQuery
			} else {
				delete params.f
			}
			navigateTo('/san-pham', params)
		}
	})
}

function addSearchFilterHandler(match) {
	const searchInput = document.querySelector('.search-input')
	if (match.params?.q) {
		searchInput.value = match.params.q.split('-')[1]
	}
	searchInput.oninput = e => {
		const params = _router.lastResolved()?.[0].params || {}

		if (searchInput.value) {
			const searchQuery = `title_like-${searchInput.value}`
			params.q = searchQuery
		} else {
			delete params.q
		}
		navigateTo('/san-pham', params)
	}
}

function addSortHandler(match) {
	const sortEl = document.querySelector('.sort-product')

	if (match.params?.s) {
		const sortValue = match.params.s
		sortEl.value = sortValue;
	}

	sortEl.onchange = e => {
		const params = _router.lastResolved()?.[0].params || {}

		if (sortEl.value) {
			params.s = sortEl.value
		} else {
			delete params.s
		}
		navigateTo('/san-pham', params)
	}
}

export function updateProduct(match) {
	const productListEl = document.querySelector('.product-list')
	const products = getProducts(match.params)
	productListEl.innerHTML = products.map(item => ProductItem(item)).join('')
}

function changeStage() {
	isFirstRender = false
}

export function cleanState(done) {
	isFirstRender = true
	done()
}

export const hooks = {
	after: [addHandler, updateProduct, changeStage],
	leave: [cleanState]
}
