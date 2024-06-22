var categories = [
	{
		id: 1,
		name: 'Chuyên mục 1'
	},
	{
		id: 2,
		name: 'Chuyên mục 2',
		children: [
			{
				id: 4,
				name: 'Chuyên mục 2.1'
			},
			{
				id: 5,
				name: 'Chuyên mục 2.2',
				children: [
					{
						id: 10,
						name: 'Chuyên mục 2.2.1'
					},
					{
						id: 11,
						name: 'Chuyên mục 2.2.2'
					},
					{
						id: 12,
						name: 'Chuyên mục 2.2.3'
					}
				]
			},
			{
				id: 6,
				name: 'Chuyên mục 2.3'
			}
		]
	},
	{
		id: 3,
		name: 'Chuyên mục 3',
		children: [
			{
				id: 7,
				name: 'Chuyên mục 3.1'
			},
			{
				id: 8,
				name: 'Chuyên mục 3.2'
			},
			{
				id: 9,
				name: 'Chuyên mục 3.3'
			}
		]
	}
]
createOptions('#select')

function createOptions(selector) {
	var selectEl = document.querySelector(selector)
	var items = [{ id: -1, name: 'Chọn Chuyên mục' }].concat(categories)
	selectEl.innerHTML = getCategoryOptionsHTML(items)
}

function getCategoryOptionHTML(category, childLevel) {
	var prefix = ''
	while (childLevel && childLevel > 0) {
		prefix += '--|'
		childLevel--
	}

	return `<option value="${category.id}">${prefix}${category.name}</option>`
}

function getCategoryOptionsHTML(categories, childLevel) {
	childLevel = childLevel ?? 0

	return categories
		.map(category => {
			if (category.children?.length > 0) {
				return (
					getCategoryOptionHTML(category, childLevel) +
					getCategoryOptionsHTML(category.children, childLevel + 1)
				)
			} else {
				return getCategoryOptionHTML(category, childLevel)
			}
		})
		.join('')
}
