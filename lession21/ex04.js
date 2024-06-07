var data = [
	[
		'https://fastly.picsum.photos/id/1045/536/354.jpg?hmac=tYGrnSarkqEFrV8Xhe__wg3gQainNqYXisMPSpA01q8',
		'Tiêu đề bài viết 1',
		'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, magnam voluptatem? Dolor consequatur optio voluptate mollitia sint cupiditate! Quibusdam impedit voluptatibus nulla ut ad quisquam obcaecati ullam corrupti voluptas harum!'
	],
	[
		'https://fastly.picsum.photos/id/1045/536/354.jpg?hmac=tYGrnSarkqEFrV8Xhe__wg3gQainNqYXisMPSpA01q8',
		'Tiêu đề bài viết 2',
		'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, magnam voluptatem? Dolor consequatur optio voluptate mollitia sint cupiditate! Quibusdam impedit voluptatibus nulla ut ad quisquam obcaecati ullam corrupti voluptas harum!'
	],
	[
		'https://fastly.picsum.photos/id/1045/536/354.jpg?hmac=tYGrnSarkqEFrV8Xhe__wg3gQainNqYXisMPSpA01q8',
		'Tiêu đề bài viết 3',
		'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, magnam voluptatem? Dolor consequatur optio voluptate mollitia sint cupiditate! Quibusdam impedit voluptatibus nulla ut ad quisquam obcaecati ullam corrupti voluptas harum!'
	]
]
render(data)
function render(data) {
	document.write('<div class="container">')
	data.forEach(function (box) {
		renderBox(box)
	})
	document.write('</div>')
}

function renderBox(box) {
	var imgUrl = box[0]
	var title = box[1]
	var content = box[2]
	var html = `
        <div class="box">
            <div class="box-img">
                <img src="${imgUrl}"
                    alt="">
            </div>
            <div class="box-content">
                <h2 class="box-title">${title}</h2>
                <p class="box-para">${content}</p>
            </div>
        </div>
    `

	document.write(html)
}
