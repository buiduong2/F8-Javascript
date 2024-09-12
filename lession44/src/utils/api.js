import { toComparator, toPredicate } from './util'

const productItems = [
	{
		id: 1,
		imgUrl: 'item1.jpg',
		title: 'Đĩa game Spider-Man: Miles Morales',
		price: 550000,
		category: 'rpg',
		discount: 31
	},
	{
		id: 2,
		imgUrl: 'item2.jpg',
		title: 'Đĩa game Jackboy',
		price: 650000,
		category: 'action',
		discount: 31
	},
	{
		id: 3,
		imgUrl: 'item3.jpg',
		title: 'Đĩa game Crash Bandicoot 4',
		category: 'fps',
		price: 750000,
		discount: 31
	},
	{
		id: 4,
		imgUrl: 'item4.jpg',
		title: 'Đĩa game Dreams',
		category: 'sport',
		price: 850000,
		discount: 31
	},
	{
		id: 5,
		imgUrl: 'item5.jpg',
		title: 'Đĩa game Samurai Showdown',
		category: 'action',
		price: 950000,
		discount: 31
	},
	{
		id: 6,
		imgUrl: 'item6.jpg',
		title: 'Đĩa game Nioh2',
		category: 'rpg',
		price: 1000000,
		discount: 31
	}
]

const ROOT_URL = import.meta.env.ROOT_URL || '/'
if (ROOT_URL) {
	productItems.forEach(
		product => (product.imgUrl = ROOT_URL + product.imgUrl)
	)
}
const filters = [
	{
		title: 'GIÁ GỐC',
		options: [
			{
				value: 'price_between-500000,600000',
				label: '500.000 - 600.000'
			},
			{
				value: 'price_between-600000,700000',
				label: '600.000 - 700.000'
			},
			{
				value: 'price_between-700000,800000',
				label: '700.000 - 800.000'
			},
			{
				value: 'price_between-800000,1000000',
				label: '800.000 - 1.000.000'
			}
		]
	},
	{
		title: 'THỂ LOẠI',
		options: [
			{ value: 'category_equal-rpg', label: 'RPG' },
			{ value: 'category_equal-action', label: 'Action' },
			{ value: 'category_equal-fps', label: 'FPS' },
			{ value: 'category_equal-sport', label: 'Sport' }
		]
	}
]

export function getFilters() {
	return JSON.parse(JSON.stringify(filters))
}

export function getProducts(params) {
	let result = [...productItems]
	if (params) {
		const predicate = toPredicate(params)
		result = result.filter(predicate)
		const comparator = toComparator(params)
		result = result.sort(comparator)
	}
	return JSON.parse(JSON.stringify(result))
}

export function getProductById(id) {
	const product = productItems.find(product => product.id === id)
	if (!product) {
		return product
	}
	return JSON.parse(JSON.stringify(product))
}

export function existsProductById(id) {
	return productItems.some(product => product.id === id)
}
