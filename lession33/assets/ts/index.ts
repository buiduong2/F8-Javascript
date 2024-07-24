// Format Btn Handler
document.addEventListener("DOMContentLoaded", function () {
    var contentEl = document.querySelector(".editor-content") as HTMLDivElement;
    var boldBtn = document.querySelector(".btn--bold") as HTMLButtonElement;
    var underlineBtn = document.querySelector(".btn--underline") as HTMLButtonElement;
    var italicBtn = document.querySelector(".btn--italic") as HTMLButtonElement;
    var pickColorBtn = document.querySelector(".btn--color") as HTMLInputElement;

    var tagMap: { [key: string]: HTMLElement } = {
        b: boldBtn,
        u: underlineBtn,
        i: italicBtn,
        font: pickColorBtn
    }

    contentEl.addEventListener("click", function (e) {
        addActiveClassBtnByCurrentSelect();
    })

    contentEl.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.key in tagMap) {
            tagMap[e.key].classList.toggle("active")
        } else {
            var moveCursorKeys = ["ArrowLeft", "ArrowRight", "ArrowTop", "ArrowBottom", "Delete", "Backspace"]
            if (moveCursorKeys.includes(e.key)) {
                addActiveClassBtnByCurrentSelect();
            }
        }
    })


    boldBtn.addEventListener("click", formatBtnHandler("bold"));
    underlineBtn.addEventListener("click", formatBtnHandler("underline"))
    italicBtn.addEventListener("click", formatBtnHandler("italic"))
    pickColorBtn.addEventListener("input", function (e) {
        document.execCommand("foreColor", false, this.value);
        contentEl.focus();
    })

    function formatBtnHandler(commandId: string) {
        return function (this: HTMLButtonElement) {
            document.execCommand(commandId);
            contentEl.focus();
            this.classList.toggle("active")
        }
    }

    function addActiveClassBtnByCurrentSelect(): void {
        RemoveAllBtnActiveClass();
        var node = getSelectedNode();
        if (node === null) return;

        while (node !== contentEl) {
            if (node instanceof HTMLElement) {
                var tagNameLowerCase = node.tagName.toLowerCase()
                if (tagNameLowerCase in tagMap) {
                    if (tagNameLowerCase === 'font') {
                        (tagMap[tagNameLowerCase] as HTMLInputElement).value = node.getAttribute("color") ?? "#000000";
                    } else {
                        tagMap[tagNameLowerCase].classList.add("active");
                    }
                }
            }
            node = (node.parentElement as Node);
        }

    }

    function getSelectedNode(): Node | null {
        var selectedNode = window.getSelection();
        if (document.activeElement === contentEl && selectedNode && selectedNode.rangeCount > 0) {
            var startContainer = selectedNode.getRangeAt(0).startContainer;
            var endContainer = selectedNode.getRangeAt(0).endContainer;
            if (startContainer === endContainer) {
                return startContainer;
            }
        }

        return null;
    }

    function RemoveAllBtnActiveClass() {
        for (const tagName in tagMap) {
            tagMap[tagName].classList.remove("active")
        }
        ; (tagMap['font'] as HTMLInputElement).value = '#000000'
    }



    // File Handler
    window.addEventListener("load", function () {
        var btnClear = document.querySelector(".btn--clear") as HTMLElement;
        var btnSaveTxt = document.querySelector(".btn--save-txt") as HTMLElement;
        var btnSavePdf = document.querySelector(".btn--save-pdf") as HTMLElement;

        btnClear.addEventListener("click", function () {
            contentEl.innerHTML = ""
            contentEl.focus();
        })

        btnSaveTxt.addEventListener("click", function () {
            var opt = {
                margin: 1,
                filename: 'myfile.txt',
            }
            new Blob(contentEl.textContent);
        })

        btnSavePdf.addEventListener("click", function () {

            var opt = {
                margin: 1,
                filename: 'untitled.pdf',
            }

            html2pdf(contentEl, opt);

        })
    })

})


