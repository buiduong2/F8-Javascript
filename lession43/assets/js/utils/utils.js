export function applyTransitionClasses(el, prefix) {
    return new Promise(resolve => {
        el.classList.add(`${prefix}-from`);
        el.classList.add(`${prefix}-active`);
        const { transitionDelay, transitionDuration } = window.getComputedStyle(el);
        setTimeout(() => {
            el.classList.add(`${prefix}-to`);
            el.classList.remove(`${prefix}-from`);
        }, 100);
        const trantitionTime = parseFloat(transitionDelay) + parseFloat(transitionDuration);
        setTimeout(() => {
            el.classList.remove(`${prefix}-active`, `${prefix}-to`);
            resolve();
        }, trantitionTime * 1000);
    });
}
export function fromNow(dateStr) {
    const intervalInSeconds = (new Date().getTime() - new Date(dateStr).getTime()) / 1000;
    const dateNames = [
        { name: "seconds ago", max: 60 },
        { name: "mins ago", max: 60 },
        { name: "hours ago", max: 24 },
        { name: "days ago", max: 30 }
    ];
    let currentTimeRes = intervalInSeconds;
    let max = 60;
    for (let i = 0; i < dateNames.length; i++) {
        if (intervalInSeconds < max) {
            return Math.floor(currentTimeRes) + " " + dateNames[i].name;
        }
        else {
            max *= dateNames[i].max;
            currentTimeRes /= dateNames[i].max;
        }
    }
    return Math.floor(currentTimeRes) + " " + "days ago";
}
export function escapeHTML(str) {
    const escapeDictionary = {
        '&': '&amp;',
        '<': "&lt;",
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return str
        .split("")
        .map(char => char in escapeDictionary ? escapeDictionary[char] : char)
        .join("");
}
