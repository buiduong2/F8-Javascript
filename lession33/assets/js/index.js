document.addEventListener('DOMContentLoaded', function () {
	// Format Action Handle
	var contenteditableEl = document.querySelector('.editor-content')
	var quantityLetterEl = document.querySelector('.quantity--letter .quantity')
	var quantityWordEl = document.querySelector('.quantity--word .quantity')
	var btnClear = document.querySelector('.btn--clear')
	var inputFileNameEl = document.querySelector('.input-file-name')

	var formatBold = new FormatBtn('.btn--bold', 'bold', contenteditableEl)
	var formatUnderline = new FormatBtn(
		'.btn--underline',
		'underline',
		contenteditableEl
	)
	var formatItalic = new FormatBtn(
		'.btn--italic',
		'italic',
		contenteditableEl
	)
	var formatColor = new FormatColorBtn(
		'.btn--color',
		'foreColor',
		contenteditableEl
	)

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

	//Add Event Listener cho tất cả các Button
	Object.values(tagMap).forEach(function (formatBtn) {
		formatBtn.addEventListener()
	})

	btnClear.addEventListener('click', function () {
		contenteditableEl.innerHTML = ''
		quantityLetterEl.textContent = '0'
		quantityWordEl.textContent = '0'
		inputFileNameEl.value = 'untitled'
		removeAllBtnActiveClass()
		contenteditableEl.focus()
	})

	document.addEventListener('selectionchange', function (e) {
		// Lắng nghe sự kiện khi contentedableEl's selection thay đổi
		var node = getEditableElSelectedNode()
		if (node != null) {
			addActiveClassBtnByCurrentSelect(node)
		}
	})

	contenteditableEl.addEventListener('input', function (e) {
		// Hành vi của JS một khi đã xuống dòng thì ko thể thoát ra một cách trực tiếp mà phải xóa 2 lần
		if (this.innerText.length === 1 && this.innerText[0] === '\n') {
			this.innerText = ''
		}
		quantityLetterEl.textContent = String(countLetter())
		quantityWordEl.textContent = String(countWord())
	})

	//Lắng nghe sự kiện sử dụng phím tắt để format
	contenteditableEl.addEventListener('keydown', function (e) {
		if (e.ctrlKey && e.key in keyBoardMap) {
			keyBoardMap[e.key].toggleActive()
		}
	})

	// prevent paste element behavior to contentediableEl
	contenteditableEl.addEventListener('paste', function (e) {
		e.preventDefault()
		var text = (e.clipboardData || window.clipboardData).getData('text')
		document.execCommand('insertText', false, text)
	})

	/**
	 * - hàm Đếm số lượng từ
	 * - Tiến hành loop qua từng character của nội dung InnerText và so sánh xem nó có phải là một kí tự:
	 *  space, xuống dòng, tab ... hay không.
	 * - có 2 TH:
	 * + Nếu là một kí tự space . Ta đánh đấu là chuẩn bị bắt đầu một word. encounteredLetter = false;
	 * + nếu là một kí tự Letter: Ta tiến hành count++. Đánh đấu là đã gặp word. ko đếm nữa encounteredLetter = true
	 * @returns {number} Số lượng từ
	 */
	function countWord() {
		var str = contenteditableEl.innerText

		// CharCode theo mã ASCII của một số kí tự thuộc nhóm space - được coi là không phải là một kí tự
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
		return contenteditableEl.innerText.length
	}

	/**
	 * B1: Traversel currentNode up to root = contentEl.  child -> parent-> parent's parent .
	 * Nếu gặp ContentEl (editable elemnet) break;
	 * B2: Kiểm tra xem ELement hiện tại có nằm trong nhóm các tag (b , i , font) đang theo dõi
	 * - TH1: tag hiện tại nằm trong nhóm tag theo dõi. Tiến hành cài đặt lại thông số của btn thông qua method addActiveState(currentNode)
	 * - TH2: ko phải thì tiến hành duyệt tiếp
	 * @param {Node} selectedNode : node được Selected  và thuộc contenteditableEl
	 * @returns {void}
	 */
	function addActiveClassBtnByCurrentSelect(selectedNode) {
		removeAllBtnActiveClass()

		if (selectedNode === null) return

		while (selectedNode !== contenteditableEl) {
			if (
				selectedNode instanceof HTMLElement &&
				selectedNode.tagName in tagMap
			) {
				tagMap[selectedNode.tagName].addActiveState(selectedNode)
			}
			selectedNode = selectedNode.parentElement
		}
	}

	/**
	 *- Lấy ra Node tổ tiên gần nhất của tất cả các Node được bôi đen
	 * @returns {Node | null}
	 *
	 * - TH1- null:  Elemetn hiện tại đang active (đang forcus ) ko phải là editable element return null
	 * - TH2- Node: trả về cha chung gần nhất của tất cả các Node được select các phần tử trong ContentEdable El;
	 */
	function getEditableElSelectedNode() {
		var selection = window.getSelection()

		if (document.activeElement !== contenteditableEl) return null
		if (!selection || selection.rangeCount === 0) return null

		return selection.getRangeAt(0).commonAncestorContainer
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

		btnSaveTxt.addEventListener('click', function () {
			var blob = new Blob([contenteditableEl.innerText], {
				type: 'text/plain'
			})
			var url = URL.createObjectURL(blob)
			goUrl(url)
			URL.revokeObjectURL(url)
		})

		btnSavePdf.addEventListener('click', function () {
			var opt = {
				margin: 1,
				filename: inputFileNameEl.value
			}
			html2pdf(contenteditableEl, opt)
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
