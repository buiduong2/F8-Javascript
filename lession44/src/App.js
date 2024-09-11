import './assets/style.css'
import { router } from './utils/router'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Product } from './pages/Product'
import { ProductDetail } from './pages/ProductDetail'
import { DefaultLayout } from './layouts/Default'

// Import các icons cần sử dụng
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

library.add(faCartShopping)
dom.watch()

export const App = () => {
	return router(
		[
			{
				path: '/',
				component: Home
			},
			{
				path: '/gioi-thieu',
				component: About
			},
			{
				path: '/san-pham',
				component: Product
			},
			{
				path: '/san-pham/:id',
				component: ProductDetail
			}
		],
		DefaultLayout
	)
}
