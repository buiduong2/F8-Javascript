import { getProductById } from '../utils/api'
import { ErrorPage } from '../Error'
import { _router } from '../utils/router';

export const ProductDetail = route => {
	const item = getProductById(Number(route.data.id))


	if (!item) {
		return ErrorPage(undefined, { code: 404, message: 'Product Not found' });
	}

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
        <div class="img-list w-3/5 flex justify-center">
            <img src="/item1.jpg" class="max-w-[400px]">
        </div>
        <div class="detail w-2/5 min-h-[400px] bg-white rounded-sm p-5">
            <h2 class="product-title text-xl font-semibold">${product.title}</h2>
            <p class="price my-5 text-2xl font-bold">${product.newPrice} đ</p>
            <div class="quantity">
                <div class="flex border w-fit font-semibold">
                    <span class="p-1 px-3 hover:border-r cursor-pointer">+</span>
                    <input
                        class="text-center w-20 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number" value="1">
                    <span class="p-1 px-3 hover:border-l cursor-pointer">-</span>
                </div>
            </div>
            <p class="action">
                <a href="/san-pham" data-navigo class=" text-center inline-block bg-orange-500 p-3 w-4/5 mt-5 text-white hover:bg-orange-600">Quay về</a>
            </p>
        </div>
    `
}
