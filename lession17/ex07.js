document.write('<div class="row">')

for (var i = 1; i <= 10; i++) {
	document.write('<div class="col-1-5">')
	for (var j = 1; j <= 10; j++) {
		document.write(`<p>${i} x ${j} = ${i * j}</p>`)
	}
	document.write('</div class="col-1-5">')
}
document.write('</div class="row">')
