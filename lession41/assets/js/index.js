"use strict";
console.log('hello world');
// countDownState()
function countDownState() {
    const countDownItems = document.querySelectorAll(".count-down-item");
    Array.from(countDownItems).forEach((item, index) => {
        item.style.display = "none";
        setTimeout(() => {
            item.style.display = "";
        }, index * 1000);
    });
}
