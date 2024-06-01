var str = `Lorem ipsum dolorsit, amet consectetur adipisicing elit. Quasi vitae magnam unde, inventore optio repudiandae ipsa
qui! Soluta provident nulla eligendi dolorem, excepturi eum dolor saepe omnis at,`
hightLightText(str)

function hightLightText(str) {
	var left = 0
	var right = left + 1
	setInterval(() => {
		left = indexOfCharacter(str, left)
		right = indexOfNonCharacter(str, left)
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

	/**
	 * Remove Mutilple space or break line. get index of Non character like a,b,c ...etc
	 * @param str : searchString
	 * @param left : index at which to begin searching
	 * @returns index . -1 if don't exist
	 */
	function indexOfCharacter(str, left) {
		while (!isCharacter(str[left]) && left < str.length) {
			left++
		}

		return left === str.length ? indexOfCharacter(str, 0) : left
	}

	/**
	 * get index of non character. like space or break like sometimes like tab
	 * @param str : searchString
	 * @param left : index at which to begin searching
	 * @returns index . -1 if don't exist
	 */
	function indexOfNonCharacter(str, left) {
		while (isCharacter(str[left]) && left < str.length) {
			left++
		}

		return left === str.length ? -1 : left
	}

	function isCharacter(character) {
		return character !== ' ' && character !== '\n' && character !== '\t'
	}
}
