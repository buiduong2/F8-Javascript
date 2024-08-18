console.log('hello world');
// countDownState()
function countDownState() {
    const countDownItems = document.querySelectorAll(".count-down-item");
    Array.from(countDownItems).forEach((item, index) => {
        (item as HTMLElement).style.display = "none";

        setTimeout(() => {
            (item as HTMLElement).style.display = "";
        }, index * 1000);
    })
}