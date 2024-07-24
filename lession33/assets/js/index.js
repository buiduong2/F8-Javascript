"use strict";
// Format Btn Handler
document.addEventListener("DOMContentLoaded", function () {
    var contentEl = document.querySelector(".editor-content");
    var boldBtn = document.querySelector(".btn--bold");
    var underlineBtn = document.querySelector(".btn--underline");
    var italicBtn = document.querySelector(".btn--italic");
    var pickColorBtn = document.querySelector(".btn--color");
    var tagMap = {
        b: boldBtn,
        u: underlineBtn,
        i: italicBtn,
        font: pickColorBtn
    };
    contentEl.addEventListener("click", function (e) {
        addActiveClassBtnByCurrentSelect();
    });
    contentEl.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.key in tagMap) {
            tagMap[e.key].classList.toggle("active");
        }
        else {
            var moveCursorKeys = ["ArrowLeft", "ArrowRight", "ArrowTop", "ArrowBottom", "Delete", "Backspace"];
            if (moveCursorKeys.includes(e.key)) {
                addActiveClassBtnByCurrentSelect();
            }
        }
    });
    boldBtn.addEventListener("click", formatBtnHandler("bold"));
    underlineBtn.addEventListener("click", formatBtnHandler("underline"));
    italicBtn.addEventListener("click", formatBtnHandler("italic"));
    pickColorBtn.addEventListener("input", function (e) {
        document.execCommand("foreColor", false, this.value);
        contentEl.focus();
    });
    function formatBtnHandler(commandId) {
        return function () {
            document.execCommand(commandId);
            contentEl.focus();
            this.classList.toggle("active");
        };
    }
    function addActiveClassBtnByCurrentSelect() {
        var _a;
        RemoveAllBtnActiveClass();
        var node = getSelectedNode();
        if (node === null)
            return;
        while (node !== contentEl) {
            if (node instanceof HTMLElement) {
                var tagNameLowerCase = node.tagName.toLowerCase();
                if (tagNameLowerCase in tagMap) {
                    if (tagNameLowerCase === 'font') {
                        tagMap[tagNameLowerCase].value = (_a = node.getAttribute("color")) !== null && _a !== void 0 ? _a : "#000000";
                    }
                    else {
                        tagMap[tagNameLowerCase].classList.add("active");
                    }
                }
            }
            node = node.parentElement;
        }
    }
    function getSelectedNode() {
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
            tagMap[tagName].classList.remove("active");
        }
        ;
        tagMap['font'].value = '#000000';
    }
    // File Handler
    window.addEventListener("load", function () {
        var btnClear = document.querySelector(".btn--clear");
        var btnSaveTxt = document.querySelector(".btn--save-txt");
        var btnSavePdf = document.querySelector(".btn--save-pdf");
        btnClear.addEventListener("click", function () {
            contentEl.innerHTML = "";
            contentEl.focus();
        });
        btnSaveTxt.addEventListener("click", function () {
            var opt = {
                margin: 1,
                filename: 'myfile.txt',
            };
            new Blob(contentEl.textContent);
        });
        btnSavePdf.addEventListener("click", function () {
            var opt = {
                margin: 1,
                filename: 'untitled.pdf',
            };
            html2pdf(contentEl, opt);
        });
    });
});
