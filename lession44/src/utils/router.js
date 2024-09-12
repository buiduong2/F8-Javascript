import Navigo from 'navigo'
import { ErrorPage } from '../Error'
import { hooks as productHook } from '../pages/Product'

const notFoundMsg =
	'The Page you are Looking for may have been moved, deleted, or possibly nerver exists'
const errorMsg = 'The Server encounterd an internal Error'

const app = document.querySelector('#app')
export const _router = new Navigo(import.meta.env.ROOT_URL, { hash: true })

export function router(routes, layout) {
	let innerHTML = layout()
	innerHTML = innerHTML.replace(
		'{body}',
		`<span class="js-page-view"></span>`
	)
	app.innerHTML = innerHTML

	let pageViewEl = app.querySelector('.js-page-view')

	if (pageViewEl.parentElement.children.length > 1) {
		throw new Error("{body} must be only child of it's parent ")
	}

	const parent = pageViewEl.parentElement

	routes.forEach(route => {
		_router.on(route.path, match => {
			try {
				if (_router.lastResolved()?.[0].url === match.url) {
					return
				}
				parent.innerHTML = route.component(match)
			} catch (error) {
				console.warn(error)
				_router.navigateByName('500')
			}
		})
	})

	_router.getRoute('/san-pham').hooks = productHook

	_router.on({
		'/not-found/': {
			as: '404',
			uses: match => {
				parent.innerHTML = ErrorPage(match, {
					code: 404,
					message: notFoundMsg
				})
			}
		},
		'/error': {
			as: '500',
			uses: match => {
				parent.innerHTML = ErrorPage(match, {
					code: 500,
					message: errorMsg
				})
			}
		}
	})

	_router.notFound(route => {
		parent.innerHTML = ErrorPage(route, {
			code: 404,
			message: notFoundMsg
		})
	})

	_router.resolve()
}
