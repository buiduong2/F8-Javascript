import { _router } from './router'

export function navigateTo(path, params) {
	const query = Object.entries(params)
		.map(([key, value]) => {
			if (typeof value === 'string') {
				return key + '=' + value
			}
			return value.map(value => key + '=' + value).join('&')
		})
		.join('&')

	if (query) {
		_router.navigate(path + '?' + query)
	} else {
		_router.navigate(path)
	}
}

export function toPredicate(params) {
	let filters = []
	if (typeof params.f === 'string') {
		filters.push(params.f)
	} else if (Array.isArray(params.f)) {
		filters.push(...params.f)
	}

	if (params.q) {
		filters.push(params.q)
	}
	const operators = {
		between(target, low, high) {
			return target >= Number(low) && target <= Number(high)
		},
		equal(target, value) {
			return target === value
		},
		like(target, keyWord) {
			return target.toUpperCase().includes(keyWord.toUpperCase())
		}
	}
	if (filters.length) {
		filters = filters.filter(identity)
		const groupByKey = groupingBy(
			filters,
			filter => filter.split('_')[0],
			filter => filter.split('_')[1]
		)

		const combine = Object.entries(groupByKey)
			.map(([key, values]) => {
				return values
					.map(value => value.split('-'))
					.map(value => [value[0], ...value[1].split(',')])
					.map(([operator, ...args]) => {
						return item => operators[operator](item[key], ...args)
					})
					.reduce(predicateOr, () => false)
			})
			.reduce(predicateAnd, () => true)

		return combine
	} else {
		return () => true
	}
}

export function toComparator(params) {
	let sort = params.s
	if (sort) {
		const [key, operator] = sort.split(',')
		const reverse = operator === 'desc'
		return (o2, o1) => {
			if (typeof o1[key] === 'string') {
				return compareString(o1[key], o2[key], reverse)
			} else {
				return compareNumber(o1[key], o2[key], reverse)
			}
		}
	} else {
		return () => 0
	}
}

function groupingBy(arr, keyMapper, valueMapper, mapSuppiler) {
	const map = mapSuppiler ? mapSuppiler() : {}
	return arr.reduce((accumulator, curr) => {
		const key = keyMapper(curr)
		const value = valueMapper(curr)
		if (!(key in accumulator)) {
			accumulator[key] = []
		}
		accumulator[key].push(value)
		return accumulator
	}, map)
}

function predicateOr(pre1, pre2) {
	return item => pre1(item) || pre2(item)
}

function predicateAnd(pre1, pre2) {
	return item => pre1(item) && pre2(item)
}

function identity(item) {
	return item
}

function compareNumber(n1, n2, reverse) {
	return reverse ? n2 - n1 : n1 - n2
}

function compareString(o1, o2, reverse) {
	const res = o1.localeCompare(o2)
	return reverse ? res * -1 : res
}
