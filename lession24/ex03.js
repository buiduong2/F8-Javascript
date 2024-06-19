var categories = [
	{
		id: 1,
		name: 'Chuyên mục 1',
		parent: 0
	},
	{
		id: 2,
		name: 'Chuyên mục 2',
		parent: 0
	},
	{
		id: 3,
		name: 'Chuyên mục 3',
		parent: 0
	},
	{
		id: 4,
		name: 'Chuyên mục 2.1',
		parent: 2
	},
	{
		id: 5,
		name: 'Chuyên mục 2.2',
		parent: 2
	},
	{
		id: 6,
		name: 'Chuyên mục 2.3',
		parent: 2
	},
	{
		id: 7,
		name: 'Chuyên mục 3.1',
		parent: 3
	},
	{
		id: 8,
		name: 'Chuyên mục 3.2',
		parent: 3
	},
	{
		id: 9,
		name: 'Chuyên mục 3.3',
		parent: 3
	},
	{
		id: 10,
		name: 'Chuyên mục 2.2.1',
		parent: 5
	},
	{
		id: 11,
		name: 'Chuyên mục 2.2.2',
		parent: 5
	}
]
export function transformToHierarchedCategory(categories) {
	var map = {}
	var result = []
	for (var i = 0; i < categories.length; i++) {
		var categoryId = categories[i].id
		map[categoryId] = { ...categories[i] }
	}
	for (var id in map) {
		var parentId = map[id].parent
		delete map[id].parent
		if (parentId in map) {
			if (!map[parentId].children) {
				map[parentId].children = []
			}
			map[parentId].children.push(map[id])
		} else {
			result.push(map[id])
		}
	}

	return result
}
console.log(transformToHierarchedCategory(categories))
