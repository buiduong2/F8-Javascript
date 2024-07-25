document.addEventListener('DOMContentLoaded', function () {
	// Format Action Handle
	var contentEl = document.querySelector('.editor-content')
	var quantityLetterEl = document.querySelector('.quantity--letter .quantity')
	var quantityWordEl = document.querySelector('.quantity--word .quantity')
    var btnClear = document.querySelector('.btn--clear')
	var formatBold = new FormatBtn('.btn--bold', 'bold', contentEl)
	var formatUnderline = new FormatBtn( '.btn--underline', 'underline', contentEl)
	var formatItalic = new FormatBtn('.btn--italic', 'italic', contentEl)
	var formatColor = new FormatColorBtn('.btn--color', 'foreColor', contentEl)

	var tagMap = {
		B: formatBold,
		U: formatUnderline,
		I: formatItalic,
		FONT: formatColor
	}
	var keyBoardMap = {
		b: formatBold,
		u: formatUnderline,
		i: formatItalic
	}

	Object.values(tagMap).forEach(function (formatBtn) {
		formatBtn.addEventListener()
	})

    btnClear.addEventListener('click', function () {
        contentEl.innerHTML = ''
        quantityLetterEl.textContent = "0"
		quantityWordEl.textContent = "0"
        removeAllBtnActiveClass();
        contentEl.focus()
    })

	contentEl.addEventListener('click', addActiveClassBtnByCurrentSelect)

	contentEl.addEventListener('input', function (e) {
		quantityLetterEl.textContent = String(countLetter())
		quantityWordEl.textContent = String(countWord())
	})

	contentEl.addEventListener('keydown', function (e) {
		var moveCursorKeys = [ 'ArrowLeft', 'ArrowRight', 'ArrowTop', 'ArrowBottom', 'Delete', 'Backspace' ]
		if (e.ctrlKey && e.key in keyBoardMap) {
			keyBoardMap[e.key].toggleActive()
		} else if (moveCursorKeys.includes(e.key)) {
			addActiveClassBtnByCurrentSelect()
		}
	})

	function countWord() {
		var str = contentEl.innerText
		var nonLetterCharCodes = new Set([160, 10, 32, 9]) //['&npsb'; '\n', ' ' , '\t']
		var encounteredLetter = false
		var count = 0
		for (var i = 0; i < str.length; i++) {
			if (!nonLetterCharCodes.has(str.charCodeAt(i))) {
				if (!encounteredLetter) {
					count++
				}
				encounteredLetter = true
			} else {
				encounteredLetter = false
			}
		}
		return count
	}

	function countLetter() {
		return contentEl.innerText.length
	}

	function addActiveClassBtnByCurrentSelect() {
		removeAllBtnActiveClass()
		var node = getSelectedNode()

		if (node === null) return

		while (node !== contentEl) {
			if (node instanceof HTMLElement && node.tagName in tagMap) {
				tagMap[node.tagName].addActiveState(node)
			}
			node = node.parentElement
		}
	}

	function getSelectedNode() {
		var selectedNode = window.getSelection()

		if (document.activeElement !== contentEl) return null
		if (!selectedNode || selectedNode.rangeCount === 0) return null
        
		var startContainer = selectedNode.getRangeAt(0).startContainer
		var endContainer = selectedNode.getRangeAt(0).endContainer

		return startContainer === endContainer ? startContainer : null
	}

	function removeAllBtnActiveClass() {
		for (const tagName in tagMap) {
			tagMap[tagName].removeActive()
		}
	}

    
	// File Handler
	window.addEventListener('load', function () {
		var btnSaveTxt = document.querySelector('.btn--save-txt')
		var btnSavePdf = document.querySelector('.btn--save-pdf')
		var inputFileNameEl = document.querySelector('.input-file-name')



		btnSaveTxt.addEventListener('click', function () {
			var blob = new Blob([contentEl.innerText], { type: 'text/plain' })
			var url = URL.createObjectURL(blob)
			goUrl(url)
			URL.revokeObjectURL(url)
		})

		btnSavePdf.addEventListener('click', function () {
			var opt = {
				margin: 1,
				filename: inputFileNameEl.value
			}
			html2pdf(contentEl, opt)
		})

		function goUrl(url) {
			var anchorEl = document.createElement('a')
			anchorEl.href = url
			anchorEl.download = inputFileNameEl.value
			document.body.appendChild(anchorEl)
			anchorEl.click()
			document.body.removeChild(anchorEl)
		}
	})
})
