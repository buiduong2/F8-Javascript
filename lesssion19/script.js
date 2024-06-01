var str = ` Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi vitae magnam unde, inventore optio repudiandae ipsa
qui! Soluta provident nulla eligendi dolorem, excepturi eum dolor saepe omnis at,`
hightLightText(str)

function hightLightText(str) {
	var left = 0
	var right = left + 1
	setInterval(() => {
		left = indexOfCharacter(str, left)
		right = indexOfNonCharacter(str, left)
		if (left === str.length) {
			console.log(hightLight(str, left, right))
		}

		document.querySelector('body').innerHTML = hightLight(str, left, right)

		if (right === -1) {
			left = 0
		} else {
			left = right + 1
		}
	}, 500)

	function hightLight(str, left, right) {
		if (right === -1) {
			return (
				str.substring(0, left) +
				`<span style="background-color:yellow;">${str.substring(
					left
				)}</span>`
			)
		} else {
			return (
				str.substring(0, left) +
				`<span>${str.substring(left, right)}</span>` +
				str.substring(right)
			)
		}
	}

	function indexOfCharacter(str, left) {
		while ((str[left] === ' ' || str[left] === '\n') && left < str.length) {
			left++
		}

		return left === str.length ? indexOfCharacter(str, 0) : left
	}

	function indexOfNonCharacter(str, left) {
		while (str[left] !== ' ' && str[left] !== '\n' && left < str.length) {
			left++
		}

		return left === str.length ? -1 : left
	}
}
